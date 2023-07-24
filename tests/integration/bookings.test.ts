import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { prisma } from '@/config';
import {
    createEnrollmentWithAddress,
    createHotel,
    createPayment,
    createRoomWithHotelId,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createUser,
  } from '../factories';
  import * as jwt from 'jsonwebtoken';

  import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const server = supertest(app);

  describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })
   
})

describe("get booking válido", () => {
    it('status 200', async () => {
        const user = await createUser();
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);

        function createBooking({ roomId, userId }: any) {
            return prisma.booking.create({
              data: {
                roomId,
                userId
              },
            });
          }
  
        const booking = await createBooking({
          userId: user.id,
          roomId: room.id,
        })});

        it('404 ', async () => {
            const user = await createUser();
            const hotel = await createHotel();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });

})

describe("/post booking", () => {
    it('should respond with status 401 if no token is given', async () => {
        const valido = {
            roomId: 1,
          };
        const response = await server.post('/booking').send(valido);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const valido = {
            roomId: 1,
          };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(valido);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const valido = {
            roomId: 1,
          };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(valido);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
})

describe("/post booking com token válido", () => {
    it('staus 200', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);


        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
          roomId: room.id,
        });
  
        expect(response.status).toEqual(httpStatus.OK);
      });
})

describe("update booking", () => {

    it('should respond with status 401 if no token is given', async () => {
        const valido = {
            roomId: 1,
          };
        const response = await server.put('/booking/1').send(valido);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const valido =  {
            roomId: 1,
          };
        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(valido);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const valido = {
            roomId: 1,
          };
        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(valido);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
})

describe("/update com token válido", () => {
    it('should respond with status 200 with a valid body', async () => {
        const user = await createUser();
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const room2 = await createRoomWithHotelId(hotel.id);
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);

        function createBooking({ roomId, userId }: any) {
            return prisma.booking.create({
              data: {
                roomId,
                userId
              },
            });
          }
  
        const booking = await createBooking({
          roomId: room.id,
          userId: user.id,
        });
        
        let res = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
          roomId: room2.id,
        });
  
        expect(res.status).toEqual(httpStatus.OK);
      });

      it("404", async () => {
        const user = await createUser();
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  

        function createBooking({ roomId, userId }: any) {
            return prisma.booking.create({
              data: {
                roomId,
                userId
              },
            });
          }
  
        const booking = await createBooking({
          roomId: room.id,
          userId: user.id,
        });

        const response = await server
          .put(`/booking/${booking.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            roomId: 3.1415,
          });
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
})

//nao achei nenhum teste unitario relevante