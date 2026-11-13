import { navigate } from '../router'

// Internal link: switches pages without a reload. A link to a section on
// the page you're already on (e.g. /#chat while on /) uses the browser's
// own anchor scroll.
export default function Link({ to, children, onClick, ...rest }) {
  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const url = new URL(to, window.location.origin)
    if (url.pathname === window.location.pathname) {
      if (!url.hash) {
        e.preventDefault()
        window.history.pushState({}, '', url.pathname)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }
    e.preventDefault()
    navigate(url.pathname + url.hash)
  }
  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
