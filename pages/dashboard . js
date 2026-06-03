import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [clients, setClients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', account_number: '',
    account_type: 'both', expires_at: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    const res = await fetch('/api/clients')
    if (res.status === 401) return router.push('/')
    const data = await res.json()
    setClients(data)
  }

  const addClient = async () => {
    if (!form.name || !form.account_number) {
      alert('Name and Account Number required')
      return
    }
    setLoading(true)
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setClients([data, ...clients])
    setForm({ name: '', email: '', account_number: '', account_type: 'both', expires_at: '' })
    setShowForm(false)
    setLoading(false)
  }

  const toggleActive = async (client) => {
    const res = await fetch('/api/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: client.id, is_active: !client.is_active })
    })
    const updated = await res.json()
    setClients(clients.map(c => c.id === updated.id ? updated : c))
  }

  const deleteClient = async (id) => {
    if (!confirm('Delete this client?')) return
    await fetch('/api/clients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setClients(clients.filter(c => c.id !== id))
  }

  const logout = () => {
    document.cookie = 'admin_auth=; Max-Age=0; Path=/'
    router.push('/')
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>EA Control Panel</h1>
        <div style={s.headerRight}>
          <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
            + Add Client
          </button>
          <button onClick={logout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      {showForm && (
        <div style={s.form}>
          <h3 style={s.formTitle}>New Client</h3>
          <div style={s.formGrid}>
            <input placeholder="Full Name *" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} style={s.input} />
            <input placeholder="Email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} style={s.input} />
            <input placeholder="Account Number *" value={form.account_number}
              onChange={e => setForm({...form, account_number: e.target.value})} style={s.input} />
            <select value={form.account_type}
              onChange={e => setForm({...form, account_type: e.target.value})} style={s.input}>
              <option value="both">Live + Demo</option>
              <option value="live">Live Only</option>
              <option value="demo">Demo Only</option>
            </select>
            <input type="date" placeholder="Expiry Date" value={form.expires_at}
              onChange={e => setForm({...form, expires_at: e.target.value})} style={s.input} />
          </div>
          <button onClick={addClient} style={s.addBtn} disabled={loading}>
            {loading ? 'Adding...' : 'Add Client'}
          </button>
        </div>
      )}

      <div style={s.stats}>
        <div style={s.statBox}>
          <p style={s.statNum}>{clients.length}</p>
          <p style={s.statLabel}>Total Clients</p>
        </div>
        <div style={s.statBox}>
          <p style={s.statNum}>{clients.filter(c => c.is_active).length}</p>
          <p style={s.statLabel}>Active</p>
        </div>
        <div style={s.statBox}>
          <p style={s.statNum}>{clients.filter(c => !c.is_active).length}</p>
          <p style={s.statLabel}>Inactive</p>
        </div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Name</th>
              <th style={s.th}>Account</th>
              <th style={s.th}>Type</th>
              <th style={s.th}>License Key</th>
              <th style={s.th}>Expiry</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} style={s.tr}>
                <td style={s.td}>{client.name}</td>
                <td style={s.td}>{client.account_number}</td>
                <td style={s.td}>{client.account_type}</td>
                <td style={{...s.td, fontSize: '11px', color: '#888'}}>
                  {client.license_key?.substring(0, 18)}...
                </td>
                <td style={s.td}>
                  {client.expires_at ? new Date(client.expires_at).toLocaleDateString() : 'No Expiry'}
                </td>
                <td style={s.td}>
                  <span style={{
                    ...s.badge,
                    background: client.is_active ? '#00ff9620' : '#ff444420',
                    color: client.is_active ? '#00ff96' : '#ff4444'
                  }}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={s.td}>
                  <button onClick={() => toggleActive(client)}
                    style={{...s.actionBtn, background: client.is_active ? '#ff444420' : '#00ff9620',
                      color: client.is_active ? '#ff4444' : '#00ff96'}}>
                    {client.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => deleteClient(client.id)}
                    style={{...s.actionBtn, background: '#ff444420', color: '#ff4444', marginLeft: '6px'}}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan="7" style={{...s.td, textAlign: 'center', color: '#555'}}>
                No clients yet. Add your first client.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0f0f0f', padding: '24px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  headerRight: { display: 'flex', gap: '10px' },
  title: { color: '#00ff96', margin: 0, fontSize: '22px' },
  addBtn: { padding: '10px 20px', background: '#00ff96', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  logoutBtn: { padding: '10px 20px', background: '#1a1a1a', color: '#888', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer' },
  form: { background: '#1a1a1a', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #333' },
  formTitle: { color: '#fff', margin: '0 0 16px 0' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' },
  input: { padding: '10px', background: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statBox: { background: '#1a1a1a', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #222' },
  statNum: { color: '#00ff96', fontSize: '32px', margin: 0, fontWeight: 'bold' },
  statLabel: { color: '#888', margin: '4px 0 0 0', fontSize: '13px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a1a' },
  th: { padding: '12px 16px', color: '#888', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #222' },
  tr: { borderBottom: '1px solid #1a1a1a' },
  td: { padding: '14px 16px', color: '#ddd', fontSize: '14px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  actionBtn: { padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
}
