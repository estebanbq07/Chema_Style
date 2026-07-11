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

    if (!error && data) {
      setProfile(data)
    } else {
      setProfile(null)
    }
  }

  async function loadUserFromSession() {
    setLoading(true)
    try {
      const { data } = await supabase.auth.getSession()
      const currentUser = data?.session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await loadProfile(currentUser.id)
      }
    } catch (error) {
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserFromSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        loadProfile(currentUser.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  async function signUp(email, password, fullName) {
    setLoading(true)
    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email, password) {
    setLoading(true)
    try {
      return await supabase.auth.signInWithPassword({ email, password })
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
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
