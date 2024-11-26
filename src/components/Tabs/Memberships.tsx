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
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Members Management</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={handleAddEventClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black font-BebasNeue"
        >
          Add Member
        </button>
      </div>

      {membersLoading ? (
        <div>Loading...</div>
      ) : membersError ? (
        <div>Error loading members. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Photo</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Name</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Address</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Date</th>
                <th className="text-black border border-gr py-2 px-4 border-b border-slate-700 text-center">Type</th>
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
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{member.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Add Member</h2>
            <button onClick={handlePopupClose} className="absolute top-6 right-6 text-white p-5">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
            <label className="block mt-5 mb-2 text-white text-left">Profile Photo:</label>
              <label className="block mt-5 mb-2 text-white text-left">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-xl text-black"
                required
              />

              <label className="block mt-5 mb-2 text-white text-left">Address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded-xl text-black"
                required
              />

              <label className="block mt-5 mb-2 text-white text-left">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-xl text-black"
                required
              />

              <label className="block mt-5 mb-2 text-white text-left">Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'ajeeva' | 'poshaka' | 'mrutha')}
                className="w-full p-2 rounded-xl text-black"
                required
              >
                <option value="ajeeva">Ajeeva</option>
                <option value="poshaka">Poshaka</option>
                <option value="mrutha">Mrutha</option>
              </select>

              <label className="block mt-5 mb-2 text-white text-left">Receipt Number:</label>
              <input
                type="number"
                value={receiptNo}
                onChange={(e) => setReceiptNo(Number(e.target.value))}
                className="w-full p-2 rounded-xl text-black"
                required
              />

              <label className="block mt-5 mb-2 text-white text-left">Capture (Optional):</label>
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />

              <button type="submit" className="p-2 bg-white text-black rounded-xl w-full mt-10">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memberships;
