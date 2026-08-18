const courses = [
  {
    title: 'AI 미리캔버스 요소 제작',
    description: 'AI로 아이디어부터 요소 제작, 키워드, 업로드까지 배우는 실전 과정',
    lessons: 10,
    status: '수강 가능',
  },
  {
    title: 'AI 컬러링북 작가 과정',
    description: 'AI로 도안을 만들고 나만의 컬러링북을 완성하는 과정',
    lessons: 10,
    status: '수강 신청',
  },
]

const resources = [
  { icon: '🤖', title: '강의용 챗봇', description: '수업에서 사용하는 전용 GPT와 AI 도구' },
  { icon: '📄', title: 'PDF 자료', description: '워크북, 체크리스트, 프롬프트 자료' },
  { icon: '🔗', title: '유용한 링크', description: '미리캔버스, Canva 등 강의 관련 사이트' },
  { icon: '📁', title: '다운로드 자료', description: '예제 이미지, 템플릿, 실습 파일' },
]

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <div className="brand">TOVERICH <span>CLASS</span></div>
        <nav>
          <a href="#courses">전체 강의</a>
          <a href="/my-class">내 강의실</a>
          <a href="#resources">자료실</a>
          <a className="loginButton" href="/login">로그인</a>
        </nav>
      </header>

      <section className="hero">
        <div className="heroBadge">토브리치 온라인 성장스쿨</div>
        <h1>배우고, 만들고,<br />나만의 콘텐츠로 성장하세요.</h1>
        <p>AI가 어렵게 느껴져도 괜찮습니다. 하나씩 따라오며 나만의 콘텐츠와 수익화 기반을 만들어 보세요.</p>
        <div className="heroActions">
          <a className="primaryButton" href="/my-class">내 강의실 가기</a>
          <a className="secondaryButton" href="#courses">강의 둘러보기</a>
        </div>
      </section>

      <section className="section" id="myclass">
        <div className="sectionHeading">
          <div>
            <span className="eyebrow">MY CLASS</span>
            <h2>내 강의실</h2>
          </div>
          <p>결제 확인 후 수강 권한이 부여된 강의만 열립니다.</p>
        </div>
        <div className="courseGrid">
          {courses.map((course, index) => (
            <article className="courseCard" key={course.title}>
              <div className={`courseVisual visual${index + 1}`}>
                <span>{index === 0 ? 'AI · DESIGN' : 'AI · COLORING'}</span>
              </div>
              <div className="courseBody">
                <div className="courseMeta">총 {course.lessons}강 · 온라인 강의</div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <button className={index === 0 ? 'courseButton active' : 'courseButton'}>
                  {index === 0 ? '강의실 입장' : '🔒 수강 신청'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section softSection" id="resources">
        <div className="sectionHeading">
          <div>
            <span className="eyebrow">LEARNING TOOLS</span>
            <h2>강의 자료실</h2>
          </div>
          <p>강의별 챗봇, PDF, 링크와 실습파일을 한곳에서 관리합니다.</p>
        </div>
        <div className="resourceGrid">
          {resources.map((resource) => (
            <article className="resourceCard" key={resource.title}>
              <div className="resourceIcon">{resource.icon}</div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="courses">
        <div className="ctaBox">
          <div>
            <span className="eyebrow">TOVERICH CLASS</span>
            <h2>처음부터 차근차근,<br />실제로 완성하는 수업</h2>
          </div>
          <p>회원 로그인, 강의별 권한, 영상 시청, 자료실과 관리자 기능을 순차적으로 연결할 예정입니다.</p>
        </div>
      </section>

      <footer>© 2026 TOVERICH CLASS. All rights reserved.</footer>
    </main>
  )
}
