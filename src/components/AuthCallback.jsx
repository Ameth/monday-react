import React, { useEffect } from 'react'

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    // const codeVerifier = sessionStorage.getItem('code_verifier')

    if (code) {
      // Enviar el código al backend
      fetch('http://localhost/exchange-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Tokens recibidos del backend:', data)
        })
        .catch((error) =>
          console.error('Error al enviar el código al backend:', error)
        )
    }
  }, [])

  return <div>Procesando autenticación...</div>
}
