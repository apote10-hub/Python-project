import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/auth/login', { email, password })
            login({ username: res.data.username, role: res.data.role }, res.data.access_token)
            navigate('/')
        } catch {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#E3F2FD,#BBDEFB)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'white',borderRadius:'16px',padding:'40px',width:'380px',border:'0.5px solid #BBDEFB'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
                    <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'#1565C0',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px'}}>
                        <i className='ti ti-package'></i>
                    </div>
                    <div>
                        <div style={{fontSize:'20px',fontWeight:'500',color:'#1565C0'}}>StoqNepal</div>
                        <div style={{fontSize:'12px',color:'#64B5F6'}}>Inventory Management System</div>
                    </div>
                </div>
                <div style={{fontSize:'14px',color:'#666',marginBottom:'24px',marginTop:'16px'}}>Sign in to your account</div>
                {error && <div style={{background:'#FCEBEB',color:'#A32D2D',padding:'10px 14px',borderRadius:'8px',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
                <div style={{marginBottom:'14px'}}>
                    <label style={{fontSize:'12px',color:'#666',display:'block',marginBottom:'6px'}}>Email address</label>
                    <input type='email' placeholder='admin@smartinventory.com' value={email} onChange={e => setEmail(e.target.value)}
                        style={{width:'100%',border:'0.5px solid #BBDEFB',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',outline:'none',color:'#333'}} />
                </div>
                <div style={{marginBottom:'20px'}}>
                    <label style={{fontSize:'12px',color:'#666',display:'block',marginBottom:'6px'}}>Password</label>
                    <input type='password' placeholder='Enter your password' value={password} onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={{width:'100%',border:'0.5px solid #BBDEFB',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',outline:'none',color:'#333'}} />
                </div>
                <button onClick={handleLogin} disabled={loading}
                    style={{width:'100%',background:'#1565C0',color:'#fff',border:'none',borderRadius:'8px',padding:'12px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
                <div style={{textAlign:'center',marginTop:'16px',fontSize:'12px',color:'#999'}}>
                    Smart Inventory System for Nepali Businesses
                </div>
            </div>
        </div>
    )
}