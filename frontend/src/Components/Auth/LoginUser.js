import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import { supabase } from '../../supabaseClient'
import { AuthContext } from './AuthState' // Import AuthContext

const LoginUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { user, fetchUser } = useContext(AuthContext) // Access global state and fetchUser function
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        console.error('Supabase login error:', error)
      } else {
        setErrorMessage('')
        console.log('User successfully logged in:', data.user)

        await fetchUser() // Ensure fetchUser completes

        const { data: session } = await supabase.auth.getSession()
        if (session?.user) {
          const { error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('user_id', session.user.id)
            .single()

          if (roleError) {
            console.error('Error fetching user role:', roleError.message)
            setErrorMessage('Failed to fetch user role.')
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setErrorMessage('An unexpected error occurred. Please try again.')
    }
  }

  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'super admin') {
        navigate('/admin')
      } else if (user.role === 'user') {
        navigate('/home')
      } else {
        console.error('Unrecognized role:', user.role)
      }
    }
  }, [user, navigate])

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 className={styles.heading}>Login</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='email'>
            Email:
          </label>
          <input
            className={styles.input}
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='password'>
            Password:
          </label>
          <input
            className={styles.input}
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className={styles.button}>
          Login
        </button>
        {errorMessage && <p className={styles.message}>{errorMessage}</p>}
      </form>
      <p className={styles.toggleText}>
        Don't have an account?{' '}
        <Link to='/register' className={styles.toggleLink}>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default LoginUser
