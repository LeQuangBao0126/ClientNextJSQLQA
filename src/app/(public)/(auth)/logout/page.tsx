'use client'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'


export default function LogoutPage() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const ref = useRef<any>(null)
    const searchParams = useSearchParams()
    const refreshToken =searchParams.get('refreshToken')
    const accessToken =searchParams.get('accessToken')

    // nếu refreshToken từ url = refreshToken thì mới cho logout 

    useEffect(() => {
        if(ref.current 
             || 
             refreshToken && refreshToken !== getRefreshTokenFromLocalStorage() 
             ||
             accessToken && accessToken!== getAccessTokenFromLocalStorage()
        ) {
            return 
        } 
        ref.current = mutateAsync
        mutateAsync().then(() => {
            console.log("Log out thanh cong ")
            ref.current = null 
            router.push("/login")
        }) 
        return 
    }, [router])

    return (
        <div>Logout Loading ....................... </div>
    )
}
