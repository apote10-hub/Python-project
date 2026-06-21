import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Sidebar({ active }) {
    const [festival, setFestival] = useState(null)

    useEffect(() => {
        api.get('/festivals/suggestions').then(r => setFestival(r.data)).catch(() => {})
    }, [])

    const navItems = [
        { to: '/', icon: 'ti-layout-dashboard', label: 'Dashboard' },
        { to: '/products', icon: 'ti-box', label: 'Products' },
        { to: '/stock', icon: 'ti-arrows-exchange', label: 'Stock' },
        { to: '/transactions', icon: 'ti-file-text', label: 'Transactions' },
        { to: '/reports', icon: 'ti-chart-bar', label: 'Reports' },
    ]

    const months = festival ? Math.floor(festival.days_until / 30) : 0
    const days = festival ? festival.days_until % 30 : 0

    return (
        <div style={{ width: '220px', background: 'var(--color-background-primary)', borderRight: '0.5px solid var(--color-border-tertiary)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
            <div style={{ padding: '16px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>
                    <i className='ti ti-package'></i>
                </div>
                <div>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)' }}>StoqNepal</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Inventory System</div>
                </div>
            </div>
            <div style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', padding: '8px 8px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Main Menu</div>
                {navItems.map(item => (
                    <Link key={item.to} to={item.to} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
                        borderRadius: '8px', fontSize: '13px',
                        color: active === item.label ? '#1565C0' : 'var(--color-text-secondary)',
                        background: active === item.label ? '#E3F2FD' : 'transparent',
                        fontWeight: active === item.label ? '500' : '400',
                        marginBottom: '2px', textDecoration: 'none'
                    }}>
                        <i className={`ti ${item.icon}`}></i>{item.label}
                    </Link>
                ))}
            </div>
            {festival && festival.festival && (
                <div style={{ margin: '0 8px 12px', background: '#1565C0', borderRadius: '8px', padding: '12px', color: '#fff' }}>
                    <div style={{ fontSize: '10px', opacity: '0.8', marginBottom: '4px' }}>Next festival</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>{festival.festival}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '4px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: '500' }}>{months}</div>
                            <div style={{ fontSize: '9px', opacity: '0.8' }}>months</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '4px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: '500' }}>{days}</div>
                            <div style={{ fontSize: '9px', opacity: '0.8' }}>days</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '10px', opacity: '0.8', marginTop: '6px' }}>
                        Stock up {festival.surge_multiplier}x
                    </div>
                </div>
            )}
        </div>
    )
}