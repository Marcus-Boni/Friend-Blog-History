"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global Error page - handles errors in the root layout
 * This is a special error boundary that catches errors in the root layout
 * and provides its own html and body tags.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>
        {/* Inline styles for critical error page - fully responsive */}
        <style>{`
          * {
            box-sizing: border-box;
          }
          .error-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: linear-gradient(180deg, #000000 0%, #050505 50%, #0a0a0a 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .error-container {
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          .error-icon-wrapper {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 50%;
            background: rgba(255, 23, 68, 0.1);
            border: 1px solid rgba(255, 23, 68, 0.3);
            display: inline-flex;
          }
          .error-icon {
            width: 2.5rem;
            height: 2.5rem;
            color: #ff1744;
          }
          .error-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #ff1744;
            margin: 0 0 0.75rem 0;
          }
          .error-description {
            color: #71717a;
            margin: 0 0 1.5rem 0;
            line-height: 1.6;
            font-size: 0.875rem;
            padding: 0 0.5rem;
          }
          .error-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            padding: 0 0.5rem;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            border-radius: 0.5rem;
            font-weight: 500;
            font-size: 0.875rem;
            text-decoration: none;
            cursor: pointer;
            transition: opacity 0.2s;
            width: 100%;
          }
          .btn:hover {
            opacity: 0.9;
          }
          .btn-primary {
            background: linear-gradient(135deg, #dc143c, #8b0000);
            color: white;
            border: none;
          }
          .btn-outline {
            background: transparent;
            color: #ffd700;
            border: 1px solid rgba(255, 215, 0, 0.5);
          }
          .btn-outline:hover {
            background: rgba(255, 215, 0, 0.1);
          }
          .error-digest {
            margin-top: 1.5rem;
            font-size: 0.625rem;
            color: #52525b;
          }
          
          /* Tablet and up */
          @media (min-width: 640px) {
            .error-page {
              padding: 2rem;
            }
            .error-icon-wrapper {
              padding: 1.5rem;
            }
            .error-icon {
              width: 4rem;
              height: 4rem;
            }
            .error-title {
              font-size: 2rem;
            }
            .error-description {
              font-size: 1rem;
            }
            .error-buttons {
              flex-direction: row;
              justify-content: center;
            }
            .btn {
              width: auto;
              padding: 0.75rem 1.5rem;
              font-size: 1rem;
            }
            .error-digest {
              font-size: 0.75rem;
            }
          }
        `}</style>

        <div className="error-page">
          <div className="error-container">
            {/* Error icon */}
            <div className="error-icon-wrapper">
              <AlertTriangle className="error-icon" />
            </div>

            <h1 className="error-title">
              Erro Crítico
            </h1>
            
            <p className="error-description">
              Ocorreu um erro grave no sistema. Nossa equipe foi notificada e 
              está trabalhando para resolver o problema o mais rápido possível.
            </p>

            <div className="error-buttons">
              <button onClick={reset} className="btn btn-primary">
                <RefreshCcw size={18} />
                Tentar Novamente
              </button>
              <a href="/" className="btn btn-outline">
                <Home size={18} />
                Voltar ao Início
              </a>
            </div>

            {error.digest && (
              <p className="error-digest">
                Código de erro: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
