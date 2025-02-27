'use client'
import Image from 'next/image'
import { formatCurrency, getAccessTokenFromLocalStorage, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'
import socket from '@/lib/socket'
import { UpdateOrderResType } from '@/schemaValidations/order.schema'

export default function OrderCart() {
    const { data, refetch } = useGuestGetOrderListQuery()
    const orders = data?.payload.data ?? []
    
    return (
        <>
            {
                orders.length === 0 && <h1>Chưa có món hàng nào</h1>
            }
            {orders.map((order) => (
                <div key={order.id} className={'flex gap-4 '}>
                    <div className='flex-shrink-0 relative' >

                        <Image
                            src={order.dishSnapshot.image}
                            alt={order.dishSnapshot.name}
                            height={100}
                            width={100}
                            quality={100}
                            className='object-cover w-[80px] h-[80px] rounded-md'
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
                        <p className='text-xs'>{order.dishSnapshot.description}</p>
                        <p className='text-xs font-semibold'>{formatCurrency(order.dishSnapshot.price)} đ</p>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <Badge> x {order.quantity} </Badge>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <Badge>  Trạng thái : {getVietnameseOrderStatus(order.status)} </Badge>
                    </div>
                </div>
            ))}
        </>

    )
}
