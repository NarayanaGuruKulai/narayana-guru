import React, { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

const Ledger: React.FC = () => {
  const addLedger = api.ledger.addLedger.useMutation();
  const { data: incomingLedger, refetch: refetchIncoming } =
    api.ledger.getAllLedger.useQuery({ type: "incoming" });
  const { data: outgoingLedger, refetch: refetchOutgoing } =
    api.ledger.getAllLedger.useQuery({ type: "outgoing" });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [transactionType, setTransactionType] = useState<"incoming" | "outgoing">("incoming");
  const [transactionHeader, setTransactionHeader] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [receiptNo, setReceiptNo] = useState<number>(1);

  const toastStyle = {
    style: {
      borderRadius: "10px",
      background: "black",
      color: "white",
    },
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
    try {
      const result = await addLedger.mutateAsync({
        date,
        TransactionType: transactionType,
        TransactionHeader: transactionHeader,
        Amount: amount,
        ReceiptNumber: receiptNo,
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
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಲೆಡ್ಜರ್ ನಿರ್ವಹಣೆ</h2>

      <button
        onClick={() => setIsPopupOpen(true)}
       className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 bg-black font-BebasNeue"
      >
        Add Ledger Entry
      </button>

      <div className="flex gap-4">
        {/* Incoming Table */}
        <div className="flex-1">
          <h2 className="text-center text-lg font-semibold mb-4">Incoming Transactions</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Transaction Header</th>
                <th className="border border-gray-300 p-2">Receipt Number</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomingLedger?.map((entry) => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 p-2">{entry.TransactionHeader}</td>
                  <td className="border border-gray-300 p-2">{entry.ReceiptNumber}</td>
                  <td className="border border-gray-300 p-2">{entry.date}</td>
                  <td className="border border-gray-300 p-2">{entry.Amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Outgoing Table */}
        <div className="flex-1">
          <h2 className="text-center text-lg font-semibold mb-4">Outgoing Transactions</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Transaction Header</th>
                <th className="border border-gray-300 p-2">Receipt Number</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {outgoingLedger?.map((entry) => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 p-2">{entry.TransactionHeader}</td>
                  <td className="border border-gray-300 p-2">{entry.ReceiptNumber}</td>
                  <td className="border border-gray-300 p-2">{entry.date}</td>
                  <td className="border border-gray-300 p-2">{entry.Amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Ledger Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add Ledger Entry</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2">Transaction Type:</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as "incoming" | "outgoing")}
                className="w-full mb-4 p-2 border rounded"
                required
              >
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>

              <label className="block mb-2">Transaction Header:</label>
              <select
                value={transactionHeader}
                onChange={(e) => setTransactionHeader(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
                required
              >
                {(transactionType === "incoming" ? incomingOptions : outgoingOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Receipt Number:</label>
              <input
                type="number"
                value={receiptNo}
                onChange={(e) => setReceiptNo(Number(e.target.value))}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <label className="block mb-2">Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mb-4 p-2 border rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ledger;
