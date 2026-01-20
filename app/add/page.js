'use client';

import { useState } from 'react';
import styles from './add.module.css';

export default function AddLocationPage() {
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: ''
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Location Added Successfully (Check console for data)');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    Add <span>Location</span>
                </h1>

                <form className={styles.form} onSubmit={handleSubmit}>

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

                    <button type="submit" className={styles.submitButton}>
                        Register Location
                    </button>
                </form>
            </div>
        </div>
    );
}
