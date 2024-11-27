import React, { useState, useEffect } from 'react';
import { api } from '~/utils/api'; // Importing TRPC API utils for making calls
import Calendar from 'react-calendar'; // Importing react-calendar
import 'react-calendar/dist/Calendar.css'; // Default styling for the calendar
import { format, isSameMonth, isSameDay } from 'date-fns'; // Importing date-fns utilities

interface Booking {
  id: number;
  BookingDate: string;
  BookingType: 'marriagereceptionengagement' | 'lastrites' | 'other';
  BookingNote: string;
  FromTime: string;
  ToTime: string;
}

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

  // Use TRPC query to fetch data
  const { data: hallBookings, isLoading } = api.hallBooking.getAllHallBookingsCalendar.useQuery();

  // Effect to filter bookings for the selected month and highlight dates
  useEffect(() => {
    if (hallBookings) {
      const filteredBookings = hallBookings.filter((booking) => {
        const bookingDate = new Date(booking.BookingDate);
        return isSameMonth(bookingDate, selectedDate); // Filter bookings for the same month
      });
      setBookings(filteredBookings);

      // Highlight dates with bookings
      const datesWithBookings = hallBookings.map((booking) => new Date(booking.BookingDate));
      setHighlightedDates(datesWithBookings);
    } else {
      setBookings([]); // Fallback to an empty array if data is unavailable
      setHighlightedDates([]); // Clear highlighted dates
    }
  }, [hallBookings, selectedDate]);

  const handleDateChange = (value: Date | Date[] | null) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0] ?? new Date());
    } else if (value instanceof Date) {
      setSelectedDate(value);
    } else {
      setSelectedDate(new Date());
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto flex-col ">
      <h1 className="text-3xl font-bold my-5 text-center">
        ಹಾಲ್ ಬುಕಿಂಗ್ ಕ್ಯಾಲೆಂಡರ್
      </h1>
      <p className='text-center my-2 mb-10'>ಬುಕಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ದಿನಾಂಕದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ</p>
      <div className='flex justify-center w-full'>
        <Calendar
          onChange={(value) => handleDateChange(value as Date | Date[] | null)}
          value={selectedDate}
          className="react-calendar custom-calender shadow-md rounded-lg text-black"
          tileClassName={({ date, view }) => {
            if (view === 'month' && highlightedDates.some((d) => isSameDay(d, date))) {
              return 'react-calendar__tile--highlight';
            }
            return null;
          }}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Bookings for {format(selectedDate, 'dd/MM/yyyy')}
        </h2>
        {isLoading ? (
          <p>Loading bookings...</p>
        ) : (
          <ul>
            {bookings.filter((booking) => isSameDay(new Date(booking.BookingDate), selectedDate)).length === 0 ? (
              <p className='text-center'>ಈ ದಿನಕ್ಕೆ ಯಾವುದೇ ಬುಕಿಂಗ್ ಇಲ್ಲ / No bookings for this day.</p>
            ) : (
              bookings
                .filter((booking) => isSameDay(new Date(booking.BookingDate), selectedDate))
                .map((booking) => (
                  <li key={booking.id} className="mb-2 p-2 border rounded-lg">
                    <strong>{booking.BookingType === 'marriagereceptionengagement' ? 'ಮದುವೆ/ಆರತಕ್ಷತೆ/ನಿಶ್ಚಿತಾರ್ಥ' :
                      booking.BookingType === 'lastrites' ? 'ಉತ್ತರಕ್ರಿಯೆ' :
                      booking.BookingType === 'other' ? 'ಇತರ' : ''} ಬುಕಿಂಗ್</strong>
                    <div>{booking.BookingNote}</div>
                    <div>
                      {booking.FromTime} - {booking.ToTime}
                    </div>
                  </li>
                ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Booking;
