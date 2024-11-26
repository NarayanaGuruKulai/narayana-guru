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
          ಬುಕಿಂಗ್ ಸೇರಿಸಿ
        </button>
      </div>

      {hallBookings && hallBookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white">
              <tr>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                ಬುಕಿಂಗ್ ದಿನಾಂಕ
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                ಬುಕಿಂಗ್ ಪ್ರಕಾರ
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                ಬುಕಿಂಗ್ ನೋಟ್ 
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                ಸಮಯದಿಂದ
                </th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                ಸಮಯವರಗೆ
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
                    {entry.BookingType === 'marriagereceptionengagement' ? 'ಮದುವೆ/ಆರತಕ್ಷತೆ/ನಿಶ್ಚಿತಾರ್ಥ' :
                    entry.BookingType === 'lastrites' ? 'ಉತ್ತರಕ್ರಿಯೆ' :
                    entry.BookingType === 'other' ? 'ಇತರ' : ''}
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
        <div>ಯಾವುದೇ ಹಾಲ್ ಬುಕಿಂಗ್ ಕಂಡುಬಂದಿಲ್ಲ</div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">ಹಾಲ್ ಬುಕಿಂಗ್ ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-10 right-10 text-white text-xl">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-white text-left">ಬುಕಿಂಗ್ ದಿನಾಂಕ:</label>
              <input
                type="date"
                name="BookingDate"
                value={BookingDate}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-white text-left">ಬುಕಿಂಗ್ ಪ್ರಕಾರ:</label>
              <select
                name="BookingType"
                value={BookingType}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="marriagereceptionengagement">ಮದುವೆ/ಆರತಕ್ಷತೆ/ನಿಶ್ಚಿತಾರ್ಥ</option>
                <option value="lastrites">ಉತ್ತರಕ್ರಿಯೆ</option>
                <option value="other">ಇತರ</option>
              </select>

              <label className="block mb-2 text-white text-left">ಬುಕಿಂಗ್ ನೋಟ್:</label>
              <input
                type="text"
                name="BookingNote"
                value={BookingNote}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-white text-left">ಸಮಯದಿಂದ:</label>
              <input
                type="time"
                name="FromTime"
                value={FromTime}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-white text-left">ಸಮಯವರಗೆ:</label>
              <input
                type="time"
                name="ToTime"
                value={ToTime}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <button type="submit" className="w-full bg-blue-600 text-white p-2 my-2 rounded ">
              ಸಮರ್ಪಿಸಿ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallBooking;
