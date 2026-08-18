import './globals.css'

export const metadata = {
  title: 'TOVERICH CLASS',
  description: '토브리치 온라인 강의 전용 사이트',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
