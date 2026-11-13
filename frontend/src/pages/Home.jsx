import Chat from '../components/Chat'

const CONTACT = 'mailto:lsvconsultingservices@outlook.com?subject=Data%20engineering%20inquiry'

const services = [
  {
    title: 'Azure Data Pipelines',
    body: 'Azure Data Factory pipelines that move data reliably across enterprise systems, with monitoring and self-hosted integration runtimes for on-prem sources.',
  },
  {
    title: 'Python ETL & Parquet',
    body: 'Python ETL deployed through GitHub Actions, landing analytics-ready Parquet that makes downstream reporting faster and cheaper.',
  },
  {
    title: 'Analytics & Power BI Modeling',
    body: 'Fact/dimension models, complex DAX, and refresh strategies that keep dashboards fast and numbers trustworthy.',
  },
  {
    title: 'API & System Integration',
    body: 'REST APIs on Azure Functions and API Management that connect line-of-business systems without brittle point-to-point glue.',
  },
  {
    title: 'Power Platform & CoE Governance',
    body: 'Dataverse data models, Power Apps, and Center of Excellence governance with DLP, so citizen development scales safely.',
  },
  {
    title: 'AI-Enabled Workflows',
    body: 'Practical LLM integrations, from Copilot agents to grounded chatbots like the one on this page, built on solid data foundations.',
  },
]

const steps = [
  { n: '01', title: 'Start with the decision', body: 'What decision does this data need to support? We define the outcome before writing a line of code.' },
  { n: '02', title: 'Design the flow', body: 'Sources, models, and pipelines sized to the problem: clean and maintainable over clever.' },
  { n: '03', title: 'Build with discipline', body: 'CI/CD, version control, and documentation as standard, even on small engagements.' },
  { n: '04', title: 'Hand over and harden', body: 'Monitoring, governance, and knowledge transfer so your team owns the result.' },
]

const results = [
  { stat: '300%', label: 'growth in platform usage after building a Power Platform CoE', who: 'Global pharmaceutical company' },
  { stat: '80%', label: 'less processing time across 9 automated manual processes', who: 'Medical device manufacturer' },
  { stat: '70%', label: 'reduction in manual data entry with a Copilot sentiment agent', who: 'Engineering consultancy' },
  { stat: '15 min', label: 'Power BI refresh solution on a fact/dimension Dataverse model', who: 'Tier-1 Canadian bank' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.35),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-4">
            LSV Consulting Services Ltd.
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
            Data engineering that drives decisions.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            We design and build Azure data pipelines, analytics models, and integrations
            that turn scattered enterprise data into answers your business can act on.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#chat"
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-full font-semibold text-center transition-colors"
            >
              Talk to our AI
            </a>
            <a
              href={CONTACT}
              className="border border-white/25 hover:border-white text-white px-8 py-3 rounded-full font-semibold text-center transition-colors"
            >
              Book a conversation
            </a>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
            <span>11+ years in enterprise data</span>
            <span>Microsoft Certified PL-300 · PL-400</span>
            <span>Based in British Columbia, Canada</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Services" title="What we build" sub="End-to-end data engineering on the Microsoft cloud, from source systems to the dashboard." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => (
              <div key={s.title} className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition">
                <div className="w-10 h-1 bg-blue-500 rounded-full mb-5" />
                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="py-20 px-4 bg-slate-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <SectionHead eyebrow="Approach" title="Business outcome first" sub="Rooted in a business background (B.Com, MBA), every engagement starts with the question the data has to answer." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.n}>
                <p className="text-blue-600 font-mono text-sm font-semibold">{s.n}</p>
                <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-20 px-4 bg-slate-950 text-white scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <SectionHead dark eyebrow="Results" title="Measured outcomes" sub="Selected results from past engagements." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map(r => (
              <div key={r.stat} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <p className="text-4xl font-bold text-blue-400">{r.stat}</p>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">{r.label}</p>
                <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{r.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Chat />

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Have a data problem worth solving?</h2>
          <p className="mt-4 text-blue-100 text-lg">
            Tell us what decision you need to make, and we'll tell you what it takes to get the data there.
          </p>
          <a
            href={CONTACT}
            className="inline-block mt-8 bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </>
  )
}

function SectionHead({ eyebrow, title, sub, dark }) {
  return (
    <div className="mb-12 max-w-2xl">
      <span className={`${dark ? 'text-blue-400' : 'text-blue-600'} font-semibold text-sm uppercase tracking-widest`}>
        {eyebrow}
      </span>
      <h2 className={`text-3xl sm:text-4xl font-bold mt-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      <p className={`mt-3 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{sub}</p>
    </div>
  )
}
