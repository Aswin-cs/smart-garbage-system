'use client';

import { useState, useEffect } from 'react'; // Added hooks
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // Added useSession import
import styles from './collect.module.css';



export default function CollectPage() {
    const { data: session, status } = useSession();
    const [locations, setLocations] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this location?')) return;

        try {
            const res = await fetch('/api/location', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setLocations(prev => prev.filter(item => item._id !== id));
            } else {
                alert('Failed to delete location');
            }
        } catch (error) {
            console.error('Error deleting location:', error);
            alert('An error occurred while deleting');
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && (session?.user?.role === 'driver' || session?.user?.role === 'cleaner')) {
            const fetchLocations = async () => {
                try {
                    const res = await fetch('/api/location');
                    if (!res.ok) throw new Error('Failed to fetch data');
                    const data = await res.json();
                    setLocations(data.locations || []);
                } catch (err) {
                    setError('Failed to load collection points');
                    console.error(err);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchLocations();
        } else if (status !== 'loading') {
            setLoadingData(false);
        }
    }, [status, session]);

    if (status === 'loading') {
        return <div className={styles.container}><p>Loading...</p></div>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className={styles.container}>
                <div className={styles.card} style={{
                    maxWidth: '400px',
                    margin: '2rem auto',
                    padding: '2rem',
                    background: 'var(--card-bg, #fff)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <h1 className={styles.title} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Authentication <span>Required</span>
                    </h1>
                    <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                        You must be logged in as a driver to view collection points.
                    </p>
                    <Link
                        href="/login"
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.75rem',
                            textAlign: 'center',
                            background: 'var(--primary, #10b981)',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Role check: Only drivers and cleaners can access this page
    if (session?.user?.role !== 'driver' && session?.user?.role !== 'cleaner') {
        return (
            <div className={styles.container}>
                <div className={styles.card} style={{
                    maxWidth: '400px',
                    margin: '2rem auto',
                    padding: '2rem',
                    background: 'var(--card-bg, #fff)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <h1 className={styles.title} style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>
                        Access <span>Denied</span>
                    </h1>
                    <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                        This page is restricted to Drivers and Cleaners only. <br />
                        It seems this is not your purpose.
                    </p>
                    <Link
                        href="/"
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.75rem',
                            textAlign: 'center',
                            background: '#ef4444',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    Collection <span>Points</span>
                </h1>
                <p className={styles.subtitle}>List of locations scheduled for pickup today</p>
            </header>

            {loadingData ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading collection points...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
            ) : locations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>No collection points found.</div>
            ) : (
                <div className={styles.grid}>
                    {locations.map((item) => (
                        <div key={item._id} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.addressGroup}>
                                    <span className={styles.label}>Address</span>
                                    <h3 className={styles.address}>{item.address}</h3>
                                </div>

                                <div className={styles.pincodeGroup}>
                                    <span className={styles.pincodeLabel}>PIN:</span>
                                    <span className={styles.pincode}>{item.pincode}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <Link
                                    href={`https://www.google.com/maps/search/?api=1&query=${item.geolocation.latitude},${item.geolocation.longitude}`}
                                    target="_blank"
                                    className={styles.locationBtn}
                                    style={{ flex: 1, textAlign: 'center' }}
                                >
                                    View
                                </Link>
                                {session?.user?.role === 'cleaner' && (
                                    <>
                                        <Link
                                            href={`/add?edit=true&id=${item._id}&street=${encodeURIComponent(item.address)}&city=${encodeURIComponent(item.city)}&pincode=${item.pincode}&lat=${item.geolocation.latitude}&lng=${item.geolocation.longitude}`}
                                            className={styles.locationBtn}
                                            style={{ background: '#f59e0b', border: 'none', color: 'white', cursor: 'pointer', padding: '0.8rem 1rem', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className={styles.locationBtn}
                                            style={{ background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem 1rem' }}
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
