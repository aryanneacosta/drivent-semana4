import { prisma } from "@/config";

type CreateBooking = {
    roomId: number,
    userId: number
}

export function createBooking({ roomId, userId }: CreateBooking) {
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    });
}