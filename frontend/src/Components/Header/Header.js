import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import styles from './Header.module.css'

const Header = ({ user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false) // Ensure menu starts closed
  const navigate = useNavigate()
  const menuRef = useRef(null) // Ref to the menu container

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login')
  }

  // Ensure menu is closed on component mount or when user logs in
  useEffect(() => {
    console.log('User or Component Mounted - Forcing menuOpen to false')
    setMenuOpen(false) // Always ensure menu starts closed
  }, [user])

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        console.log('Click outside detected - closing menu.')
        setMenuOpen(false) // Close the menu if clicking outside
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className={styles.header}>
      <Link to={user ? '/home' : '/'}>
        <img src='/images/logo.png' alt='Logo' className={styles.logo} />
      </Link>
      <h1 className={styles.title}>Life GPA</h1>

      {user && (
        <div
          className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}
          ref={menuRef}
        >
          <button
            onClick={() => setMenuOpen((prev) => !prev)} // Toggle menu visibility
            className={styles.hamburger}
            aria-label='Menu'
          >
            ☰
          </button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
