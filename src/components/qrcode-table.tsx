import React, { HTMLElementType, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { getTableLink } from '@/lib/utils'

export default function QRCodeTable({ token, tableNumber, width = 250 }: { token: string, tableNumber: number, width?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        canvas.width = width
        canvas.height = width + 70

        // tạo canvas thật chứa size . 
        // tạo canvas ảo chứa hình QR
        // đưa canvas ảo vào thật 

        const canvasContext = canvas.getContext("2d")!
        canvasContext.fillStyle = "white"
        canvasContext.fillRect(0, 0, canvas.width, canvas.height,)
        canvasContext.font = '20px Arial '
        canvasContext.textAlign = "center"
        canvasContext.fillStyle = 'black'
        canvasContext.fillText(`Bàn số ${tableNumber} `, canvas.width / 2, canvas.width + 20)
        canvasContext.fillText(`Quét mã QR để đặt món`, canvas.width / 2, canvas.width + 50)


        const virtualCanvas = document.createElement('canvas')
        QRCode.toCanvas(virtualCanvas, getTableLink({ token, tableNumber }), function () {
            canvasContext?.drawImage(virtualCanvas, 0, 0 , width,width)
        })

    }, [token, tableNumber])
    return (
        <canvas ref={canvasRef} />
    )
}
