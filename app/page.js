'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLE_USERS = ['torvalds', 'gaearon', 'sindresorhus', 'addyosmani', 'tj']

export default function Home() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typed, setTyped] = useState('')
  const [exampleIdx, setExampleIdx] = useState(0)
  const router = useRouter()

  // Typewriter effect cycling through example usernames
  useEffect(() => {
    const target = EXAMPLE_USERS[exampleIdx]
    let i = 0
    setTyped('')
    const interval = setInterval(() => {
      i++
      setTyped(target.slice(0, i))
      if (i >= target.length) {
        clearInterval(interval)
        setTimeout(() => {
          setExampleIdx((prev) => (prev + 1) % EXAMPLE_USERS.length)
        }, 2000)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [exampleIdx])

  const extractUsername = (input) => {
    const trimmed = input.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed)
      return url.pathname.split('/').filter(Boolean)[0]
    }
    if (trimmed.includes('github.com/')) {
      return trimmed.split('github.com/')[1].split('/')[0]
    }
    return trimmed
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    if (!input.trim()) {
      setError('input required — enter a username or github url')
      return
    }
    try {
      const username = extractUsername(input)
      if (!username || username.includes('/') || username.includes(' ')) {
        setError('invalid github username or url')
        return
      }
      setIsLoading(true)
      router.push(`/results/${encodeURIComponent(username)}`)
    } catch {
      setError('invalid github url format')
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#040d04] flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{fontFamily:"'IBM Plex Mono', monospace"}}
    >
      {/* GitHub Star Button */}
      <a
        href="https://github.com/codewithfourtix/opencontri.git"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0a1a0a] hover:bg-[#0d2310] border border-[#00ff4433] hover:border-[#00ff44] text-[#00ff44] text-xs font-mono transition-all duration-300"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>star on github</span>
      </a>

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00ff4406 1px, transparent 1px), linear-gradient(90deg, #00ff4406 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at center, transparent 40%, #040d04 100%)'}} />

      <div className="w-full max-w-2xl relative z-10">
        {/* ASCII art header */}
        <div className="mb-10 text-center">
          <pre className="text-[#00ff4433] text-[8px] md:text-[10px] leading-tight select-none mb-6 overflow-hidden">
{`  ██████╗ ██╗████████╗██╗  ██╗██╗   ██╗██████╗ 
 ██╔════╝ ██║╚══██╔══╝██║  ██║██║   ██║██╔══██╗
 ██║  ███╗██║   ██║   ███████║██║   ██║██████╔╝
 ██║   ██║██║   ██║   ██╔══██║██║   ██║██╔══██╗
 ╚██████╔╝██║   ██║   ██║  ██║╚██████╔╝██████╔╝
  ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ `}
          </pre>
          <div className="text-[#00ff4466] text-xs tracking-[0.4em] uppercase mb-2">
            open source contribution analyzer
          </div>
          <div className="text-[#00ff4033] text-[10px] tracking-widest">
            v1.0.0 // powered by github api
          </div>
        </div>

        {/* Terminal window */}
        <div className="border border-[#00ff4422] bg-[#050f05] overflow-hidden mb-6">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00ff4415] bg-[#00ff440a]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff44]" style={{boxShadow:'0 0 6px #00ff44'}} />
            </div>
            <span className="ml-2 text-[#00ff4444] text-xs tracking-[0.2em]">github-analyzer — bash</span>
          </div>

          <div className="p-6">
            {/* Prompt line */}
            <div className="flex items-center gap-2 mb-1 text-xs">
              <span className="text-[#00ff44cc]">user@analyzer</span>
              <span className="text-[#00ff4455]">:</span>
              <span className="text-[#6699ff99]">~</span>
              <span className="text-[#00ff4055]">$</span>
              <span className="text-[#00ff4044] ml-1">analyze</span>
              <span className="text-[#00ff4033] animate-pulse ml-1">
                {typed}<span className="text-[#00ff44cc]">_</span>
              </span>
            </div>

            <form onSubmit={handleSearch} className="mt-4">
              <div className="flex items-center gap-3 border border-[#00ff4422] bg-[#040d04] px-4 py-3 focus-within:border-[#00ff4466] transition-colors">
                <span className="text-[#00ff4466] text-sm shrink-0">$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError('') }}
                  placeholder="username or github.com/username"
                  className="flex-1 bg-transparent text-[#c0f0c0] text-sm placeholder-[#00ff4022] focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-1.5 text-xs border border-[#00ff4444] text-[#00ff44] hover:bg-[#00ff4411] hover:border-[#00ff4488] transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-widest uppercase"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-base leading-none">⠋</span>
                      running
                    </span>
                  ) : 'run →'}
                </button>
              </div>

              {error && (
                <div className="mt-3 flex items-center gap-2 text-[#ff6b6b] text-xs">
                  <span>✗</span>
                  <span>{error}</span>
                </div>
              )}
            </form>

            <div className="mt-4 text-[10px] text-[#00ff4033] space-y-1">
              <div>// accepts: username, github.com/username, full profile url</div>
              <div>// fetches all public PRs and issues across github</div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-3 gap-px bg-[#00ff4415]">
          {[
            { sym: '01', label: 'all PRs', desc: 'every PR ever opened' },
            { sym: '02', label: 'by repo', desc: 'grouped & ranked' },
            { sym: '03', label: 'languages', desc: 'contribution breakdown' },
          ].map((f) => (
            <div key={f.sym} className="bg-[#040d04] px-4 py-4 hover:bg-[#071407] transition-colors group">
              <div className="text-[9px] text-[#00ff4033] tracking-widest mb-2">{f.sym}</div>
              <div className="text-[#00ff4499] text-xs font-medium mb-1 group-hover:text-[#00ff44cc] transition-colors">{f.label}</div>
              <div className="text-[9px] text-[#00ff4033]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}