import React, { useState } from 'react';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

// Define a strong type for Member
type Member = {
  id: number;
  name: string;
  address: string;
  date: string;
  type: 'ajeeva' | 'poshaka' | 'mrutha';
  receiptno: number; // Ensure this is typed correctly
  photo: string;
};

const Memberships: React.FC = () => {
  const addMember = api.memberships.addMember.useMutation();
  const deleteMember = api.memberships.deleteMembership.useMutation();
  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
    refetch,
  } = api.memberships.getAllMembers.useQuery<Member[]>();
  
  
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newImage, setNewImage] = useState<string>('');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'ajeeva' | 'poshaka' | 'mrutha'>('ajeeva');
  const [receiptno, setReceiptNo] = useState<number>();
  const [nameSearch, setNameSearch] = useState<string>('');
  const [receiptNoSearch, setReceiptNoSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>(''); // New filter state

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

    if (!name || !receiptno || !type || !address || !date) {
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
        receiptno,
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

  // Filter members based on the search inputs and type filter
const filteredMembers = members?.filter((member) => {
  const nameSearchLower = nameSearch.toLowerCase();
  const matchesName = member.name?.toLowerCase().includes(nameSearchLower);
  const receiptNoStr = member.receiptno?.toString() || '';
  const matchesReceiptNo = receiptNoStr.includes(receiptNoSearch);
  const matchesType = typeFilter ? member.type === typeFilter : true;

  return matchesName && matchesReceiptNo && matchesType;
}) ?? [];
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

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-full w-44 text-black"
        >
          <option value="">ಎಲ್ಲಾ ಪ್ರಕಾರ</option>
          <option value="ajeeva">ಅಜೀವ</option>
          <option value="poshaka">ಪೋಷಕ</option>
          <option value="mrutha">ಮೃತ</option>
        </select>
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
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={25}
                      height={25}
                      className="h-28 w-28 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-wrap">{member.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center text-wrap">{member.address}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.date}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {member.type === 'ajeeva'
                      ? 'ಅಜೀವ'
                      : member.type === 'poshaka'
                      ? 'ಪೋಷಕ'
                      : member.type === 'mrutha'
                      ? 'ಮೃತ'
                      : ''}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.receiptno}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <button
                      onClick={() => handleDeleteClick(member.id)}
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
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4">ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-10 right-10 text-white text-2xl font-bold">
              &times;
            </button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="ಹೆಸರು"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-black"
              />
              <input
                type="text"
                placeholder="ವಿಳಾಸ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-black"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-black"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'ajeeva' | 'poshaka' | 'mrutha')}
                className="p-2 border border-gray-300 rounded-lg text-black"
              >
                <option value="ajeeva">ಅಜೀವ</option>
                <option value="poshaka">ಪೋಷಕ</option>
                <option value="mrutha">ಮೃತ</option>
              </select>
              <input
                type="number"
                placeholder="ರಶೀದಿ ಸಂಖ್ಯೆ"
                value={receiptno}
                onChange={(e) => setReceiptNo(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg text-black"
              />
               <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />
              <button
                type="submit"
                className="p-2 border border-gray-300 rounded-lg bg-green-500 text-white font-bold"
              >
                ಸೇರ್ ಮಾಡಿ
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
