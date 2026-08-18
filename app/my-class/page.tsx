'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function MyClassPage() {
  const router = useRouter()
  const [status, setStatus] = useState('수강 정보를 확인하는 중입니다...')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace('/login')
        return
      }
      setStatus('로그인되었습니다. 수강 권한이 있는 강의가 여기에 표시됩니다.')
    }
    load()
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  return (
    <main className="dashboardPage">
      <section className="dashboardShell">
        <div className="dashboardTopbar">
          <div>
            <div className="authBrand">TOVERICH <span>CLASS</span></div>
            <div className="authEyebrow">MY CLASS</div>
          </div>
          <button className="secondaryAction" onClick={logout}>로그아웃</button>
        </div>
        <h1>내 강의실</h1>
        <p>{status}</p>
      </section>
    </main>
  )
}
