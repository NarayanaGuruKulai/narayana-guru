import React from 'react';
import { api } from '~/utils/api';
import Image from 'next/image';

interface CardProps {
  name: string;
  post: string;
  photo: string;
}

interface CommitteeMember {
  id: number;
  Name: string;
  photo: string;
}


const CommitteeCard = ({ name, post, photo }: CardProps) => {
  return (
    <div className="transform transition-transform hover:rotate-3 hover:scale-105 h-80 w-72 bg-black rounded-lg shadow-lg p-4">
      <div className="relative w-56 h-56 overflow-hidden rounded-md mx-auto mb-4">
        <Image 
          src={photo}  
          alt={name} 
          layout="fill" 
          objectFit="cover" 
          className="rounded-md transition-transform duration-300 ease-in-out transform hover:scale-110" 
        />
      </div>
      <h3 className="text-2xl font-bold text-white text-center mb-1">{name}</h3>
      <p className="text-white text-center text-sm">{post}</p> 
    </div>
  );
};

const Committee = () => {
  const { data: committeeCore, isLoading: isCoreLoading, error: coreError } = api.committee.getAllCommitteeCore.useQuery();
  const { data: committeeMembers, isLoading: isMembersLoading, error: membersError } = api.committee.getAllCommitteeMembers.useQuery<CommitteeMember[]>();

  if (isCoreLoading || isMembersLoading) return <p>Loading...</p>;
  if (coreError) return <p className="text-white text-center">Error loading core committee members: {coreError?.message}</p>;
  if (membersError) return <p className="text-white text-center">Error loading committee members: {membersError?.message}</p>;

  // Safe fallback in case data is undefined
  const safeCommitteeCore = committeeCore ?? [];
  const safeCommitteeMembers = committeeMembers ?? [];

  return (
    <div className="p-6 bg-black min-h-screen">
      <h2 className="text-2xl md:text-5xl text-white text-center mb-8 mt-4 md:mb-4 md:mt-8 z-20">
     ಆಡಳಿತ ಸಮಿತಿ
      </h2>

      {/* Core Committee Section */}
      <section className="z-20 py-6 md:py-12 px-4 md:px-6 flex flex-col  md:flex-row flex-wrap justify-center gap-10 md:gap-8 items-center">
        {safeCommitteeCore.map((member) => (
          <CommitteeCard 
            key={member.id}
            name={member.Name}
            post={member.Post}
            photo={member.photo} 
          />
        ))}
      </section>

      {/* Committee Members Section */}
      <section className="mt-12">
  <h2 className="text-2xl md:text-5xl text-white text-center mb-8 mt-4 md:mb-4 md:mt-8 z-20">
    ಸಮಿತಿ ಸದಸ್ಯರು
  </h2>
  <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 text-white text-center">
    {safeCommitteeMembers.map((member) => (
      <li key={member.id} className="text-lg mb-2 flex flex-col items-center justify-center">
        <Image
          src={member.photo}
          alt={member.Name}
          width={100} // Set a reasonable width
          height={100} // Set a reasonable height
          className="object-cover mb-2"  // Add margin to space out the photo from the name
        />
        <div>{member.Name}</div>  {/* Name is already centered by flex */}
      </li>
    ))}
  </ul>
</section>


    </div>
  );
};

export default Committee;
