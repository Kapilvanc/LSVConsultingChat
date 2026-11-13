import Link from './Link'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-6 justify-between">
        <div>
          <p className="text-white font-semibold">LSV Consulting Services Ltd.</p>
          <p className="mt-1">Data engineering consultancy · British Columbia, Canada</p>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <a href="mailto:lsvconsultingservices@outlook.com" className="hover:text-white transition-colors">
            lsvconsultingservices@outlook.com
          </a>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/#chat" className="hover:text-white transition-colors">Chat</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-slate-500">
        © 2026 LSV Consulting Services Ltd. · Built from scratch with FastAPI, React &amp; OpenAI
      </div>
    </footer>
  )
}
