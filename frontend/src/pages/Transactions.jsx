import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState('')
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => { api.get('/transactions').then(r => setTransactions(r.data)) }, [])

    const filtered = transactions.filter(t =>
        t.type?.toLowerCase().includes(search.toLowerCase()) ||
        String(t.product_id).includes(search) ||
        t.note?.toLowerCase().includes(search.toLowerCase())
    )

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div style={{display:'flex',minHeight:'100vh',background:'var(--color-background-tertiary)'}}>
            <Sidebar active='Transactions' />
            <div style={{marginLeft:'220px',flex:1,paddingTop:'56px'}}>
                <Topbar user={user} onLogout={handleLogout} search={search} setSearch={setSearch} placeholder='Search transactions...' />
                <div style={{padding:'20px'}}>
                    <div style={{marginBottom:'20px'}}>
                        <div style={{fontSize:'20px',fontWeight:'500',color:'var(--color-text-primary)'}}>Transaction History</div>
                        <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginTop:'2px'}}>{transactions.length} total transactions</div>
                    </div>

                    <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'12px',overflow:'hidden'}}>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                            <thead>
                                <tr style={{background:'#E3F2FD'}}>
                                    {['ID','Product ID','Type','Quantity','Note','Date & Time'].map(h => (
                                        <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'12px',color:'#1565C0',fontWeight:'500'}}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(t => (
                                    <tr key={t.id} style={{borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                                        <td style={{padding:'10px 14px',color:'var(--color-text-secondary)'}}>{t.id}</td>
                                        <td style={{padding:'10px 14px',fontWeight:'500'}}>{t.product_id}</td>
                                        <td style={{padding:'10px 14px'}}>
                                            <span style={{
                                                background: t.type === 'stock_in' ? '#E3F2FD' : '#FCEBEB',
                                                color: t.type === 'stock_in' ? '#1565C0' : '#A32D2D',
                                                fontSize:'11px',padding:'3px 10px',borderRadius:'20px',fontWeight:'500'
                                            }}>
                                                {t.type === 'stock_in' ? '+ Stock In' : '- Stock Out'}
                                            </span>
                                        </td>
                                        <td style={{padding:'10px 14px',fontWeight:'500',color: t.type === 'stock_in' ? '#1565C0' : '#E24B4A'}}>
                                            {t.type === 'stock_in' ? '+' : '-'}{t.quantity}
                                        </td>
                                        <td style={{padding:'10px 14px',color:'var(--color-text-secondary)'}}>{t.note || '—'}</td>
                                        <td style={{padding:'10px 14px',color:'var(--color-text-secondary)',fontSize:'12px'}}>{new Date(t.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div style={{padding:'40px',textAlign:'center',color:'var(--color-text-secondary)'}}>
                                <i className='ti ti-file-text' style={{fontSize:'32px',display:'block',marginBottom:'8px'}}></i>
                                No transactions found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}