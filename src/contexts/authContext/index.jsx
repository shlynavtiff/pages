import React, { useContext, useEffect, useState } from "react"
import { auth } from "../../firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({}){
    const [currentUser, setCurrenUser] = useState(null)
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect (() =>{
        const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return unsubscribe
    }, [])

    async function initializeUser(user) {
        if (user) {
            setCurrenUser({...user})
            setUserLoggedIn(true)

        }else{
            setCurrenUser(null)
            setUserLoggedIn(false)
        }
        setIsLoading(false)

    }

    const value = {
        currentUser, userLoggedIn, isLoading
    }

    return(
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}