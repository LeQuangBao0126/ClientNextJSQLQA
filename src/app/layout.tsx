import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import AppProvider from "@/components/app-provider";
 

export const metadata: Metadata = {
    title: "Nhà hàng vui vẻ",
    description: "Nơi trải nghiệm ăn uống ",
};


export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode 
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={cn('min-h-screen bg-background font-sans antialiased')}>
                <AppProvider>
                    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </AppProvider>
            </body>
        </html>
    )
}
