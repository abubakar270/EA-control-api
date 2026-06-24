import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const auth = req.cookies?.admin_auth
    if (auth !== 'true') return res.status(401).json({ error: 'Unauthorized' })

    const { client_id } = req.query
    if (!client_id) return res.status(200).json({ trades: [], stats: [] })

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

    return res.status(200).json({
      trades: trades || [],
      stats: stats || []
    })
  }

  return res.status(405).end()
}
