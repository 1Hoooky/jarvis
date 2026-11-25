import { useState, type KeyboardEvent } from 'react'

/**
 * A typed line in, for when there is no microphone to talk into — chiefly a
 * remote-desktop session, where the browser has no audio input at all. It
 * bypasses the wake word entirely: whatever is typed here is sent straight to
 * `respond()`, exactly as if the wake word had just fired and this were the
 * command that followed it.
 *
 * Deliberately plain. This is a fallback control, not a second interface —
 * it should not compete with the voice loop for attention when a microphone
 * is available.
 */
export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void
  disabled?: boolean
}) {
  const [value, setValue] = useState('')

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '28px',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        width: 'min(560px, 86vw)',
        zIndex: 40,
        pointerEvents: 'auto',
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="Mensagem para o Jarvis…"
        style={{
          flex: 1,
          background: 'rgba(8, 14, 20, 0.82)',
          border: '1px solid rgba(120, 200, 255, 0.35)',
          borderRadius: '10px',
          padding: '10px 14px',
          color: '#f2f8ff',
          fontSize: '15px',
          fontFamily: 'inherit',
          outline: 'none',
          backdropFilter: 'blur(6px)',
        }}
      />
      <button
        onClick={submit}
        disabled={disabled}
        style={{
          background: 'rgba(120, 200, 255, 0.14)',
          border: '1px solid rgba(120, 200, 255, 0.35)',
          borderRadius: '10px',
          padding: '0 18px',
          color: '#f2f8ff',
          fontSize: '14px',
          fontFamily: 'inherit',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        Enviar
      </button>
    </div>
  )
}
