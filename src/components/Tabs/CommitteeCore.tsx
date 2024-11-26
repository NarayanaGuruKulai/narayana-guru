import React, { useState } from 'react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';

const CommitteeCore: React.FC = () => {
  const addCommitteeCore = api.committee.addCommitteeCore.useMutation();
  const { data: committeeCore, isLoading: committeeCoreLoading, isError: committeeCoreError, refetch } = api.committee.getAllCommitteeCore.useQuery();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [post, setPost] = useState('');
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

    if (!post || !name) {
      toast.error('Please fill in all fields.', toastStyle);
      return;
    }

    try {
      const result = await addCommitteeCore.mutateAsync({ Post: post, Name: name });
      console.log('Committee Core added:', result);
      setIsPopupOpen(false);
      setPost('');
      setName('');
      void refetch();
      toast.success('Committee Core Added');
    } catch {
      toast.error('Error adding Committee Core', toastStyle);
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center w-full text-2xl text-bold mb-8 py-5 text-center">ಮುಖ್ಯ ಸಮಿತಿ ನಿರ್ವಹಣೆ</h2>

      <div className="mb-4 flex gap-2 flex-wrap justify-center">
        <button onClick={handleAddClick} className="p-2 border border-slate-700 rounded-xl w-52 text-white h-12 bg-black font-BebasNeue">
        ಮುಖ್ಯ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ
        </button>
      </div>

      {committeeCoreLoading ? (
        <div>ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
      ) : committeeCoreError ? (
        <div>ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white">
              <tr>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಪದನಾಮ</th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಹೆಸರು</th>
              </tr>
            </thead>
            <tbody>
              {committeeCore?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center">{item.Post}</td>
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
            <h2 className="text-xl font-bold text-white mb-4">ಮುಖ್ಯ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-6 right-6 text-white p-5">&times;</button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">ಪದನಾಮ:</label>
              <input 
                type="text" 
                value={post} 
                onChange={(e) => setPost(e.target.value)} 
                className="block w-full mb-4 p-2 rounded-md"
                required
              />
              <label className="block mt-5 mb-2 text-white text-left">ಹೆಸರು:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="block w-full mb-4 p-2 rounded-md"
                required
              />
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

export default CommitteeCore;
