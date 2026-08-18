'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Profile = {
  id: string
  name: string | null
  email: string | null
  role: 'student' | 'admin'
  created_at: string
}

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Profile[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    setLoading(true)
    setMessage('')

    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user

    if (!user) {
      router.replace('/login')
      return
    }

    setCurrentUserId(user.id)

    const { data: me } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (me?.role !== 'admin') {
      router.replace('/my-class')
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage('회원 목록을 불러오지 못했습니다.')
    } else {
      setMembers((data || []) as Profile[])
    }

    setLoading(false)
  }

  async function changeRole(member: Profile, nextRole: 'student' | 'admin') {
    if (member.id === currentUserId) {
      setMessage('현재 로그인한 관리자 계정의 권한은 이 화면에서 변경하지 않습니다.')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: nextRole })
      .eq('id', member.id)

    if (error) {
      setMessage('권한 변경에 실패했습니다.')
      return
    }

    setMembers((prev) => prev.map((item) => item.id === member.id ? { ...item, role: nextRole } : item))
    setMessage(`${member.email || member.name || '회원'}의 권한을 ${nextRole === 'admin' ? '관리자' : '수강생'}로 변경했습니다.`)
  }

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return members
    return members.filter((member) =>
      (member.name || '').toLowerCase().includes(q) ||
      (member.email || '').toLowerCase().includes(q)
    )
  }, [members, search])

  return (
    <main className="dashboardPage">
      <section className="dashboardShell wideDashboard">
        <div className="dashboardTopbar">
          <div>
            <a href="/admin" className="authBrand">TOVERICH <span>CLASS</span></a>
            <div className="authEyebrow">ADMIN · MEMBERS</div>
          </div>
          <a className="secondaryAction" href="/admin">← 관리자 홈</a>
        </div>

        <div className="adminPageHeader">
          <div>
            <h1>회원 관리</h1>
            <p>가입한 회원과 관리자/수강생 권한을 확인하고 관리합니다.</p>
          </div>
          <div className="memberSummary">총 {members.length}명</div>
        </div>

        <div className="memberToolbar">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="이름 또는 이메일 검색"
            aria-label="회원 검색"
          />
          <button className="secondaryAction" onClick={loadMembers}>새로고침</button>
        </div>

        {message && <div className="adminNotice">{message}</div>}

        {loading ? (
          <div className="adminEmpty">회원 목록을 불러오는 중입니다...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="adminEmpty">표시할 회원이 없습니다.</div>
        ) : (
          <div className="memberTableWrap">
            <table className="memberTable">
              <thead>
                <tr>
                  <th>회원</th>
                  <th>이메일</th>
                  <th>가입일</th>
                  <th>권한</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="memberName">{member.name || '이름 미등록'}</div>
                      {member.id === currentUserId && <span className="meBadge">현재 계정</span>}
                    </td>
                    <td>{member.email || '-'}</td>
                    <td>{new Date(member.created_at).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <select
                        className="roleSelect"
                        value={member.role}
                        disabled={member.id === currentUserId}
                        onChange={(event) => changeRole(member, event.target.value as 'student' | 'admin')}
                      >
                        <option value="student">수강생</option>
                        <option value="admin">관리자</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
