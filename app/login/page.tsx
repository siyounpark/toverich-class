'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      setMessage('이메일 또는 비밀번호를 확인해 주세요.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/my-class')
    }

    router.refresh()
  }

  return (
    <main className="authPage">
      <section className="authCard">
        <a href="/" className="authBrand">TOVERICH <span>CLASS</span></a>
        <div className="authEyebrow">MEMBER LOGIN</div>
        <h1>강의실 로그인</h1>
        <p className="authIntro">등록된 이메일과 비밀번호로 로그인해 주세요.</p>

        <form onSubmit={handleLogin} className="authForm">
          <label>
            이메일
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
          </label>

          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호 입력"
              required
              autoComplete="current-password"
            />
          </label>

          {message && <div className="authMessage">{message}</div>}

          <button type="submit" className="authSubmit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <a href="/" className="authBack">← 홈으로 돌아가기</a>
      </section>
    </main>
  )
}
