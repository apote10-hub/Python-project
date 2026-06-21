import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Sidebar = ({ active }) => (
    <div style={{width:'220px',background:'var(--color-background-primary)',borderRight:'0.5px solid var(--color-border-tertiary)',display:'flex',flexDirection:'column',height:'100vh',position:'fixed',top:0,left:0,zIndex:10}}>
        <div style={{padding:'16px',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'#1565C0',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'16px'}}>
                <i className='ti ti-package'></i>
            </div>
            <div>
                <div style={{fontSize:'15px',fontWeight:'500',color:'var(--color-text-primary)'}}>StoqNepal</div>
                <div style={{fontSize:'10px',color:'var(--color-text-secondary)'}}>Inventory System</div>
            </div>
        </div>
        <div style={{padding:'12px 8px',flex:1,overflowY:'auto'}}>
            <div style={{fontSize:'10px',color:'var(--color-text-tertiary)',padding:'8px 8px 4px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Main</div>
            {[
                {to:'/',icon:'ti-layout-dashboard',label:'Dashboard'},
                {to:'/products',icon:'ti-box',label:'Products'},
                {to:'/stock',icon:'ti-arrows-exchange',label:'Stock'},
                {to:'/transactions',icon:'ti-file-text',label:'Transactions'},
            ].map(item => (
                <Link key={item.to} to={item.to} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'var(--border-radius-md)',fontSize:'13px',color: active===item.label ? '#1565C0' : 'var(--color-text-secondary)',background: active===item.label ? '#E3F2FD' : 'transparent',fontWeight: active===item.label ? '500' : '400',marginBottom:'2px',textDecoration:'none'}}>
                    <i className={`ti ${item.icon}`}></i>{item.label}
                </Link>
            ))}
            <div style={{fontSize:'10px',color:'var(--color-text-tertiary)',padding:'8px 8px 4px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Analytics</div>
            {[
                {to:'/reports',icon:'ti-chart-bar',label:'Reports'},
            ].map(item => (
                <Link key={item.to} to={item.to} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'var(--border-radius-md)',fontSize:'13px',color: active===item.label ? '#1565C0' : 'var(--color-text-secondary)',background: active===item.label ? '#E3F2FD' : 'transparent',fontWeight: active===item.label ? '500' : '400',marginBottom:'2px',textDecoration:'none'}}>
                    <i className={`ti ${item.icon}`}></i>{item.label}
                </Link>
            ))}
        </div>
        <div style={{margin:'0 8px 12px',background:'linear-gradient(135deg,#1565C0,#0D47A1)',borderRadius:'var(--border-radius-md)',padding:'12px',color:'#fff'}}>
            <div style={{fontSize:'11px',opacity:'0.8',marginBottom:'4px'}}>Next festival</div>
            <div style={{fontSize:'13px',fontWeight:'500',marginBottom:'8px'}}>Dashain 2026</div>
            <div style={{display:'flex',gap:'6px'}}>
                <div style={{background:'rgba(255,255,255,0.2)',borderRadius:'6px',padding:'4px 8px',textAlign:'center'}}>
                    <div style={{fontSize:'16px',fontWeight:'500'}}>3</div>
                    <div style={{fontSize:'9px',opacity:'0.8'}}>months</div>
                </div>
                <div style={{background:'rgba(255,255,255,0.2)',borderRadius:'6px',padding:'4px 8px',textAlign:'center'}}>
                    <div style={{fontSize:'16px',fontWeight:'500'}}>28</div>
                    <div style={{fontSize:'9px',opacity:'0.8'}}>days</div>
                </div>
            </div>
        </div>
    </div>
)

const Topbar = ({ user, onLogout }) => (
    <div style={{position:'fixed',top:0,left:'220px',right:0,height:'56px',background:'var(--color-background-primary)',borderBottom:'0.5px solid var(--color-border-tertiary)',display:'flex',alignItems:'center',gap:'12px',padding:'0 16px',zIndex:9}}>
        <div style={{flex:1,display:'flex',alignItems:'center',gap:'8px',background:'var(--color-background-secondary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--border-radius-md)',padding:'6px 12px'}}>
            <i className='ti ti-search' style={{color:'var(--color-text-secondary)',fontSize:'15px'}}></i>
            <input placeholder='Search products, transactions...' style={{border:'none',background:'transparent',fontSize:'13px',color:'var(--color-text-primary)',outline:'none',width:'100%'}} />
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'var(--border-radius-md)',border:'0.5px solid var(--color-border-tertiary)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--color-text-secondary)',position:'relative'}}>
                <i className='ti ti-bell'></i>
                <div style={{position:'absolute',top:'6px',right:'6px',width:'6px',height:'6px',borderRadius:'50%',background:'#E24B4A'}}></div>
            </div>
            <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#1565C0',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px',fontWeight:'500'}}>
                {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span style={{fontSize:'13px',color:'var(--color-text-secondary)'}}>{user?.username}</span>
            <button onClick={onLogout} style={{background:'#FCEBEB',color:'#A32D2D',border:'0.5px solid #F7C1C1',borderRadius:'var(--border-radius-md)',padding:'5px 10px',fontSize:'12px',cursor:'pointer'}}>Logout</button>
        </div>
    </div>
)

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [festival, setFestival] = useState(null)
    const [weather, setWeather] = useState(null)
    const [topProducts, setTopProducts] = useState([])
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/dashboard/stats').then(r => setStats(r.data))
        api.get('/festivals/suggestions').then(r => setFestival(r.data))
        api.get('/weather/suggestions').then(r => setWeather(r.data)).catch(() => {})
        api.get('/reports/movement').then(r => setTopProducts(r.data.top_selling_products || []))
    }, [])

    const handleLogout = () => { logout(); navigate('/login') }

    const sendLowStockAlert = async () => {
        const email = prompt('Enter email to send low stock alert:')
        if (email) {
            try {
                await api.post('/notifications/send-low-stock-alert', { email })
                alert('Low stock alert sent successfully!')
            } catch { alert('Failed to send alert.') }
        }
    }

    const sendExpiryAlert = async () => {
        const email = prompt('Enter email to send expiry alert:')
        if (email) {
            try {
                await api.post('/notifications/send-expiry-alert', { email })
                alert('Expiry alert sent successfully!')
            } catch { alert('Failed to send alert.') }
        }
    }

    return (
        <div style={{display:'flex',minHeight:'100vh',background:'var(--color-background-tertiary)'}}>
            <Sidebar active='Dashboard' />
            <div style={{marginLeft:'220px',flex:1,paddingTop:'56px'}}>
                <Topbar user={user} onLogout={handleLogout} />
                <div style={{padding:'20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                        <div>
                            <div style={{fontSize:'20px',fontWeight:'500',color:'var(--color-text-primary)'}}>Dashboard</div>
                            <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginTop:'2px'}}>Welcome back, {user?.username}</div>
                        </div>
                        <div style={{display:'flex',gap:'8px'}}>
                            <button onClick={sendLowStockAlert} style={{background:'#FCEBEB',color:'#A32D2D',border:'0.5px solid #F7C1C1',borderRadius:'var(--border-radius-md)',padding:'7px 14px',fontSize:'12px',cursor:'pointer',fontWeight:'500',display:'flex',alignItems:'center',gap:'6px'}}>
                                <i className='ti ti-mail'></i> Low Stock Alert
                            </button>
                            <button onClick={sendExpiryAlert} style={{background:'#FFF8E1',color:'#F57F17',border:'0.5px solid #FFE082',borderRadius:'var(--border-radius-md)',padding:'7px 14px',fontSize:'12px',cursor:'pointer',fontWeight:'500',display:'flex',alignItems:'center',gap:'6px'}}>
                                <i className='ti ti-mail'></i> Expiry Alert
                            </button>
                        </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'20px'}}>
                        {[
                            {label:'Total Products',value:stats?.total_products,trend:'+3 this week',up:true,icon:'ti-box'},
                            {label:'Low Stock Items',value:stats?.low_stock_count,trend:'Needs attention',up:false,icon:'ti-alert-triangle'},
                            {label:'Transactions',value:stats?.total_transactions,trend:'+12 today',up:true,icon:'ti-arrows-exchange'},
                            {label:'Stock Value (NPR)',value:`Rs. ${stats?.total_stock_value_npr?.toLocaleString() ?? '...'}`,trend:'+5% this month',up:true,icon:'ti-coin'},
                        ].map((card,i) => (
                            <div key={i} style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--border-radius-lg)',padding:'14px 16px'}}>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                                    <div style={{fontSize:'12px',color:'var(--color-text-secondary)'}}>{card.label}</div>
                                    <div style={{width:'28px',height:'28px',borderRadius:'var(--border-radius-md)',background:'#E3F2FD',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                        <i className={`ti ${card.icon}`} style={{fontSize:'14px',color:'#1565C0'}}></i>
                                    </div>
                                </div>
                                <div style={{fontSize:'22px',fontWeight:'500',color: i===1 ? '#E24B4A' : 'var(--color-text-primary)',marginBottom:'4px'}}>{card.value ?? '...'}</div>
                                <div style={{fontSize:'11px',color: card.up ? '#1565C0' : '#A32D2D',display:'flex',alignItems:'center',gap:'3px'}}>
                                    <i className={`ti ${card.up ? 'ti-trending-up' : 'ti-trending-down'}`} style={{fontSize:'12px'}}></i>
                                    {card.trend}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'20px'}}>
                        {weather && !weather.error && (
                            <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--border-radius-lg)',padding:'16px'}}>
                                <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                                    <i className='ti ti-cloud' style={{fontSize:'16px',color:'#1565C0'}}></i> Kathmandu Weather
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'10px'}}>
                                    <div>
                                        <div style={{fontSize:'32px',fontWeight:'500',color:'var(--color-text-primary)'}}>{weather.temperature_celsius}°C</div>
                                        <div style={{fontSize:'13px',color:'var(--color-text-secondary)'}}>{weather.weather}</div>
                                        <div style={{fontSize:'11px',color:'var(--color-text-tertiary)'}}>{weather.city}, Nepal</div>
                                    </div>
                                </div>
                                <div style={{fontSize:'11px',color:'var(--color-text-secondary)',marginBottom:'6px'}}>Stock suggestions:</div>
                                <div>{weather.stock_suggestions?.map((s,i) => (
                                    <span key={i} style={{display:'inline-block',background:'#E3F2FD',color:'#1565C0',fontSize:'11px',padding:'3px 8px',borderRadius:'20px',margin:'2px'}}>{s}</span>
                                ))}</div>
                            </div>
                        )}

                        {festival && festival.festival && (
                            <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--border-radius-lg)',padding:'16px'}}>
                                <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                                    <i className='ti ti-confetti' style={{fontSize:'16px',color:'#1565C0'}}></i> Festival Stock Alert
                                </div>
                                <div style={{background:'#E3F2FD',borderRadius:'var(--border-radius-md)',padding:'12px',marginBottom:'10px'}}>
                                    <div style={{fontSize:'12px',color:'#1565C0',fontWeight:'500',marginBottom:'4px'}}>{festival.festival} is coming!</div>
                                    <div style={{fontSize:'11px',color:'#1565C0',opacity:'0.8'}}>{festival.advice}</div>
                                </div>
                                <div style={{fontSize:'11px',color:'var(--color-text-secondary)',marginBottom:'6px'}}>Stock up {festival.surge_multiplier}x on:</div>
                                <div>{festival.stock_up_categories?.map((c,i) => (
                                    <span key={i} style={{display:'inline-block',background:'#E3F2FD',color:'#1565C0',fontSize:'11px',padding:'3px 8px',borderRadius:'20px',margin:'2px'}}>{c}</span>
                                ))}</div>
                            </div>
                        )}
                    </div>

                    {topProducts.length > 0 && (
                        <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--border-radius-lg)',padding:'16px'}}>
                            <div style={{fontSize:'13px',fontWeight:'500',color:'var(--color-text-primary)',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                                <i className='ti ti-flame' style={{fontSize:'16px',color:'#E24B4A'}}></i> Top Selling Products
                            </div>
                            {topProducts.map((p,i) => (
                                <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 0',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                                    <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'#E3F2FD',color:'#1565C0',fontSize:'12px',fontWeight:'500',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
                                    <div style={{flex:1,fontSize:'13px',color:'var(--color-text-primary)'}}>{p.name}</div>
                                    <div style={{fontSize:'13px',fontWeight:'500',color:'#1565C0'}}>{p.units_sold} units sold</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}