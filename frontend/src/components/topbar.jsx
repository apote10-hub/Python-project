export default function Topbar({ user, onLogout, search, setSearch, placeholder }) {
    return (
        <div style={{ position: 'fixed', top: 0, left: '220px', right: 0, height: '56px', background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', zIndex: 9 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '8px', padding: '6px 12px' }}>
                <i className='ti ti-search' style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}></i>
                <input placeholder={placeholder || 'Search...'} value={search || ''} onChange={e => setSearch && setSearch(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '13px', color: 'var(--color-text-primary)', outline: 'none', width: '100%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', position: 'relative' }}>
                    <i className='ti ti-bell'></i>
                    <div style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#E24B4A' }}></div>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '500' }}>
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{user?.username}</span>
                <button onClick={onLogout} style={{ background: '#FCEBEB', color: '#A32D2D', border: '0.5px solid #F7C1C1', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>
        </div>
    )
}