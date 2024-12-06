import React, { useState } from 'react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';
import UploadComponent from '../UploadComponent';
import Image from 'next/image';
interface CommitteeMember {
  id: number; // or number, depending on your data
  Name: string;
  photo: string;
}
const CommitteeMembers: React.FC = () => {
  const addCommitteeMember = api.committee.addCommitteeMember.useMutation();
  const updateCommitteeMember = api.committee.updateCommittee.useMutation();
  const updateCommitteeMemberWithPhoto = api.committee.updateCommitteeWithPhoto.useMutation();
  const { data: committeeMembers, isLoading, isError, refetch } = api.committee.getAllCommitteeMembers.useQuery<CommitteeMember[]>();
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState('');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };
  const handleUploadComplete = (url: string) => {
    setUploadUrl(url); // Update the URL when the image upload is complete
  };
  
  const handleRowDoubleClick = (id: number, name: string) => {
    setIsPopupOpen(true);
    setIsEditMode(true);
    setName(name);
    setPost(post);
    setCurrentId(id);
    setIsEditMode(false);
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
    setPost('');
    setName('');
    setCurrentId(null);
    setUploadUrl('');
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setName('');
    setIsEditMode(false);
    setPost('');
    setCurrentId(null);
    setUploadUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Please enter a name.', toastStyle);
      return;
    }
    setIsSubmitting(true);

    try {
      if (isEditMode && currentId !== null) {
        if(!uploadUrl){
          const result = await updateCommitteeMember.mutateAsync({ id: currentId, Name: name});
          console.log('Committee Member updated:', result);
          toast.success('Committee Member Updated');
        } else{
          const result = await updateCommitteeMemberWithPhoto.mutateAsync({ id: currentId, Name: name ,Post: post});
          console.log('Committee Member updated:', result);
          toast.success('Committee Member Updated');
        }
        
      } else {
        // Add new committee core
        const result = await addCommitteeMember.mutateAsync({ Name: name , imagePath: uploadUrl ?? null});
        console.log('Committee Member added:', result);
        toast.success('Committee Member Added');
      }

      setIsPopupOpen(false);
      setName('');
      await refetch();
    }
      catch {
        toast.error('Error saving Committee Core', toastStyle);
      }
      finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center w-full text-2xl text-bold mb-8 py-5 text-center"> ಸಮಿತಿ ಸದಸ್ಯರ ನಿರ್ವಹಣೆ</h2>

      <div className="mb-4 flex gap-2 flex-wrap justify-center">
        <button onClick={handleAddClick} className="p-2 border border-slate-700 rounded-xl w-48 text-white h-12 bg-black font-BebasNeue">
        ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ
        </button>
      </div>

      {isLoading ? (
        <div>ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
      ) : isError ? (
        <div>ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 ">
            <thead className="bg-white">
              <tr>
              <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಫೋಟೋ</th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಹೆಸರು</th>
              </tr>
            </thead>
            <tbody>
              {committeeMembers?.map((item) => (
                <tr key={item.id} 
                className="hover:bg-gray-50 hover:text-black"
                onDoubleClick={() => handleRowDoubleClick(item.id, item.Name)}
                >
                <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <Image
                      src={item.photo}
                      alt={item.photo}
                      width={25}
                      height={25}
                      className="h-28 w-28 object-cover"
                    />
                  </td>
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
            <h2 className="text-2xl font-bold text-white mb-4">ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-4 right-6 text-white text-2xl p-5">&times;</button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">ಹೆಸರು:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="block w-full mb-4 p-2 rounded-md text-black"
                required
              />
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />
              <button type="submit"  className="w-full bg-blue-600 text-white p-2 my-2 rounded "
              disabled={isSubmitting}
              >
               {isSubmitting ? 'ಸಮರ್ಪಿಸುತ್ತಿದೆ...' : 'ಸಮರ್ಪಿಸಿ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeMembers;
