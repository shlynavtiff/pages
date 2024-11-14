import React, {useState, useEffect} from 'react'
import {auth} from '../../firebase/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const listen = onAuthStateChanged(auth,(user) => {
            if (user) {
                setAuthUser(user)
            }   
            else {
                setAuthUser(null)
            }
        })

        return () => {
            listen()
        }

        
    }, [])

        const userSignOut = () => {
            signOut(auth).then(() => {
                console.log("sign out successfull")
            })
            .catch(error => console.log(error))
        }


    return (
    <div className='flex items-center flex-col'>{authUser ?<> <p>{`Signed in as ${authUser.displayName}`}</p> <button onClick={userSignOut}>Sign out</button> </> : <p>Signed out</p>}
    </div>
  )
}

export default AuthDetails