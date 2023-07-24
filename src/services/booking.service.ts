import { Booking } from '@prisma/client';
import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotdobookingerror } from '@/errors/cannot-do-book-error';
import { ApplicationError } from '@/protocols';
import { Request, Response } from 'express';

type semid = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type paraupdate = Omit<Booking, 'createdAt' | 'updatedAt'>;

export async function getByRoomIdonDB(roomId: number) {
    const book = prisma.booking.findMany({
      where: {
        roomId,
      },
      include: {
        Room: true,
      },
    });
    return book
  }

  export async function getroomByIdoNDB(roomId: number) {
    return prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });
  }

 
export  async function getByUserIdonDB(userId: number) {
    const book = prisma.booking.findFirst({
      where: {
        userId,
      },
      include: {
        Room: true,
      },
    });
    return book;
  }

export async function createonDB({ roomId, userId }: semid){
    return prisma.booking.create({
      data: {
        roomId,
        userId,
      },
    });
  }

export  async function updateonDB({ roomId, id, userId }: paraupdate) {
    return prisma.booking.upsert({
      where: {
        id,
      },
      create: {
        userId,
        roomId
      },
      update: {
        roomId,
      },
    });
  }

  export async function validarbookingconformequarto(roomId: number) {
    const bookings = await getByRoomIdonDB(roomId);
    const room = await getroomByIdoNDB(roomId);
  
    if (!room || room.capacity <= bookings.length){ 
        if(!room){
          let err = new Error();
          err.name = "404"
          err.message = "404";
          throw err;
         }
        if (room.capacity <= bookings.length){
          let err = new Error();
          err.name = "403"
          err.message = "403";
          throw err;

        };
        }
    else{
        //
    }
  }

  export async function validarticket(userId: number) {
    let res: Response
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment){
      let err = new Error();
      err.name = "403"
      err.message = "403";
      throw err;
    }
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  
    if (!ticket ||  ticket.TicketType.isRemote ||ticket.status === 'RESERVED') {
      let err = new Error();
          err.name = "403"
          err.message = "403";
          throw err;
    }
  }

 export async function getBookingbyUserId(userId: number) {
    const booking = await getByUserIdonDB(userId);
    if (!booking){
      let err = new Error();
          err.name = "404"
          err.message = "404";
          throw err;
    }
    else{
        return booking
    }
  }

 export async function createBookingbyRoomById(roomId: number, userId: number) {
    if (!roomId){
        let err :ApplicationError;
        err = {
            name: 'BadRequestError',
            message: '404',
          };
        throw err;
    }
  
    await validarticket(userId);
    await validarbookingconformequarto(roomId);
  
    const criaçao = createonDB({ roomId, userId });

    return criaçao;
  }
  
 export async function updatebyroomanduser(userId: number, roomId: number) {

    if (!roomId){
        let err :ApplicationError;
        err = {
            name: 'BadRequestError',
            message: '404',
          };
        
    }
    else
    await validarbookingconformequarto(roomId);
    const booking = await getByUserIdonDB(userId);
  
    if (!booking || booking.userId !== userId){
      let err = new Error();
      err.name = "403"
      err.message = "403";
      throw err;
    }
    else{
    const update = updateonDB({
        id: booking.id,
        userId,
        roomId,
      })
  
    return updateonDB({
      id: booking.id,
      roomId,
      userId,
    });
}
  }
  