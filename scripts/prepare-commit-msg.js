#!/usr/bin/env node
/**
 * prepare-commit-msg: подставляет в сообщение коммита префикс задачи из имени ветки.
 *
 * Ветка kb-146-jest-vite-config + сообщение "фикс конфига"
 *   -> "kb-146: фикс конфига"
 *
 * Ничего не делает, если:
 *   - в имени ветки нет номера задачи (main, dev, detached HEAD при rebase);
 *   - префикс уже есть в сообщении;
 *   - это merge- или squash-коммит.
 *
 * Правила именования веток и коммитов — docs/contributing.md
 */

const { readFileSync, writeFileSync } = require('fs')
const { execFileSync } = require('child_process')

const TASK_RE = /^(kb)-(\d+)/i
const PREFIXED_RE = /^kb-\d+\s*:/i

const [msgFile, source] = process.argv.slice(2)

// merge и squash формирует git — не трогаем
if (!msgFile || source === 'merge' || source === 'squash') process.exit(0)

let branch
try {
  branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8',
  }).trim()
} catch {
  process.exit(0) // нет ветки (первый коммит, detached HEAD) — молча выходим
}

const match = branch.match(TASK_RE)
if (!match) process.exit(0)

const prefix = `${match[1].toLowerCase()}-${match[2]}`

const raw = readFileSync(msgFile, 'utf8')
const lines = raw.split('\n')

// первая содержательная строка: не комментарий и не пустая
const target = lines.findIndex(line => line.trim() && !line.startsWith('#'))

if (target === -1) {
  // сообщение пустое — коммит через редактор, готовим заголовок отдельной строкой
  writeFileSync(msgFile, `${prefix}: 
${raw}`)
  process.exit(0)
}

if (PREFIXED_RE.test(lines[target].trim())) process.exit(0)

lines[target] = `${prefix}: ${lines[target].trimStart()}`
writeFileSync(msgFile, lines.join('\n'))
