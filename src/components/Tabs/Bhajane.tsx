import React, { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
const Bhajane: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [limit, setLimit] = useState(10); // Initial limit for entries
  const  deleteBhajane = api.bhajane.deleteBhajane.useMutation();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedBhajaneId, setSelectedBhajaneId] = useState<number | null>(null);
  const addBhajane = api.bhajane.addBhajane.useMutation();
  const { data: bhajane, refetch } = api.bhajane.getAllBhajane.useQuery({
    limit,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setLimit((prev) => prev + 10); // Increase limit by 20
  };

  
  const handleDeleteClick = (id: number) => {
    setSelectedBhajaneId(id);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBhajaneId) return;

    try {
      await deleteBhajane.mutateAsync({ id: selectedBhajaneId });
      toast.success('Bhajane deleted successfully', toastStyle);
      setSelectedBhajaneId(null);
      setIsDeletePopupOpen(false);
      void refetch();
    } catch {
      toast.error('Failed to delete the entry', toastStyle);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Ensure that `name` is never undefined or null
  const validName = name ?? ""; // Fallback to an empty string if `name` is undefined or null
  const validDate = date ?? ""; // Fallback to an empty string if `date` is undefined or null

  if (!validName.trim() || !validDate) {
    toast.error("Please fill in all the required fields.", toastStyle);
    return;
  }

  // Regular expression to split input by the numbering pattern (e.g., "1.", "2.", etc.)
  const nameEntries = validName
    .split(/\d+\./) // Split by one or more digits followed by a period
    .map((entry) => entry.trim()) // Trim whitespace from each entry
    .filter((entry) => entry.length > 0); // Remove any empty entries

  if (nameEntries.length === 0) {
    toast.error("Please enter valid names.", toastStyle);
    return;
  }
  setIsSubmitting(true);
  try {
    // If multiple entries, process and upload each one
    if (nameEntries.length > 1) {
      for (const entryName of nameEntries) {
        await addBhajane.mutateAsync({
          name: entryName,
          date: validDate,
        });
      }
      toast.success("Data Processed and Uploaded", toastStyle); // Data processed (multiple names)
    } else {
      // If a single entry, upload directly
      await addBhajane.mutateAsync({
        name: nameEntries[0] ?? validName,
        date: validDate,
      });
      toast.success("Data Uploaded Directly", toastStyle); // Direct upload (single name)
    }

    console.log("Bhajane added:", nameEntries);
    handlePopupClose();
    void refetch();
  } catch {
    toast.error("Error adding Bhajane", toastStyle);
  } finally {
    setIsSubmitting(false);
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
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಅಳಿಸು</th>
              </tr>
            </thead>
            <tbody>
              {bhajane.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{entry.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{entry.date}</td>
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
        <div>ಯಾವುದೇ ಭಜನೆ ನಮೂದುಗಳು ಕಂಡುಬಂದಿಲ್ಲ</div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-6 rounded-3xl shadow-lg relative w-96">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">ಭಜನೆ ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-6 right-8 text-white text-2xl">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-white text-left">ಹೆಸರು:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 p-2 text-black border rounded"
                required
              />

              <label className="block mb-2 text-white text-left">ದಿನಾಂಕ:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mb-4 p-2 text-black border rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 my-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ಸಮರ್ಪಿಸುತ್ತಿದೆ...' : 'ಸಮರ್ಪಿಸಿ'}
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

export default Bhajane;
