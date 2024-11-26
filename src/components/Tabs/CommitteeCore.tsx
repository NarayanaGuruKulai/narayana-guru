import React, { useState } from 'react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';

const CommitteeCore: React.FC = () => {
  const addCommitteeCore = api.committee.addCommitteeCore.useMutation();
  const updateCommitteeCore = api.committee.updateCommitteeCore.useMutation();
  const { data: committeeCore, isLoading: committeeCoreLoading, isError: committeeCoreError, refetch } = api.committee.getAllCommitteeCore.useQuery();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [post, setPost] = useState('');
  const [name, setName] = useState('');
  const [currentId, setCurrentId] = useState<number | null>(null);

  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
    setIsEditMode(false); // Reset to add mode
    setPost('');
    setName('');
    setCurrentId(null);
  };

  const handleRowDoubleClick = (id: number, post: string, name: string) => {
    setIsPopupOpen(true);
    setIsEditMode(true);
    setPost(post);
    setName(name);
    setCurrentId(id);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    setPost('');
    setName('');
    setCurrentId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post || !name) {
      toast.error('Please fill in all fields.', toastStyle);
      return;
    }

    try {
      if (isEditMode && currentId !== null) {
        // Update existing committee core
        const result = await updateCommitteeCore.mutateAsync({ id: currentId, Post: post, Name: name });
        console.log('Committee Core updated:', result);
        toast.success('Committee Core Updated');
      } else {
        // Add new committee core
        const result = await addCommitteeCore.mutateAsync({ Post: post, Name: name });
        console.log('Committee Core added:', result);
        toast.success('Committee Core Added');
      }

      setIsPopupOpen(false);
      setPost('');
      setName('');
      void refetch();
    } catch {
      toast.error('Error saving Committee Core', toastStyle);
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
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 hover:text-black"
                  onDoubleClick={() => handleRowDoubleClick(item.id, item.Post, item.Name)}
                >
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
            <h2 className="text-xl font-bold text-white mb-4">
              {isEditMode ? 'ಮುಖ್ಯ ಸದಸ್ಯರನ್ನು ಬದಲಿಸಿ' : 'ಮುಖ್ಯ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ'}
            </h2>
            <button onClick={handlePopupClose} className="absolute top-4 right-6 text-2xl text-white p-5">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">ಪದನಾಮ:</label>
              <input
                type="text"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="block w-full mb-4 p-2 rounded-md text-black"
                required
              />
              <label className="block mt-5 mb-2 text-white text-left">ಹೆಸರು:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full mb-4 p-2 rounded-md text-black"
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white p-2 my-2 rounded">
                {isEditMode ? 'ಅಪ್‌ಡೇಟ್' : 'ಸಮರ್ಪಿಸಿ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeCore;
