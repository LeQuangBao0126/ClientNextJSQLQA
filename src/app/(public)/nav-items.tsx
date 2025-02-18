'use client'

import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Role } from '@/constants/type'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const menuItems: {
    title: string,
    href: string,
    role?: RoleType[],
    hideWhenLogin?: boolean
}[] =
    [
        {
            title: 'Trang chủ',
            href: '/'
        },
        {
            title: 'Món ăn',
            href: '/guest/menu',
            role: [Role.Guest]
        },
        {
            title: 'Đăng nhập',
            href: '/login',
            hideWhenLogin: true 
        },
        {
            title: 'Quản lý',
            href: '/manage/dashboard',
            role: [Role.Owner, Role.Employee]
        }
    ]

export default function NavItems({ className }: { className?: string }) {
    const { role, setRole } = useAppContext()
    const logoutMutation = useLogoutMutation()
    const router = useRouter()

    const logout = async () => {
        if (logoutMutation.isPending) return
        try {
            await logoutMutation.mutateAsync()
            setRole(undefined)
            router.push('/')
        } catch (error) {
        }
    }   
   
    return (<>
        {menuItems.map((item) => {
            const isAuth = item.role && role && item.role.includes(role)
            const canShow = (item.role === undefined && !item.hideWhenLogin ) || (!role && item.hideWhenLogin)
            if (isAuth || canShow) {
                return (
                    <Link href={item.href} key={item.href} className={className}>
                        {item.title}
                    </Link>
                )
            } 
            return null
        })}
        {
            role && <div className='inline-block text-muted-foreground transition-colors hover:text-foreground flex-shrink-0 cursor-pointer' onClick={logout}>
                Đăng Xuất
            </div>
        }
    </>

    )

}
