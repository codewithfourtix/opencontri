export default function StatCards({ stats }) {
  const cards = [
    { label: 'total_prs', value: stats.totalPRs, accent: '#00ff44' },
    { label: 'merged_prs', value: stats.mergedPRs, accent: '#00e5ff' },
    { label: 'open_prs', value: stats.openPRs, accent: '#ffe500' },
    { label: 'closed_prs', value: stats.closedPRs, accent: '#ff6b6b' },
    { label: 'issues_filed', value: stats.totalIssues, accent: '#ff9f43' },
    { label: 'repos_touched', value: stats.reposContributed, accent: '#a29bfe' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-px mb-6 border border-[#00ff4415] bg-[#00ff4415]" style={{fontFamily:"'IBM Plex Mono', monospace"}}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="bg-[#040d04] p-6 group hover:bg-[#071407] transition-colors duration-200 relative overflow-hidden"
        >
          {/* corner accent */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity" style={{borderColor: card.accent}} />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity" style={{borderColor: card.accent}} />

          <div className="text-[9px] tracking-[0.35em] uppercase mb-3" style={{color: card.accent + '66'}}>
            {card.label}
          </div>
          <div
            className="text-4xl font-bold tabular-nums"
            style={{color: card.accent, textShadow: `0 0 20px ${card.accent}44`}}
          >
            {card.value.toLocaleString()}
          </div>

          {/* bottom progress-line on hover */}
          <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{backgroundColor: card.accent + '55'}} />
        </div>
      ))}
    </div>
  )
}