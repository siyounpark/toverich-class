'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [status, setStatus] = useState('관리자 정보를 확인하는 중입니다...')

  useEffect(() => {
    async function checkAdmin() {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData.user

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, name, email')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.replace('/my-class')
        return
      }

      setStatus(`${profile.name || profile.email || '관리자'}님, 관리자 모드입니다.`)
    }

    checkAdmin()
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  const go = (path: string) => router.push(path)

  return (
    <main className="dashboardPage">
      <section className="dashboardShell">
        <div className="dashboardTopbar">
          <div>
            <div className="authBrand">TOVERICH <span>CLASS</span></div>
            <div className="authEyebrow">ADMIN</div>
          </div>
          <button className="secondaryAction" onClick={logout}>로그아웃</button>
        </div>

        <h1>관리자 페이지</h1>
        <p>{status}</p>

        <div className="adminGrid">
          <button type="button" className="adminCardButton" onClick={() => go('/admin/members')}>
            <strong>회원 관리</strong>
            <span>회원 목록과 관리자/수강생 정보를 관리합니다.</span>
          </button>
          <button type="button" className="adminCardButton" onClick={() => go('/admin/enrollments')}>
            <strong>수강권한 관리</strong>
            <span>결제 확인 후 과목별 수강권한을 부여합니다.</span>
          </button>
          <button type="button" className="adminCardButton" onClick={() => go('/admin/courses')}>
            <strong>강의 관리</strong>
            <span>과목과 차시별 영상을 등록합니다.</span>
          </button>
          <button type="button" className="adminCardButton" onClick={() => go('/admin/resources')}>
            <strong>자료실 관리</strong>
            <span>각 강의별 PDF, 챗봇, 링크, 파일을 등록합니다.</span>
          </button>
        </div>
      </section>
    </main>
  )
}
