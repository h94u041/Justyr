<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/* ---------- content ---------- */
const traits = ['選擇勝於打拼', '冷靜客觀', '學習力強', '狀況分析']

const skills = [
  { name: 'T-SQL / MS SQL', years: 8, max: 8, hue: 'gold', note: '大量 View 整合分析、效能調教' },
  { name: 'Vue 3', years: 5, max: 7, hue: 'teal', note: '大前端從無到有，一人獨立建置' },
  { name: 'Laravel / PHP', years: 5, max: 7, hue: 'rose', note: 'API Service、金流、第三方驗證' },
  { name: 'React', years: 1, max: 7, hue: 'cyan', note: '官網、數據後台、銷售管理前端' },
  { name: 'Oracle / 4GL ERP', years: 1, max: 7, hue: 'violet', note: 'TIPTOP、淨銷存、生產製造' },
  { name: 'C# / ASP.NET', years: 1, max: 7, hue: 'ice', note: 'PLM 後端、MS-SQL 溝通層' },
]

const orbits = [
  { r: 110, dur: 26, planets: [{ label: 'Vue 3', hue: 'teal', a: 0 }, { label: 'React', hue: 'cyan', a: 180 }] },
  { r: 175, dur: 40, planets: [{ label: 'Laravel', hue: 'rose', a: 40 }, { label: 'T-SQL', hue: 'gold', a: 160 }, { label: 'MySQL', hue: 'ice', a: 280 }] },
  { r: 240, dur: 58, planets: [{ label: 'Oracle', hue: 'violet', a: 90 }, { label: 'Linux', hue: 'gold', a: 210 }, { label: 'C#', hue: 'ice', a: 330 }] },
]

const journey = [
  {
    period: '-',
    role: '全端工程師',
    tags: ['React', 'Laravel', 'MySQL', 'Serverless'],
    text: '官網、數據後台、製造管理與客戶銷售四套系統；串接 Chat Bot、金流、第三方驗證與快遞平台。',
    hue: 'cyan',
  },
  {
    period: '2022 — 2025',
    role: '全端工程師',
    tags: ['Vue 3', '後端 API', '系統架構'],
    text: '從底層架構到 Vue 3 前端 + Laravel，一人從零建起整套系統，運行近四年。',
    hue: 'gold',
  },
  {
    period: '2020 — 2022',
    role: '軟體工程師 / DBA',
    tags: ['Oracle', '4GL ERP', 'Java', 'JavaScript'],
    text: 'Oracle 資料庫維運、ERP 模組與表單簽核系統開發。',
    hue: 'violet',
  },
]

/* 成果簡報：每一頁一個職務，只列負責事務與完成事項，不放公司名 */
type Win = { text: string; star?: boolean; metric?: string }
type Slide = { period: string; role: string; summary: string; hue: string; duties: string[]; wins: Win[]; stack: string[] }
const deck: Slide[] = [
  {
    period: '2026 — 至今',
    role: '全端工程師',
    summary: '一人扛四套系統的前後端，從架構到上線。',
    hue: 'cyan',
    duties: [
      '整體 Web 服務架構規劃與開發',
      '後端資料庫設計、API 接口邏輯與資料流',
      '官網、數據後台、製造管理後台、客戶銷售管理 前端開發與維護',
      '各類規格探查與技術調研',
    ],
    wins: [
      { text: '將老介面打造為商用級介面', star: true },
      { text: 'Chat 訊息機器人、Serverless API 上線' },
      { text: '第三方驗證與金流整合' },
      { text: '快遞平台串接，出貨流程自動化' },
    ],
    stack: ['React', 'Laravel', 'MySQL', 'Serverless', 'Git'],
  },
  {
    period: '2022 — 2025',
    role: '全端工程師 · 獨立開發',
    summary: '在精密製造現場，一個人從零建起整套系統。',
    hue: 'gold',
    duties: [
      '底層架構、後端 API 到 Vue 3 前端，全端獨立設計與建置',
      '系統穩定性與長期維護成本的取捨',
      '需求訪談、規格定義到部署上線',
    ],
    wins: [
      { text: '整套系統從無到有，穩定運行近四年', star: true },
      { text: '在資源有限下兼顧開發效率與可維護性' },
      { text: '零外部協力，單人完成全部環節' },
    ],
    stack: ['Vue 3', 'Laravel', 'T-SQL', 'Linux'],
  },
  {
    period: '2020 — 2022',
    role: '軟體工程師 / DBA · ERP',
    summary: '維運 Oracle 資料庫，開發 ERP 與簽核系統。',
    hue: 'violet',
    duties: [
      'Oracle 資料庫維護與資源管理（CPU、Memory、IO、權限、空間）',
      'ERP 程式開發（Genero 4GL / 4fd）',
      '表單簽核系統（JavaScript、Java SessionBean）',
      '效能調教、技術債梳理，兼顧維運成本',
    ],
    wins: [
      { text: '替公司省下一年 500 萬的維護成本', star: true, metric: '500萬 / 年' },
      { text: '資料庫效能調教，消除瓶頸' },
      { text: '簽核流程系統化，取代紙本作業' },
    ],
    stack: ['Oracle', '4GL', 'TIPTOP', 'Java', 'JavaScript', 'Linux'],
  },
]

const slide = ref(0)
const slideDir = ref(1)
const goSlide = (n: number) => {
  const len = deck.length
  const next = ((n % len) + len) % len
  slideDir.value = next > slide.value || (slide.value === len - 1 && next === 0) ? 1 : -1
  slide.value = next
}

/* ---------- runtime ---------- */
const canvasRef = ref<HTMLCanvasElement | null>(null)
const loaded = ref(false)
const progress = ref(0)
const timelineRef = ref<HTMLElement | null>(null)
const timelineProgress = ref(0)

let raf = 0
let observer: IntersectionObserver | null = null
let cleanupFns: Array<() => void> = []

type Star = { x: number; y: number; z: number; r: number; p: number; s: number; tint: number }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; len: number }

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* reveal on scroll */
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          observer?.unobserve(e.target)
        }
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => observer!.observe(el))

  /* scroll: progress bar, parallax, timeline draw */
  const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
  const onScroll = () => {
    const sy = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(1, sy / max) : 0
    if (!reduce) {
      for (const el of parallaxEls) {
        const f = Number(el.dataset.parallax || 0)
        el.style.transform = `translate3d(0, ${(-sy * f).toFixed(1)}px, 0)`
      }
    }
    const tl = timelineRef.value
    if (tl) {
      const rect = tl.getBoundingClientRect()
      const seen = window.innerHeight * 0.75 - rect.top
      timelineProgress.value = Math.max(0, Math.min(1, seen / rect.height))
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  cleanupFns.push(() => window.removeEventListener('scroll', onScroll))
  onScroll()

  /* starfield */
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (canvas && ctx) {
    let W = 0
    let H = 0
    let stars: Star[] = []
    let meteors: Meteor[] = []
    let nextMeteor = 1500
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(420, (W * H) / 3200))
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.25 + Math.random() * 0.75,
        r: 0.4 + Math.random() * 1.3,
        p: Math.random() * Math.PI * 2,
        s: 0.6 + Math.random() * 1.6,
        tint: Math.random(),
      }))
    }
    resize()
    window.addEventListener('resize', resize)
    cleanupFns.push(() => window.removeEventListener('resize', resize))

    const color = (t: number, a: number) =>
      t < 0.75 ? `rgba(235,240,255,${a})` : t < 0.9 ? `rgba(160,220,255,${a})` : `rgba(255,214,150,${a})`

    let last = 0
    const draw = (t: number) => {
      const dt = last ? Math.min(50, t - last) : 16
      last = t
      ctx.clearRect(0, 0, W, H)
      const sy = window.scrollY

      for (const st of stars) {
        const px = st.x * W
        let py = (st.y * H - sy * st.z * 0.32) % H
        if (py < 0) py += H
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * 0.0012 * st.s + st.p)
        const a = (0.35 + 0.65 * tw) * st.z
        ctx.fillStyle = color(st.tint, a)
        ctx.beginPath()
        ctx.arc(px, py, st.r * st.z, 0, Math.PI * 2)
        ctx.fill()
        if (st.r > 1.4 && st.z > 0.8) {
          ctx.fillStyle = color(st.tint, a * 0.12)
          ctx.beginPath()
          ctx.arc(px, py, st.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!reduce) {
        nextMeteor -= dt
        if (nextMeteor <= 0 && meteors.length < 2) {
          meteors.push({
            x: Math.random() * W * 0.8,
            y: Math.random() * H * 0.4,
            vx: 0.55 + Math.random() * 0.4,
            vy: 0.28 + Math.random() * 0.2,
            life: 1,
            len: 140 + Math.random() * 120,
          })
          nextMeteor = 2500 + Math.random() * 5000
        }
        meteors = meteors.filter((m) => m.life > 0)
        for (const m of meteors) {
          m.x += m.vx * dt
          m.y += m.vy * dt
          m.life -= dt / 1100
          const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.len, m.y - m.vy * m.len)
          g.addColorStop(0, `rgba(255,255,255,${0.9 * m.life})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.strokeStyle = g
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(m.x, m.y)
          ctx.lineTo(m.x - m.vx * m.len, m.y - m.vy * m.len)
          ctx.stroke()
        }
        raf = requestAnimationFrame(draw)
      }
    }
    raf = requestAnimationFrame(draw)
  }

  /* deck: 方向鍵翻頁（簡報在視窗內時才吃鍵盤） */
  const deckEl = document.getElementById('deck')
  const onKey = (e: KeyboardEvent) => {
    if (!deckEl) return
    const r = deckEl.getBoundingClientRect()
    if (r.bottom < 0 || r.top > window.innerHeight) return
    if (e.key === 'ArrowRight') goSlide(slide.value + 1)
    else if (e.key === 'ArrowLeft') goSlide(slide.value - 1)
  }
  window.addEventListener('keydown', onKey)
  cleanupFns.push(() => window.removeEventListener('keydown', onKey))

  requestAnimationFrame(() => (loaded.value = true))
})

/* deck: 手機左右滑 */
let touchX = 0
const onTouchStart = (e: TouchEvent) => (touchX = e.touches[0].clientX)
const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchX
  if (Math.abs(dx) > 48) goSlide(slide.value + (dx < 0 ? 1 : -1))
}

onUnmounted(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []
})
</script>

<template>
  <div class="cosmos" :class="{ loaded }">
    <div class="progress" :style="{ transform: `scaleX(${progress})` }" />

    <!-- fixed deep-space backdrop -->
    <div class="sky" aria-hidden="true">
      <canvas ref="canvasRef" class="stars" />
      <div class="nebula nebula--violet" data-parallax="0.08" />
      <div class="nebula nebula--cyan" data-parallax="0.05" />
      <div class="nebula nebula--rose" data-parallax="0.12" />
      <div class="drifter drifter--ice" data-parallax="0.22" />
      <div class="drifter drifter--mars" data-parallax="0.16" />
      <div class="drifter drifter--moon" data-parallax="0.3" />
    </div>

    <header class="nav">
      <a href="#top" class="nav__logo"><span class="nav__dot" />Justyr</a>
      <nav class="nav__links">
        <a href="#skills">技能</a>
        <a href="#deck">簡報</a>
        <a href="#journey">航程</a>
        <a href="#contact">聯絡</a>
      </nav>
    </header>

    <main id="top">
      <!-- ============ HERO ============ -->
      <section class="hero">
        <div class="hero__planet" aria-hidden="true">
          <div class="ring ring--back" />
          <div class="globe" />
          <div class="ring ring--front" />
        </div>

        <div class="hero__copy">
          <p class="eyebrow"><span class="eyebrow__line" />Full-Stack Engineer · Taichung</p>
          <h1 class="hero__name">
            <span class="hero__en">Justyr</span>
          </h1>
          <p class="hero__lead">8 年全端。<br />從 ERP 底層到 Web 全端，<em>一個人也能建起一整套系統。</em></p>
          <ul class="traits">
            <li v-for="(t, i) in traits" :key="t" :style="{ '--i': i }">{{ t }}</li>
          </ul>
        </div>

        <a href="#about" class="scroll-cue" aria-label="向下捲動">
          <span class="scroll-cue__mouse"><span /></span>
          <span class="scroll-cue__text">向下探索</span>
        </a>
      </section>

      <!-- ============ ABOUT ============ -->
      <section id="about" class="about">
        <div class="sun" aria-hidden="true" data-reveal="scale" />
        <div class="about__inner">
          <p class="section-tag" data-reveal="up">01 · About</p>
          <h2 class="about__quote" data-reveal="up" style="--d: 0.1s">
            我把自己定義為<br /><strong>「解決問題的人」</strong>，<br />而不只是寫程式的人。
          </h2>
          <p class="about__sub" data-reveal="up" style="--d: 0.2s">
            在意的始終是：這套系統能不能真正運作、被人使用、並創造價值。
            面對技術債，主動盤點與重構，而非等它累積成災。
          </p>
          <div class="stats" data-reveal="up" style="--d: 0.3s">
            <div class="stat"><span class="stat__n">8<i>+</i></span><span class="stat__l">年開發資歷</span></div>
            <div class="stat"><span class="stat__n">4</span><span class="stat__l">套系統同時維護</span></div>
            <div class="stat"><span class="stat__n">1</span><span class="stat__l">人從零全站建置</span></div>
          </div>
        </div>
      </section>

      <!-- ============ SKILLS ============ -->
      <section id="skills" class="skills">
        <div class="skills__head">
          <p class="section-tag" data-reveal="up">02 · Skills</p>
          <h2 class="section-title" data-reveal="up" style="--d: 0.1s">技術星系</h2>
          <p class="section-desc" data-reveal="up" style="--d: 0.2s">Core in Database，前後端在軌道上運行</p>
        </div>

        <div class="skills__body">
          <div class="system" data-reveal="scale">
            <div class="system__core">
              <span>Full<br />Stack</span>
            </div>
            <div
              v-for="(o, oi) in orbits"
              :key="oi"
              class="orbit"
              :style="{ '--r': o.r + 'px', '--dur': o.dur + 's' }"
            >
              <div
                v-for="p in o.planets"
                :key="p.label"
                class="orbit__slot"
                :style="{ '--a': p.a + 'deg' }"
              >
                <div class="orbit__unrotate">
                  <div class="orbit__planet" :style="{ '--dur': o.dur + 's' }">
                    <span class="mini-globe" :class="'hue-' + p.hue" />
                    <span class="orbit__label">{{ p.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul class="skill-list">
            <li
              v-for="(s, i) in skills"
              :key="s.name"
              class="skill"
              data-reveal="right"
              :style="{ '--d': i * 0.08 + 's', '--fill': (s.years / s.max) * 100 + '%' }"
            >
              <span class="mini-globe mini-globe--lg" :class="'hue-' + s.hue" />
              <div class="skill__body">
                <div class="skill__row">
                  <span class="skill__name">{{ s.name }}</span>
                  <span class="skill__years">{{ s.years }} yr</span>
                </div>
                <div class="skill__bar"><span /></div>
                <p class="skill__note">{{ s.note }}</p>
              </div>
            </li>
          </ul>
        </div>

        <ul class="chips" data-reveal="up">
          <li v-for="c in ['Git', 'Linux (Alma / Rocky / CentOS)', 'Serverless API', '金流串接', '第三方驗證', '快遞平台', 'Chat Bot', 'DB 效能調教', 'PLM', 'Android']" :key="c">
            {{ c }}
          </li>
        </ul>
      </section>

      <!-- ============ DECK ============ -->
      <section id="deck" class="deck">
        <div class="deck__head">
          <p class="section-tag" data-reveal="up">03 · Highlights</p>
          <h2 class="section-title" data-reveal="up" style="--d: 0.1s">成果簡報</h2>
          <p class="section-desc" data-reveal="up" style="--d: 0.2s">每個職務，我負責什麼、完成了什麼。</p>
        </div>

        <div class="deck__frame" data-reveal="up" style="--d: 0.3s" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div class="deck__stage" :class="slideDir > 0 ? 'dir-next' : 'dir-prev'">
            <article
              v-for="(s, i) in deck"
              :key="s.period"
              class="slide"
              :class="[{ 'is-active': i === slide }, 'hue-' + s.hue]"
              :aria-hidden="i !== slide"
            >
              <div class="slide__planet" aria-hidden="true" />
              <header class="slide__head">
                <span class="slide__index">{{ String(i + 1).padStart(2, '0') }} / {{ String(deck.length).padStart(2, '0') }}</span>
                <p class="slide__period">{{ s.period }}</p>
                <h3 class="slide__role">{{ s.role }}</h3>
                <p class="slide__summary">{{ s.summary }}</p>
                <ul class="slide__stack"><li v-for="t in s.stack" :key="t">{{ t }}</li></ul>
              </header>
              <div class="slide__cols">
                <div class="slide__col">
                  <h4 class="slide__label">負責事務</h4>
                  <ul class="slide__list">
                    <li v-for="(d, di) in s.duties" :key="d" :style="{ '--i': di }">{{ d }}</li>
                  </ul>
                </div>
                <div class="slide__col">
                  <h4 class="slide__label slide__label--win">完成事項</h4>
                  <ul class="slide__list slide__list--win">
                    <li v-for="(w, wi) in s.wins" :key="w.text" :class="{ 'is-star': w.star }" :style="{ '--i': wi }">
                      <span v-if="w.metric" class="slide__metric">{{ w.metric }}</span>
                      {{ w.text }}
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>

          <div class="deck__ctrl">
            <button class="deck__btn" type="button" aria-label="上一頁" @click="goSlide(slide - 1)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <div class="deck__dots">
              <button
                v-for="(s, i) in deck"
                :key="s.period"
                type="button"
                class="deck__dot"
                :class="{ 'is-active': i === slide }"
                :aria-label="`第 ${i + 1} 頁`"
                @click="goSlide(i)"
              />
            </div>
            <button class="deck__btn" type="button" aria-label="下一頁" @click="goSlide(slide + 1)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
          <p class="deck__hint">← → 方向鍵或左右滑動翻頁</p>
        </div>
      </section>

      <!-- ============ JOURNEY ============ -->
      <section id="journey" class="journey">
        <div class="journey__head">
          <p class="section-tag" data-reveal="up">04 · Journey</p>
          <h2 class="section-title" data-reveal="up" style="--d: 0.1s">航行日誌</h2>
          <p class="section-desc" data-reveal="up" style="--d: 0.2s">四顆星球，一條航線。</p>
        </div>

        <div ref="timelineRef" class="timeline" :style="{ '--tp': timelineProgress }">
          <div class="timeline__track"><span class="timeline__ship" /></div>
          <article
            v-for="(j, i) in journey"
            :key="j.period + j.role"
            class="stop"
            :class="[i % 2 ? 'stop--right' : 'stop--left']"
            :data-reveal="i % 2 ? 'right' : 'left'"
          >
            <span class="stop__node" :class="'hue-' + j.hue" />
            <div class="stop__card">
              <p class="stop__period">{{ j.period }}</p>
              <h3 class="stop__role">{{ j.role }}</h3>
              <p class="stop__text">{{ j.text }}</p>
              <ul class="stop__tags"><li v-for="t in j.tags" :key="t">{{ t }}</li></ul>
            </div>
          </article>
        </div>
      </section>

      <!-- ============ CONTACT ============ -->
      <section id="contact" class="contact">
        <div class="radar" aria-hidden="true" data-reveal="scale">
          <span /><span /><span />
        </div>
        <p class="section-tag" data-reveal="up">05 · Contact</p>
        <h2 class="section-title" data-reveal="up" style="--d: 0.1s">傳送訊號</h2>
        <p class="section-desc" data-reveal="up" style="--d: 0.2s">技術交流、合作機會，或單純聊聊開發的大小事。</p>
        <div class="contact__links" data-reveal="up" style="--d: 0.3s">
          <a class="btn btn--primary" href="mailto:h94u041@gmail.com">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13 2 4" /></svg>
            h94u041@gmail.com
          </a>
          <a class="btn" href="https://github.com/h94u041" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
            GitHub
          </a>
        </div>
      </section>
    </main>

    <footer class="footer">
      <span> - Justyr </span>
      <span class="footer__dim">Built with Vue 3 · VitePress</span>
    </footer>
  </div>
</template>

<style>
/* =====================================================
   layout shell
   ===================================================== */
.cosmos {
  position: relative;
  min-height: 100vh;
  font-family: var(--font-latin), var(--font-tc);
}
.progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 2px;
  background: linear-gradient(90deg, var(--violet), var(--cyan), var(--gold));
  transform-origin: 0 50%;
  z-index: 60;
}

/* ---------- sky ---------- */
.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(ellipse 120% 80% at 50% -20%, #151a3a 0%, transparent 60%),
    linear-gradient(180deg, #070919 0%, var(--space) 45%, #04050c 100%);
}
.stars {
  position: absolute;
  inset: 0;
}
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  will-change: transform;
}
.nebula--violet {
  width: 60vw;
  height: 60vw;
  left: -20vw;
  top: 10vh;
  background: radial-gradient(circle, rgba(139, 123, 255, 0.35), transparent 65%);
}
.nebula--cyan {
  width: 50vw;
  height: 50vw;
  right: -18vw;
  top: 60vh;
  background: radial-gradient(circle, rgba(94, 231, 255, 0.22), transparent 65%);
}
.nebula--rose {
  width: 45vw;
  height: 45vw;
  left: 30vw;
  top: 160vh;
  background: radial-gradient(circle, rgba(255, 122, 200, 0.2), transparent 65%);
}
.drifter {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}
.drifter--ice {
  width: 90px;
  height: 90px;
  left: 8vw;
  top: 120vh;
  background: radial-gradient(circle at 32% 30%, #dff6ff 0%, #6fb8e6 30%, #1f3f78 70%, #0a1330 100%);
  box-shadow: 0 0 40px rgba(111, 184, 230, 0.35);
}
.drifter--mars {
  width: 56px;
  height: 56px;
  right: 10vw;
  top: 230vh;
  background: radial-gradient(circle at 35% 35%, #ffb28a 0%, #d4552f 40%, #5a1c12 80%);
  box-shadow: 0 0 30px rgba(212, 85, 47, 0.35);
}
.drifter--moon {
  width: 30px;
  height: 30px;
  left: 70vw;
  top: 330vh;
  background: radial-gradient(circle at 35% 35%, #ffffff 0%, #b9bfd6 45%, #4c5270 85%);
}

/* ---------- nav ---------- */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px clamp(16px, 5vw, 48px);
  background: linear-gradient(180deg, rgba(5, 6, 15, 0.85), rgba(5, 6, 15, 0));
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.8s var(--ease-out) 0.9s, transform 0.8s var(--ease-out) 0.9s;
}
.loaded .nav {
  opacity: 1;
  transform: none;
}
.nav__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-size: 1.05rem;
}
.nav__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff, var(--violet) 60%, #2a1c6b);
  box-shadow: 0 0 14px var(--violet);
}
.nav__links {
  display: flex;
  gap: 26px;
  font-size: 0.9rem;
  color: var(--ink-2);
}
.nav__links a {
  position: relative;
  padding: 4px 0;
  transition: color 0.3s;
}
.nav__links a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--cyan);
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 0.4s var(--ease-out);
}
.nav__links a:hover {
  color: var(--ink);
}
.nav__links a:hover::after {
  transform: scaleX(1);
}

main {
  position: relative;
  z-index: 1;
}
section {
  position: relative;
  padding: clamp(96px, 14vh, 160px) clamp(16px, 6vw, 72px);
  max-width: 1180px;
  margin: 0 auto;
}

/* ---------- shared type ---------- */
.section-tag {
  font-size: 0.78rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 14px;
}
.section-title {
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.15;
}
.section-desc {
  margin-top: 12px;
  color: var(--ink-2);
  font-size: 1.05rem;
}

/* ---------- reveal ---------- */
[data-reveal] {
  --d: 0s;
  opacity: 0;
  transition: opacity 0.9s var(--ease-out) var(--d), transform 1s var(--ease-out) var(--d);
  will-change: opacity, transform;
}
[data-reveal='up'] {
  transform: translateY(36px);
}
[data-reveal='left'] {
  transform: translateX(-48px);
}
[data-reveal='right'] {
  transform: translateX(48px);
}
[data-reveal='scale'] {
  transform: scale(0.6);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* =====================================================
   hero
   ===================================================== */
.hero {
  min-height: 100vh;
  display: grid;
  align-items: center;
  padding-top: 120px;
  overflow: visible;
}
.hero__copy {
  position: relative;
  z-index: 2;
  max-width: 640px;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--cyan);
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.9s var(--ease-out) 0.2s, transform 0.9s var(--ease-out) 0.2s;
}
.eyebrow__line {
  width: 40px;
  height: 1px;
  background: var(--cyan);
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 1s var(--ease-out) 0.4s;
}
.hero__name {
  display: flex;
  flex-direction: column;
  margin: 26px 0 28px;
  line-height: 1;
}
.hero__zh,
.hero__en {
  display: block;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s var(--ease-out), transform 1.1s var(--ease-out);
}
.hero__zh {
  font-family: var(--font-tc);
  font-size: clamp(3.2rem, 11vw, 7.5rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  background: linear-gradient(120deg, #fff 0%, #dcd6ff 45%, var(--cyan) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition-delay: 0.35s;
}
.hero__en {
  margin-top: 10px;
  font-size: clamp(1.4rem, 3.4vw, 2.3rem);
  font-weight: 500;
  letter-spacing: 0.35em;
  color: var(--ink-2);
  transition-delay: 0.55s;
}
.hero__lead {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  line-height: 1.7;
  color: var(--ink-2);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 1s var(--ease-out) 0.75s, transform 1s var(--ease-out) 0.75s;
}
.hero__lead em {
  font-style: normal;
  color: var(--ink);
}
.traits {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 30px;
}
.traits li {
  padding: 7px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--glass);
  font-size: 0.85rem;
  color: var(--ink-2);
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.7s var(--ease-out) calc(1s + var(--i) * 0.1s), transform 0.7s var(--ease-out) calc(1s + var(--i) * 0.1s);
}
.loaded .eyebrow,
.loaded .hero__zh,
.loaded .hero__en,
.loaded .hero__lead,
.loaded .traits li {
  opacity: 1;
  transform: none;
}
.loaded .eyebrow__line {
  transform: scaleX(1);
}

/* the big ringed planet */
.hero__planet {
  position: absolute;
  right: clamp(-260px, -12vw, -40px);
  top: 50%;
  width: clamp(360px, 46vw, 640px);
  aspect-ratio: 1;
  transform: translateY(-50%) scale(0.7);
  opacity: 0;
  transition: opacity 1.6s var(--ease-out) 0.1s, transform 1.8s var(--ease-out) 0.1s;
  z-index: 1;
}
.loaded .hero__planet {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}
.globe {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.55), transparent 32%),
    repeating-linear-gradient(172deg, rgba(255, 255, 255, 0.05) 0 6px, transparent 6px 18px),
    radial-gradient(circle at 35% 30%, #ffb27a 0%, #e0685e 28%, #7a2b8f 62%, #1e0f3f 100%);
  box-shadow:
    inset -30px -30px 80px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(224, 104, 94, 0.35),
    0 0 160px rgba(122, 43, 143, 0.35);
  animation: breathe 9s ease-in-out infinite;
}
.ring {
  position: absolute;
  left: -6%;
  right: -6%;
  top: 50%;
  height: 34%;
  transform: translateY(-50%) rotate(-18deg);
  border-radius: 50%;
  border: 14px solid transparent;
  border-color: rgba(94, 231, 255, 0.35) rgba(139, 123, 255, 0.55);
  box-shadow: 0 0 30px rgba(94, 231, 255, 0.15);
  animation: ringTilt 14s ease-in-out infinite;
}
.ring--back {
  clip-path: inset(0 0 50% 0);
  z-index: 0;
}
.ring--front {
  clip-path: inset(50% 0 0 0);
  z-index: 2;
}
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.025);
  }
}
@keyframes ringTilt {
  0%,
  100% {
    transform: translateY(-50%) rotate(-18deg);
  }
  50% {
    transform: translateY(-50%) rotate(-14deg);
  }
}

.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 36px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--ink-3);
  font-size: 0.72rem;
  letter-spacing: 0.3em;
  opacity: 0;
  transition: opacity 1s var(--ease-out) 1.6s;
}
.loaded .scroll-cue {
  opacity: 1;
}
.scroll-cue__mouse {
  width: 22px;
  height: 36px;
  border: 1.5px solid var(--ink-3);
  border-radius: 12px;
  position: relative;
}
.scroll-cue__mouse span {
  position: absolute;
  left: 50%;
  top: 7px;
  width: 3px;
  height: 7px;
  margin-left: -1.5px;
  border-radius: 2px;
  background: var(--cyan);
  animation: wheel 1.8s ease-in-out infinite;
}
@keyframes wheel {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    transform: translateY(12px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

/* =====================================================
   about
   ===================================================== */
.about {
  text-align: center;
}
.sun {
  position: absolute;
  left: 50%;
  top: 46%;
  width: clamp(280px, 40vw, 560px);
  aspect-ratio: 1;
  margin-left: calc(clamp(280px, 40vw, 560px) / -2);
  margin-top: calc(clamp(280px, 40vw, 560px) / -2);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 210, 122, 0.22) 0%, rgba(255, 122, 200, 0.12) 35%, transparent 70%);
  filter: blur(6px);
  z-index: 0;
}
.sun::after {
  content: '';
  position: absolute;
  inset: 34%;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #fff3d6, #ffd27a 40%, #ff9a5c 75%, #ff7ac8);
  box-shadow: 0 0 60px rgba(255, 210, 122, 0.6), 0 0 140px rgba(255, 154, 92, 0.35);
  animation: breathe 6s ease-in-out infinite;
}
.about__inner {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
}
.about__quote {
  font-family: var(--font-tc);
  font-size: clamp(1.6rem, 4.2vw, 2.9rem);
  font-weight: 300;
  line-height: 1.5;
  letter-spacing: 0.04em;
}
.about__quote strong {
  font-weight: 700;
  background: linear-gradient(120deg, var(--gold), var(--rose));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.about__sub {
  margin: 28px auto 0;
  max-width: 560px;
  color: var(--ink-2);
  line-height: 1.9;
}
.stats {
  display: flex;
  justify-content: center;
  gap: clamp(24px, 6vw, 72px);
  margin-top: 56px;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat__n {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(180deg, #fff, var(--ink-2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat__n i {
  font-style: normal;
  font-size: 0.5em;
  color: var(--cyan);
  -webkit-text-fill-color: var(--cyan);
}
.stat__l {
  margin-top: 8px;
  font-size: 0.82rem;
  color: var(--ink-3);
  letter-spacing: 0.1em;
}

/* =====================================================
   skills
   ===================================================== */
.skills__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
  margin-top: 56px;
}
.system {
  --size: 520px;
  --k: 1;
  position: relative;
  width: min(100%, var(--size));
  aspect-ratio: 1;
  margin: 0 auto;
  display: grid;
  place-items: center;
}
.system__core {
  position: relative;
  z-index: 3;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 1.2;
  text-transform: uppercase;
  background: radial-gradient(circle at 35% 35%, #fff, var(--violet) 45%, #2a1c6b 100%);
  box-shadow: 0 0 40px rgba(139, 123, 255, 0.7), 0 0 120px rgba(139, 123, 255, 0.35);
  animation: breathe 5s ease-in-out infinite;
}
.orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(var(--r) * 2 * var(--k));
  height: calc(var(--r) * 2 * var(--k));
  margin: calc(var(--r) * -1 * var(--k)) 0 0 calc(var(--r) * -1 * var(--k));
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  animation: spin var(--dur) linear infinite;
  animation-play-state: paused;
  transform-origin: center;
}
.system.is-visible .orbit {
  animation-play-state: running;
}
.orbit__slot {
  position: absolute;
  inset: 0;
  transform: rotate(var(--a));
}
.orbit__unrotate {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%) rotate(calc(var(--a) * -1));
}
.orbit__planet {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: spin-rev var(--dur) linear infinite;
  animation-play-state: paused;
}
.system.is-visible .orbit__planet {
  animation-play-state: running;
}
.orbit__label {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--ink-2);
  white-space: nowrap;
  text-shadow: 0 0 10px var(--space);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes spin-rev {
  to {
    transform: rotate(-360deg);
  }
}
.mini-globe {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  box-shadow: inset -4px -4px 8px rgba(0, 0, 0, 0.55), 0 0 14px var(--glow);
  background: radial-gradient(circle at 35% 35%, #fff 0%, var(--c1) 30%, var(--c2) 100%);
  flex: none;
}
.mini-globe--lg {
  width: 34px;
  height: 34px;
}
.hue-teal { --c1: #5ef2c0; --c2: #0d5b4a; --glow: rgba(94, 242, 192, 0.5); }
.hue-cyan { --c1: #5ee7ff; --c2: #0f4e82; --glow: rgba(94, 231, 255, 0.5); }
.hue-rose { --c1: #ff7ac8; --c2: #6b1a4e; --glow: rgba(255, 122, 200, 0.5); }
.hue-gold { --c1: #ffd27a; --c2: #8a4a12; --glow: rgba(255, 210, 122, 0.5); }
.hue-violet { --c1: #a898ff; --c2: #2a1c6b; --glow: rgba(139, 123, 255, 0.55); }
.hue-ice { --c1: #cfeeff; --c2: #2a4f8a; --glow: rgba(207, 238, 255, 0.45); }

.skill-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.skill {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--glass);
  backdrop-filter: blur(10px);
  transition: border-color 0.4s, background 0.4s, opacity 0.9s var(--ease-out) var(--d), transform 1s var(--ease-out) var(--d);
}
.skill:hover {
  border-color: rgba(94, 231, 255, 0.35);
  background: rgba(255, 255, 255, 0.06);
}
.skill__body {
  flex: 1;
  min-width: 0;
}
.skill__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}
.skill__name {
  font-weight: 700;
  letter-spacing: 0.02em;
}
.skill__years {
  font-size: 0.78rem;
  color: var(--cyan);
  letter-spacing: 0.12em;
}
.skill__bar {
  margin-top: 8px;
  height: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.skill__bar span {
  display: block;
  height: 100%;
  width: var(--fill);
  border-radius: 4px;
  background: linear-gradient(90deg, var(--c1), var(--c2));
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 1.4s var(--ease-out) calc(var(--d) + 0.3s);
}
.skill.is-visible .skill__bar span {
  transform: scaleX(1);
}
.skill__note {
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--ink-3);
}
.chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 56px;
}
.chips li {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 0.8rem;
  color: var(--ink-2);
  letter-spacing: 0.04em;
}

/* =====================================================
   deck (成果簡報)
   ===================================================== */
.deck {
  max-width: none;
  padding-left: clamp(12px, 2vw, 32px);
  padding-right: clamp(12px, 2vw, 32px);
}
.deck__head {
  text-align: center;
}
.deck__frame {
  position: relative;
  margin-top: 56px;
  touch-action: pan-y;
}
.deck__stage {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 70vh;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), rgba(8, 10, 24, 0.7);
  backdrop-filter: blur(14px);
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}
.slide {
  grid-area: 1 / 1;
  position: relative;
  padding: clamp(32px, 5vw, 80px) clamp(28px, 6vw, 96px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  gap: clamp(32px, 5vw, 96px);
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transform: translateX(60px);
  transition: opacity 0.6s var(--ease-out), transform 0.7s var(--ease-out), visibility 0s linear 0.7s;
}
.dir-prev .slide {
  transform: translateX(-60px);
}
.slide.is-active {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition-delay: 0s, 0s, 0s;
}
.slide__planet {
  position: absolute;
  right: -90px;
  top: -90px;
  width: 34vh;
  height: 34vh;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff 0%, var(--c1) 25%, var(--c2) 100%);
  box-shadow: inset -40px -40px 90px rgba(0, 0, 0, 0.6), 0 0 90px var(--glow);
  opacity: 0.35;
  pointer-events: none;
}
.slide__head {
  position: relative;
}
.slide__index {
  font-size: 0.95rem;
  letter-spacing: 0.3em;
  color: var(--ink-3);
}
.slide__period {
  margin-top: 22px;
  font-size: 1.05rem;
  letter-spacing: 0.25em;
  color: var(--c1);
}
.slide__role {
  margin-top: 10px;
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  font-weight: 700;
  line-height: 1.2;
}
.slide__summary {
  margin-top: 18px;
  color: var(--ink-2);
  font-size: clamp(1.1rem, 1.5vw, 1.35rem);
  line-height: 1.8;
}
.slide__stack {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}
.slide__stack li {
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  color: var(--ink-2);
}
.slide__cols {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(20px, 3vw, 40px);
}
.slide__label {
  font-size: 1rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}
.slide__label--win {
  color: var(--c1);
}
.slide__list {
  list-style: none;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.slide__list li {
  position: relative;
  padding-left: 24px;
  font-size: clamp(1.05rem, 1.35vw, 1.3rem);
  line-height: 1.7;
  color: var(--ink-2);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s var(--ease-out) calc(0.25s + var(--i) * 0.08s), transform 0.6s var(--ease-out) calc(0.25s + var(--i) * 0.08s);
}
.slide.is-active .slide__list li {
  opacity: 1;
  transform: none;
}
.slide__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ink-3);
}
.slide__list--win li::before {
  background: var(--c1);
  box-shadow: 0 0 10px var(--glow);
}
.slide__list--win li.is-star {
  color: var(--ink);
  font-weight: 500;
}
.slide__list--win li.is-star::before {
  width: 11px;
  height: 11px;
  left: -1px;
  background: radial-gradient(circle at 35% 35%, #fff, var(--c1) 60%);
}
.slide__metric {
  display: block;
  margin: 2px 0 8px;
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  white-space: nowrap;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  background: linear-gradient(120deg, #fff, var(--c1));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.deck__ctrl {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 26px;
}
.deck__btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--glass);
  color: var(--ink-2);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: border-color 0.3s, color 0.3s, transform 0.3s var(--ease-out);
}
.deck__btn:hover {
  border-color: rgba(94, 231, 255, 0.5);
  color: var(--ink);
  transform: scale(1.08);
}
.deck__dots {
  display: flex;
  gap: 10px;
}
.deck__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.deck__dot.is-active {
  background: var(--cyan);
  transform: scale(1.4);
  box-shadow: 0 0 12px var(--cyan);
}
.deck__hint {
  margin-top: 14px;
  text-align: center;
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  color: var(--ink-3);
}

/* =====================================================
   journey
   ===================================================== */
.journey__head {
  text-align: center;
}
.timeline {
  position: relative;
  margin-top: 72px;
  padding: 24px 0;
}
.timeline__track {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: rgba(255, 255, 255, 0.07);
  overflow: visible;
}
.timeline__track::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--cyan), var(--violet), var(--rose));
  transform: scaleY(var(--tp));
  transform-origin: 50% 0;
  transition: transform 0.15s linear;
}
.timeline__ship {
  position: absolute;
  left: 50%;
  top: calc(var(--tp) * 100%);
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 16px var(--cyan), 0 0 40px var(--violet);
  transition: top 0.15s linear;
}
.stop {
  position: relative;
  width: 50%;
  padding: 0 0 56px;
}
.stop--left {
  padding-right: clamp(32px, 5vw, 64px);
}
.stop--right {
  margin-left: 50%;
  padding-left: clamp(32px, 5vw, 64px);
}
.stop__node {
  position: absolute;
  top: 26px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fff 0%, var(--c1) 30%, var(--c2) 100%);
  box-shadow: 0 0 0 6px var(--space), 0 0 24px var(--glow);
  z-index: 2;
}
.stop--left .stop__node {
  right: -11px;
}
.stop--right .stop__node {
  left: -11px;
}
.stop__card {
  padding: 24px 26px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--glass);
  backdrop-filter: blur(12px);
  transition: border-color 0.4s, transform 0.5s var(--ease-out);
}
.stop__card:hover {
  border-color: rgba(139, 123, 255, 0.4);
  transform: translateY(-4px);
}
.stop__period {
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: var(--cyan);
}
.stop__role {
  margin-top: 8px;
  font-size: 1.35rem;
  font-weight: 700;
}
.stop__text {
  margin-top: 12px;
  color: var(--ink-2);
  font-size: 0.92rem;
  line-height: 1.8;
}
.stop__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
.stop__tags li {
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  color: var(--ink-2);
}

/* =====================================================
   contact
   ===================================================== */
.contact {
  text-align: center;
  padding-bottom: 140px;
}
.radar {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  z-index: 0;
}
.radar span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  border-radius: 50%;
  border: 1px solid rgba(94, 231, 255, 0.5);
  animation: ping 4.5s ease-out infinite;
}
.radar span:nth-child(2) {
  animation-delay: 1.5s;
}
.radar span:nth-child(3) {
  animation-delay: 3s;
}
@keyframes ping {
  0% {
    transform: scale(0.4);
    opacity: 0.8;
  }
  100% {
    transform: scale(6);
    opacity: 0;
  }
}
.contact > * {
  position: relative;
  z-index: 1;
}
.contact__links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 40px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--glass);
  font-weight: 500;
  letter-spacing: 0.04em;
  backdrop-filter: blur(10px);
  transition: transform 0.4s var(--ease-out), border-color 0.4s, box-shadow 0.4s;
}
.btn:hover {
  transform: translateY(-3px);
  border-color: rgba(94, 231, 255, 0.5);
  box-shadow: 0 10px 40px rgba(94, 231, 255, 0.15);
}
.btn--primary {
  background: linear-gradient(120deg, var(--violet), #5b6cff);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 10px 40px rgba(139, 123, 255, 0.3);
}
.btn--primary:hover {
  box-shadow: 0 14px 50px rgba(139, 123, 255, 0.5);
}

.footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 28px clamp(16px, 6vw, 72px);
  border-top: 1px solid var(--line);
  font-size: 0.8rem;
  color: var(--ink-3);
  letter-spacing: 0.06em;
}

/* =====================================================
   responsive
   ===================================================== */
@media (max-width: 900px) {
  .slide {
    grid-template-columns: 1fr;
  }
  .slide__planet {
    width: 180px;
    height: 180px;
    right: -70px;
    top: -70px;
  }
  .skills__body {
    grid-template-columns: 1fr;
  }
  .system {
    --size: 420px;
    --k: 0.78;
  }
  .hero__planet {
    right: -30vw;
    top: 22%;
    width: 78vw;
    opacity: 0.55 !important;
  }
  .hero__copy {
    padding-top: 24px;
  }
}
@media (max-width: 640px) {
  .slide__cols {
    grid-template-columns: 1fr;
  }
  .deck__stage {
    border-radius: 20px;
  }
  .slide {
    padding: 28px 22px;
    align-items: start;
    align-content: start;
    gap: 28px;
  }
  .slide__role {
    font-size: 1.8rem;
  }
  .slide__list li {
    font-size: 1rem;
  }
  .slide__planet {
    width: 160px;
    height: 160px;
  }
  .nav__links {
    gap: 18px;
    font-size: 0.85rem;
  }
  .system {
    --size: 340px;
    --k: 0.62;
  }
  .system__core {
    width: 72px;
    height: 72px;
    font-size: 0.65rem;
  }
  .timeline__track {
    left: 14px;
  }
  .stop,
  .stop--right {
    width: 100%;
    margin-left: 0;
    padding-left: 44px;
    padding-right: 0;
  }
  .stop--left .stop__node,
  .stop--right .stop__node {
    left: 3px;
    right: auto;
  }
  .stats {
    gap: 28px;
  }
  .footer {
    justify-content: center;
    text-align: center;
  }
}
</style>
