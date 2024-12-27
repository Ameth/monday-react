import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAti4DMIwr951hCXI89VJrTsq-thhoz6Yk',
  authDomain: 'events-maps-34efe.firebaseapp.com',
  projectId: 'events-maps-34efe',
  storageBucket: 'events-maps-34efe.appspot.com',
  messagingSenderId: '451240457556',
  appId: '1:451240457556:web:428557ec4d3fd3449904c1',
  measurementId: 'G-7JWF6NH8X4',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
