import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value)
            }
            supabaseResponse = NextResponse.next({
              request,
            })
            for (const { name, value, options } of cookiesToSet) {
              supabaseResponse.cookies.set(name, value, options)
            }
          },
        },
      }
    )

    // Refresh session if expired - usa try/catch para evitar erros silenciosos
    const { data: { user }, error } = await supabase.auth.getUser()

    // Se houve erro de sessão (mas não é erro de autenticação), continua normalmente
    if (error && error.name !== "AuthSessionMissingError") {
      console.error("Middleware auth error:", error.message)
    }

    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
    const isLoginRoute = request.nextUrl.pathname === "/login"

    // Protected routes check - só redireciona se não há usuário
    if (isAdminRoute && !user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      // Preserva a URL original para redirect após login
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // If logged in and trying to access login, redirect to admin
    if (isLoginRoute && user) {
      const url = request.nextUrl.clone()
      // Verifica se há redirect query param
      const redirectTo = request.nextUrl.searchParams.get("redirect") || "/admin"
      url.pathname = redirectTo
      url.searchParams.delete("redirect")
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    // Em caso de erro inesperado, permite a requisição continuar
    console.error("Middleware error:", error)
    return supabaseResponse
  }
}
