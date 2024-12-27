import React, { useEffect, useState } from 'react'

const GRAPH_ME_ENDPOINT = 'https://graph.microsoft.com/v1.0/me'

export default function UserInfo({ accessToken }) {
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (accessToken) {
      fetch(GRAPH_ME_ENDPOINT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('User profile:', data)
          setUserProfile(data)
        })
        .catch((error) => console.error('Error fetching user profile:', error))
    }
  }, [accessToken])

  return (
    <div>
      {userProfile ? (
        <div>
          <h2>Welcome, {userProfile.displayName}</h2>
          <p>Email: {userProfile.mail || userProfile.userPrincipalName}</p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  )
}
