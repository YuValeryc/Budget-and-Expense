import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import AuthContext from '../../components/AuthContext/AuthContext'; 
import Cookies from 'js-cookie';  
import { notify } from '../../components/Notify/notification';

const LoginPage = () => {
    const { login } = useContext(AuthContext); 
    const [isSignup, setIsSignup] = useState(false); 
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const  handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignup) {
            if (password !== confirmPassword) {
                notify(2, 'Mật khẩu không khớp', 'Error');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    const { user, token } = data;
                    Cookies.set('user', JSON.stringify(user), { expires: 7 }); 
                    Cookies.set('token', token, { expires: 7 }); 
                    notify(1, data.message, 'Success');
                    setIsSignup(false); 
                } else {
                    notify(2, data.message, 'Error');
                }
            } catch (error) {
                console.error(error);
                notify(2, 'Lỗi kết nối đến máy chủ', 'Error');
            }
        } else {
            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const { user, token } = data;
                    console.log(user, token);
                    Cookies.set('user', JSON.stringify(user), { expires: 7 }); 
                    Cookies.set('token', token, { expires: 7 });
                    
                    login(user, token); 
                    navigate('/home'); 
                    notify(1, 'Đăng nhập thành công', 'Success');
                } else {
                    notify(2, 'Đăng nhập thất bại', 'Error');
                }
            } catch (error) {
                console.error(error);
                notify(2, 'Lỗi kết nối đến máy chủ', 'Error');
            }
        }
    };

    return (
        <div className="login-container"> 
            <div className="login">
                <div className="login__box">
                    <h2 className="login__title">{isSignup ? 'Tạo tài khoản mới' : 'Đăng nhập'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="login__input-group">
                                <label className="login__label" htmlFor="login-email">Email</label>
                                <input
                                    className="login__input"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email của bạn"
                                    required
                                />
                            </div>
                        {isSignup && (
                            <div className="login__input-group">
                            <label className="login__label" htmlFor="username">Username</label>
                            <input
                                className="login__input"
                                type="text"
                                id="username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tên người dùng"
                                required
                            />
                            </div>
                        )}
                        <div className="login__input-group">
                            <label className="login__label" htmlFor="password">Mật khẩu</label>
                            <input
                                className="login__input"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu của bạn"
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className="login__input-group">
                                <label className="login__label" htmlFor="confirm-password">Xác nhận mật khẩu</label>
                                <input
                                    className="login__input"
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Xác nhận lại mật khẩu"
                                    required
                                />
                            </div>
                        )}
                        {!isSignup && (
                            <p>
                                <button className="forgot-password-btn" onClick={() => navigate('/forgot-password')}>
                                    Quên mật khẩu?
                                </button>
                            </p>
                        )}
                        <button type="submit" className="login__btn">{isSignup ? 'Đăng ký' : 'Đăng nhập'}</button>
                    </form>
                    <div className="login__footer">
                        <p>
                            {isSignup ? "Bạn đã có tài khoản? " : "Bạn chưa có tài khoản? "}
                            <button onClick={() => setIsSignup(!isSignup)} className="login__toggle-btn">
                                {isSignup ? 'Đăng nhập' : 'Đăng ký'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
