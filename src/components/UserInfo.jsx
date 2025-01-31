import { useState, useEffect } from 'react'

// const hostname = window.location.hostname

// const isLocalhost = hostname === 'localhost'

// const BACKEND_URL = isLocalhost ? 'http://localhost:3000' : 'https://monday-email-app.vercel.app'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function UserInfo({ authCode, boardId }) {
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
            body: JSON.stringify({ code: authCode, boardId: boardId }),
          })

          if (!tokenResponse.ok) {
            throw new Error('Error exchanging code for tokens')
          }

          const tokenData = await tokenResponse.json()
          // console.log('Token data form backend:', tokenData)
        }

        // Obtener la información del usuario
        const userResponse = await fetch(
          `${BACKEND_URL}/user-info/${boardId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${accessToken}`,
            },
          }
        )

        if (!userResponse.ok) {
          throw new Error('User information not found')
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
  }, [authCode, boardId])

  const handleLogout = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/user-logout/${boardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to log out')
      }

      setUserInfo(null) // Limpia la información del usuario
      // alert('Logout successful!')
    } catch (err) {
      console.error('Error logging out:', err)
      setError(err.message)
      // alert('Error logging out')
    } finally {
      setLoading(false)
    }
  }

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
          <button
            className='mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      ) : (
        <p className='text-red-600'>No user information found.</p>
      )}
    </div>
  )
}
