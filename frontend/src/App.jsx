import Nav from './components/Nav'
import Hero from './components/Hero'
import AboutSite from './components/AboutSite'
import Chat from './components/Chat'

function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <AboutSite />
        <Chat />
      </main>
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm">
        © 2026 Venkat Penumarthi · Built with FastAPI, React & OpenAI
      </footer>
    </div>
  )
}

export default App