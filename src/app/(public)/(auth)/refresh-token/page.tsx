'use client'
import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'
function RefreshToken() {

    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenFromURL = searchParams.get('refreshToken')
    const redirectPathname = searchParams.get('redirect')

    useEffect(() => {
        if (getRefreshTokenFromLocalStorage()) {

            checkAndRefreshToken({
                onError: () => {
                    console.log("error ")
                },
                onSuccess: () => {
                    console.log("aasdasdsad", redirectPathname)
                    router.push(redirectPathname || '/')
                }
            })
        } else {
            router.push('/')
        }


    }, [router, refreshTokenFromURL])

    return (
        <div>RefreshToken loading ..........</div>
    )
}
const RefreshTokenPage = () => {
    
    return <Suspense>
        <RefreshToken />
    </Suspense>
}
export default RefreshTokenPage



