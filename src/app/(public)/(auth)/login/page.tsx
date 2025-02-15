import LoginForm from '@/app/(public)/(auth)/login/login-form'
import { Suspense } from 'react'

export default function Login() {
    return (
        <Suspense>
            <div className='min-h-screen flex items-center justify-center'>
                <LoginForm />
            </div>
        </Suspense>

    )
}
