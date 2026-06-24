import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    account, session_id, symbol,
    start_balance, end_balance, session_profit,
    total_trades, winning_trades, losing_trades,
    gross_profit, gross_loss, max_spread,
    start_time, end_time
  } = req.body

  if (!account) return res.status(400).json({ error: 'Missing account' })

  try {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('account_number', account)
      .single()

    if (!client) return res.status(401).json({ error: 'Client not found' })

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
          total_profit: Number(existing.total_profit) + Number(session_profit),
          total_trades: existing.total_trades + Number(total_trades),
          winning_trades: existing.winning_trades + Number(winning_trades),
          losing_trades: existing.losing_trades + Number(losing_trades),
          updated_at: new Date()
        })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('monthly_stats')
        .insert([{
          client_id: client.id,
          month,
          total_profit: Number(session_profit),
          total_trades: Number(total_trades),
          winning_trades: Number(winning_trades),
          losing_trades: Number(losing_trades)
        }])
    }

    await supabase
      .from('trade_logs')
      .insert([{
        client_id: client.id,
        account_number: account,
        symbol: symbol,
        trade_type: 'session',
        profit: Number(session_profit),
        lots: 0,
        closed_at: new Date()
      }])

    return res.status(200).json({ success: true })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
