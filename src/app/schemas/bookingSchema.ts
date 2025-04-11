import { z } from 'zod';

export const createBookingSchema = (availableTimeSlots: string[]) =>
  z.object({
    bookerName: z
      .string()
      .min(2, { message: 'Booker name must be at least 2 characters long' }),
    bookerEmail: z.union([
      z.string().email({ message: 'Invalid email address' }),
      z.literal(''),
    ]),
    eventName: z
      .string()
      .min(2, { message: 'Event name must be at least 2 characters long' }),
    eventDate: z.date().min(new Date(), { message: 'Event date must be in the future' }),
    numberOfGuests: z
      .number({ message: 'Number of Guests must be integer' })
      .min(1, { message: 'Number of Guests must be at least 1' })
      .max(10, { message: 'Number must be less than or equal to 10' })
      .int({ message: 'Number of Guests must be integer' }),
    timeSlot: z.string().refine((value) => availableTimeSlots.includes(value), {
      message: 'Selected time slot is unavailable',
    }),
    eventLink: z
      .string()
      .url({ message: 'Invalid URL. Please enter a valid event link' }),
  });

export type BookingFormData = z.infer<ReturnType<typeof createBookingSchema>>;
