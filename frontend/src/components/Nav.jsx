export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-indigo-600 font-bold text-lg">Venkat Penumarthi</span>
        <div className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="#hero" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="#chat" className="hover:text-indigo-600 transition-colors">Chat</a>
        </div>
      </div>
    </nav>
  )
}
