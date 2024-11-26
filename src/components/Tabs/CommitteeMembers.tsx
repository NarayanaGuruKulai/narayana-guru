import React, { useState } from 'react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';

const CommitteeMembers: React.FC = () => {
  const addCommitteeMember = api.committee.addCommitteeMember.useMutation();
  const { data: committeeMembers, isLoading, isError, refetch } = api.committee.getAllCommitteeMembers.useQuery();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState('');

  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Please enter a name.', toastStyle);
      return;
    }

    try {
      const result = await addCommitteeMember.mutateAsync({ Name: name });
      console.log('Committee Member added:', result);
      setIsPopupOpen(false);
      setName('');
      void refetch();
      toast.success('Committee Member Added');
    } catch {
      toast.error('Error adding Committee Member', toastStyle);
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center"> ಸಮಿತಿ ಸದಸ್ಯರ ನಿರ್ವಹಣೆ</h2>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button onClick={handleAddClick} className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black font-BebasNeue">
          Add Member
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading committee members. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">Name</th>
              </tr>
            </thead>
            <tbody>
              {committeeMembers?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.Name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Add Committee Member</h2>
            <button onClick={handlePopupClose} className="absolute top-6 right-6 text-white p-5">&times;</button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">Name:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="block w-full mb-4 p-2 rounded-md"
                required
              />
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

export default CommitteeMembers;
