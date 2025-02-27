'use client'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
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
                    router.push(redirectPathname || '/')
                },
            })
        } else {
            router.push('/')
            return
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



