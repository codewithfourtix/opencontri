'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileCard from '@/components/ProfileCard'
import StatCards from '@/components/StatCards'
import RepoList from '@/components/RepoList'
import LanguageBar from '@/components/LanguageBar'

const LOADING_STEPS = [
  'connecting to github api...',
  'fetching user profile...',
  'scanning pull requests...',
  'scanning issues...',
  'aggregating repositories...',
  'computing language stats...',
  'rendering results...',
]

export default function ResultsPage({ params }) {
  const { username } = params
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [repos, setRepos] = useState([])
  const [languages, setLanguages] = useState({})
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadStep, setLoadStep] = useState(0)

  // Cycle loading messages
  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setLoadStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 1800)
    return () => clearInterval(t)
  }, [loading])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const profileRes = await fetch(`/api/github?endpoint=user&username=${username}`)
        if (!profileRes.ok) {
          setError(profileRes.status === 404 ? 'user_not_found' : 'fetch_failed')
          return
        }
        const profileData = await profileRes.json()
        setProfile(profileData)

        let allPRs = [], prPage = 1, lastPRSize = 100
        while (lastPRSize === 100) {
          const res = await fetch(`/api/github?endpoint=prs&username=${username}&page=${prPage}`)
          if (!res.ok) throw new Error('failed to fetch PRs')
          const data = await res.json()
          allPRs = allPRs.concat(data.items || [])
          lastPRSize = data.items?.length || 0
          prPage++
        }

        let allIssues = [], issuePage = 1, lastIssueSize = 100
        while (lastIssueSize === 100) {
          const res = await fetch(`/api/github?endpoint=issues&username=${username}&page=${issuePage}`)
          if (!res.ok) throw new Error('failed to fetch issues')
          const data = await res.json()
          allIssues = allIssues.concat(data.items || [])
          lastIssueSize = data.items?.length || 0
          issuePage++
        }

        const repoMap = new Map()
        const languageMap = {}
        const orgSet = new Set()

        allPRs.forEach((pr) => {
          const repoName = pr.repository_url.split('/').pop()
          const repoOwner = pr.repository_url.split('/')[4]
          if (repoOwner !== username) {
            const key = `${repoOwner}/${repoName}`
            if (!repoMap.has(key)) repoMap.set(key, { owner: repoOwner, name: repoName, prCount: 0, issueCount: 0, language: null, stars: 0, description: null, org: repoOwner })
            repoMap.get(key).prCount += 1
            orgSet.add(repoOwner)
          }
        })

        allIssues.forEach((issue) => {
          const repoName = issue.repository_url.split('/').pop()
          const repoOwner = issue.repository_url.split('/')[4]
          if (repoOwner !== username) {
            const key = `${repoOwner}/${repoName}`
            if (!repoMap.has(key)) repoMap.set(key, { owner: repoOwner, name: repoName, prCount: 0, issueCount: 0, language: null, stars: 0, description: null, org: repoOwner })
            repoMap.get(key).issueCount += 1
          }
        })

        for (const [, repo] of repoMap.entries()) {
          try {
            const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
              headers: { Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''}`, Accept: 'application/vnd.github.v3+json' },
            })
            if (res.ok) {
              const data = await res.json()
              repo.language = data.language || null
              repo.stars = data.stargazers_count || 0
              repo.description = data.description || null
              if (repo.language) languageMap[repo.language] = (languageMap[repo.language] || 0) + repo.prCount
            }
          } catch {}
        }

        const repoArray = Array.from(repoMap.values()).sort((a, b) => b.prCount - a.prCount)
        const mergedCount = allPRs.filter(pr => pr.pull_request?.merged_at && pr.repository_url.split('/')[4] !== username).length
        const openCount = allPRs.filter(pr => pr.state === 'open' && pr.repository_url.split('/')[4] !== username).length
        const closedCount = allPRs.filter(pr => pr.state === 'closed' && !pr.pull_request?.merged_at && pr.repository_url.split('/')[4] !== username).length

        setStats({
          totalPRs: allPRs.filter(pr => pr.repository_url.split('/')[4] !== username).length,
          mergedPRs: mergedCount, openPRs: openCount, closedPRs: closedCount,
          totalIssues: allIssues.filter(i => i.repository_url.split('/')[4] !== username).length,
          reposContributed: repoArray.length,
        })
        setRepos(repoArray)
        setLanguages(languageMap)
        setOrgs(Array.from(orgSet).sort())
      } catch (err) {
        setError(err.message || 'unknown_error')
      } finally {
        setLoading(false)
      }
    }

    if (username) fetchData()
  }, [username])

  const BackButton = () => (
    <button
      onClick={() => router.push('/')}
      className="flex items-center gap-2 text-[#00ff4455] hover:text-[#00ff44aa] text-xs tracking-widest uppercase mb-6 transition-colors group"
      style={{fontFamily:"'IBM Plex Mono', monospace"}}
    >
      <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
      <span>back</span>
    </button>
  )

  if (error) {
    const msg = error === 'user_not_found'
      ? `user "${username}" not found on github`
      : `error: ${error}`
    return (
      <div className="min-h-screen bg-[#040d04] py-10 px-4" style={{fontFamily:"'IBM Plex Mono', monospace"}}>
        <div className="max-w-6xl mx-auto">
          <BackButton />
          <div className="border border-[#ff6b6b33] bg-[#1a0505] p-8">
            <div className="text-[9px] text-[#ff6b6b44] tracking-widest uppercase mb-3">process exited with error</div>
            <div className="text-[#ff6b6b99] text-sm">✗ {msg}</div>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !profile || !stats) {
    return (
      <div className="min-h-screen bg-[#040d04] py-10 px-4" style={{fontFamily:"'IBM Plex Mono', monospace"}}>
        <div className="max-w-6xl mx-auto">
          <BackButton />
          <div className="border border-[#00ff4415] bg-[#050f05] p-8">
            <div className="text-[9px] text-[#00ff4033] tracking-widest uppercase mb-6">analyzing {username}</div>
            <div className="space-y-2">
              {LOADING_STEPS.map((step, i) => (
                <div key={step} className={`flex items-center gap-3 text-xs transition-all duration-300 ${i <= loadStep ? 'opacity-100' : 'opacity-20'}`}>
                  <span style={{color: i < loadStep ? '#00ff44' : i === loadStep ? '#ffe500' : '#00ff4033'}}>
                    {i < loadStep ? '✓' : i === loadStep ? '›' : '·'}
                  </span>
                  <span style={{color: i < loadStep ? '#00ff4466' : i === loadStep ? '#ffe50099' : '#00ff4022'}}>
                    {step}
                  </span>
                  {i === loadStep && (
                    <span className="text-[#ffe50066] animate-pulse">▊</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#040d04] py-10 px-4"
      style={{
        fontFamily:"'IBM Plex Mono', monospace",
        backgroundImage: 'linear-gradient(#00ff4403 1px, transparent 1px), linear-gradient(90deg, #00ff4403 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="max-w-6xl mx-auto">
        <BackButton />
        <ProfileCard profile={profile} />
        <StatCards stats={stats} />
        {Object.keys(languages).length > 0 && <LanguageBar languages={languages} />}
        <RepoList repos={repos} orgs={orgs} />
        <div className="mt-6 text-center text-[9px] text-[#00ff4022] tracking-widest">
          process complete // data sourced from github public api
        </div>
      </div>
    </div>
  )
}