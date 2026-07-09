import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    schedule_id, account, event, pair, magic,
    instant_buy, instant_sell_delay, pending_time, close_time,
    buy_stop_count, sell_stop_count,
    dist1, dist2, dist3, dist4, dist5,
    lot1, lot2, lot3, lot4, lot5,
    sl, tp, instantTrade, enableBuy, enableSell
  } = req.body

  if (!schedule_id || !pair) return res.status(400).json({ error: 'Missing data' })

  try {
    // Upsert — same schedule_id dobara bheja toh update ho
    const { error } = await supabase
      .from('schedules')
      .upsert([{
        schedule_id,
        master_account: account,
        event_name: event,
        pair,
        magic,
        instant_buy,
        instant_sell_delay,
        pending_time,
        close_time,
        buy_stop_count,
        sell_stop_count,
        dist1, dist2, dist3, dist4, dist5,
        lot1, lot2, lot3, lot4, lot5,
        sl, tp,
        instant_trade: instantTrade,
        enable_buy: enableBuy,
        enable_sell: enableSell,
        created_at: new Date()
      }], { onConflict: 'schedule_id' })

    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ success: true, schedule_id })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
