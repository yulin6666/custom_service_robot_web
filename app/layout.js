import './globals.css'

export const metadata = {
  title: '智能客服助手',
  description: '基于LangGraph的智能客服机器人',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
