import React, { useEffect } from 'react';
import { signOut, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const NotAuthorized = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (session && session.user.role !== 'user') {
      void router.push('/admin');
    }
  }, [session, status, router]);

  const handleSignOutAndIn = async () => {
    await signOut({ redirect: false }); // Do not redirect immediately
    await signIn();
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
    >
      {/* Dim the background using an absolute div with black background and opacity */}
      <div className="absolute inset-0 bg-black opacity-75" />
      <div className="relative z-10 text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4">ನೀವು ಅನಧಿಕೃತರಾಗಿದ್ದೀರಿ!</h1>
        <button
          onClick={handleSignOutAndIn}
          className="mt-4 px-6 py-2 bg-white text-black font-bold rounded hover:bg-black hover:text-white transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
