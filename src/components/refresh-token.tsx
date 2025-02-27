'use client'
import { checkAndRefreshToken  } from '@/lib/utils'
import { usePathname   } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

/**
 *  Page này có chức năng interval để refresh token mới,  ko cho access token hết hạn . 
 */
const UNAUTHENTICATEPAGE = ['/login', '/logout', '/refresh-token']
 let interval: any = null
export default function RefreshTokenPage() {
    const ref = useRef<any>(null)
    const pathname = usePathname()
    useEffect(() => {
        // những trang nào cần check thì mới cho chạy refresh token  .
        if (UNAUTHENTICATEPAGE.includes(pathname)) return  
        // check accessToken sắp hết hạn thì gọi refresh 
            checkAndRefreshToken()
            const timeOut = 1500
            
            if(interval) {
                return 
            } 

            interval = setInterval( ()=>{ 
                checkAndRefreshToken({
                   onError: () => {
                       clearInterval(interval)
                   },
               }) 
            } ,timeOut )
 
        return () => {
            clearInterval( interval )
        }

    }, [pathname])
    // Lưu ý path name thay đổi thì sẽ gọi lại checkAndRefreshToken dẫn tới chạy ko theo thứ tự và gửi RefreshToken cũ lên . nên bị lỗi refreshtoken 
    // Xử lý : Tách promise ra . promise null thì mới gán lại cho chạy tiếp . chạy xong thì cho promise null lại 
    return (
        <div>RefreshToken</div>
    )
}
