import React, { useState } from 'react';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';

const Memberships: React.FC = () => {
  const addMember = api.memberships.addMember.useMutation();
  const { data: members, isLoading: membersLoading, isError: membersError, refetch } = api.memberships.getAllMembers.useQuery();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newImage, setNewImage] = useState<string>('');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'ajeeva' | 'poshaka' | 'mrutha'>('ajeeva'); // Default type set to 'ajeeva'
  const [receiptNo, setReceiptNo] = useState<number>(1); // Default receipt number set to 1

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!name || !receiptNo || !type || !address || !date) {
      toast.error('Please fill in all the required fields.', toastStyle);
      return;
    }

    // Image is optional but should be uploaded if selected
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
        photo: uploadUrl || '',  // Default empty if no image
        receiptNo,
      });

      console.log('Member added:', result);
      setIsPopupOpen(false);
      setUploadUrl('');
      setNewImage('');
      setName('');
      setAddress('');
      setDate('');
      setReceiptNo(1); // Reset receipt number to default
      void refetch();
      toast.success('Member Added');
    } catch{
      toast.error('Member Not Added', toastStyle);
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಸದಸ್ಯತ್ವ ನಿರ್ವಹಣೆ</h2>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={handleAddEventClick}
          className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 bg-black font-BebasNeue"
        >          
          ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ
        </button>
      </div>

      {membersLoading ? (
        <div>
          ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
      ) : membersError ? (
        <div>ಸದಸ್ಯರನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white">
              <tr className='hover:bg-gray-50 hover:text-black'>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಫೋಟೋ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಹೆಸರು</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ವಿಳಾಸ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ದಿನಾಂಕ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ಸದಸ್ಯತ್ವ ಪ್ರಕಾರ</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">ರಶೀದಿ ಸಂಖ್ಯೆ</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                    <Image src={member.photo} alt={member.name} width={32} height={32} className="h-32 w-32 object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.name}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.address}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.date}</td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {member.type === 'ajeeva' ? 'ಅಜೀವ' :
                    member.type === 'poshaka' ? 'ಪೋಷಕ' :
                    member.type === 'mrutha' ? 'ಮೃತ' : ''}
                  </td>

                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.receiptNo}</td>
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
            <button onClick={handlePopupClose} className="absolute top-6 right-6 text-white p-5">
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
                <option value="ajeeva">ಅಜೀವ </option>
                <option value="poshaka">ಪೋಷಕ </option>
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

              <label className="block mt-5 mb-2 text-white text-left">ಸದಸ್ಯರ ಫೋಟೋ</label>
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />

              <button type="submit"  className="w-full bg-blue-600 text-white p-2 my-2 rounded ">
              ಸಮರ್ಪಿಸಿ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memberships;
