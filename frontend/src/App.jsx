import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import { usePath, useScrollOnNavigate } from './router'

function App() {
  const path = usePath()
  useScrollOnNavigate(path)
  const isAbout = path.replace(/\/+$/, '') === '/about'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav path={path} />
      <main className="flex-1">{isAbout ? <About /> : <Home />}</main>
      <Footer />
    </div>
  )
}

export default App
