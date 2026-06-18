import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Reports() {
    const [movement, setMovement] = useState(null)
    const [deadStock, setDeadStock] = useState(null)
    const [alerts, setAlerts] = useState(null)
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/reports/movement').then(r => setMovement(r.data))
        api.get('/reports/dead-stock').then(r => setDeadStock(r.data))
        api.get('/alerts').then(r => setAlerts(r.data))
    }, [])

    const handleExport = () => {
        window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/export/csv`, '_blank')
    }

    return (
        <div className='min-h-screen bg-gray-100'>
            <nav className='bg-blue-900 text-white px-6 py-4 flex justify-between items-center'>
                <h1 className='text-xl font-bold'>Smart Inventory</h1>
                <div className='flex gap-4'>
                    <Link to='/' className='hover:underline'>Dashboard</Link>
                    <Link to='/products' className='hover:underline'>Products</Link>
                    <Link to='/stock' className='hover:underline'>Stock</Link>
                    <Link to='/transactions' className='hover:underline'>Transactions</Link>
                    <button onClick={() => { logout(); navigate('/login') }} className='bg-red-500 px-3 py-1 rounded'>Logout</button>
                </div>
            </nav>
            <div className='p-6'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-blue-900'>Reports</h2>
                    <button onClick={handleExport} className='bg-green-700 text-white px-4 py-2 rounded-lg'>Download CSV</button>
                </div>
                <div className='grid grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white p-6 rounded-xl shadow'>
                        <h3 className='font-bold text-blue-900 mb-3'>Stock Movement</h3>
                        <p className='text-green-600 font-semibold'>Total In: {movement?.total_stock_in ?? '...'}</p>
                        <p className='text-red-600 font-semibold mt-1'>Total Out: {movement?.total_stock_out ?? '...'}</p>
                    </div>
                    <div className='bg-white p-6 rounded-xl shadow'>
                        <h3 className='font-bold text-blue-900 mb-3'>Dead Stock</h3>
                        <p className='text-gray-600'>{deadStock?.dead_stock_count ?? '...'} products not moved in 30 days</p>
                        {deadStock?.products?.map(p => (
                            <p key={p.id} className='text-sm text-gray-500 mt-1'>{p.name} — {p.quantity} units</p>
                        ))}
                    </div>
                    <div className='bg-white p-6 rounded-xl shadow'>
                        <h3 className='font-bold text-blue-900 mb-3'>Low Stock Alerts</h3>
                        <p className='text-red-600 font-semibold'>{alerts?.total_alerts ?? '...'} alerts</p>
                        {alerts?.alerts?.map((a, i) => (
                            <p key={i} className='text-sm text-gray-500 mt-1'>{a.message}</p>
                        ))}
                    </div>
                </div>
                <div className='bg-white p-6 rounded-xl shadow'>
                    <h3 className='font-bold text-blue-900 mb-3'>Top Selling Products</h3>
                    {movement?.top_selling_products?.length > 0 ? movement.top_selling_products.map((p, i) => (
                        <div key={i} className='flex justify-between py-2 border-b'>
                            <span>{p.name}</span>
                            <span className='font-bold text-blue-900'>{p.units_sold} units sold</span>
                        </div>
                    )) : <p className='text-gray-500 text-sm'>No sales data yet</p>}
                </div>
            </div>
        </div>
    )
}