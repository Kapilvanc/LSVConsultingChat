// Tiny client-side router: clean URLs (/ and /about) without a dependency.
// The backend serves index.html for /about so direct loads and refreshes work.
import { useEffect, useState } from 'react'

export function navigate(to) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path
}

// After a page change (or a first load like /#services), land on the
// requested section, or at the top of the page when there is none.
export function useScrollOnNavigate(path) {
  useEffect(() => {
    const hash = window.location.hash
    const el = hash ? document.getElementById(hash.slice(1)) : null
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo(0, 0)
  }, [path])
}
