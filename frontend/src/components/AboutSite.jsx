const stack = [
  { label: 'FastAPI', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Python', color: 'bg-blue-100 text-blue-700' },
  { label: 'React', color: 'bg-cyan-100 text-cyan-700' },
  { label: 'Tailwind CSS', color: 'bg-sky-100 text-sky-700' },
  { label: 'OpenAI GPT-4o', color: 'bg-violet-100 text-violet-700' },
  { label: 'Auth0', color: 'bg-orange-100 text-orange-700' },
  { label: 'PostgreSQL', color: 'bg-blue-100 text-blue-700' },
  { label: 'Render.com', color: 'bg-slate-100 text-slate-700' },
]

export default function AboutSite() {
  return (
    <section id="about" className="bg-slate-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              About this site
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
              Built from scratch
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              This entire site — including the AI chatbot on the home page — was designed and
              built by me as a personal project. No templates, no site builders.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              The chatbot is powered by OpenAI and trained on my professional
              background. It can answer questions about my experience, skills,
              and approach to data problems.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Building this required skills across backend API design, OAuth
              security, AI integration, database design, frontend development,
              and cloud deployment — the same skills I bring to every data
              engineering engagement.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Tech stack
            </p>
            <div className="flex flex-wrap gap-2">
              {stack.map(({ label, color }) => (
                <span
                  key={label}
                  className={`${color} text-sm font-medium px-3 py-1 rounded-full`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}