import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'
import mondaySdk from 'monday-sdk-js'
import 'monday-ui-react-core/dist/main.css'
//Explore more Monday React Components here: https://style.monday.com/
import { AttentionBox } from 'monday-ui-react-core'
import LoginButton from './components/LoginButton'
import SendMailButton from './components/SendMailButton'
import UserInfo from './components/UserInfo'
import AuthCallback from './components/AuthCallback'

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk()

const App = () => {
  const [context, setContext] = useState()
  const [info, setInfo] = useState(null)

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute('valueCreatedForUser')

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen('context', (res) => {
      // console.log("context", res);
      setContext(res.data)
    })
  }, [])

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  // const attentionBoxText = `Account: ${info?.displayName}
  // Context: ${context ? JSON.stringify(context) : 'No context available'}`

  const infoUSer = info?.displayName
    ? `${info.displayName} (${info.email})`
    : 'No account'

  const attentionBoxText = `Account: ${infoUSer}`

  const name = `WRD Mailer`

  return (
    <div className='flex flex-col items-center justify-center'>
      {!info && <LoginButton />}
      <AuthCallback />
      <UserInfo />
      <AttentionBox title={name} text={attentionBoxText} type='success' />
      {info && <SendMailButton />}
    </div>
  )
}

export default App
