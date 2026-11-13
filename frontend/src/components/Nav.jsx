import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Link from './Link'

const links = [
  { to: '/', label: 'Home' },
  { to: '/#services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/#chat', label: 'Chat' },
]

export default function Nav({ path }) {
  const { isAuthenticated, user, logout } = useAuth0()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('chat_session_id')
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const isActive = (to) =>
    (to === '/about' && path.startsWith('/about')) || (to === '/' && path === '/')

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-white/10">
      <div className="relative max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white">
          <img src="/logo-mark.png" alt="LSV Consulting logo" className="w-9 h-9" />
          <span className="font-semibold tracking-tight">LSV Consulting</span>
        </Link>

        <button
          className="sm:hidden text-slate-300 hover:text-white p-2"
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          {open ? '✕' : '☰'}
        </button>

        <div
          className={`${open ? 'flex' : 'hidden'} sm:flex absolute sm:static top-full left-0 right-0 flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 bg-slate-950 sm:bg-transparent px-4 py-4 sm:p-0 text-sm font-medium border-b border-white/10 sm:border-0`}
        >
          {links.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className={`transition-colors ${isActive(to) ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <span className="text-slate-500">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-left text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
