'use client';

import { useState } from 'react';
import styles from './login.module.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        role: 'cleaner' // Default role
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await signIn('credentials', {
                userId: formData.userId,
                password: formData.password,
                role: formData.role,
                redirect: false
            });

            if (result.error) {
                setError("Invalid credentials");
                return;
            }

            router.push('/');
        } catch (error) {
            setError("Something went wrong");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    Welcome <span>Back</span>
                </h1>

                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <div className={styles.roleSelector}>
                    <button
                        type="button"
                        className={`${styles.roleOption} ${formData.role === 'cleaner' ? styles.roleOptionActive : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'cleaner' })}
                    >
                        Cleaner
                    </button>
                    <button
                        type="button"
                        className={`${styles.roleOption} ${formData.role === 'driver' ? styles.roleOptionActive : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'driver' })}
                    >
                        Driver
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="userId" className={styles.label}>User ID</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                className={styles.input}
                                placeholder="Enter your user ID"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className={styles.input}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
