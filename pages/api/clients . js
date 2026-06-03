import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  const auth = req.cookies?.admin_auth
  if (auth !== 'true') return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { name, email, account_number, account_type, expires_at } = req.body
    const { data, error } = await supabase
      .from('clients')
      .insert([{ name, email, account_number, account_type, expires_at }])
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'PATCH') {
    const { id, ...updates } = req.body
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
