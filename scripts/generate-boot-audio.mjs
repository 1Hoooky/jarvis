import { writeFile } from 'node:fs/promises'

const API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.JARVIS_VOICE_ID

if (!API_KEY || !VOICE_ID) {
  console.error('Faltam as variáveis ELEVENLABS_API_KEY e/ou JARVIS_VOICE_ID.')
  process.exit(1)
}

const text =
  'Permita-me me apresentar. Eu sou o Jarvis, uma inteligência artificial ' +
  'virtual programada para auxiliá-lo com suas necessidades tecnológicas. ' +
  'Importando todas as preferências do sistema residencial. Os sistemas ' +
  'estão totalmente operacionais.'

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
  {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ text, model_id: 'eleven_flash_v2_5' }),
  },
)

if (!res.ok) {
  console.error(`ElevenLabs respondeu ${res.status}: ${await res.text()}`)
  process.exit(1)
}

const buf = Buffer.from(await res.arrayBuffer())
await writeFile('public/audio/boot-music.mp3', buf)
console.log('Salvo em public/audio/boot-music.mp3 —', buf.length, 'bytes')