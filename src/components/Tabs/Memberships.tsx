import React, { useState } from 'react';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

const Memberships: React.FC = () => {
  const addMember = api.memberships.addMember.useMutation();
  const deleteMember = api.memberships.deleteMembership.useMutation();
  const { data: members, isLoading: membersLoading, isError: membersError, refetch } = api.memberships.getAllMembers.useQuery();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null); // Updated type to string
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newImage, setNewImage] = useState<string>('');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'ajeeva' | 'poshaka' | 'mrutha'>('ajeeva');
  const [receiptNo, setReceiptNo] = useState<number>();
  const [nameSearch, setNameSearch] = useState<string>('');
  const [receiptNoSearch, setReceiptNoSearch] = useState<string>('');

  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  const handleUploadComplete = (url: string) => {
    setUploadUrl(url);
  };

  const handleAddEventClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedMemberId(id);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMemberId) return;

    try {
      await deleteMember.mutateAsync({ id: selectedMemberId });
      toast.success('Member deleted successfully', toastStyle);
      setSelectedMemberId(null);
      setIsDeletePopupOpen(false);
      void refetch();
    } catch {
      toast.error('Failed to delete the member', toastStyle);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !receiptNo || !type || !address || !date) {
      toast.error('Please fill in all the required fields.', toastStyle);
      return;
    }

    if (!uploadUrl && newImage) {
      toast.error('Select and Upload the Image', toastStyle);
      return;
    }

    try {
      const result = await addMember.mutateAsync({
        name,
        address,
        date,
        type,
        photo: uploadUrl || '',
        receiptNo,
      });

      console.log('Member added:', result);
      setIsPopupOpen(false);
      setUploadUrl('');
      setNewImage('');
      setName('');
      setAddress('');
      setDate('');
      setReceiptNo(1);
      void refetch();
      toast.success('Member Added');
    } catch {
      toast.error('Member Not Added', toastStyle);
    }
  };

  const filteredMembers = members?.filter((member) => {
    const matchesName = member.name.toLowerCase().includes(nameSearch.toLowerCase());
    const matchesReceiptNo = member.receiptNo.toString().includes(receiptNoSearch);
    return matchesName && matchesReceiptNo;
  });

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಸದಸ್ಯತ್ವ ನಿರ್ವಹಣೆ</h2>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={handleAddEventClick}
          className="p-2 border border-slate-700 rounded-full w-44 text-white h-12 bg-black font-BebasNeue"
        >
          ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ
        </button>

        <input
          type="text"
          placeholder="ಹೆಸರನ್ನು ಹುಡುಕಿ"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-full w-60 text-black"
        />

        <input
          type="text"
          placeholder="ರಶೀದಿ ಸಂಖ್ಯೆಯನ್ನು ಹುಡುಕಿ"
          value={receiptNoSearch}
          onChange={(e) => setReceiptNoSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-full w-60 text-black"
        />
      </div>

      {membersLoading ? (
        <div>ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
      ) : membersError ? (
        <div>ಸದಸ್ಯರನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white">
              <tr className="hover:bg-gray-50 hover:text-black">
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಫೋಟೋ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಹೆಸರು</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ವಿಳಾಸ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ದಿನಾಂಕ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಸದಸ್ಯತ್ವ ಪ್ರಕಾರ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ರಶೀದಿ ಸಂಖ್ಯೆ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಅಳಿಸು</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                    <Image src={member.photo} alt={member.name} width={25} height={25} className="h-28 w-28 object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-wrap">{member.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-wrap">{member.address}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.date}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {member.type === 'ajeeva' ? 'ಅಜೀವ' :
                    member.type === 'poshaka' ? 'ಪೋಷಕ' :
                    member.type === 'mrutha' ? 'ಮೃತ' : ''}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.receiptNo}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <button
                      onClick={() => handleDeleteClick(member.id)}
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
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4">ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-4 right-6 text-2xl text-white p-5">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">ಹೆಸರು:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-xl text-black"
                required
              />
              <label className="block mt-5 mb-2 text-white text-left">ವಿಳಾಸ:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded-xl text-black"
                required
              />
              <label className="block mt-5 mb-2 text-white text-left">ದಿನಾಂಕ:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-xl text-black"
                required
              />
              <label className="block mt-5 mb-2 text-white text-left">ಸದಸ್ಯತ್ವ ಪ್ರಕಾರ:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'ajeeva' | 'poshaka' | 'mrutha')}
                className="w-full p-2 rounded-xl text-black"
                required
              >
                <option value="ajeeva">ಅಜೀವ</option>
                <option value="poshaka">ಪೋಷಕ</option>
                <option value="mrutha">ಮೃತ</option>
              </select>
              <label className="block mt-5 mb-2 text-white text-left">ರಶೀದಿ ಸಂಖ್ಯೆ:</label>
              <input
                type="number"
                value={receiptNo}
                onChange={(e) => setReceiptNo(Number(e.target.value))}
                className="w-full p-2 rounded-xl text-black"
                required
              />
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />
              <button type="submit" className="mt-8 p-3 rounded-2xl text-center bg-blue-500 text-white">
                ಸೇರ್ಪಡೆ
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

export default Memberships;
