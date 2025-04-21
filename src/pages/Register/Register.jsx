import './Register.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import authService from '../../services/api/authService';

const Register = () => {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp!');
            return;
        }

        try {
            await authService.register(username, email, password);
            // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            navigate('/chat', {state: {isLoggedIn: true, username: username}}); // Chuyển hướng đến trang chat
        } catch (err) {
            console.log(err);
            setError('Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.');
        }
    };

    return (
        <>
            <div className="register-container">
                <h1>Đăng ký</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Tên người dùng"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Đăng ký</button>
                    <p className="login-link">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                </form>
            </div>
        
        
        </>
    )
}

export default Register;