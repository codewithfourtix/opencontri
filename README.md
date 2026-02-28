# GitHub Open Source Contribution Analyzer

A full-stack web application to analyze anyone's open source contributions on GitHub. See exactly which projects someone has contributed to, how many PRs they've merged, what languages they code in, and more.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourname%2Fgithub-contribution-analyzer&env=GITHUB_TOKEN&envDescription=GitHub%20API%20Token&envLink=https%3A%2F%2Fgithub.com%2Fsettings%2Ftokens)

## Features

- **Profile Analysis**: View user profile info, followers, join date, location, bio
- **PR Breakdown**: See total PRs, merged PRs, open PRs, and closed PRs across all external repos
- **Issue Tracking**: Count all issues filed on external repositories
- **Repo List**: Browse every repo the user has contributed to, sorted by contribution frequency
- **Language Insights**: See what programming languages they code in most
- **Organization Tracking**: Filter contributions by organization
- **Real-time API Integration**: Fetches latest data from GitHub API with pagination
- **Shareable URLs**: Direct results URLs like `/results/torvalds` work immediately
- **Dark Theme**: Clean, minimal interface optimized for readability

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes (server-side)
- **API**: GitHub REST API v3
- **Deployment**: Vercel
- **Security**: GitHub token stored server-side only, never exposed to client

## Quick Start

### 1. Get a GitHub Personal Access Token

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name (e.g., "GitHub Analyzer Token")
4. Select **only** the `public_repo` scope
5. Click **"Generate token"** at the bottom
6. **Copy the token immediately** (you won't see it again!)

### 2. Clone and Setup

```bash
git clone https://github.com/yourusername/github-contribution-analyzer.git
cd github-contribution-analyzer

npm install
```

### 3. Add Your Token

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and paste your GitHub token
# GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Homepage**: Paste any GitHub profile URL or username in the search bar:
   - `https://github.com/torvalds`
   - `github.com/torvalds`
   - `torvalds`

2. **Results Page**: View comprehensive contribution analysis with:
   - Profile card with avatar, bio, follower count
   - Statistics cards showing PR and issue counts
   - Language breakdown chart
   - Filterable & sortable repository list

3. **Share Results**: Copy the URL from results page (e.g., `yoursite.com/results/torvalds`)

## Project Structure

```
.
├── app/
│   ├── page.js                    # Homepage with search bar
│   ├── layout.js                  # Root layout with Tailwind globals
│   ├── globals.css                # Tailwind CSS directives
│   ├── results/
│   │   └── [username]/
│   │       └── page.js            # Results page component
│   └── api/
│       └── github/
│           └── route.js           # GitHub API proxy route
├── components/
│   ├── ProfileCard.js             # User profile display
│   ├── StatCards.js               # Stats grid (PRs, issues, repos)
│   ├── RepoList.js                # Searchable, filterable repo list
│   └── LanguageBar.js             # Language usage breakdown
├── public/                        # Static assets
├── package.json
├── tailwind.config.js
├── next.config.js
├── .env.example                   # Template for environment variables
├── .env.local                     # Your actual token (never commit!)
├── .gitignore
└── README.md
```

## API Routes

### `GET /api/github`

Server-side proxy to GitHub API. Parameters:
- `endpoint`: `user`, `prs`, or `issues`
- `username`: GitHub username
- `page`: Page number (for PRs/issues, default: 1)

**Example**:
```
GET /api/github?endpoint=user&username=torvalds
GET /api/github?endpoint=prs&username=torvalds&page=1
```

The token is automatically added serverside, never exposed to the client.

## How It Works

1. **User enters GitHub username/URL** on homepage
2. **Next.js extracts** the username from the URL
3. **`/results/[username]` page** mounts and calls `/api/github` route
4. **API route adds GITHUB_TOKEN** and calls GitHub API
5. **Multiple API calls** fetch:
   - User profile data
   - All public PRs (paginated)
   - All public issues (paginated)
6. **Client-side filtering** removes repos owned by the user
7. **Data aggregation** calculates stats and language usage
8. **Results displayed** with interactive, filterable components

## Deployment to Vercel

### Option A: Deploy Button (Recommended)

Click the button at the top of this README or [here](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourname%2Fgithub-contribution-analyzer&env=GITHUB_TOKEN).

### Option B: Manual Deployment

1. **Push to GitHub**: Commit your code to a GitHub repository
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repo
   - Leave settings as default
   - Click "Deploy"
3. **Add Environment Variable**:
   - Go to your project settings
   - Select "Environment Variables"
   - Add `GITHUB_TOKEN` with your token value
   - Click "Save"
4. **Redeploy**:
   - Go to "Deployments"
   - Click the three dots on the latest deployment
   - Select "Redeploy"

Your app will be live at `yourproject.vercel.app`

## Rate Limiting

The GitHub API has rate limits:
- **Unauthenticated**: 60 requests/hour
- **Authenticated (with token)**: 5,000 requests/hour

A personal access token (included in your `GITHUB_TOKEN`) allows 5,000 requests/hour. One analysis can use 10-20+ API calls depending on the user's contribution history.

## Environment Variables

### Production (Vercel)

Set in Vercel project settings:
```
GITHUB_TOKEN=your_personal_access_token
```

### Development (Local)

Create `.env.local`:
```
GITHUB_TOKEN=your_personal_access_token
```

⚠️ **NEVER commit `.env.local` to Git** — it's in `.gitignore`

## Troubleshooting

### "GitHub token not configured"

Make sure:
1. You created `.env.local` in the project root
2. It contains `GITHUB_TOKEN=your_actual_token`
3. Your token is a valid GitHub personal access token
4. On Vercel, check that the environment variable is set in project settings

### "Rate limit exceeded"

- Each token has 5,000 API requests/hour
- Active contributors might exceed this
- Try again in an hour, or create additional tokens

### "User not found"

- The GitHub username doesn't exist
- Check spelling and try again

### Port already in use

If port 3000 is in use:
```bash
npm run dev -- -p 3001
```

## Features Todo

- [ ] Export data as CSV/JSON
- [ ] Compare two users' contributions
- [ ] Timeline of contributions over time
- [ ] Integration with GitHub GraphQL API
- [ ] Cache results for faster repeat lookups
- [ ] Dark/Light theme toggle

## License

MIT

## Support

Found a bug or have a suggestion? Open an issue on GitHub!

## Security

- **GitHub token is server-side only** — never sent to the browser
- **No data collection** — we don't store user data
- **API calls made on-demand** — real-time data from GitHub
- **No third-party tracking**
