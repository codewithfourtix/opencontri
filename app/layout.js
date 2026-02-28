import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'GitHub Contribution Analyzer',
  description: 'Analyze GitHub open source contributions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5G2XF8MBV1"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5G2XF8MBV1');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
