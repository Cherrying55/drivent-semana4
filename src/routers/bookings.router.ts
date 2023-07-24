import { createBooking, getBooking, updateBooking } from "@/controllers/bookings-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingrouter = Router();


bookingrouter.get("/booking", authenticateToken, getBooking)
bookingrouter.post("/booking", authenticateToken, createBooking)
bookingrouter.put("/booking/:bookingId", authenticateToken, updateBooking)

export default bookingrouter