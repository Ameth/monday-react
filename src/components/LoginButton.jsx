const hostname = window.location.hostname
const currentURL = window.location.href
console.log('Current Hostname:', hostname)
console.log('Current URL:', currentURL)

const isLocalhost = hostname === 'localhost'

const REDIRECT_URI = isLocalhost
  ? 'http://localhost:8301'
  : `https://${hostname}`

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
// const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
// const REDIRECT_URI = `https://${hostname}`
// const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
console.log('redirect_uri:', REDIRECT_URI)
const AUTH_ENDPOINT =
  'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'

export default function LoginButton({ onCodeReceived }) {
  const handleLogin = async () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(
      'offline_access https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read'
    )}&state=12345`

    // Abrir una ventana emergente para el inicio de sesión
    const popup = window.open(
      authUrl,
      '_blank',
      'width=500,height=600,scrollbars=no,resizable=no'
    )

    const interval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(interval)
          console.error(
            'La ventana emergente fue cerrada sin completar la autenticación.'
          )
          return
        }

        // Verificar si la URL de la ventana contiene el parámetro `code`
        const popupUrl = popup.location.href
        console.log('Popup URL:', popupUrl)
        if (popupUrl.includes('?code=')) {
          const params = new URLSearchParams(new URL(popupUrl).search)
          const code = params.get('code')

          if (code) {
            // console.log('Código de autorización:', code)
            popup.close() // Cerrar la ventana emergente
            clearInterval(interval)
            onCodeReceived(code) // Enviar el código a la ventana principal
          }
        }
      } catch (error) {
        // Ignorar errores de Cross-Origin hasta que la ventana llegue a REDIRECT_URI
      }
    }, 500)
  }

  return (
    <div className='flex justify-center flex-col items-center'>
      <button
        onClick={handleLogin}
        className='flex items-center justify-center space-x-2 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold leading-6 text-white shadow-md transition-transform duration-200 hover:bg-blue-700 hover:scale-105 mb-4 mt-6'
      >
        <img
          src='microsoft_logo.svg'
          alt='Microsoft Logo'
          className='h-5 w-5'
        />
        <span>Sign in with Microsoft</span>
      </button>
    </div>
  )
}
