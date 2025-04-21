import './Login.css';
import React, { useState } from 'react';
import authService from '../../services/api/authService'; // Giả sử bạn có một service để gọi API đăng nhập
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate để điều hướng sau khi đăng nhập thành công


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate(); // Khởi tạo useNavigate
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

    
        try {
        // Gọi API đăng nhập ở đây
            await authService.login(username, password);
            // Chuyển hướng đến trang chính sau khi đăng nhập thành công
            // window.location.href = '/chat'; // Hoặc sử dụng useNavigate từ react-router-dom
            // console.log(username);
            navigate('/chat', {state: {isLoggedIn: true, username: username}}); // Chuyển hướng đến trang chat
            
        } catch (err) {
            console.log(err);
            setError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <h1>Đăng nhập</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                <p className="login-link">Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
            </form>
        </div>
        
    );
}


export default Login;