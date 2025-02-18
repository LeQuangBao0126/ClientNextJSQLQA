'use client'
import { checkAndRefreshToken  } from '@/lib/utils'
import { usePathname   } from 'next/navigation'
import React, { useEffect } from 'react'
 

/**
 *  Page này có chức năng interval để refresh token mới,  ko cho access token hết hạn . 
 */
const UNAUTHENTICATEPAGE = ['/login', '/logout', '/refresh-token']
const guestTable =  '/tables'
export default function RefreshTokenPage() {
    const pathname = usePathname()

    useEffect(() => {
        // những trang nào cần check thì mới cho chạy refresh token  .
        if (UNAUTHENTICATEPAGE.includes(pathname)) return  
        if (pathname.startsWith('/tables')) return 

        let interval: any = null
        // check accessToken sắp hết hạn thì gọi refresh 

        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
            }
        })
        const timeOut = 1000
        interval = setInterval(() => checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
            }
        }), timeOut)

        return () => {
            clearInterval(interval)
        }

    }, [pathname])
    // Lưu ý path name thay đổi thì sẽ gọi lại checkAndRefreshToken dẫn tới chạy ko theo thứ tự và gửi RefreshToken cũ lên . nên bị lỗi refreshtoken 
    // Xử lý : Tách promise ra . promise null thì mới gán lại cho chạy tiếp . chạy xong thì cho promise null lại 
    return (
        <div>RefreshToken</div>
    )
}
