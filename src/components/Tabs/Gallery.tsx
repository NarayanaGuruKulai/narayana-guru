import React, { useState } from 'react';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

const Gallery: React.FC = () => {
  const addImage = api.gallery.addImage.useMutation();
  const deleteImage = api.gallery.deleteImage.useMutation();
  const [limit, setLimit] = useState(10); 
  const { data: gallery, isLoading: galleryLoading, isError: galleryError, refetch } = api.gallery.getAllGalleryList.useQuery({limit});
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null); // Updated type to string
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string>(''); // Ensure it's always a string
  const [uploadDate] = useState<string>(new Date().toISOString().split('T')[0] ?? '');
  const toastStyle = {
    style: {
      borderRadius: '10px',
      background: 'black',
      color: 'white',
    },
  };

  // Handle image upload completion
  const handleUploadComplete = (url: string | undefined) => {
    if (url) {
      setUploadUrl(url);
    } else {
      toast.error('Failed to upload image. Please try again.', toastStyle);
    }
  };
  const handleShowMore = () => {
    setLimit((prev) => prev + 10); // Increase limit by 20
  };

  const handleAddImageClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setUploadUrl(''); // Reset the upload URL when closing
  };

  const handleDeleteClick = (id: number) => {
    setSelectedMemberId(id);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMemberId) return;

    try {
      await deleteImage.mutateAsync({ id: selectedMemberId });
      toast.success('Image deleted successfully', toastStyle);
      setSelectedMemberId(null);
      setIsDeletePopupOpen(false);
      void refetch();
    } catch {
      toast.error('Failed to delete the Image', toastStyle);
    }
  };
  // Form submit for adding image to the gallery
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if image is uploaded
    if (!uploadUrl) {
      toast.error('Please upload an image.', toastStyle);
      return;
    }

    try {
      const result = await addImage.mutateAsync({
        imagePath: uploadUrl,
        uploadDate,
      });

      console.log('Image added to gallery:', result);
      setIsPopupOpen(false); // Close popup after success
      setUploadUrl(''); // Reset upload URL
      await refetch(); // Await the refetch to ensure it's resolved before continuing
      toast.success('Image Added to Gallery');
    } catch (error) {
      console.error('Error:', error); // Log error to console
      toast.error('Error adding image to gallery', toastStyle);
    }
  };

  return (
    <div className="p-4">
      <h2 className="flex justify-center text-3xl text-bold mb-8 py-5 text-center">ಗ್ಯಾಲರಿ ನಿರ್ವಹಣೆ</h2>
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={handleAddImageClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black font-BebasNeue"
        >
          ಗ್ಯಾಲರಿ ಸೇರಿಸಿ
        </button>
        <button
          onClick={handleShowMore}
          className="p-2 border border-slate-700 rounded-xl w-44 text-white h-12 bg-black font-BebasNeue"
        >
          ಹೆಚ್ಚು ತೋರಿಸು
        </button>
      </div>

      {galleryLoading ? (
        <div className="text-center text-white">ಗ್ಯಾಲರಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
      ) : galleryError ? (
        <div className="text-center text-red-500">ಗ್ಯಾಲರಿಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-white">
              <tr>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಫೋಟೋ</th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಅಪ್ಲೋಡ್ ದಿನಾಂಕ</th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">ಅಳಿಸಿ</th>
              </tr>
            </thead>
            <tbody>
              {gallery?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="py-2 px-4 border-b border-slate-700 text-center flex justify-center">
                    <Image src={item.imagePath} alt="Uploaded Image" width={32} height={32} className="h-32 w-32 object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    {new Date(item.uploadDate).toLocaleDateString()} {/* Convert to string */}
                  </td>
                  <td className="py-2 px-4 border-b border-slate-700 text-center">
                    <button
                      onClick={() => handleDeleteClick(item.id)}
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
            <h2 className="text-2xl font-bold text-white mb-4">ಗ್ಯಾಲರಿ ಸೇರಿಸಿ</h2>
            <button onClick={handlePopupClose} className="absolute top-4 right-6 text-white text-2xl p-5" aria-label="Close popup">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">Upload Image:</label>
              <UploadComponent onUploadComplete={handleUploadComplete} resetUpload={() => setUploadUrl('')} />

              <button type="submit"  className="w-full bg-blue-600 text-white p-2 my-2 rounded ">
              ಸಮರ್ಪಿಸಿ
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

export default Gallery;
