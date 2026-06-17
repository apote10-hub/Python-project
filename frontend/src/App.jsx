import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Stock from './pages/Stock'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'

function PrivateRoute({ children }) {
    const { token } = useAuth()
    return token ? children : <Navigate to='/login' />
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path='/products' element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path='/stock' element={<PrivateRoute><Stock /></PrivateRoute>} />
                <Route path='/transactions' element={<PrivateRoute><Transactions /></PrivateRoute>} />
                <Route path='/reports' element={<PrivateRoute><Reports /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    )
}