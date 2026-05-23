export default function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-b from-indigo-50 to-white py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
          Open to new opportunities
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Venkat Penumarthi
        </h1>
        <p className="text-xl sm:text-2xl text-indigo-600 font-medium mb-6">
          Data & Integration Engineer
        </p>
        <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          10+ years turning complex data problems into clean, automated pipelines —
          across Azure, Python, Power Platform, and AI-powered applications.
          Microsoft Certified · Based in BC, Canada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#chat"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            Chat with my AI
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            className="border border-slate-300 text-slate-700 px-8 py-3 rounded-full font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            View Resume
          </a>
        </div>
      </div>
    </section>
  )
}