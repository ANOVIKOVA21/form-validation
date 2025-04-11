'use client';
import styles from './BookingForm.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookingSchema, BookingFormData } from '../../schemas/bookingSchema';
import { useEffect, useState } from 'react';
import ErrorMessage from '../ErrorMessage';

export default function BookingForm() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [BookingSchema, setBookingSchema] = useState(createBookingSchema(timeSlots));
  useEffect(() => {
    async function getTimeSlots() {
      const jsonData = await fetch('/api/time-slots');
      const time = await jsonData.json();
      setTimeSlots(time);
      setBookingSchema(createBookingSchema(time));
    }
    getTimeSlots();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
    mode: 'onBlur',
  });

  function showMessage() {
    alert('Booking successful!');
  }
  const {
    bookerName,
    bookerEmail,
    eventName,
    eventDate,
    numberOfGuests,
    timeSlot,
    eventLink,
  } = errors;

  return (
    <form className={styles.form} onSubmit={handleSubmit(showMessage)}>
      <div className={styles.inputGroup}>
        <label htmlFor="bookerName" className={styles.label}>
          Booker Name
        </label>
        <input id="bookerName" className={styles.input} {...register('bookerName')} />
        <ErrorMessage message={bookerName?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="bookerEmail" className={styles.label}>
          Booker Email
        </label>
        <input
          id="bookerEmail"
          type="email"
          className={styles.input}
          {...register('bookerEmail')}
        />
        <ErrorMessage message={bookerEmail?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventName" className={styles.label}>
          Event Name
        </label>
        <input id="eventName" className={styles.input} {...register('eventName')} />
        <ErrorMessage message={eventName?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventDate" className={styles.label}>
          Event Date
        </label>
        <input
          id="eventDate"
          className={styles.input}
          type="date"
          {...register('eventDate', { valueAsDate: true })}
        />
        <ErrorMessage message={eventDate?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="numberOfGuests" className={styles.label}>
          Number of Guests
        </label>
        <input
          id="numberOfGuests"
          className={styles.input}
          {...register('numberOfGuests', { valueAsNumber: true })}
        />
        <ErrorMessage message={numberOfGuests?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="timeSlot" className={styles.label}>
          Time Slot
        </label>
        <select id="timeSlot" className={styles.input} {...register('timeSlot')}>
          <option value="">Select a time slot</option>
          {timeSlots.map((time, i) => (
            <option key={i} value={time}>
              {time}
            </option>
          ))}
        </select>
        <ErrorMessage message={timeSlot?.message} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventLink" className={styles.label}>
          Event Link (Online)
        </label>
        <input
          id="eventLink"
          className={styles.input}
          type="url"
          {...register('eventLink')}
        />
        <ErrorMessage message={eventLink?.message} />
      </div>

      <button className={styles.button} type="submit">
        Book Event
      </button>
    </form>
  );
}
