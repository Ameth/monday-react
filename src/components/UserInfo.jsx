import { useState, useEffect } from 'react'

// const hostname = window.location.hostname

// const isLocalhost = hostname === 'localhost'

// const BACKEND_URL = isLocalhost ? 'http://localhost:3000' : 'https://monday-email-app.vercel.app'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function UserInfo({ authCode }) {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      // if (!authCode) return

      try {
        setLoading(true)
        setError(null)

        if (authCode) {
          // Enviar el código al backend para obtener tokens
          const tokenResponse = await fetch(`${BACKEND_URL}/exchange-code`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: authCode }),
          })

          if (!tokenResponse.ok) {
            throw new Error('Error al intercambiar el código por tokens')
          }

          const tokenData = await tokenResponse.json()
          console.log('Token data form backend:', tokenData)
        }

        // Obtener la información del usuario
        const userResponse = await fetch(`${BACKEND_URL}/user-info`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${accessToken}`,
          },
        })

        if (!userResponse.ok) {
          throw new Error('No se encontró información del usuario')
        }

        const userData = await userResponse.json()
        setUserInfo(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [authCode])

  if (loading) {
    return (
      <div className='text-center text-gray-500'>
        Loading user information...
      </div>
    )
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>
  }

  return (
    <div className='p-4 bg-slate-700 rounded-lg shadow-xl w-80'>
      <h2 className='text-xl font-semibold text-sky-400 mb-4'>
        Authenticated user
      </h2>
      {userInfo ? (
        <div>
          <p className='text-white'>
            <span className='font-semibold'>Name:</span> {userInfo.displayName}
          </p>
          <p className='text-white'>
            <span className='font-semibold'>Email:</span> {userInfo.email}
          </p>
        </div>
      ) : (
        <p className='text-red-600'>No user information found.</p>
      )}
    </div>
  )
}
