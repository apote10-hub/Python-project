import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/transactions').then(r => setTransactions(r.data))
    }, [])

    return (
        <div className='min-h-screen bg-gray-100'>
            <nav className='bg-blue-900 text-white px-6 py-4 flex justify-between items-center'>
                <h1 className='text-xl font-bold'>Smart Inventory</h1>
                <div className='flex gap-4'>
                    <Link to='/' className='hover:underline'>Dashboard</Link>
                    <Link to='/products' className='hover:underline'>Products</Link>
                    <Link to='/stock' className='hover:underline'>Stock</Link>
                    <Link to='/reports' className='hover:underline'>Reports</Link>
                    <button onClick={() => { logout(); navigate('/login') }} className='bg-red-500 px-3 py-1 rounded'>Logout</button>
                </div>
            </nav>
            <div className='p-6'>
                <h2 className='text-2xl font-bold text-blue-900 mb-4'>Transaction History</h2>
                <div className='bg-white rounded-xl shadow overflow-x-auto'>
                    <table className='w-full text-sm'>
                        <thead className='bg-blue-900 text-white'>
                            <tr>{['ID','Product ID','Type','Quantity','Note','Date'].map(h => (
                                <th key={h} className='p-3 text-left'>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} className='hover:bg-gray-50 border-b'>
                                    <td className='p-3'>{t.id}</td>
                                    <td className='p-3'>{t.product_id}</td>
                                    <td className='p-3'>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'stock_in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className='p-3'>{t.quantity}</td>
                                    <td className='p-3'>{t.note || '-'}</td>
                                    <td className='p-3'>{new Date(t.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}