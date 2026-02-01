"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/database.types"

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAdmin: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAdmin: false,
  })
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        setState({
          user,
          profile,
          isLoading: false,
          isAdmin: profile?.is_admin ?? false,
        })
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAdmin: false,
        })
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          setState({
            user: session.user,
            profile,
            isLoading: false,
            isAdmin: profile?.is_admin ?? false,
          })
        } else {
          setState({
            user: null,
            profile: null,
            isLoading: false,
            isAdmin: false,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    router.push("/admin")
  }

  const signUp = async (email: string, password: string, metadata?: { username?: string; full_name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push("/")
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
  }
}
