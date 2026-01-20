'use client';

import { useState } from 'react';
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          Smart<span>Waste</span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          <Link href="/add" className={styles.navBtn}>
            Add Location
          </Link>
          <Link href="/collect" className={styles.navBtn}>
            Collection Points
          </Link>
          <Link href="/login" className={`${styles.navBtn} ${styles.navBtnPrimary}`}>
            Login
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </nav>

      {/* Full Page Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <button
            className={styles.closeBtn}
            onClick={toggleSidebar}
            aria-label="Close Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.sidebarLinks}>
          <Link href="/add" className={styles.sidebarLink} onClick={toggleSidebar}>
            Add Location
          </Link>
          <Link href="/collect" className={styles.sidebarLink} onClick={toggleSidebar}>
            Collection Points
          </Link>
          <Link href="/login" className={styles.sidebarLink} onClick={toggleSidebar}>
            Login
          </Link>
        </div>
      </div>

      <main className={styles.hero}>
        <h1 className={styles.heroTitle}>A Smarter Way to Manage City Waste</h1>
        <p className={styles.heroSubtitle}>
          Join our mission to create cleaner, greener cities through efficient waste collection and smart monitoring systems.
        </p>

        <div className={styles.heroButtons}>
          <Link href="/login" className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}>
            Get Started
          </Link>
          <Link href="/collect" className={`${styles.ctaBtn} ${styles.ctaBtnSecondary}`}>
            View Map
          </Link>
        </div>
      </main>
    </div>
  );
}
