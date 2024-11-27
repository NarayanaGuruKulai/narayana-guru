import { isMobile, isTablet, isDesktop } from 'react-device-detect';
import { Box, ImageList, ImageListItem } from "@mui/material";
import { api } from '~/utils/api';
import Image from 'next/image';

const Gallery = () => {
  const devicecol = isMobile ? 3 : isTablet ? 3 : isDesktop ? 4 : 5;
  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-white text-center">Error loading images: {error?.message}</p>;
  if (!images) return <p className="text-white text-center">No images available.</p>;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-2xl md:text-5xl text-center mt-4 md:mb-4 md:mt-8 z-20 mb-20">
      ಗ್ಯಾಲರಿ
      </h1>
      <main className='flex justify-center items-center my-10'>
        <Box sx={{
          width: '100vw',
          overflowY: 'visible',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          WebkitOverflowScrolling: 'touch',
        }}>
          <ImageList variant="masonry" cols={devicecol} gap={8}>
            {images.map((image) => (
            <ImageListItem key={image.id}>
                <Image
                src={`${image.imagePath}?w=248&fit=crop&auto=format`}
                alt={image.imagePath}
                loading="lazy"
                width={248}
                height={0}
                quality={20}
                />
          </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </main>
    </div>
  );
};

export default Gallery;
