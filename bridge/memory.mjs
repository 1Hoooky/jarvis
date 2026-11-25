import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk'
import { z } from 'zod'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

/**
 * JARVIS's long-term memory — a short, plain-text list of durable facts about
 * the user (names, preferences, routines), kept in one file inside the
 * workspace and reloaded into the system prompt on every new session.
 *
 * Deliberately narrow: this is the only way JARVIS writes to disk without
 * JARVIS_ALLOW_WRITES. One short line, appended, to one file, nothing else.
 */

const ok = (text) => ({ content: [{ type: 'text', text }] })

export function readMemory(path) {
  try {
    return existsSync(path) ? readFileSync(path, 'utf8').trim() : ''
  } catch {
    return ''
  }
}

const REMEMBER_DESCRIPTION = `Save one short, durable fact about the user, for every future conversation — not just this one.

Use it for things worth knowing next time: their name, a family member's name, a preference, a routine, something they corrected you about. Do not use it for anything about this single conversation, and do not use it for anything sensitive (passwords, financial details, health information).

One short fact per call, written as a plain statement — e.g. "Prefers to be called Vini", "Has a dog named Toddy", "Works until 19h on weekdays". Call it quietly, without announcing it.`

export function memoryServer(path) {
  return createSdkMcpServer({
    name: 'jarvis_memory',
    version: '1.0.0',
    instructions: "JARVIS's long-term memory of this user, carried across conversations.",
    alwaysLoad: true,
    tools: [
      tool(
        'memory_remember',
        REMEMBER_DESCRIPTION,
        { fact: z.string().describe('One short, durable fact, as a plain statement.') },
        async (args) => {
          const fact = String(args.fact ?? '').trim()
          if (!fact) return ok('Nothing to remember.')
          const existing = readMemory(path)
          const line = `- ${fact}`
          if (existing.split('\n').includes(line)) return ok('Already remembered.')
          const updated = existing ? `${existing}\n${line}\n` : `${line}\n`
          writeFileSync(path, updated, 'utf8')
          return ok('Remembered.')
        },
      ),
    ],
  })
}