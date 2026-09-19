import { TermProvider } from './components/Term'
import { Contents } from './pages/Contents'
import { SectionView } from './sections/SectionView'
import { useRoute, toContents } from './router'
import { bySection } from './course/sections'

export function App() {
  const route = useRoute()
  const meta = route.name === 'section' ? bySection(route.id) : undefined

  return (
    <TermProvider>
      <div className="topbar">
        <div className="topbar-inner">
          {meta ? (
            <button className="iconbtn" onClick={toContents} aria-label="contents">
              &larr;
            </button>
          ) : (
            <span style={{ width: 8 }} />
          )}
          <div className="topbar-title">
            {meta ? (
              <>
                <span className="topbar-num">{String(meta.id).padStart(2, '0')}</span>
                {meta.title}
              </>
            ) : (
              'How language models work'
            )}
          </div>
        </div>
      </div>

      {meta ? <SectionView id={meta.id} /> : <Contents />}
    </TermProvider>
  )
}
