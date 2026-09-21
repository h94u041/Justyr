import { defineConfig } from 'vitepress'

const favicon =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><radialGradient id="g" cx="35%" cy="30%"><stop offset="0" stop-color="#ffb37a"/><stop offset="1" stop-color="#5a1f8a"/></radialGradient></defs><ellipse cx="32" cy="34" rx="30" ry="9" fill="none" stroke="#8ee8ff" stroke-width="3" transform="rotate(-20 32 34)"/><circle cx="32" cy="32" r="18" fill="url(#g)"/></svg>`
  )

export default defineConfig({
  title: 'Justyr',
  titleTemplate: false,
  description: '蔡勝諺 Justyr · 全端工程師 · Vue 3 / React · Laravel · T-SQL',
  lang: 'zh-TW',
  base: '/Justyr/',
  cleanUrls: true,
  appearance: false,
  head: [
    ['link', { rel: 'icon', href: favicon }],
    ['meta', { name: 'theme-color', content: '#05060f' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap',
      },
    ],
  ],
})
