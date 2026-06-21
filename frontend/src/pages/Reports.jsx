import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function Reports() {
    const [movement, setMovement] = useState(null)
    const [deadStock, setDeadStock] = useState(null)
    const [alerts, setAlerts] = useState(null)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/reports/movement').then(r => setMovement(r.data))
        api.get('/reports/dead-stock').then(r => setDeadStock(r.data))
        api.get('/alerts').then(r => setAlerts(r.data))
    }, [])

    const handleExport = () => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/export/csv`, '_blank')
    }

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div style={{display:'flex',minHeight:'100vh',background:'var(--color-background-tertiary)'}}>
            <Sidebar active='Reports' />
            <div style={{marginLeft:'220px',flex:1,paddingTop:'56px'}}>
                <Topbar user={user} onLogout={handleLogout} placeholder='Search...' />
                <div style={{padding:'20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                        <div>
                            <div style={{fontSize:'20px',fontWeight:'500',color:'var(--color-text-primary)'}}>Reports & Analytics</div>
                            <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginTop:'2px'}}>Inventory insights and analytics</div>
                        </div>
                        <button onClick={handleExport}
                            style={{background:'#1565C0',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'500',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
                            <i className='ti ti-download'></i> Export CSV
                        </button>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'20px'}}>
                        <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'12px',padding:'16px'}}>
                            <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                                <i className='ti ti-arrows-exchange' style={{color:'#1565C0'}}></i> Stock Movement
                            </div>
                            <div style={{display:'flex',gap:'12px',marginBottom:'8px'}}>
                                <div style={{flex:1,background:'#E3F2FD',borderRadius:'8px',padding:'12px',textAlign:'center'}}>
                                    <div style={{fontSize:'11px',color:'#1565C0',marginBottom:'4px'}}>Total In</div>
                                    <div style={{fontSize:'22px',fontWeight:'500',color:'#1565C0'}}>{movement?.total_stock_in ?? '...'}</div>
                                </div>
                                <div style={{flex:1,background:'#FCEBEB',borderRadius:'8px',padding:'12px',textAlign:'center'}}>
                                    <div style={{fontSize:'11px',color:'#A32D2D',marginBottom:'4px'}}>Total Out</div>
                                    <div style={{fontSize:'22px',fontWeight:'500',color:'#E24B4A'}}>{movement?.total_stock_out ?? '...'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'12px',padding:'16px'}}>
                            <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                                <i className='ti ti-clock-pause' style={{color:'#1565C0'}}></i> Dead Stock
                            </div>
                            <div style={{fontSize:'28px',fontWeight:'500',color: deadStock?.dead_stock_count > 0 ? '#E24B4A' : '#1565C0',marginBottom:'4px'}}>
                                {deadStock?.dead_stock_count ?? '...'}
                            </div>
                            <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'8px'}}>products not moved in 30 days</div>
                            {deadStock?.products?.slice(0,3).map(p => (
                                <div key={p.id} style={{fontSize:'12px',color:'var(--color-text-secondary)',padding:'3px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                                    {p.name} — {p.quantity} units
                                </div>
                            ))}
                        </div>

                        <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'12px',padding:'16px'}}>
                            <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                                <i className='ti ti-bell' style={{color:'#1565C0'}}></i> Low Stock Alerts
                            </div>
                            <div style={{fontSize:'28px',fontWeight:'500',color: alerts?.total_alerts > 0 ? '#E24B4A' : '#1565C0',marginBottom:'4px'}}>
                                {alerts?.total_alerts ?? '...'}
                            </div>
                            <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginBottom:'8px'}}>active alerts</div>
                            {alerts?.alerts?.slice(0,3).map((a,i) => (
                                <div key={i} style={{fontSize:'12px',color:'#A32D2D',padding:'3px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                                    {a.message}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'12px',padding:'16px'}}>
                        <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                            <i className='ti ti-flame' style={{color:'#E24B4A'}}></i> Top Selling Products
                        </div>
                        {movement?.top_selling_products?.length > 0 ? movement.top_selling_products.map((p,i) => (
                            <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                                <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'#E3F2FD',color:'#1565C0',fontSize:'12px',fontWeight:'500',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
                                <div style={{flex:1,fontSize:'13px',color:'var(--color-text-primary)'}}>{p.name}</div>
                                <div style={{fontSize:'13px',fontWeight:'500',color:'#1565C0'}}>{p.units_sold} units sold</div>
                                <div style={{width:'100px',height:'6px',background:'#E3F2FD',borderRadius:'3px',overflow:'hidden'}}>
                                    <div style={{height:'100%',background:'#1565C0',width:`${Math.min((p.units_sold / (movement.top_selling_products[0]?.units_sold || 1)) * 100, 100)}%`,borderRadius:'3px'}}></div>
                                </div>
                            </div>
                        )) : <div style={{padding:'20px',textAlign:'center',color:'var(--color-text-secondary)'}}>No sales data yet</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}