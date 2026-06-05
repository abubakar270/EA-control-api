import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { license_key, account_number, symbol, trade_type, profit, lots } = req.body

    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('license_key', license_key)
      .single()

    if (!client) return res.status(401).json({ error: 'Invalid license' })

    const { error } = await supabase
      .from('trade_logs')
      .insert([{
        client_id: client.id,
        account_number,
        symbol,
        trade_type,
        profit,
        lots
      }])

    if (error) return res.status(500).json({ error: error.message })

    // Monthly stats update
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
          total_profit: existing.total_profit + profit,
          total_trades: existing.total_trades + 1,
          winning_trades: profit > 0 ? existing.winning_trades + 1 : existing.winning_trades,
          losing_trades: profit < 0 ? existing.losing_trades + 1 : existing.losing_trades,
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
          total_trades: 1,
          winning_trades: profit > 0 ? 1 : 0,
          losing_trades: profit < 0 ? 1 : 0
        }])
    }

    return res.status(200).json({ success: true })
  }

  if (req.method === 'GET') {
    const auth = req.cookies?.admin_auth
    if (auth !== 'true') return res.status(401).json({ error: 'Unauthorized' })

    const { client_id } = req.query

    const { data: trades } = await supabase
      .from('trade_logs')
      .select('*')
      .eq('client_id', client_id)
      .order('closed_at', { ascending: false })
      .limit(50)

    const { data: stats } = await supabase
      .from('monthly_stats')
      .select('*')
      .eq('client_id', client_id)
      .order('month', { ascending: false })

    return res.status(200).json({ trades, stats })
  }

  return res.status(405).end()
}
