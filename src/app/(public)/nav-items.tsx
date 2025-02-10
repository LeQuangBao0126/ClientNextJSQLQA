'use client'

import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'    // authRequired undefined dang nhap hay chua cũng hiển thị
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true ,
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false  // chưa đăng nhập cũng hiển thị
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
    const [isAuth , setIsAuth] = useState(false) 
    console.log("isAuth" , isAuth)  
    useEffect(() => {
        const a = Boolean(getAccessTokenFromLocalStorage() )
        setIsAuth(a) 
    }, []) 

  return menuItems.map((item) => {
    if((item.authRequired === false &&   isAuth ) || (item.authRequired === true && !isAuth)) return null

    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
