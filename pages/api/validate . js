import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  const { license_key, account_number, account_type } = req.query

  if (!license_key || !account_number) {
    return res.status(400).json({ valid: false, message: 'Missing parameters' })
  }

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('license_key', license_key)
    .single()

  if (error || !client) {
    return res.status(200).json({ valid: false, message: 'License not found' })
  }

  if (!client.is_active) {
    return res.status(200).json({ valid: false, message: 'License is disabled' })
  }

  if (client.expires_at && new Date(client.expires_at) < new Date()) {
    return res.status(200).json({ valid: false, message: 'License expired' })
  }

  if (client.account_number && client.account_number !== account_number) {
    return res.status(200).json({ valid: false, message: 'Account number mismatch' })
  }

  if (client.account_type !== 'both' && client.account_type !== account_type) {
    return res.status(200).json({ valid: false, message: 'Account type not allowed' })
  }

  return res.status(200).json({ valid: true, message: 'Authorized', client_name: client.name })
}
