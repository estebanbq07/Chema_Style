import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    if (!userId) {
      setProfile(null)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(!error && data ? data : null)
  }

  useEffect(() => {
    let isMounted = true

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      if (!isMounted) return

      setUser(currentUser)

      if (currentUser) {
        await loadProfile(currentUser.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  async function signUp(email, password, fullName) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
  }

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext