"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, useMemo } from "react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  credits: number
  is_admin: boolean
  created_at: string
  updated_at: string
}

// Shared state to prevent duplicate getSession calls
let sessionPromise: Promise<any> | null = null
let isInitialized = false

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        // Reuse existing session promise if available
        if (!sessionPromise || isInitialized) {
          sessionPromise = supabase.auth.getSession()
          isInitialized = true
        }

        const { data: { session } } = await sessionPromise

        if (!isMounted) return

        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('[v0] Error initializing auth:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (!error && data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      sessionPromise = null
      isInitialized = false
    } catch (error) {
      console.error('[v0] Error logging out:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    refreshProfile,
    logout,
    isAdmin: profile?.is_admin || false,
  }
}
