import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { account } = req.body

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('account_number', account)
    .single()

  if (!client) return res.status(200).json({ allowed: false, message: 'Not found' })

  if (!client.is_active) return res.status(200).json({ allowed: false, ea_status: 'off', message: 'Disabled' })

  if (client.expires_at && new Date(client.expires_at) < new Date()) {
    return res.status(200).json({ allowed: false, ea_status: 'off', message: 'Expired' })
  }

  return res.status(200).json({
    allowed: true,
    ea_status: 'on',
    client_name: client.name
  })
}
