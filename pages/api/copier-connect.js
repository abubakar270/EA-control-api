import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { account } = req.body
  if (!account) return res.status(400).json({ error: 'Missing account' })

  try {
    // License check
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('account_number', account)
      .single()

    if (!client) return res.status(200).json({ allowed: false, message: 'Not found' })
    if (!client.is_active) return res.status(200).json({ allowed: false, message: 'Disabled' })
    if (client.expires_at && new Date(client.expires_at) < new Date()) {
      return res.status(200).json({ allowed: false, message: 'Expired' })
    }

    // Latest schedule fetch karo
    const { data: schedule } = await supabase
      .from('schedules')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!schedule) {
      return res.status(200).json({ allowed: true, schedule: null, message: 'No schedule yet' })
    }

    // Parse times
    const instantBuyDate = new Date(schedule.instant_buy)
    const pendingDate    = new Date(schedule.pending_time)
    const closeDate      = new Date(schedule.close_time)

    return res.status(200).json({
      allowed: true,
      ea_status: 'on',
      schedule: {
        schedule_id:        schedule.schedule_id,
        symbol:             schedule.pair,
        year:               pendingDate.getFullYear(),
        month:              pendingDate.getMonth() + 1,
        day:                pendingDate.getDate(),
        instantHour:        instantBuyDate.getUTCHours(),
        instantMinute:      instantBuyDate.getUTCMinutes(),
        instantSecond:      instantBuyDate.getUTCSeconds(),
        instantSellDelay:   schedule.instant_sell_delay,
        gridHour:           pendingDate.getUTCHours(),
        gridMinute:         pendingDate.getUTCMinutes(),
        gridSecond:         pendingDate.getUTCSeconds(),
        closeHour:          closeDate.getUTCHours(),
        closeMinute:        closeDate.getUTCMinutes(),
        closeSecond:        closeDate.getUTCSeconds(),
        buyStopCount:       schedule.buy_stop_count,
        sellStopCount:      schedule.sell_stop_count,
        dist1: schedule.dist1, dist2: schedule.dist2,
        dist3: schedule.dist3, dist4: schedule.dist4, dist5: schedule.dist5,
        sl: schedule.sl, tp: schedule.tp,
        instantTrade:  schedule.instant_trade,
        enableBuy:     schedule.enable_buy,
        enableSell:    schedule.enable_sell
      }
    })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
