import './globals.css'

export const metadata = {
  title: 'GitHub Contribution Analyzer',
  description: 'Analyze GitHub open source contributions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
