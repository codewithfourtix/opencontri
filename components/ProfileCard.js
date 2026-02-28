export default function ProfileCard({ profile }) {
  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })

  return (
    <div className="mb-6 border border-[#00ff4422] bg-[#040d04] overflow-hidden" style={{fontFamily:"'IBM Plex Mono', monospace"}}>
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#00ff4415] bg-[#00ff440a]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff44]" style={{boxShadow:'0 0 6px #00ff44'}} />
        </div>
        <span className="ml-2 text-[#00ff4444] text-xs tracking-[0.2em]">~/profile/{profile.login}</span>
      </div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {profile.avatar_url && (
            <div className="shrink-0 flex flex-col items-center gap-2">
              <img
                src={profile.avatar_url}
                alt={profile.login}
                className="w-20 h-20 border border-[#00ff4433]"
                style={{filter:'grayscale(20%) sepia(30%) hue-rotate(60deg) brightness(0.85)', boxShadow:'0 0 20px rgba(0,255,68,0.1)'}}
              />
              <span className="text-[9px] text-[#00ff4444] tracking-[0.25em]">
                {profile.public_repos || 0} repos
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-[#00ff4455] text-[10px] tracking-[0.4em] uppercase mb-1">$ whoami</div>
            <div className="flex items-baseline gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[#e0ffe0] tracking-tight">
                {profile.name || profile.login}
              </h1>
              <span className="text-[#00ff4466] text-sm">@{profile.login}</span>
            </div>

            {profile.bio && (
              <p className="text-[#7aaa7a] text-sm leading-relaxed mb-5 border-l border-[#00ff4433] pl-3 mt-3">
                // {profile.bio}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                { k: 'followers', v: profile.followers },
                { k: 'following', v: profile.following },
                profile.location && { k: 'location', v: profile.location },
                { k: 'joined', v: joinDate },
              ].filter(Boolean).map(({ k, v }) => (
                <div key={k}>
                  <div className="text-[9px] text-[#00ff4444] tracking-[0.3em] uppercase mb-1">{k}</div>
                  <div className="text-[#00ff44cc] text-sm font-semibold" style={{textShadow:'0 0 10px rgba(0,255,68,0.3)'}}>
                    {typeof v === 'number' ? v.toLocaleString() : v}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-5 flex-wrap">
              <a
                href={`https://github.com/${profile.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-xs border border-[#00ff4433] text-[#00ff4499] hover:border-[#00ff4466] hover:text-[#00ff44cc] transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                github.com/{profile.login}
              </a>
              {profile.blog && (
                <a
                  href={profile.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs border border-[#00ff4422] text-[#00ff4466] hover:border-[#00ff4444] hover:text-[#00ff4499] transition-all"
                >
                  ↗ website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}