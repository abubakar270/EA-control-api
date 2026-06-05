import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Wrong password. Try again.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>EA Control Panel</h1>
        <p style={styles.subtitle}>Admin Login</p>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#0f0f0f'
  },
  box: {
    background: '#1a1a1a', padding: '40px',
    borderRadius: '12px', width: '340px',
    boxShadow: '0 0 30px rgba(0,255,150,0.1)'
  },
  title: { color: '#00ff96', margin: 0, fontSize: '24px' },
  subtitle: { color: '#888', marginBottom: '24px' },
  input: {
    width: '100%', padding: '12px',
    background: '#2a2a2a', border: '1px solid #333',
    borderRadius: '8px', color: '#fff',
    fontSize: '16px', marginBottom: '12px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%', padding: '12px',
    background: '#00ff96', color: '#000',
    border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'
  },
  error: { color: '#ff4444', marginBottom: '8px' }
}
