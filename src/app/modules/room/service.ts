import { PrismaClient, Room } from "@prisma/client"


const prisma = new PrismaClient()
const createRoom = async(payload:Room):Promise<Room>=>{
    const result = await prisma.room.create({
        data:payload,
        include:{
            building:true
        }
    })

    return result
}


export const roomService = {
    createRoom
}