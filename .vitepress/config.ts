import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Jusrtyr',
  description: '全端工程師 · ERP TIPTOP · Vue3 · Laravel · 8 年經驗',
  lang: 'zh-TW',
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#7c5cfc' }],
  ],
  themeConfig: {
    nav: [
      { text: '首頁', link: '/' },
      { text: '技能', link: '#skills' },
      { text: '經歷', link: '#experience' },
      { text: '聯絡', link: '#contact' },
    ],
    footer: {
      message: '© 2024 Jusrtyr. All rights reserved.',
    },
  },
})