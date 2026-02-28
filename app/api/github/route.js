export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const username = searchParams.get('username')

  if (!endpoint || !username) {
    return Response.json(
      { error: 'Missing endpoint or username' },
      { status: 400 }
    )
  }

  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return Response.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    )
  }

  try {
    let url = ''

    switch (endpoint) {
      case 'user':
        url = `https://api.github.com/users/${username}`
        break
      case 'prs':
        const page = searchParams.get('page') || '1'
        const perPage = 100
        url = `https://api.github.com/search/issues?q=type:pr+author:${username}+is:public&sort=created&order=desc&page=${page}&per_page=${perPage}`
        break
      case 'issues':
        const page2 = searchParams.get('page') || '1'
        const perPage2 = 100
        url = `https://api.github.com/search/issues?q=type:issue+author:${username}+is:public&sort=created&order=desc&page=${page2}&per_page=${perPage2}`
        break
      default:
        return Response.json(
          { error: 'Unknown endpoint' },
          { status: 400 }
        )
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return Response.json(
        { error: data.message || 'GitHub API error' },
        { status: response.status }
      )
    }

    return Response.json(data)
  } catch (error) {
    console.error('GitHub API error:', error)
    return Response.json(
      { error: 'Failed to fetch from GitHub API' },
      { status: 500 }
    )
  }
}
