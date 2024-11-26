// src/pages/admin.tsx
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Memberships from '~/components/Tabs/Memberships';
import Ledger from '~/components/Tabs/Ledger';
import Bhajane from '~/components/Tabs/Bhajane';
import HallBooking from '~/components/Tabs/HallBooking';
import Gallery from '~/components/Tabs/Gallery';
import Committee from '~/components/Tabs/Committee';
import useUserRole from '~/hooks/useUserRole';


const Dashboard = () => {
  const userRole = useUserRole();
  const [activeTab, setActiveTab] = useState<string>(''); // Start with no active tab
  const [showMessageOnce, setShowMessageOnce] = useState(true); // Control the default message
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/unauthorized');
    }

    if (status === 'authenticated' && session?.user?.role === 'user') {
      void router.push('/unauthorized');
    }
  }, [session, status, router]);


  const renderComponent = () => {
    if (activeTab === 'memberships') return <div><Memberships/></div>;
    if (activeTab === 'ledger') return <div><Ledger/></div>;
    if (activeTab === 'bhajane') return <div><Bhajane/></div>;
    if (activeTab === 'hallbooking') return <div><HallBooking/></div>;
    if (activeTab === 'gallery') return <div><Gallery/></div>;
    if (activeTab === 'committee') return <div><Committee/></div>

    if (showMessageOnce) {
      return (
        <div className="text-center mt-20 text-lg">
          <h1 className="text-center text-4xl font-bold mb-8 text-white">
            Hey {session?.user.name}
          </h1>
          <p className="text-blue-400">
            Use <span className="text-yellow-500">Tabs</span> to switch to your destination! 🚀
          </p>
          <p className="text-gray-300 mt-2">
            Don’t worry, we’ve got all your needs covered!
          </p>
        </div>
      );
    }
  };

  const renderTabNavigation = () => (
    <div className="flex flex-col mb-4 gap-5">
      <h3 className='my-5 text-center'>Options</h3>
      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('memberships');
            setShowMessageOnce(false);
          }}
          className={`flex-1 text-center p-2 rounded-lg font-BebasNeue text-lg ${
            activeTab === 'memberships'
              ? 'bg-gradient-to-r from-purple-700 to-gray-900 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-purple-700 to-gray-900'
          } transition duration-200`}  
        >
          Memberships
        </button>
      )}
      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('ledger');
            setShowMessageOnce(false);
          }}
          className={`flex-1 text-center p-2 rounded-lg font-BebasNeue text-lg ${
            activeTab === 'ledger'
              ? 'bg-gradient-to-r from-purple-700 to-gray-900 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-purple-700 to-gray-900'
          } transition duration-200`}                
        >
          Ledger
        </button>
      )}

        {(userRole === 'admin' || userRole === 'editor') && (
        <button
        onClick={() => {
          setActiveTab('bhajane');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'bhajane'
              ? 'bg-gradient-to-r from-purple-700 to-gray-900 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-purple-700 to-gray-900'
          } transition duration-200`}  
      >
        Bhajane
      </button>
      
      )}

      {(userRole === 'admin') && (
        <button
        onClick={() => {
          setActiveTab('hallbooking');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'hallbooking'
              ? 'bg-gradient-to-r from-purple-700 to-gray-900 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-purple-700 to-gray-900'
          } transition duration-200`}  
      >
        Hall Booking
      </button>
      
      )}

{(userRole === 'admin') && (
        <button
        onClick={() => {
          setActiveTab('gallery');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'gallery'
              ? 'bg-gradient-to-r from-purple-700 to-gray-900 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-purple-700 to-gray-900'
          } transition duration-200`}  
      >
        Gallery
      </button>
      
      )}

{(userRole === 'admin') && (
        <button
        onClick={() => {
          setActiveTab('committee');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'committee'
              ? 'bg-gradient-to-r from-purple-700 to-gray-900 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-purple-700 to-gray-900'
          } transition duration-200`}  
      >
       Committee
      </button>
      
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row bg-zinc-800 text-white min-h-screen ">
      {/* Sidebar */}
      <div className="md:w-48 w-full p-4 bg-zinc-900 bg-cover bg-opacity-100">
        {renderTabNavigation()}
      </div>

      {/* Content Area */}
      <div className="md:w-5/6 w-full min-h-screen p-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
