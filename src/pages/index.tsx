import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '~/utils/api';

export default function Home() {
  const { data: bhajanes } = api.bhajane.getAllBhajane.useQuery({ limit: 100 });
  const [upcomingBhajanes, setUpcomingBhajanes] = useState<{ name: string; date: string }[]>([]);

  useEffect(() => {
    if (bhajanes) {
      const today = new Date();
      const futureBhajanes = bhajanes?.filter((bhajane) => new Date(bhajane.date) > today);

      if (futureBhajanes.length) {
        const nearestDate = futureBhajanes.reduce((prev, curr) =>
          new Date(curr.date) < new Date(prev.date) ? curr : prev
        ).date;

        const filteredBhajanes = futureBhajanes.filter((b) => b.date === nearestDate);
        setUpcomingBhajanes(filteredBhajanes);
      }
    }
  }, [bhajanes]);


  return (
    <>
      <div className="p-4 space-y-10 my-10">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center bg-black p-6 rounded-lg shadow-md">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0 flex justify-center">
            <Image
              src="https://utfs.io/f/SVkywvr9y613GgFK6DotAgyMXxR0bflucYTpSUB8NDEs4mZ7" // Replace with your image path
              alt="Hero Image"
              width={200}
              height={200}
              className="rounded-lg object-cover md:w-2/3 w-full h-1/3"
            />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-center text-white">ಬ್ರಹ್ಮಶ್ರೀ ನಾರಾಯಣ ಗುರು ಸಮಾಜ ಸೇವಾ ಸ೦ಘ (ರಿ) ಕುಳಾಯಿ</h1>
            <h2 className="text-xl font-bold mb-4 text-center text-white">ದಕ್ಷಿಣ ಕನ್ನಡ ಜಿಲ್ಲಾ ರಾಜ್ಯೋತ್ಸವ ಪ್ರಶಸ್ತಿ ಪುರಸ್ಕೃತ </h2>
            <p className="text-white text-center">
              ಮುಂದಾಳತ್ವದಲ್ಲಿ ಬಿಲ್ಲವರ ಯೂನಿಯನ್‌ (ರಿ) ಮ೦ಗಳೂರು ಇದರ ಅಧ್ಯಕ್ಷರಾದ ಶ್ರೀ ದಾಮೋದರ ಆರ್‌. 
              ಸುವರ್ಣರವರ ಮಾರ್ಗದರ್ಶನದೊ೦ದಿಗೆ ದಿನಾ೦ಕ 11-11-1976ರ ಶುಭ ದಿನದಲ್ಲಿ &quot;ಬ್ರಹ್ಮಶ್ರೀ ನಾರಾಯಣ ಗುರು 
              ಸಮಾಜ ಸೇವಾ ಸ೦ಘ&quot; ಕುಳಾಯಿ ಸ್ಡಾಪನೆಯಾಯಿತು. ಸಂಘದ ಮೂಲ ಉದ್ದೇಶ ಸಂಘಟನೆಗೆ ಒತ್ತು ನೀಡಿ, 
              ವಿದ್ಯೆಗೆ ಪ್ರೋತ್ಸಾಹ ನೀಡುವುದು. ನಮ್ಮ ಸಮಾಜದ ಜನರ ವ್ಯಾಜ್ಯ ಇದ್ದಲ್ಲಿ ಅದನ್ನು ಪಂಚಾಯತ್‌ನಿಂದ 
              ಪರಿಹರಿಸುವುದು ಮತ್ತು ಸಮಾಜದ ದುರ್ಬಲರಿಗೆ ಅವರ ಕಷ್ಟಕಾಲದಲ್ಲಿ ನೈತಿಕ ಹಾಗೂ ಆರ್ಥಿಕ ಸಹಾಯ 
              ನೀಡುವುದು. ಈ ಸಂಘವು ಸಮಾಜದ ವಿವಿಧ ಕಷ್ಟಗಳನ್ನು ಪರಿಹರಿಸುವ ಮೂಲಕ ಸಮಾಜದ ಸೇವೆಗೆ ನಿರತವಾಗಿದೆ.
            </p>
          </div>
        </section>

        {/* Bhajane Section */}
        <section className="flex flex-col lg:flex-row items-center bg-black p-6 rounded-lg shadow-md">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold  text-center lg:text-center">ಮುಂಬರುವ ಭಜನೆ</h2>
            <div className='flex justify-center'>
              <Image
              src="https://utfs.io/f/SVkywvr9y613eAMWZCEU9S7NcHYtJhy0unGkQEVimWBIoR8z" // Replace with your image path
              alt="Bhajane Design"
              width={400}
              height={400}
              className="rounded-lg object-cover  md:w-1/3 w-2/3 h-1/3 mb-4"
            />
            </div>
            {upcomingBhajanes.length > 0 ? (
              <ul className="list-disc list-inside text-white text-center text-xl">
                {upcomingBhajanes.map((bhajane, index) => (
                  <li key={index} className="mb-2">
                    {bhajane.name} - <span className="font-medium">{new Date(bhajane.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white text-center">ಭವಿಷ್ಯದಲ್ಲಿನ ಭಜನೆಗಳ ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ.</p>
            )}
          </div>
          
          <div className="w-full lg:w-1/2 mt-4 lg:mt-0 flex justify-center">
            <Image
              src="https://utfs.io/f/SVkywvr9y613CGO0eAFvbcPd3SwNR4eOXqAmU8KujiL0Qxs7" // Replace with your image path
              alt="Bhajane Section Image"
              width={400}
              height={400} 
              className="rounded-lg object-cover md:w-2/3 w-full h-1/3"
            />
          </div>
        </section>

        {/* Map Section */}
        <section className="flex flex-col lg:flex-row items-center bg-black p-6 rounded-lg shadow-md">
          <div className="w-full lg:w-1/2 h-400 flex justify-center">
            <Image
              src="https://utfs.io/f/SVkywvr9y613hg3wlpMqmHtjeyZlxgoQ81iIz34P7MRKXTfV" // Replace with your image path
              alt="Map Section Image"
              width={400}
              height={400}
              className="rounded-lg object-cover md:w-4/6 w-full "
            />
          </div>
          <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
            <h3 className='text-xl text-center my-5'>Brahmashree Narayana Guru Samajha Seva Sangha Kulai</h3>
            <p className='text-center'>Contact No: +91 9480689101</p>
            <p className='text-center text-blue-300'>
              <a href='https://maps.app.goo.gl/vHgnEn9Vv67joYZ5A'>
                XR75+829, New Mangalore, Honne Katte, Kulai, Mangaluru, Karnataka 575019
              </a>
              </p>
          </div>
        </section>
      </div>
    </>
  );
}
