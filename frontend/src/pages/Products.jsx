import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function Products() {
    const [products, setProducts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name:'', category:'', sku:'', quantity:0, min_stock_level:5, buy_price:0, sell_price:0, expiry_date:'' })
    const [editId, setEditId] = useState(null)
    const [search, setSearch] = useState('')
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const fetchProducts = () => api.get('/products').then(r => setProducts(r.data))
    useEffect(() => { fetchProducts() }, [])

    const handleSave = async () => {
        const data = {...form, expiry_date: form.expiry_date || null}
        if (editId) { await api.put(`/products/${editId}`, data) }
        else { await api.post('/products', data) }
        setShowModal(false)
        setEditId(null)
        setForm({ name:'', category:'', sku:'', quantity:0, min_stock_level:5, buy_price:0, sell_price:0, expiry_date:'' })
        fetchProducts()
    }

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            await api.delete(`/products/${id}`)
            fetchProducts()
        }
    }

    const handleEdit = (p) => {
        setForm({...p, expiry_date: p.expiry_date || ''})
        setEditId(p.id)
        setShowModal(true)
    }

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    )

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div style={{display:'flex',minHeight:'100vh',background:'var(--color-background-tertiary)'}}>
            <Sidebar active='Products' />
            <div style={{marginLeft:'220px',flex:1,paddingTop:'56px'}}>
                <Topbar user={user} onLogout={handleLogout} search={search} setSearch={setSearch} placeholder='Search products...' />
                <div style={{padding:'20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                        <div>
                            <div style={{fontSize:'20px',fontWeight:'500',color:'var(--color-text-primary)'}}>Products</div>
                            <div style={{fontSize:'12px',color:'var(--color-text-secondary)',marginTop:'2px'}}>{products.length} total products</div>
                        </div>
                        <button onClick={() => setShowModal(true)}
                            style={{background:'#1565C0',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',fontWeight:'500',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
                            <i className='ti ti-plus'></i> Add Product
                        </button>
                    </div>

                    <div style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'12px',overflow:'hidden'}}>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                            <thead>
                                <tr style={{background:'#E3F2FD'}}>
                                    {['ID','Name','Category','SKU','Qty','Min Stock','Buy Price','Sell Price','Expiry','Status','Actions'].map(h => (
                                        <th key={h} style={{padding:'12px 14px',textAlign:'left',fontSize:'12px',color:'#1565C0',fontWeight:'500'}}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} style={{borderBottom:'0.5px solid var(--color-border-tertiary)',background: p.quantity <= p.min_stock_level ? '#FCEBEB' : 'transparent'}}>
                                        <td style={{padding:'10px 14px',color:'var(--color-text-secondary)'}}>{p.id}</td>
                                        <td style={{padding:'10px 14px',fontWeight:'500',color:'var(--color-text-primary)'}}>{p.name}</td>
                                        <td style={{padding:'10px 14px'}}>
                                            <span style={{background:'#E3F2FD',color:'#1565C0',fontSize:'11px',padding:'2px 8px',borderRadius:'20px'}}>{p.category}</span>
                                        </td>
                                        <td style={{padding:'10px 14px',color:'var(--color-text-secondary)',fontFamily:'monospace'}}>{p.sku}</td>
                                        <td style={{padding:'10px 14px',fontWeight:'500',color: p.quantity <= p.min_stock_level ? '#E24B4A' : 'var(--color-text-primary)'}}>{p.quantity}</td>
                                        <td style={{padding:'10px 14px',color:'var(--color-text-secondary)'}}>{p.min_stock_level}</td>
                                        <td style={{padding:'10px 14px'}}>Rs. {p.buy_price}</td>
                                        <td style={{padding:'10px 14px'}}>Rs. {p.sell_price}</td>
                                        <td style={{padding:'10px 14px',color:'var(--color-text-secondary)'}}>{p.expiry_date || '—'}</td>
                                        <td style={{padding:'10px 14px'}}>
                                            {p.quantity <= p.min_stock_level
                                                ? <span style={{background:'#FCEBEB',color:'#A32D2D',fontSize:'11px',padding:'2px 8px',borderRadius:'20px'}}>Low Stock</span>
                                                : <span style={{background:'#E3F2FD',color:'#1565C0',fontSize:'11px',padding:'2px 8px',borderRadius:'20px'}}>In Stock</span>
                                            }
                                        </td>
                                        <td style={{padding:'10px 14px'}}>
                                            <div style={{display:'flex',gap:'6px'}}>
                                                <button onClick={() => handleEdit(p)} style={{background:'#E3F2FD',color:'#1565C0',border:'none',borderRadius:'6px',padding:'4px 10px',fontSize:'12px',cursor:'pointer'}}>Edit</button>
                                                <button onClick={() => handleDelete(p.id)} style={{background:'#FCEBEB',color:'#A32D2D',border:'none',borderRadius:'6px',padding:'4px 10px',fontSize:'12px',cursor:'pointer'}}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div style={{padding:'40px',textAlign:'center',color:'var(--color-text-secondary)'}}>
                                <i className='ti ti-box' style={{fontSize:'32px',display:'block',marginBottom:'8px'}}></i>
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
                    <div style={{background:'white',borderRadius:'12px',padding:'24px',width:'420px',maxHeight:'90vh',overflowY:'auto'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                            <div style={{fontSize:'16px',fontWeight:'500',color:'#1565C0'}}>{editId ? 'Edit Product' : 'Add New Product'}</div>
                            <button onClick={() => { setShowModal(false); setEditId(null) }} style={{background:'none',border:'none',cursor:'pointer',fontSize:'20px',color:'#999'}}>×</button>
                        </div>
                        {[
                            {label:'Product Name',key:'name',type:'text',placeholder:'e.g. Rice 5kg'},
                            {label:'Category',key:'category',type:'text',placeholder:'e.g. food, electronics'},
                            {label:'SKU (unique product code)',key:'sku',type:'text',placeholder:'e.g. RICE001'},
                            {label:'Quantity',key:'quantity',type:'number',placeholder:'0'},
                            {label:'Minimum Stock Level',key:'min_stock_level',type:'number',placeholder:'5'},
                            {label:'Buy Price (NPR)',key:'buy_price',type:'number',placeholder:'0'},
                            {label:'Sell Price (NPR)',key:'sell_price',type:'number',placeholder:'0'},
                            {label:'Expiry Date (optional)',key:'expiry_date',type:'date',placeholder:''},
                        ].map(field => (
                            <div key={field.key} style={{marginBottom:'14px'}}>
                                <label style={{fontSize:'12px',color:'#666',display:'block',marginBottom:'5px'}}>{field.label}</label>
                                <input type={field.type} placeholder={field.placeholder}
                                    value={form[field.key] ?? ''}
                                    onChange={e => setForm({...form, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value})}
                                    style={{width:'100%',border:'0.5px solid #BBDEFB',borderRadius:'8px',padding:'9px 12px',fontSize:'13px',outline:'none'}} />
                            </div>
                        ))}
                        <div style={{display:'flex',gap:'10px',marginTop:'8px'}}>
                            <button onClick={handleSave} style={{flex:1,background:'#1565C0',color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontSize:'13px',fontWeight:'500',cursor:'pointer'}}>Save Product</button>
                            <button onClick={() => { setShowModal(false); setEditId(null) }} style={{flex:1,background:'#f5f5f5',color:'#666',border:'none',borderRadius:'8px',padding:'10px',fontSize:'13px',cursor:'pointer'}}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}