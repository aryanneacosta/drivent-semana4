import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function listBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const booking = await bookingService.getBooking(userId);
        return res.status(httpStatus.OK).send({
            id: booking.id,
            Room: booking.Room
        });
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function roomBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const { roomId } = req.body;
        if (!roomId) {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }

        const booking = await bookingService.createBookingById(userId, Number(roomId));
        return res.sendStatus(httpStatus.OK).send({
            bookingId: booking.id
        });
    } catch (error) {
        if(error.name === "CannotBookingError") {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const { roomId } = req.body;
        if(!roomId) {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }

        const bookingId =  Number(req.params.bookingId);
        if(!bookingId) {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }

        const booking = await bookingService.updateBookingByRoomId(userId, Number(roomId));
        return res.sendStatus(httpStatus.OK).send({
            bookingId: booking.id
        });
    } catch (error) {
        if(error.name === "CannotBookingError") {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}