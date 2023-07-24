import { Booking } from '@prisma/client';
import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotdobookingerror } from '@/errors/cannot-do-book-error';
import { ApplicationError } from '@/protocols';

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
        if(!room){throw notFoundError()}
        if (room.capacity <= bookings.length){throw cannotdobookingerror()};
        }
    else{
        //
    }
  }

  export async function validarticket(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment){
        throw cannotdobookingerror();
    }
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  
    if (!ticket ||  ticket.TicketType.isRemote ||ticket.status === 'RESERVED') {
      throw cannotdobookingerror();
    }
  }

 export async function getBookingbyUserId(userId: number) {
    const booking = await getByUserIdonDB(userId);
    if (!booking){throw notFoundError();}
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
        throw err;
    }
  
    await validarbookingconformequarto(roomId);
    const booking = await getByUserIdonDB(userId);
  
    if (!booking || booking.userId !== userId){
        throw cannotdobookingerror();
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
  