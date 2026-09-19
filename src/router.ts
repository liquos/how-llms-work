import { useEffect, useState } from 'react'

export type Route =
  | { name: 'contents' }
  | { name: 'section'; id: number }

function parse(hash: string): Route {
  const m = /^#\/s\/(\d+)/.exec(hash)
  if (m) return { name: 'section', id: Number(m[1]) }
  return { name: 'contents' }
}

export function navigate(to: string) {
  if (window.location.hash === to) return
  window.location.hash = to
}

export const toContents = () => navigate('#/')
export const toSection = (id: number) => navigate(`#/s/${id}`)

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
