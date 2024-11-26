import React, { useState } from 'react';
import UploadComponent from '../UploadComponent';
import { api } from '~/utils/api';
import Image from 'next/image';
import toast from 'react-hot-toast';

const Gallery: React.FC = () => {
  const addImage = api.gallery.addImage.useMutation();
  const { data: gallery, isLoading: galleryLoading, isError: galleryError, refetch } = api.gallery.getAllGallery.useQuery();

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

  const handleAddImageClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setUploadUrl(''); // Reset the upload URL when closing
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
      <h1 className="flex justify-center text-6xl font-Hunters mb-8 py-5 text-center">Gallery Management</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={handleAddImageClick}
          className="p-2 border border-slate-700 rounded-xl w-32 text-white h-12 bg-black font-BebasNeue"
        >
          Add Image
        </button>
      </div>

      {galleryLoading ? (
        <div className="text-center text-white">Loading gallery...</div>
      ) : galleryError ? (
        <div className="text-center text-red-500">Error loading gallery. Please try again later.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-black">
            <thead className="bg-white">
              <tr>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">Image</th>
                <th className="text-black border py-2 px-4 border-b border-slate-700 text-center">Upload Date</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50">
          <div className="bg-black p-10 rounded-3xl shadow-lg relative text-center w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Add Image to Gallery</h2>
            <button onClick={handlePopupClose} className="absolute top-6 right-6 text-white p-5" aria-label="Close popup">
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <label className="block mt-5 mb-2 text-white text-left">Upload Image:</label>
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

export default Gallery;
