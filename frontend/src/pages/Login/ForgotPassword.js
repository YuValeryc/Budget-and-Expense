import React, { useState } from 'react';
import './ForgotPassword.css';
import { notify } from '../../components/Notify/notification';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                notify(1, 'Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn', 'Success');
            } else {
                notify(2, data.message, 'Error');
            }
        } catch (error) {
            console.error(error);
            notify(2, 'Lỗi kết nối đến máy chủ', 'Error');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password">
                <h2 className="forgot-password__title">Quên mật khẩu</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="forgot-password__input-group">
                        <label className="forgot-password__label" htmlFor="email">Email</label>
                        <input
                            className="forgot-password__input"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email của bạn"
                            required
                        />
                    </div>
                    <button type="submit" className="forgot-password__btn">Gửi liên kết đặt lại mật khẩu</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
