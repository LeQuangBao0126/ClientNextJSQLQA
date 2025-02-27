'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useDishListQuery } from '@/queries/useDish'
import { formatCurrency } from '@/lib/utils'
import Quantity from './quantity'
import { useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { DishStatus } from '@/constants/type'
import cn from 'classnames'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
// fake data

export default function MenuOrder() {
    const router= useRouter()
    const dishListQuery = useDishListQuery()
    const dishes = dishListQuery.data?.payload.data ?? []
    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
    const {mutateAsync} = useGuestOrderMutation()
    const totalPrice = ( )=>{
        return dishes.reduce( ( result , dish )=>{
               const order = orders.find( o => o.dishId === dish.id)
               if(!order )return result 

               return  result+  order.quantity*  dish.price
        } ,0)
    }
    const handleQuantityChange = (dishId: number, quantity: number) => {
        setOrders((prevOrders) => {
            if (quantity === 0) {
                return prevOrders.filter(order => order.dishId !== dishId)
            }
            const index = prevOrders.findIndex(order => order.dishId === dishId)
            if (index === -1) {
                // chưa có thì add new order 
                return  [ ...prevOrders,{ dishId, quantity } ]
            } else {
                const  newOrder =  { dishId , quantity}
                prevOrders.splice(index , 1  )
                return [...prevOrders , newOrder]
            }
        })
    }   

    const handleOrder  = async ( )=>{
        await  mutateAsync( orders)
        toast({description: 'Đặt hàng thành công'})
        router.push("/guest/order")
    }
    
    return (
        < >
            {dishes.filter( d => d.status!== DishStatus.Hidden).map((dish) => (
                <div key={dish.id} className={cn('flex gap-4 ',  { 
                    'pointer-events-none' : dish.status === DishStatus.Unavailable 
                })}>
                    <div className='flex-shrink-0 relative' >
                    {
                        dish.status === DishStatus.Unavailable ?  
                        <span className='absolute top-0 right-0  font-bold   w-full h-full text-center inset-0 '>Hết hàng</span> 
                        :''
                    }
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            height={100}
                            width={100}
                            quality={100}
                            className='object-cover w-[80px] h-[80px] rounded-md'
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{dish.name}</h3>
                        <p className='text-xs'>{dish.description}</p>
                        <p className='text-xs font-semibold'>{formatCurrency(dish.price)} đ</p>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <Quantity
                            value={orders.find(x => x.dishId === dish.id )?.quantity ??  0   }
                            onChange={(value) => handleQuantityChange(dish.id, value)} />
                    </div>
                </div>
            ))}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between'
                    onClick={handleOrder}
                disabled ={orders.length ===0 }>
                    <span>Đặt hàng  {orders.length} món</span>
                    <span>{formatCurrency(totalPrice())} đ</span>
                </Button>
            </div>
        </ >
    )
}
