export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body

  if (password === process.env.ADMIN_PASSWORD) {
    res.setHeader('Set-Cookie', `admin_auth=true; Path=/; HttpOnly; Max-Age=86400`)
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ error: 'Invalid password' })
}
