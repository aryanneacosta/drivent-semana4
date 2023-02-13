import app, { init } from "@/app";
import { prisma } from "@/config";
import supertest from "supertest";
import httpStatus from "http-status";
import e from "express";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";
import {
    createEnrollmentWithAddress,
    createUser,
    createTicketType,
    createPayment,
    createTicketTypeWithHotel,
    createTicket,
    createHotel,
    createRoomWithHotelId,
    createBooking,
} from "../factories";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userCreated = await createUser();
        const token = jwt.sign({
            userId: userCreated.id 
        }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when user does not have booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 when user has a booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking({
                userId: user.id,
                roomId: room.id
            });

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                },
            });
        });
    });
});

function createValidBody() {
    return {
        "roomId": 1
    };
}

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const validBody = createValidBody();

        const response = await server.post('/booking').send(validBody);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const validBody = createValidBody();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userCreated = await createUser();
        const token = jwt.sign({
            userId: userCreated.id 
        }, process.env.JWT_SECRET);
        const validBody = createValidBody();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
})