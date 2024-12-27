import React from 'react'

const CLIENT_ID = 'd17f7241-8c7a-4235-8d3c-f16486fd300e'
const REDIRECT_URI = 'http://localhost:8301'
const AUTH_ENDPOINT =
  'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'

function generateCodeVerifier() {
  const array = new Uint8Array(128)
  window.crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hash = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export default function LoginButton() {
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    sessionStorage.setItem('code_verifier', codeVerifier)

    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(
      'offline_access https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read'
    )}&state=12345`

    window.location.href = authUrl
  }

  return (
    <div>
      <button
        onClick={handleLogin}
        className='flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700'
      >
        Sign in with Microsoft
      </button>
    </div>
  )
}
