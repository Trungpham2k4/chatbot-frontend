
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat/Chat'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Chat/>} />
            <Route path="/chat" element={<Chat/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
        </Routes>
    )
    
}

export default App
