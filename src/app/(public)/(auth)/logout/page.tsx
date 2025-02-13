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

    // nếu refreshToken từ url = refreshToken thì mới cho logout 

    useEffect(() => {
        if(ref.current || 
                searchParams.get('refreshToken') !== getRefreshTokenFromLocalStorage()
             
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
