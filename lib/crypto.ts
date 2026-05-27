// AES-256-GCM encryption for technical access credentials
// Key is derived from ENCRYPTION_SECRET env var (server-side only, never exposed to client)

const ALG = 'AES-GCM'
const KEY_LEN = 256

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) throw new Error('ENCRYPTION_SECRET is not set')

  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey'])

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('gestorops-salt'), iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: ALG, length: KEY_LEN },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encrypt(plaintext: string): Promise<string> {
  if (!plaintext) return ''
  const key = await getKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: ALG, iv }, key, encoded)
  // Store as base64(iv):base64(ciphertext)
  const ivB64 = btoa(String.fromCharCode(...iv))
  const ctB64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
  return `${ivB64}:${ctB64}`
}

export async function decrypt(stored: string): Promise<string> {
  if (!stored) return ''
  const [ivB64, ctB64] = stored.split(':')
  if (!ivB64 || !ctB64) return ''

  const key = await getKey()
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0))
  const ciphertext = Uint8Array.from(atob(ctB64), c => c.charCodeAt(0))

  try {
    const decrypted = await crypto.subtle.decrypt({ name: ALG, iv }, key, ciphertext)
    return new TextDecoder().decode(decrypted)
  } catch {
    return '[error al descifrar]'
  }
}
