import { notFoundError, cannotBookError } from "@/errors";
import roomRepository from "@/repositories/room-repository";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number) {
    const booking = await bookingRepository.findBookingByUserId(userId);
    if(!booking) throw notFoundError();
    return booking;
}

async function isEnrollmentTicketValid(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment) throw cannotBookError();

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket) throw notFoundError();

    if(ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotBookError();
    };
}

async function isBookingValid(roomId: number) {
    const room = await roomRepository.findRoomsById(roomId);
    const booking = await bookingRepository.findBookingByRoomId(roomId);
    if(!room) throw notFoundError();

    if(room.capacity <= booking.length) {
        throw cannotBookError();
    };
}

async function createBookingById(userId: number, roomId: number) {
    await isEnrollmentTicketValid(userId);
    await isBookingValid(roomId);

    return bookingRepository.createBooking({ roomId, userId });
}

async function updateBookingByRoomId(userId: number, roomId: number) {
    await isBookingValid(roomId);
    const booking = await bookingRepository.findBookingByUserId(userId);
    if(!booking || booking.userId !== userId) throw cannotBookError();

    return bookingRepository.updateBooking({
        id: booking.id,
        roomId,
        userId
    });
}

const bookingService = {
    getBooking,
    createBookingById,
    updateBookingByRoomId
}

export default bookingService;