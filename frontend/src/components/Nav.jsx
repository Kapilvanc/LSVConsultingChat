import { useAuth0 } from '@auth0/auth0-react'

export default function Nav() {
  const { isAuthenticated, user, logout } = useAuth0()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('chat_session_id')
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-indigo-600 font-bold text-lg">Venkat Penumarthi</span>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#hero" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="#chat" className="hover:text-indigo-600 transition-colors">Chat</a>
          {isAuthenticated && (
            <>
              <span className="text-slate-400">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition-colors"
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