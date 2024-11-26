import React, { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

const HallBooking: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState<{
    BookingDate: string;
    BookingType: "marriagereceptionengagement" | "lastrites" | "other";
    BookingNote: string;
    FromTime: string;
    ToTime: string;
  }>({
    BookingDate: "",
    BookingType: "marriagereceptionengagement", // Default value
    BookingNote: "",
    FromTime: "",
    ToTime: "",
  });

  const { BookingDate, BookingType, BookingNote, FromTime, ToTime } = formData;

  const addHallBooking = api.hallBooking.addHallBooking.useMutation();
  const { data: hallBookings, refetch } = api.hallBooking.getAllHallBookings.useQuery();

  const toastStyle = {
    style: {
      borderRadius: "10px",
      background: "black",
      color: "white",
    },
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setFormData({
      BookingDate: "",
      BookingType: "marriagereceptionengagement", // Default value
      BookingNote: "",
      FromTime: "",
      ToTime: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!BookingDate || !FromTime || !ToTime || !BookingNote) {
      toast.error("Please fill in all the required fields.", toastStyle);
      return;
    }

    try {
      const result = await addHallBooking.mutateAsync(formData);

      console.log("Hall booking added:", result);
      handlePopupClose();
      void refetch();
      toast.success("Hall Booking Added", toastStyle);
    } catch {
      toast.error("Error adding Hall Booking", toastStyle);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "BookingType"
          ? (value as "marriagereceptionengagement" | "lastrites" | "other") // Type assertion here
          : value,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಹಾಲ್ ಬುಕಿಂಗ್</h2>

      <div className="mb-4 flex gap-4 flex-wrap">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black font-BebasNeue"
        >
          Add Booking
        </button>
      </div>

      {hallBookings && hallBookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                  Booking Date
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                  Booking Type
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                  Booking Note
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                  From Time
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                  To Time
                </th>
              </tr>
            </thead>
            <tbody>
              {hallBookings.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {entry.BookingDate}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {entry.BookingType}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {entry.BookingNote}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {entry.FromTime}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {entry.ToTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No Hall Bookings found.</div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-white p-6 rounded-3xl shadow-lg relative w-96">
            <h2 className="text-2xl font-bold text-black mb-4 text-center">Add Hall Booking</h2>
            <button onClick={handlePopupClose} className="absolute top-3 right-3 text-black text-xl">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-black text-left">Booking Date:</label>
              <input
                type="date"
                name="BookingDate"
                value={BookingDate}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-black text-left">Booking Type:</label>
              <select
                name="BookingType"
                value={BookingType}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="marriagereceptionengagement">Marriage/Reception/Engagement</option>
                <option value="lastrites">Last Rites</option>
                <option value="other">Other</option>
              </select>

              <label className="block mb-2 text-black text-left">Booking Note:</label>
              <input
                type="text"
                name="BookingNote"
                value={BookingNote}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-black text-left">From Time:</label>
              <input
                type="time"
                name="FromTime"
                value={FromTime}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-black text-left">To Time:</label>
              <input
                type="time"
                name="ToTime"
                value={ToTime}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallBooking;
