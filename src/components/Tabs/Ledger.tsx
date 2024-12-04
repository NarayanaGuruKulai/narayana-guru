import React, { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
const Ledger: React.FC = () => {
  const addLedger = api.ledger.addLedger.useMutation();
  const [limit, setLimit] = useState(10); 
// Fetch incoming ledger entries with dynamic limit
const { data: incomingLedger, refetch: refetchIncoming } = api.ledger.getAllLedger.useQuery({
  type: "incoming",
  limit,
});

// Fetch outgoing ledger entries with dynamic limit
const { data: outgoingLedger, refetch: refetchOutgoing } = api.ledger.getAllLedger.useQuery({
  type: "outgoing",
  limit,
});
    const  deleteLedger = api.ledger.deleteLedger.useMutation();
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null);   
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [date, setDate] = useState<string>("");

  const [transactionType, setTransactionType] = useState<"incoming" | "outgoing">("incoming");
  const [transactionHeader, setTransactionHeader] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [receiptno, setReceiptNo] = useState<number>(1);

  const toastStyle = {
    style: {
      borderRadius: "10px",
      background: "black",
      color: "white",
    },
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedLedgerId(id);
    setIsDeletePopupOpen(true);
  };

  const handleShowMore = () => {
    setLimit((prev) => prev + 10); // Increase limit by 20
  };


  const handleDeleteConfirm = async () => {
    if (!selectedLedgerId) return;
  
    try {
      await deleteLedger.mutateAsync({ id: selectedLedgerId });
      toast.success("Ledger deleted successfully", toastStyle);
      setSelectedLedgerId(null);
      setIsDeletePopupOpen(false);
      
      // Refetch the correct ledger data
      if (transactionType === "incoming") {
        void refetchIncoming(); // Refetch incoming ledger
      } else {
        void refetchOutgoing(); // Refetch outgoing ledger
      }
    } catch {
      toast.error("Failed to delete the entry", toastStyle);
    }
  };
  
  const incomingOptions = [
    "ವಿದ್ಯಾ ನಿಧಿ",
    "ಗುರುಪೂಜೆ",
    "ಸಹಾಯಧನ",
    "ವಾರ್ಷಿಕೋತ್ಸವ / ಗುರುಜಯಂತಿ / ಭಜನಾಮಂಗಲೋತ್ಸವ",
    "ಶಾಶ್ವತ ಪೂಜೆ",
    "ಇತರ ಆದಾಯ",
    "ವಿದ್ಯಾರ್ಥಿ ವೇತನ",
    "ಬ್ಯಾಂಕ್",
    "ಕಾಣಿಕೆ ಡಬ್ಬಿ",
    "ಬಡ್ಡಿ",
    "ಡಿವಿಡೆಂಡ್",
  ];

  const outgoingOptions = [
    "ಕಟ್ಟಡ ನಿರ್ವಹಣೆ",
    "ಸಿಬ್ಬಂದಿ ವೇತನ",
    "ವಿದ್ಯಾರ್ಥಿ ವೇತನ",
    "ವಿದ್ಯುತ್ ಬಿಲ್",
    "ವಿದ್ಯುತ್ ನಿರ್ವಹಣೆ",
    "ಶುಚಿತ್ವ / ಕೂಲಿ",
    "ಸಹಾಯಧನ/ಜಾಹಿರಾತು",
    "ಪೀಠೋಪಕರಣ / ಖರೀದಿ / ಇತ್ಯಾದಿ ವಸ್ತು ಖರೀದಿ",
    "ಮುದ್ರಣ/ಜೆರಾಕ್ಸ್ / ಟಪಾಲು / ಸ್ಟೇಷನರಿ",
    "ದಿನಪತ್ರಿಕೆ / ಬಿಲ್",
    "ಜನರೇಟರ್ ನಿರ್ವಹಣೆ",
    "ಅಭಿನಂದನೆ / ಗೌರವ ಪುರಸ್ಕಾರ",
    "ಲೆಕ್ಕ ಪರಿಶೋಧಕರ ವೆಚ್ಚು",
    "ಪೂಜಾ ಸಾಮಗ್ರಿ",
    "ವಾರ್ಷಿಕೋತ್ಸವ ಹಾಗು ಇನಿತ ಕಾರ್ಯಕ್ರಮ ಖರ್ಚು",
    "ಕಟ್ಟಡ ತೆರಿಗೆ",
    "ಮಹಾಸಭೆ ಖರ್ಚು",
    "ಇತರ ಖರ್ಚು",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await addLedger.mutateAsync({
        date,
        TransactionType: transactionType,
        TransactionHeader: transactionHeader,
        Amount: amount,
        ReceiptNumber: receiptno,
      });

      console.log("Ledger entry added:", result);
      setIsPopupOpen(false);
      setDate("");
      setTransactionType("incoming");
      setTransactionHeader("");
      setAmount(0);
      setReceiptNo(1);
      void refetchIncoming();
      void refetchOutgoing();
      toast.success("Ledger entry added successfully", toastStyle);
    } catch {
      toast.error("Error adding ledger entry", toastStyle);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಲೆಡ್ಜರ್ ನಿರ್ವಹಣೆ</h2>

      <button
        onClick={() => setIsPopupOpen(true)}
       className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 mb-5 bg-black font-BebasNeue"
      >
        ಲೆಡ್ಜರ್ ಎಂಟ್ರಿ ಸೇರಿಸಿ
      </button>
      <button
          onClick={handleShowMore}
          className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 bg-black font-BebasNeue"
        >
          ಹೆಚ್ಚು ತೋರಿಸು
        </button>

      <div className="flex md:flex-row flex-col gap-4">
        {/* Incoming Table */}
        <div className="flex-1">
          <h2 className="text-center text-lg font-semibold mb-4">ಆದಾಯ</h2>
          <table className="w-3/4 border-collapse border border-gray-300">
            <thead className="bg-white w-3/4">
              <tr>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-sm text-center">ಆದಾಯ ಬಗ್ಗೆ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-sm text-center">ರಶೀದಿ ಸಂಖ್ಯೆ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-sm text-center">ದಿ.</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-sm text-center">ಮೊತ್ತ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-sm text-center"><MdDelete /></th>
              </tr>
            </thead>
            <tbody>
              {incomingLedger?.map((entry) => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 p-2">{entry.TransactionHeader}</td>
                  <td className="border border-gray-300 p-2">{entry.ReceiptNumber}</td>
                  <td className="border border-gray-300 p-2">{entry.date}</td>
                  <td className="border border-gray-300 p-2">{entry.Amount}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDeleteClick(entry.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Outgoing Table */}
        <div className="flex-1">
          <h2 className="text-center text-lg font-semibold mb-4">ವೆಚ್ಚ</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-white">
              <tr>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ವೆಚ್ಚ ಬಗ್ಗೆ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ರಶೀದಿ ಸಂಖ್ಯೆ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ದಿ.</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಮೊತ್ತ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center"><MdDelete /></th>
              </tr>
            </thead>
            <tbody>
              {outgoingLedger?.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="border border-gray-300 p-2">{entry.TransactionHeader}</td>
                  <td className="border border-gray-300 p-2">{entry.ReceiptNumber}</td>
                  <td className="border border-gray-300 p-2">{entry.date}</td>
                  <td className="border border-gray-300 p-2">{entry.Amount}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDeleteClick(entry.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Ledger Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-xl font-semibold mb-4">ಲೆಡ್ಜರ್ ಎಂಟ್ರಿ ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-4 right-6 text-2xl text-white p-5">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-left">ದಿನಾಂಕ:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mb-4 p-2 border rounded text-black"
                required
              />
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as "incoming" | "outgoing")}
                className="w-full mb-4 p-2 border roundedtext-black text-black"
                required
              >
                <option value="incoming">ಆದಾಯ</option>
                <option value="outgoing">ವೆಚ್ಚ</option>
              </select>
              <select
                value={transactionHeader}
                onChange={(e) => setTransactionHeader(e.target.value)}
                className="w-full mb-4 p-2 border rounded text-black"
                required
              >
                {(transactionType === "incoming" ? incomingOptions : outgoingOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="block mb-2 text-left">
              ರಶೀದಿ ಸಂಖ್ಯೆ:</label>
              <input
                type="number"
                value={receiptno}
                onChange={(e) => setReceiptNo(Number(e.target.value))}
                className="w-full mb-4 p-2 border rounded text-black"
                required
              />

              <label className="block mb-2 text-left">ಮೊತ್ತ:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mb-4 p-2 border rounded text-black"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded "
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

export default Ledger;
