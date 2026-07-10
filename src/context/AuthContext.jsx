import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadUserFromSession() {
    setLoading(true)
    try {
      let currentUser = null
      try {
        const { data } = await supabase.auth.getSession()
        currentUser = data?.session?.user ?? null
      } catch {
        // fallback for older client versions
        const { data: ud } = await supabase.auth.getUser?.() ?? { data: null }
        currentUser = ud?.user ?? null
      }

      setUser(currentUser)
      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        if (!error) setProfile(data)
      } else {
        setProfile(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserFromSession()

    const listener = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .single()
          .then(({ data, error }) => {
            if (!error) setProfile(data)
          })
      } else {
        setProfile(null)
      }
    })

    return () => {
      try {
        // support different unsubscribe shapes
        if (listener?.data?.subscription) listener.data.subscription.unsubscribe()
        else if (listener?.subscription) listener.subscription.unsubscribe()
        else if (typeof listener === 'function') listener()
      } catch (e) {
        // ignore
      }
    }
  }, [])

  async function signUp(email, password, fullName) {
    setLoading(true)
    try {
      const res = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      // if user created, try to update profile with name (trigger may create profile)
      const userId = res?.data?.user?.id ?? res?.user?.id
      if (userId && fullName) {
        await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId)
      }
      return res
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email, password) {
    setLoading(true)
    try {
      const res = await supabase.auth.signInWithPassword({ email, password })
      return res
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
