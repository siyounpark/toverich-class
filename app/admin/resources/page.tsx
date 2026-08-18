'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ResourceAdminPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function check() {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData.user
      if (!user) return router.replace('/login')
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') return router.replace('/my-class')
      setReady(true)
    }
    check()
  }, [router])

  if (!ready) return <main className="dashboardPage"><section className="dashboardShell">관리자 권한을 확인하는 중입니다...</section></main>

  return (
    <main className="dashboardPage">
      <section className="dashboardShell wideDashboard">
        <div className="dashboardTopbar">
          <a href="/admin" className="secondaryAction">← 관리자 홈</a>
          <div className="authBrand">TOVERICH <span>CLASS</span></div>
        </div>
        <div className="adminPageHeader">
          <div><div className="authEyebrow">RESOURCES</div><h1>자료실 관리</h1><p>각 강의별 PDF, 챗봇, 링크, 파일을 등록하고 관리합니다.</p></div>
        </div>
        <div className="adminEmpty">다음 단계에서 강의 선택 → 자료 종류 → 링크/파일 등록 기능을 연결합니다.</div>
      </section>
    </main>
  )
}
