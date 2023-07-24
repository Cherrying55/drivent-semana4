import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import { createBookingbyRoomById, getBookingbyUserId, updatebyroomanduser } from '@/services/booking.service';


export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { userId } = req;
      const booking = await getBookingbyUserId(userId);
      if(!booking){
        return res.sendStatus(httpStatus.NOT_FOUND)
      }
      return res.status(httpStatus.OK).send({
        id: booking.id,
        Room: booking.Room,
      });
    } catch (e) {
      if(e.message === "403"){
        return res.sendStatus(403)
      }
      else if(e.message === "404"){
        return res.sendStatus(404)
      }
      else{
        return res.sendStatus(500)
      }
    }
  }

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req;
      const { roomId } = req.body as Record<string, number>;
  
      const booking = await createBookingbyRoomById(roomId, userId);

      if(!booking){
        return res.sendStatus(404)
      }
  
      return res.status(httpStatus.OK).send({
        bookingId: booking.id,
      });
    } catch (e) {
      if(e.message === "403"){
        return res.sendStatus(403)
      }
      else if(e.message === "404"){
        return res.sendStatus(404)
      }
      else{
        return res.sendStatus(500)
      }
    }
  }

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const bookingId = Number(req.params.bookingId);
  
    try {
        if (!bookingId){
            
        };
      const { roomId } = req.body as Record<string, number>;
      const booking = await updatebyroomanduser(userId, roomId);
  
      return res.status(httpStatus.OK).send({
        bookingId: booking.id,
      });
    } catch (e) {
      if(e.message === "403"){
        return res.sendStatus(403)
      }
      else if(e.message === "404"){
        return res.sendStatus(404)
      }
      else{
        return res.sendStatus(500)
      }
    }
  }