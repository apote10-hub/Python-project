import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Products() {
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name: '', category: '', sku: '', quantity: 0, min_stock_level: 5, buy_price: 0, sell_price: 0 })
    const [editId, setEditId] = useState(null)
    const { logout } = useAuth()
    const navigate = useNavigate()

    const fetchProducts = () => api.get('/products').then(r => setProducts(r.data))
    useEffect(() => { fetchProducts() }, [])

    const handleSave = async () => {
        if (editId) { await api.put(`/products/${editId}`, form) }
        else { await api.post('/products', form) }
        setShowModal(false)
        setEditId(null)
        setForm({ name: '', category: '', sku: '', quantity: 0, min_stock_level: 5, buy_price: 0, sell_price: 0 })
        fetchProducts()
    }

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            await api.delete(`/products/${id}`)
            fetchProducts()
        }
    }

    const handleEdit = (p) => {
        setForm(p)
        setEditId(p.id)
        setShowModal(true)
    }

    return (
        <div className='min-h-screen bg-gray-100'>
            <nav className='bg-blue-900 text-white px-6 py-4 flex justify-between items-center'>
                <h1 className='text-xl font-bold'>Smart Inventory</h1>
                <div className='flex gap-4'>
                    <Link to='/' className='hover:underline'>Dashboard</Link>
                    <Link to='/stock' className='hover:underline'>Stock</Link>
                    <Link to='/transactions' className='hover:underline'>Transactions</Link>
                    <Link to='/reports' className='hover:underline'>Reports</Link>
                    <button onClick={() => { logout(); navigate('/login') }} className='bg-red-500 px-3 py-1 rounded'>Logout</button>
                </div>
            </nav>
            <div className='p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-bold text-blue-900'>Products</h2>
                    <button onClick={() => setShowModal(true)} className='bg-blue-900 text-white px-4 py-2 rounded-lg'>+ Add Product</button>
                </div>
                <div className='bg-white rounded-xl shadow overflow-x-auto'>
                    <table className='w-full text-sm'>
                        <thead className='bg-blue-900 text-white'>
                            <tr>{['ID','Name','Category','SKU','Qty','Min','Buy Price','Sell Price','Actions'].map(h => <th key={h} className='p-3 text-left'>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className={p.quantity <= p.min_stock_level ? 'bg-red-50' : 'hover:bg-gray-50'}>
                                    <td className='p-3'>{p.id}</td>
                                    <td className='p-3 font-medium'>{p.name}</td>
                                    <td className='p-3'>{p.category}</td>
                                    <td className='p-3'>{p.sku}</td>
                                    <td className={`p-3 font-bold ${p.quantity <= p.min_stock_level ? 'text-red-600' : ''}`}>{p.quantity}</td>
                                    <td className='p-3'>{p.min_stock_level}</td>
                                    <td className='p-3'>Rs. {p.buy_price}</td>
                                    <td className='p-3'>Rs. {p.sell_price}</td>
                                    <td className='p-3 flex gap-2'>
                                        <button onClick={() => handleEdit(p)} className='bg-blue-500 text-white px-2 py-1 rounded text-xs'>Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className='bg-red-500 text-white px-2 py-1 rounded text-xs'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded-xl w-96'>
                        <h3 className='font-bold text-blue-900 mb-4'>{editId ? 'Edit Product' : 'Add Product'}</h3>
                        {['name','category','sku'].map(field => (
                            <input key={field} placeholder={field} value={form[field] || ''} onChange={e => setForm({...form, [field]: e.target.value})} className='w-full border rounded p-2 mb-2' />
                        ))}
                        {['quantity','min_stock_level','buy_price','sell_price'].map(field => (
                            <input key={field} type='number' placeholder={field} value={form[field] || 0} onChange={e => setForm({...form, [field]: Number(e.target.value)})} className='w-full border rounded p-2 mb-2' />
                        ))}
                        <div className='flex gap-2 mt-4'>
                            <button onClick={handleSave} className='bg-blue-900 text-white px-4 py-2 rounded flex-1'>Save</button>
                            <button onClick={() => { setShowModal(false); setEditId(null) }} className='bg-gray-300 px-4 py-2 rounded flex-1'>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
