import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBookingByRoomId(roomId: number) {
    return prisma.booking.findMany({
        where: {
            roomId
        },
        include: {
            Room: true
        }
    });
}

async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId
        }, 
        include: {
            Room: true
        }
    });
}

async function createBooking({roomId, userId}: CreateBooking): Promise<Booking> {
    return prisma.booking.create({
        data: {
            roomId,
            userId
        }
    });
}

async function updateBooking({ id, roomId, userId}: UpdateBooking) {
    return prisma.booking.upsert({
        where: {
            id
        },
        create: {
            roomId,
            userId
        },
        update: {
            roomId
        }
    });
}

type CreateBooking = Omit<Booking, "id" | "createdAt" | "updatedAt">;
type UpdateBooking =  Omit<Booking, "createdAt" | "updatedAt">;

const bookingRepository = {
    findBookingByRoomId,
    findBookingByUserId,
    createBooking,
    updateBooking
}

export default bookingRepository;