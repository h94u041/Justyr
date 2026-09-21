// 一鍵部署：build → git add → commit → push（push 後 GitHub Actions 會自動發佈到 Pages）
// 用法：npm run deploy            → 以時間當 commit 訊息
//       npm run deploy -- "訊息"   → 自訂 commit 訊息
import { execSync } from 'node:child_process'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })
const out = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim()

const msg = process.argv.slice(2).join(' ').trim() || `deploy: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`
const branch = out('git rev-parse --abbrev-ref HEAD')

console.log('\n▶ build')
run('npm run build')

if (!out('git status --porcelain')) {
  console.log('\n沒有變更，改用空 commit 觸發重新部署')
  run(`git commit --allow-empty -m "${msg}"`)
} else {
  console.log('\n▶ commit')
  run('git add -A')
  run(`git commit -m "${msg}"`)
}

console.log(`\n▶ push origin ${branch}`)
run(`git push origin ${branch}`)

console.log(`
✔ 已推送。Actions 進度：https://github.com/h94u041/Justyr/actions
  站台（約 1 分鐘後更新，看不到就 Ctrl+Shift+R）：https://h94u041.github.io/Justyr/
`)
