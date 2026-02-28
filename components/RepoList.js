'use client'

import { useState } from 'react'

export default function RepoList({ repos, orgs }) {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('prs')
  const [searchTerm, setSearchTerm] = useState('')

  let filtered = repos
  if (filter !== 'all') filtered = repos.filter((r) => r.org === filter)
  if (searchTerm) filtered = filtered.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'prs') return b.prCount - a.prCount
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0)
    return 0
  })

  return (
    <div className="border border-[#00ff4422] bg-[#040d04] overflow-hidden" style={{fontFamily:"'IBM Plex Mono', monospace"}}>
      {/* Terminal bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00ff4415] bg-[#00ff440a]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff44]" style={{boxShadow:'0 0 6px #00ff44'}} />
        </div>
        <span className="ml-2 text-[#00ff4444] text-xs tracking-[0.2em]">~/repos --contributed</span>
        <span className="ml-auto text-[#00ff4444] text-[10px]">{filtered.length} / {repos.length} results</span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border-b border-[#00ff4415] bg-[#00ff4415]">
        {/* Search */}
        <div className="bg-[#040d04] px-4 py-3 flex items-center gap-3">
          <span className="text-[#00ff4444] text-xs shrink-0">search:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="filter repos..."
            className="flex-1 bg-transparent text-[#a0d4a0] text-xs placeholder-[#00ff4433] focus:outline-none border-b border-[#00ff4422] focus:border-[#00ff4466] pb-0.5 transition-colors"
          />
        </div>

        {/* Org filter */}
        <div className="bg-[#040d04] px-4 py-3 flex items-center gap-3">
          <span className="text-[#00ff4444] text-xs shrink-0">org:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-[#a0d4a0] text-xs focus:outline-none cursor-pointer border-b border-[#00ff4422] focus:border-[#00ff4466] pb-0.5"
            style={{colorScheme:'dark'}}
          >
            <option value="all" className="bg-[#040d04]">all orgs</option>
            {orgs.slice(0, 20).map((org) => (
              <option key={org} value={org} className="bg-[#040d04]">{org}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="bg-[#040d04] px-4 py-3 flex items-center gap-3">
          <span className="text-[#00ff4444] text-xs shrink-0">sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 bg-transparent text-[#a0d4a0] text-xs focus:outline-none cursor-pointer border-b border-[#00ff4422] focus:border-[#00ff4466] pb-0.5"
            style={{colorScheme:'dark'}}
          >
            <option value="prs" className="bg-[#040d04]">most PRs</option>
            <option value="name" className="bg-[#040d04]">name</option>
            <option value="stars" className="bg-[#040d04]">most stars</option>
          </select>
        </div>
      </div>

      {/* Repo rows */}
      <div className="divide-y divide-[#00ff440a]">
        {filtered.length > 0 ? filtered.map((repo, i) => (
          <a
            key={`${repo.owner}/${repo.name}`}
            href={`https://github.com/${repo.owner}/${repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#00ff4408] transition-colors group"
          >
            {/* Index */}
            <span className="text-[10px] text-[#00ff4422] w-6 text-right tabular-nums shrink-0 group-hover:text-[#00ff4444]">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Repo name */}
            <div className="flex-1 min-w-0">
              <span className="text-[#00ff4466] text-xs">{repo.owner}/</span>
              <span className="text-[#c0f0c0] text-sm font-medium group-hover:text-[#00ff44cc] transition-colors">
                {repo.name}
              </span>
              {repo.description && (
                <p className="text-[#4a7a4a] text-[10px] mt-0.5 truncate">{repo.description}</p>
              )}
            </div>

            {/* Language */}
            {repo.language && (
              <span className="text-[10px] text-[#00ff4455] hidden md:block shrink-0 w-20 truncate">
                {repo.language}
              </span>
            )}

            {/* Stars */}
            {repo.stars > 0 && (
              <span className="text-[10px] text-[#ffe50066] shrink-0 tabular-nums">
                ★ {repo.stars >= 1000 ? (repo.stars / 1000).toFixed(1) + 'k' : repo.stars}
              </span>
            )}

            {/* PR count */}
            <span
              className="text-xs font-bold tabular-nums shrink-0 w-16 text-right"
              style={{color: '#00ff44', textShadow: repo.prCount > 10 ? '0 0 10px #00ff4466' : 'none'}}
            >
              {repo.prCount} {repo.prCount === 1 ? 'PR' : 'PRs'}
            </span>

            <span className="text-[#00ff4022] group-hover:text-[#00ff4066] text-xs transition-colors">→</span>
          </a>
        )) : (
          <div className="py-16 text-center text-[#00ff4033] text-sm">
            <div className="text-2xl mb-3 opacity-30">□</div>
            no repositories found
          </div>
        )}
      </div>
    </div>
  )
}