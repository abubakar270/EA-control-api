import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { account, balance, equity, profit } = req.body

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('account_number', account)
    .single()

  if (!client) return res.status(401).json({ error: 'Not found' })

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  const { data: existing } = await supabase
    .from('monthly_stats')
    .select('*')
    .eq('client_id', client.id)
    .eq('month', month)
    .single()

  if (existing) {
    await supabase
      .from('monthly_stats')
      .update({
        total_profit: profit,
        updated_at: new Date()
      })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('monthly_stats')
      .insert([{
        client_id: client.id,
        month,
        total_profit: profit,
        total_trades: 0,
        winning_trades: 0,
        losing_trades: 0
      }])
  }

  return res.status(200).json({ success: true })
}
