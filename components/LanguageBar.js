export default function LanguageBar({ languages }) {
  if (!languages || Object.keys(languages).length === 0) return null

  const sorted = Object.entries(languages).sort(([, a], [, b]) => b - a).slice(0, 10)
  const total = sorted.reduce((sum, [, c]) => sum + c, 0)

  const colorMap = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', C: '#555555',
    'C++': '#f34b7d', 'C#': '#178600', Ruby: '#701516', PHP: '#4F5D95',
    Swift: '#F05138', Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c',
    Shell: '#89e051', Dockerfile: '#384d54', Vue: '#41b883', Dart: '#00B4AB',
  }

  const getColor = (lang) => colorMap[lang] || '#4a9e6b'

  return (
    <div className="mb-6 border border-[#00ff4422] bg-[#040d04] overflow-hidden" style={{fontFamily:"'IBM Plex Mono', monospace"}}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00ff4415] bg-[#00ff440a]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff44]" style={{boxShadow:'0 0 6px #00ff44'}} />
        </div>
        <span className="ml-2 text-[#00ff4444] text-xs tracking-[0.2em]">~/languages --top-10</span>
      </div>

      <div className="p-8">
        {/* Stacked bar */}
        <div className="flex h-2 mb-8 overflow-hidden gap-px">
          {sorted.map(([lang, count]) => (
            <div
              key={lang}
              title={`${lang}: ${((count/total)*100).toFixed(1)}%`}
              style={{
                width: `${(count/total)*100}%`,
                backgroundColor: getColor(lang),
                opacity: 0.85,
              }}
            />
          ))}
        </div>

        <div className="space-y-3">
          {sorted.map(([lang, count], i) => {
            const pct = ((count / total) * 100).toFixed(1)
            const color = getColor(lang)
            return (
              <div key={lang} className="group flex items-center gap-4">
                <div className="text-[10px] text-[#00ff4433] w-4 text-right tabular-nums">{i + 1}</div>
                <div className="w-28 text-xs truncate" style={{color: color + 'cc'}}>{lang}</div>
                <div className="flex-1 h-1.5 bg-[#0f1f0f] overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{width:`${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}55`}}
                  />
                </div>
                <div className="text-[10px] text-right tabular-nums w-12" style={{color: color + '99'}}>{pct}%</div>
                <div className="text-[10px] text-[#00ff4433] text-right tabular-nums w-16">{count} PRs</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}