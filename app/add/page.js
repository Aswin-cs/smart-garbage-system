'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link'; // Added Link import
import { useSearchParams, useRouter } from 'next/navigation'; // Added formatting params imports
import { useSession } from 'next-auth/react'; // Added useSession import
import styles from './add.module.css';

// Separate the content that uses searchParams into its own component
function AddLocationContent() {
    const { data: session, status } = useSession(); // Added session hook
    const searchParams = useSearchParams();
    const router = useRouter(); // For redirecting after edit

    // Check if we are in edit mode
    const isEditMode = searchParams.get('edit') === 'true';
    const editId = searchParams.get('id');

    const [loadingLocation, setLoadingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' }); // New state for feedback
    const [locationError, setLocationError] = useState('');
    const [formData, setFormData] = useState({
        street: searchParams.get('street') || '',
        city: searchParams.get('city') || '',
        state: '',
        pincode: searchParams.get('pincode') || '',
        latitude: searchParams.get('lat') || '',
        longitude: searchParams.get('lng') || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getLocation = () => {
        setLoadingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toFixed(6),
                    longitude: position.coords.longitude.toFixed(6)
                }));
                setLoadingLocation(false);
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = 'Location permission denied. Please enable it in your browser settings.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = 'Location information is unavailable.';
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = 'The request to get user location timed out.';
                }
                setLocationError(errorMessage);
                setLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            const endpoint = '/api/location';
            const method = isEditMode ? 'PUT' : 'POST';
            const bodyData = {
                address: formData.street,
                city: formData.city,
                pincode: formData.pincode,
                latitude: formData.latitude,
                longitude: formData.longitude,
            };

            if (isEditMode) {
                bodyData.id = editId;
            }

            const res = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitMessage({ type: 'success', text: isEditMode ? 'Location updated successfully!' : 'Location added successfully!' });

                if (isEditMode) {
                    // Redirect back to collect page after short delay? Or just show msg
                    setTimeout(() => {
                        router.push('/collect');
                    }, 1500);
                } else {
                    // Reset form
                    setFormData({
                        street: '',
                        city: '',
                        state: '',
                        pincode: '',
                        latitude: '',
                        longitude: ''
                    });
                }
            } else {
                setSubmitMessage({ type: 'error', text: data.message || 'Failed to add location' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };



    if (status === 'loading') {
        return <div className={styles.container}><p>Loading...</p></div>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Authentication Required</h1>
                    <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        You must be logged in to access this page.
                    </p>
                    <Link href="/login" className={styles.submitButton} style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Role check: Only cleaners can access this page
    if (session?.user?.role !== 'cleaner') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title} style={{ color: '#ef4444' }}>Access Denied</h1>
                    <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        This page is restricted to Cleaners only. <br />
                        It seems this is not your purpose.
                    </p>
                    <Link href="/" className={styles.submitButton} style={{ textAlign: 'center', display: 'block', textDecoration: 'none', background: '#ef4444' }}>
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {isEditMode ? 'Edit' : 'Add'} <span>Location</span>
                </h1>

                <form className={styles.form} onSubmit={handleSubmit}>

                    {submitMessage.text && (
                        <div style={{
                            padding: '10px',
                            marginBottom: '15px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            backgroundColor: submitMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: submitMessage.type === 'success' ? '#166534' : '#991b1b',
                            border: `1px solid ${submitMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                        }}>
                            {submitMessage.text}
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="street" className={styles.label}>Street Address</label>
                        <textarea
                            id="street"
                            name="street"
                            className={styles.textarea}
                            placeholder="Enter building number, area, street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="city" className={styles.label}>City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className={styles.input}
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="pincode" className={styles.label}>Pincode</label>
                            <input
                                type="text"
                                id="pincode"
                                name="pincode"
                                className={styles.input}
                                placeholder="123456"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Coordinates</label>
                        <button
                            type="button"
                            className={styles.locationButton}
                            onClick={getLocation}
                            disabled={loadingLocation}
                        >
                            {loadingLocation ? (
                                'Getting Location...'
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    Get Current Location
                                </>
                            )}
                        </button>

                        {locationError && <p className={styles.error}>{locationError}</p>}

                        {(formData.latitude || formData.longitude) && (
                            <div className={styles.coordinates}>
                                <span>Lat: {formData.latitude}</span>
                                <span>Long: {formData.longitude}</span>
                            </div>
                        )}

                        {/* Hidden inputs to ensure values are submitted comfortably if needed separately */}
                        <input type="hidden" name="latitude" value={formData.latitude} />
                        <input type="hidden" name="longitude" value={formData.longitude} />

                        <div className={styles.warningBox}>
                            <svg className={styles.warningIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <span>
                                <strong>Important:</strong> Please ensure your Pincode and Geolocation match the same area. avoid using VPNs as they may affect location accuracy.
                            </span>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className={styles.spinner}></span>
                                <span style={{ marginLeft: '10px' }}>{isEditMode ? 'Updating...' : 'Registering...'}</span>
                            </>
                        ) : (
                            isEditMode ? 'Update Location' : 'Register Location'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );

}

// Main page component wrapped in Suspense
export default function AddLocationPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>}>
            <AddLocationContent />
        </Suspense>
    );
}
