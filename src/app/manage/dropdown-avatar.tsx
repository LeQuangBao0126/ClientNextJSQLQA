'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter } from 'next/navigation'
import { useAccountMe } from '@/queries/useAccount'
import { useAppContext } from '@/components/app-provider'


export default function DropdownAvatar() {

    const logoutMutation = useLogoutMutation()
    const router = useRouter()
    const {  setRole } = useAppContext()
    const handleLogout = async () => {
        if (logoutMutation.isPending) return
        try {
            await logoutMutation.mutateAsync()
            setRole()
            router.push('/')
        } catch (error) {
        }
    }
    let  account :  any  =null 
    const data =   useAccountMe(   )
    account = data.data?.payload.data

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
                    <Avatar>
                        <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
                        <AvatarFallback>{account?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={'/manage/setting'} className='cursor-pointer'>
                        Cài đặt
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
