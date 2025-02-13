import accountAPIRequest from '@/apiRequests/account'
import DashboardMain from '@/app/manage/dashboard/dashboard-main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cookies } from 'next/headers'



export default async function Dashboard() {
  const cookiesStore = await cookies()
  const accessToken =cookiesStore.get("accessToken")?.value!
  const result = await accountAPIRequest.sMe( accessToken )

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Dashboard {result.payload.data.name}</CardTitle>
            <CardDescription>Phân tích các chỉ số</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardMain />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
