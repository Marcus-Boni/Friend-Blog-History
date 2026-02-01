"use client"

import { useEffect, useState, useCallback, useMemo, useSyncExternalStore } from "react"
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

// Estado global compartilhado entre todas as instâncias do hook
let globalAuthState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
}

// Listeners para notificar componentes sobre mudanças de estado
const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return globalAuthState
}

function setGlobalState(newState: AuthState) {
  globalAuthState = newState
  notifyListeners()
}

// Singleton para garantir uma única instância do cliente
let supabaseClient: ReturnType<typeof createClient> | null = null
let initialized = false
let initializing = false

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

async function fetchProfile(supabase: ReturnType<typeof createClient>, userId: string) {
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
}

// Inicialização global única
async function initializeAuth() {
  if (initialized || initializing) return
  initializing = true

  const supabase = getSupabaseClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      setGlobalState({
        user: null,
        profile: null,
        isLoading: false,
        isAdmin: false,
      })
    } else {
      const profile = await fetchProfile(supabase, user.id)
      setGlobalState({
        user,
        profile,
        isLoading: false,
        isAdmin: profile?.is_admin ?? false,
      })
    }
  } catch {
    setGlobalState({
      user: null,
      profile: null,
      isLoading: false,
      isAdmin: false,
    })
  }

  // Listener para mudanças de autenticação
  supabase.auth.onAuthStateChange(async (event, session) => {
    // Ignora eventos de TOKEN_REFRESHED para evitar re-renders desnecessários
    if (event === "TOKEN_REFRESHED") return

    if (event === "SIGNED_OUT") {
      setGlobalState({
        user: null,
        profile: null,
        isLoading: false,
        isAdmin: false,
      })
      return
    }

    if (session?.user) {
      const profile = await fetchProfile(supabase, session.user.id)
      setGlobalState({
        user: session.user,
        profile,
        isLoading: false,
        isAdmin: profile?.is_admin ?? false,
      })
    } else {
      setGlobalState({
        user: null,
        profile: null,
        isLoading: false,
        isAdmin: false,
      })
    }
  })

  initialized = true
  initializing = false
}

export function useAuth() {
  const supabase = useMemo(() => getSupabaseClient(), [])
  const router = useRouter()
  
  // Usa useSyncExternalStore para sincronizar com o estado global
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // Inicializa a autenticação na primeira montagem
  useEffect(() => {
    initializeAuth()
  }, [])

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
