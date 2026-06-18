import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Stock() {
    const [form, setForm] = useState({ product_id: '', quantity: '', note: '', user_id: 1 })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleStock = async (type) => {
        setMessage('')
        setError('')
        try {
            const res = await api.post(`/stock/${type}`, {
                ...form,
                product_id: Number(form.product_id),
                quantity: Number(form.quantity)
            })
            setMessage(`${type === 'in' ? 'Stock added' : 'Stock removed'}! New quantity: ${res.data.new_quantity}`)
            setForm({ product_id: '', quantity: '', note: '', user_id: 1 })
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong')
        }
    }

    return (
        <div className='min-h-screen bg-gray-100'>
            <nav className='bg-blue-900 text-white px-6 py-4 flex justify-between items-center'>
                <h1 className='text-xl font-bold'>Smart Inventory</h1>
                <div className='flex gap-4'>
                    <Link to='/' className='hover:underline'>Dashboard</Link>
                    <Link to='/products' className='hover:underline'>Products</Link>
                    <Link to='/transactions' className='hover:underline'>Transactions</Link>
                    <Link to='/reports' className='hover:underline'>Reports</Link>
                    <button onClick={() => { logout(); navigate('/login') }} className='bg-red-500 px-3 py-1 rounded'>Logout</button>
                </div>
            </nav>
            <div className='p-6 max-w-lg mx-auto'>
                <h2 className='text-2xl font-bold text-blue-900 mb-6'>Stock Management</h2>
                {message && <p className='bg-green-100 text-green-700 p-3 rounded mb-4'>{message}</p>}
                {error && <p className='bg-red-100 text-red-700 p-3 rounded mb-4'>{error}</p>}
                <div className='bg-white p-6 rounded-xl shadow'>
                    <input type='number' placeholder='Product ID'
                        value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})}
                        className='w-full border rounded p-3 mb-3' />
                    <input type='number' placeholder='Quantity'
                        value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                        className='w-full border rounded p-3 mb-3' />
                    <input placeholder='Note (optional)'
                        value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                        className='w-full border rounded p-3 mb-4' />
                    <div className='flex gap-3'>
                        <button onClick={() => handleStock('in')} className='bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex-1'>+ Stock In</button>
                        <button onClick={() => handleStock('out')} className='bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex-1'>- Stock Out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

