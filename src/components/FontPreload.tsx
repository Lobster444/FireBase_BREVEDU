import React from 'react';

/**
 * FontPreload component to add preload links for custom fonts
 * This helps browsers discover and download fonts earlier
 */
const FontPreload: React.FC = () => {
  return (
    <>
      <link 
        rel="preload" 
        href="/fonts/Rooftop-Regular.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
      <link 
        rel="preload" 
        href="/fonts/Rooftop-Bold.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
      <link 
        rel="preload" 
        href="/fonts/ManyChatGravity-Normal.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
    </>
  );
};

export default FontPreload;