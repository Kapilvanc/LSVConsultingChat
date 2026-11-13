import Hero from '../components/Hero'
import AboutSite from '../components/AboutSite'

// The original single-page site, moved here: the personal intro (Hero) and
// the "Built from scratch" section, plus a short founder bio.
export default function About() {
  return (
    <>
      <Hero />
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Founder</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">From business to data engineering</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Venkat came into technology through the business side: a B.Com, then an MBA in
              Marketing. That's why every project starts with the decision the data needs to
              support, not with the tooling.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Over 11+ years he has moved from SharePoint and Project Server to Power BI and the
              Power Platform, and on to Azure integration and data pipelines, delivering for
              energy, banking, pharmaceutical, and medical device organizations. He founded
              LSV Consulting Services Ltd. to bring that end-to-end experience to clients directly.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Certifications</p>
            <ul className="space-y-3">
              <li className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">PL-300</p>
                <p className="text-sm text-slate-600">Power BI Data Analyst</p>
              </li>
              <li className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">PL-400</p>
                <p className="text-sm text-slate-600">Power Platform Developer</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <AboutSite />
    </>
  )
}
