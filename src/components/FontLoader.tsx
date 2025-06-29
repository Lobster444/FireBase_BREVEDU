import React, { useEffect, useState } from 'react';

/**
 * FontLoader component to ensure fonts are loaded before rendering content
 * This helps prevent layout shifts and font flashing
 */
const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Use the Font Loading API if available
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('1em Rooftop'),
        document.fonts.load('600 1em Rooftop'),
        document.fonts.load('1em ManyChatGravity'),
        document.fonts.load('1em "CoFo Sans Mono"')
      ]).then(() => {
        console.log('✅ Custom fonts loaded successfully');
        setFontsLoaded(true);
      }).catch(error => {
        console.warn('⚠️ Error loading custom fonts:', error);
        // Continue anyway to avoid blocking the UI
        setFontsLoaded(true);
      });
    } else {
      // Fallback for browsers without Font Loading API
      // Use a timeout to give fonts a chance to load
      const timer = setTimeout(() => {
        setFontsLoaded(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Show a minimal loading state while fonts are loading
  if (!fontsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-cobalt/20 border-t-cobalt rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FontLoader;