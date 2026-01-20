'use client';

import Link from 'next/link';
import styles from './collect.module.css';

const sampleData = [
    {
        id: 1,
        address: "123 Green Street, Eco Valley",
        pincode: "560001",
        lat: 12.9716,
        lng: 77.5946
    },
    {
        id: 2,
        address: "45-B, Sector 7, Tech Park Area",
        pincode: "560100",
        lat: 12.8452,
        lng: 77.6602
    },
    {
        id: 3,
        address: "Rose Apartment, Block C, Main Road",
        pincode: "560038",
        lat: 12.9784,
        lng: 77.6408
    },
    {
        id: 4,
        address: "99 Sunshine Layout, Near Central Park",
        pincode: "560076",
        lat: 12.9141,
        lng: 77.6189
    },
    {
        id: 5,
        address: "Plot 102, Lake View Residency",
        pincode: "560066",
        lat: 12.9569,
        lng: 77.7011
    },
    {
        id: 6,
        address: "15th Cross, Malleshwaram West",
        pincode: "560003",
        lat: 13.0031,
        lng: 77.5643
    }
];

export default function CollectPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    Collection <span>Points</span>
                </h1>
                <p className={styles.subtitle}>List of locations scheduled for pickup today</p>
            </header>

            <div className={styles.grid}>
                {sampleData.map((item) => (
                    <div key={item.id} className={styles.card}>
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

                        <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`}
                            target="_blank"
                            className={styles.locationBtn}
                        >
                            <svg
                                className={styles.icon}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            View Location
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
