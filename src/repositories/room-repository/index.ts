import { prisma } from "@/config";

async function findRoomsByHotelId(hotelId: number) {
    return prisma.room.findMany({
        where: {
            hotelId
        }
    });
}

async function findRoomsById(roomId: number) {
    return prisma.room.findFirst({
        where: {
            id: roomId
        }
    });
}

const roomRepository = {
    findRoomsByHotelId,
    findRoomsById
};

export default roomRepository;