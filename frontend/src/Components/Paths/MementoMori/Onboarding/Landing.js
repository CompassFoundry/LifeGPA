import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../../supabaseClient'
import styles from './Onboarding.module.css'

const MementoMoriLanding = () => {
  const [hasAge, setHasAge] = useState(null) // Initialize as null to indicate loading

  useEffect(() => {
    const fetchUserAge = async () => {
      const { data: session, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError || !session?.session) {
        console.error('Session error:', sessionError)
        return
      }

      const userId = session.session.user.id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('age')
        .eq('user_id', userId)
        .single()

      if (userError) {
        console.error('Error fetching user data:', userError)
        return
      }

      setHasAge(!!userData?.age)
    }

    fetchUserAge()
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Memento Mori</h1>
      <p className={styles.description}>
        Reflect on the transient nature of life, and let that inspire you to
        live with purpose, gratitude, and presence.
      </p>
      {hasAge !== null && (
        <Link to={hasAge ? '/memento-mori/home' : '/memento-mori/onboarding'}>
          <button className={`${styles.ctaButton} ${styles.fadeIn}`}>
            {hasAge ? 'View Your Journey' : 'Start Your Journey'}
          </button>
        </Link>
      )}
      <div className={styles.quoteSection}>
        <p className={styles.quote}>
          "You could leave life right now. Let that determine what you do and
          say and think."
        </p>
        <p className={styles.author}>- Marcus Aurelius, Meditations</p>
      </div>
    </div>
  )
}

export default MementoMoriLanding
