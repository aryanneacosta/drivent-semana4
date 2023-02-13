import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listBooking, roomBooking, changeBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('', listBooking)
    .post('', roomBooking)
    .put('/:bookingId', changeBooking);

export { bookingRouter };