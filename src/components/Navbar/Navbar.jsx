import './Navbar.css';
import React, { useState } from 'react';
import { Link } from 'react-router';
import authService from '../../services/api/authService';

const Navbar = ({
    isLoggedIn,
    username
}) => {
    // const [isLoggedIn, setIsLoggedIn] = useState(false); // Giả sử bạn có state để kiểm tra trạng thái đăng nhập
    const [loggedIn, setLoggedIn] = useState(isLoggedIn); // Trạng thái đăng nhập
    const [name, setName] = useState(username); // Tên người dùng

    const logout = () => {
        authService.logout(); // Gọi API đăng xuất ở đây
        setLoggedIn(false); // Đặt lại trạng thái đăng nhập
        setName(''); // Đặt lại tên người dùng
    }

    const dropdownUser = () => {
        const userDropdown = document.querySelector('.user-dropdown');
        userDropdown.classList.toggle('show');
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <ul className="nav-menu">
                        {loggedIn ? (
                            <div className="user-info">
                                <div className="user-profile">
                                    <div className="avatar" onClick={dropdownUser}>{name.toUpperCase().charAt(0)}</div>
                                    <ul className="user-dropdown">
                                        <li className="nav-item">
                                            <Link to="/profile" className="nav-links">Hồ sơ</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/settings" className="nav-links">Cài đặt</Link>
                                        </li>
                                        <li className="nav-item">
                                            <div onClick={logout} className="nav-links">Đăng xuất</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <>
                                <li className="nav-login">
                                    <Link to="/login" className="nav-links-login">Đăng nhập</Link>
                                </li>
                                <li className="nav-register">
                                    <Link to="/register" className="nav-links-register">Đăng ký</Link>
                                </li>
                            </>
                        )}
                        
                    </ul>
                </div>
            </nav>
        </>
    )
}


export default Navbar;