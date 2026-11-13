import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'
import { useAuth0 } from '@auth0/auth0-react'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('chat_session_id'))
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [userName, setUserName] = useState(null)
  const [questionCount, setQuestionCount] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const { loginWithPopup, getIdTokenClaims } = useAuth0()
  const messagesEndRef = useRef(null)
  const idleTimerRef = useRef(null)
  const IDLE_TIMEOUT = 10 * 60 * 1000

  // Keep the newest message in view by scrolling the message box ONLY.
  // (scrollIntoView also scrolled the whole page down to the chat on load.)
  useEffect(() => {
    const box = messagesEndRef.current?.parentElement
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const resetIdleTimer = () => {
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      localStorage.removeItem('chat_session_id')
      localStorage.removeItem('auth_token')
      setSessionId(null)
      setToken(null)
      setUserName(null)
      addSystemMsg('Your session has expired due to inactivity.')
    }, IDLE_TIMEOUT)
  }

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart']
    events.forEach(e => document.addEventListener(e, resetIdleTimer))
    resetIdleTimer()
    return () => {
      events.forEach(e => document.removeEventListener(e, resetIdleTimer))
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    if (!sessionId) {
      addBotMsg("Hi! I'm LSV Consulting's AI assistant. Ask me about our founder Venkat's data engineering experience, skills, or past projects.")
      return
    }
    fetch(`/api/chat/session/${sessionId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data.messages?.length > 0) {
          setMessages(data.messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'bot',
            text: m.content,
            id: Math.random()
          })))
          setQuestionCount(data.question_count)
        } else {
          addBotMsg("Hi! I'm LSV Consulting's AI assistant. Ask me about our founder Venkat's data engineering experience, skills, or past projects.")
        }
      })
      .catch(() => addBotMsg("Hi! I'm LSV Consulting's AI assistant. Ask me about our founder Venkat's data engineering experience, skills, or past projects."))
  }, [])

  useEffect(() => {
    if (!token) return
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(user => setUserName(user.full_name || user.email))
      .catch(() => {
        localStorage.removeItem('auth_token')
        setToken(null)
      })
  }, [token])

  const addBotMsg = (text) => setMessages(prev => [...prev, { role: 'bot', text, id: Date.now() }])
  const addSystemMsg = (text) => setMessages(prev => [...prev, { role: 'system', text, id: Date.now() }])

  const handleLogin = async () => {
    try {
      await loginWithPopup()
      const claims = await getIdTokenClaims()
      const idToken = claims.__raw
      const resp = await fetch('/api/auth/auth0/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken, session_id: sessionId })
      })
      const data = await resp.json()
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token)
        setToken(data.access_token)
        setUserName(data.user?.full_name || data.user?.email)
        setMessages(prev => [
          ...prev.filter(m => m.role !== 'login'),
          { role: 'system', text: `Welcome, ${data.user?.full_name || data.user?.email}! You can now continue chatting.`, id: Date.now() }
        ])
      }
    } catch (e) {
      console.error('Login failed', e)
    }
  }


  const sendMessage = async () => {
    const text = input.trim()
    if (!text || disabled) return
    setInput('')
    setDisabled(true)
    setMessages(prev => [...prev, { role: 'user', text, id: Date.now() }])
    setIsTyping(true)
    resetIdleTimer()

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId })
      })
      const data = await response.json()
      setIsTyping(false)

      if (data.session_id) {
        setSessionId(data.session_id)
        localStorage.setItem('chat_session_id', data.session_id)
      }
      if (data.message === 'limit_reached') {
        addSystemMsg('You have reached the 50-question limit for this session.')
      } else if (data.response) {
        addBotMsg(data.response)
      }
      if (data.requires_login) {
        setMessages(prev => [...prev, {
          role: 'login',
          sessionId: data.session_id || sessionId,
          id: Date.now(),
          onLogin: handleLogin
        }])
      }
      setQuestionCount(data.question_count || 0)
    } catch {
      setIsTyping(false)
      addSystemMsg('Something went wrong. Please try again.')
    } finally {
      setDisabled(false)
    }
  }

  const sessionLabel = userName
    ? `Welcome, ${userName} | Questions used: ${questionCount} / 50`
    : token
    ? `Questions used: ${questionCount} / 50`
    : `Questions used: ${questionCount} / 5`

  return (
    <section id="chat" className="bg-white py-20 px-4 scroll-mt-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">
            Ask anything
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Talk to our AI</h2>
          <p className="text-slate-500 mt-2">
            Grounded in our founder's experience. Ask about past work, skills, or how we approach data problems.
          </p>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-950 px-6 py-4">
            <p className="text-white font-semibold">LSV Consulting AI Assistant</p>
            <p className="text-slate-400 text-sm">Powered by OpenAI · Built from scratch by Venkat</p>
          </div>

          <div className="h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
            {messages.map(msg => <Message key={msg.id} msg={msg} />)}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 bg-white border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
            <span>{sessionLabel}</span>
            {userName && (
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token')
                  localStorage.removeItem('chat_session_id')
                  window.location.reload()
                }}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            )}
          </div>


          <div className="p-4 border-t border-slate-200 bg-white flex gap-3 items-end">
            <textarea
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-blue-400 font-sans min-h-[44px] max-h-28"
              placeholder="Type your message..."
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={disabled}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Message({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="self-end bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm max-w-[75%]">
        {msg.text}
      </div>
    )
  }
  if (msg.role === 'system') {
    return (
      <div className="self-center bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-xl text-sm text-center max-w-[90%]">
        {msg.text}
      </div>
    )
  }
  if (msg.role === 'login') {
    return (
      <div className="self-center bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-xl text-sm text-center max-w-[90%]">
        You have reached the 5-question limit.{' '}
        <button onClick={msg.onLogin} className="font-semibold underline cursor-pointer bg-transparent border-none text-amber-700">
          Log in
        </button>{' '}
        to continue.
      </div>
    )
  }
  return (
    <div
      className="self-start bg-white border border-slate-200 text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm max-w-[75%] prose prose-sm"
      dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
    />
  )
}

function TypingIndicator() {
  return (
    <div className="self-start bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
      {[0, 150, 300].map(delay => (
        <span
          key={delay}
          className="w-2 h-2 bg-slate-400 rounded-full inline-block animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}