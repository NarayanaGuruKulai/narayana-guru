import React, { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

const Bhajane: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [limit, setLimit] = useState(20); // Initial limit for entries

  const addBhajane = api.bhajane.addBhajane.useMutation();
  const { data: bhajane, refetch } = api.bhajane.getAllBhajane.useQuery({
    limit,
  });

  const toastStyle = {
    style: {
      borderRadius: "10px",
      background: "black",
      color: "white",
    },
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setName("");
    setDate("");
  };

  const handleShowMore = () => {
    setLimit((prev) => prev + 20); // Increase limit by 20
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !date) {
      toast.error("Please fill in all the required fields.", toastStyle);
      return;
    }

    try {
      const result = await addBhajane.mutateAsync({
        name,
        date,
      });

      console.log("Bhajane added:", result);
      handlePopupClose();
      void refetch();
      toast.success("Bhajane Added", toastStyle);
    } catch {
      toast.error("Error adding Bhajane", toastStyle);
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಭಜನೆ ನಿರ್ವಹಣೆ</h2>

      <div className="mb-4 flex gap-4 flex-wrap">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 bg-black font-BebasNeue"
        >
          ಭಜನೆ ಸೇರಿಸಿ
        </button>
        <button
          onClick={handleShowMore}
          className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 bg-black font-BebasNeue"
        >
          ಹೆಚ್ಚು ತೋರಿಸು
        </button>
      </div>

      {bhajane && bhajane.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white">
              <tr>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಹೆಸರು</th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ದಿನಾಂಕ</th>
              </tr>
            </thead>
            <tbody>
              {bhajane.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{entry.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>ಯಾವುದೇ ಭಜನೆ ನಮೂದುಗಳು ಕಂಡುಬಂದಿಲ್ಲ</div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-6 rounded-3xl shadow-lg relative w-96">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">ಭಜನೆ ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-6 right-8 text-white text-xl">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-white text-left">ಹೆಸರು:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2 text-white text-left">ದಿನಾಂಕ:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 my-2 rounded"
              >
                ಸಮರ್ಪಿಸಿ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bhajane;
