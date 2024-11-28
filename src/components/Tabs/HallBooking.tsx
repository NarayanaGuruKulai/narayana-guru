import React, { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const HallBooking: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState<{
    BookingDate: string;
    BookingType: "marriagereceptionengagement" | "lastrites" | "other";
    BookingNote: string;
    BookingTime: "morning_to_evening" | "evening_to_night";

  }>({
    BookingDate: "",
    BookingType: "marriagereceptionengagement", // Default value
    BookingNote: "",
    BookingTime: "morning_to_evening",
  });
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedHallBookingId, setSelectedHallBookingId] = useState<number | null>(null);
  const { BookingDate, BookingType, BookingNote, BookingTime } = formData;
  const [limit, setLimit] = useState(10); 
  const  deleteHallBooking= api.hallBooking.deleteHallBooking.useMutation();
  const addHallBooking = api.hallBooking.addHallBooking.useMutation();
  const { data: hallBookings, refetch } = api.hallBooking.getAllHallBookings.useQuery({limit});

  const toastStyle = {
    style: {
      borderRadius: "10px",
      background: "black",
      color: "white",
    },
  };
  const handleDeleteClick = (id: number) => {
    setSelectedHallBookingId(id);
    setIsDeletePopupOpen(true);
  };
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setFormData({
      BookingDate: "",
      BookingType: "marriagereceptionengagement", // Default value
      BookingNote: "",
      BookingTime: "morning_to_evening",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!BookingDate || !BookingTime || !BookingNote) {
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
  const handleDeleteConfirm = async () => {
    if (!selectedHallBookingId) return;

    try {
      await deleteHallBooking.mutateAsync({ id: selectedHallBookingId });
      toast.success('Booking deleted successfully', toastStyle);
      setSelectedHallBookingId(null);
      setIsDeletePopupOpen(false);
      void refetch();
    } catch {
      toast.error('Failed to delete the entry', toastStyle);
    }
  };
  const handleShowMore = () => {
    setLimit((prev) => prev + 10); // Increase limit by 20
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "BookingType"
          ? (value as "marriagereceptionengagement" | "lastrites" | "other")
          : name === "BookingTime"
          ? (value as "morning_to_evening" | "evening_to_night")
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
        <button
          onClick={handleShowMore}
          className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 bg-black font-BebasNeue"
        >
          ಹೆಚ್ಚು ತೋರಿಸು
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
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">
                ಅಳಿಸಿ
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
                    {entry.BookingTime === 'morning_to_evening' ? 'ಬೆಳಿಗ್ಗೆಯಿಂದ ಸಂಜೆಯವರೆಗೆ' :
                    entry.BookingTime === 'evening_to_night' ? 'ಸಂಜೆಯಿಂದ ರಾತ್ರಿ' : ''}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <button
                      onClick={() => handleDeleteClick(entry.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      <MdDelete/>
                    </button>
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
            <button onClick={handlePopupClose} className="absolute top-10 right-10 text-white text-2xl">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-white text-left">ಬುಕಿಂಗ್ ದಿನಾಂಕ:</label>
              <input
                type="date"
                name="BookingDate"
                value={BookingDate}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded text-black"
                required
              />

              <label className="block mb-2 text-white text-left">ಬುಕಿಂಗ್ ಪ್ರಕಾರ:</label>
              <select
                name="BookingType"
                value={BookingType}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded text-black"
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
                className="w-full mb-4 p-2 border rounded text-black"
                required
              />

              <label className="block mb-2 text-white text-left">ಬುಕಿಂಗ್ ಸಮಯ:</label>
              <select
                name="BookingTime"
                value={BookingTime}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border rounded text-black"
              >
                <option value="morning_to_evening">
                ಬೆಳಿಗ್ಗೆಯಿಂದ ಸಂಜೆಯವರೆಗೆ</option>
                <option value="evening_to_night">ಸಂಜೆಯಿಂದ ರಾತ್ರಿ</option>
              </select>
              <button type="submit" className="w-full bg-blue-600 text-white p-2 my-2 rounded ">
              ಸಮರ್ಪಿಸಿ
              </button>
            </form>
          </div>
        </div>
      )}

{isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-6 rounded shadow-lg text-center">
            <p className="mb-4">ನೀವು ಅತಿಕ್ರಮಿಸಲು ಇಚ್ಛಿಸುತ್ತಿದ್ದೀರಾ?</p>
            <button
              onClick={handleDeleteConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              ಹೌದು
            </button>
            <button
              onClick={() => setIsDeletePopupOpen(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              ಇಲ್ಲ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallBooking;
