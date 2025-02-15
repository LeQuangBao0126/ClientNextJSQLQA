'use client'
import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef } from 'react'

function Logout() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const ref = useRef<any>(null)
    const searchParams = useSearchParams()
    const refreshToken = searchParams.get('refreshToken')
    const accessToken = searchParams.get('accessToken')
    const { setIsAuth } = useAppContext()
    // nếu refreshToken từ url = refreshToken thì mới cho logout 

    useEffect(() => {
        if (ref.current
            ||
            refreshToken && refreshToken !== getRefreshTokenFromLocalStorage()
            ||
            accessToken && accessToken !== getAccessTokenFromLocalStorage()
        ) {
            return
        }
        ref.current = mutateAsync
        mutateAsync().then(() => {
            console.log("Log out thanh cong ")
            ref.current = null
            setIsAuth(false)
            router.push("/login")
        })
        return
    }, [router])

    return (
        <div>Logout Loading ....................... </div>
    )
}

export default function LogoutPage() {
    return <Suspense>
        <Logout />
    </Suspense>
}

