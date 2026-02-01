"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
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

// Singleton para garantir uma única instância do cliente
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAdmin: false,
  })
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient(), [])
  const initializedRef = useRef(false)
  const fetchingRef = useRef(false)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
      return profile
    } catch {
      return null
    }
  }, [supabase])

  useEffect(() => {
    // Evita inicialização duplicada
    if (initializedRef.current) return
    initializedRef.current = true

    const getUser = async () => {
      // Evita chamadas duplicadas
      if (fetchingRef.current) return
      fetchingRef.current = true

      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          setState({
            user: null,
            profile: null,
            isLoading: false,
            isAdmin: false,
          })
          return
        }

        const profile = await fetchProfile(user.id)

        setState({
          user,
          profile,
          isLoading: false,
          isAdmin: profile?.is_admin ?? false,
        })
      } catch {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAdmin: false,
        })
      } finally {
        fetchingRef.current = false
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignora eventos de TOKEN_REFRESHED para evitar re-renders desnecessários
        if (event === "TOKEN_REFRESHED") return

        if (event === "SIGNED_OUT") {
          setState({
            user: null,
            profile: null,
            isLoading: false,
            isAdmin: false,
          })
          return
        }

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)

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
  }, [supabase, fetchProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    // Navegação será tratada pela página de login
  }, [supabase])

  const signUp = useCallback(async (email: string, password: string, metadata?: { username?: string; full_name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
  }, [supabase])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push("/")
  }, [supabase, router])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
  }
}
