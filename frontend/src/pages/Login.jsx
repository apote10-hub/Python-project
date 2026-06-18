import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/auth/login', { email, password })
            login({ username: res.data.username, role: res.data.role }, res.data.access_token)
            navigate('/')
        } catch (err) {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-blue-950 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-xl shadow-lg w-96'>
                <h1 className='text-2xl font-bold text-blue-900 text-center mb-2'>Smart Inventory</h1>
                <p className='text-gray-500 text-center mb-6'>Management System — Nepal</p>
                {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}
                <input type='email' placeholder='Email'
                    value={email} onChange={e => setEmail(e.target.value)}
                    className='w-full border rounded-lg p-3 mb-3 focus:outline-none focus:border-blue-500' />
                <input type='password' placeholder='Password'
                    value={password} onChange={e => setPassword(e.target.value)}
                    className='w-full border rounded-lg p-3 mb-4 focus:outline-none focus:border-blue-500' />
                <button onClick={handleLogin} disabled={loading}
                    className='w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800'>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    )
}