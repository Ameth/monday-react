import { useState, useEffect } from 'react'
import './App.css'
import mondaySdk from 'monday-sdk-js'
import 'monday-ui-react-core/dist/main.css'
//Explore more Monday React Components here: https://style.monday.com/
import { AttentionBox } from 'monday-ui-react-core'
import LoginButton from './components/LoginButton'
// import SendMailButton from './components/SendMailButton'
import UserInfo from './components/UserInfo'
import ColumnMapper from './components/ColumnMapper'

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk()

const App = () => {
  const [context, setContext] = useState()
  const [info, setInfo] = useState()
  const [authCode, setAuthCode] = useState(null)
  const [boardId, setBoardId] = useState(import.meta.env.VITE_BOARD_ID) // Default to env variable in development
  const [version, setVersion] = useState('Test')

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    // monday.execute('valueCreatedForUser')

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    // monday.listen('itemIds', (res) => {
    //   // console.log("context", res);
    //   setContext(res.data)
    // })

    monday.get('context').then((res) => {
      setContext(res)
      if (res?.data?.boardId) {
        setBoardId(res.data.boardId) // Update boardId when available
      }
      if (res?.data) {
        setVersion(res.data.appVersion.versionData.displayNumber)
      }
    })
  }, [])

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  // const attentionBoxText = `Context: ${
  //   context ? JSON.stringify(context) : 'No context available'
  // }`

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <LoginButton onCodeReceived={setAuthCode} />
      <UserInfo authCode={authCode} />
      <ColumnMapper boardId={boardId} />
      {/* {!authCode && <LoginButton onCodeReceived={setAuthCode} />} */}
      {/* <AttentionBox text={attentionBoxText} type='success' /> */}
      {/* {info && <SendMailButton />} */}
      {<p className='text-gray-400 text-sm mt-1'>Version: {version}</p>}
    </div>
  )
}

export default App
