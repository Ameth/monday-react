export default function SendMailButton() {
  const handleSendMail = () => {
    callWebhook()
  }

  const callWebhook = async () => {
    const url = 'http://localhost/webhook'
    // const url = 'https://18.189.30.198/webhook'

    const body = {
      event: {
        boardId: 7534845263,
        pulseId: 7534845375,
      },
    }

    try {
      const response = await fetch(url, {
        method: 'POST', // Tipo de petición
        headers: {
          'Content-Type': 'application/json', // Especifica que el contenido es JSON
        },
        body: JSON.stringify(body), // Convierte el objeto a una cadena JSON
      })

      // Manejar la respuesta
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json() // Parsea la respuesta como JSON
      console.log('Respuesta del servidor:', data)

      return data // Puedes devolver los datos si necesitas usarlos más adelante
    } catch (error) {
      console.error('Error al llamar al webhook:', error)
    }
  }

  return (
    <div className='flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 max-w-[30%] gap-4'>
      <button
        type='submit'
        className='flex justify-center rounded-md bg-blue-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        onClick={handleSendMail}
      >
        Send Mail
      </button>
    </div>
  )
}
