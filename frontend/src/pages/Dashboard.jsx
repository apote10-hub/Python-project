import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

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

    return (
        <div className='min-h-screen bg-gray-100'>
            <nav className='bg-blue-900 text-white px-6 py-4 flex justify-between items-center'>
                <h1 className='text-xl font-bold'>Smart Inventory</h1>
                <div className='flex gap-4 items-center'>
                    <Link to='/products' className='hover:underline'>Products</Link>
                    <Link to='/stock' className='hover:underline'>Stock</Link>
                    <Link to='/transactions' className='hover:underline'>Transactions</Link>
                    <Link to='/reports' className='hover:underline'>Reports</Link>
                    <span className='text-blue-300'>Hi, {user?.username}</span>
                    <button onClick={handleLogout} className='bg-red-500 px-3 py-1 rounded'>Logout</button>
                </div>
            </nav>
            <div className='p-6'>
                <h2 className='text-2xl font-bold text-blue-900 mb-6'>Dashboard</h2>
                <div className='grid grid-cols-4 gap-4 mb-8'>
                    {[
                        { label: 'Total Products', value: stats?.total_products, color: 'bg-blue-900' },
                        { label: 'Low Stock', value: stats?.low_stock_count, color: 'bg-red-600' },
                        { label: 'Transactions', value: stats?.total_transactions, color: 'bg-green-700' },
                        { label: 'Stock Value (NPR)', value: `Rs. ${stats?.total_stock_value_npr?.toLocaleString()}`, color: 'bg-purple-700' },
                    ].map((card, i) => (
                        <div key={i} className={`${card.color} text-white p-6 rounded-xl shadow`}>
                            <p className='text-sm opacity-80'>{card.label}</p>
                            <p className='text-3xl font-bold mt-2'>{card.value ?? '...'}</p>
                        </div>
                    ))}
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    {festival && festival.festival && (
    <div className='bg-white p-6 rounded-xl shadow'>
        <h3 className='font-bold text-blue-900 mb-2'>🎉 Festival Alert</h3>
        <p className='text-gray-700 mb-3'>{festival.advice}</p>
        <div className='bg-blue-50 rounded-lg p-4 text-center'>
            <p className='text-sm text-gray-500 mb-1'>Days until {festival.festival}</p>
            <div className='flex justify-center gap-4'>
                <div className='bg-blue-900 text-white rounded-lg p-3 min-w-16'>
                    <p className='text-3xl font-bold'>{Math.floor(festival.days_until / 30)}</p>
                    <p className='text-xs'>Months</p>
                </div>
                <div className='bg-blue-900 text-white rounded-lg p-3 min-w-16'>
                    <p className='text-3xl font-bold'>{festival.days_until % 30}</p>
                    <p className='text-xs'>Days</p>
                </div>
            </div>
            <p className='text-sm text-blue-700 mt-3 font-semibold'>
                Stock up {festival.surge_multiplier}x on: {festival.stock_up_categories?.join(', ')}
            </p>
        </div>
    </div>
)}
                    {weather && !weather.error && (
                        <div className='bg-white p-6 rounded-xl shadow'>
                            <h3 className='font-bold text-blue-900 mb-2'>Weather Suggestions</h3>
                            <p className='text-gray-700'>{weather.advice}</p>
                            <p className='text-sm text-gray-500 mt-2'>{weather.city} — {weather.temperature_celsius}°C</p>
                        </div>
                    )}
                    {topProducts.length > 0 && (
    <div className='bg-white p-6 rounded-xl shadow mt-4'>
        <h3 className='font-bold text-blue-900 mb-3'>🔥 Most Sold Products</h3>
        <div className='space-y-2'>
            {topProducts.map((p, i) => (
                <div key={i} className='flex justify-between items-center py-2 border-b'>
                    <div className='flex items-center gap-2'>
                        <span className='bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'>{i + 1}</span>
                        <span className='font-medium'>{p.name}</span>
                    </div>
                    <span className='text-blue-900 font-bold'>{p.units_sold} units sold</span>
                </div>
            ))}
        </div>
    </div>
)}
                </div>
            </div>
        </div>
    )
}