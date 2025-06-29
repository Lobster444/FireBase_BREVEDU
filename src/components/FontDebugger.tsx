import React, { useState, useEffect } from 'react';

/**
 * FontDebugger component to help diagnose font loading issues
 * This can be temporarily added to any page to debug font loading
 */
const FontDebugger: React.FC = () => {
  const [fontInfo, setFontInfo] = useState<{
    loaded: boolean;
    fontFamilies: string[];
    bodyFont: string;
    h1Font: string;
    customFontsLoaded: {
      rooftop: boolean;
      rooftopBold: boolean;
      manyChatGravity: boolean;
      cofoSansMono: boolean;
    };
  }>({
    loaded: false,
    fontFamilies: [],
    bodyFont: '',
    h1Font: '',
    customFontsLoaded: {
      rooftop: false,
      rooftopBold: false,
      manyChatGravity: false,
      cofoSansMono: false
    }
  });

  useEffect(() => {
    // Get computed styles
    const bodyStyle = window.getComputedStyle(document.body);
    const h1Style = window.getComputedStyle(document.querySelector('h1') || document.createElement('h1'));
    
    // Check if specific fonts are loaded
    const checkFontLoaded = async (fontFamily: string) => {
      if ('fonts' in document) {
        try {
          return await document.fonts.load(`1em "${fontFamily}"`);
        } catch (e) {
          console.error(`Error loading font ${fontFamily}:`, e);
          return false;
        }
      }
      return false;
    };

    const updateFontInfo = async () => {
      // Get all loaded font families
      let fontFamilies: string[] = [];
      
      if ('queryLocalFonts' in window) {
        try {
          // @ts-ignore - TypeScript doesn't know about this API yet
          const fonts = await window.queryLocalFonts();
          fontFamilies = [...new Set(fonts.map((font: any) => font.family))];
        } catch (e) {
          console.error('Error querying local fonts:', e);
        }
      }
      
      // Check if our custom fonts are loaded
      const rooftopLoaded = await checkFontLoaded('Rooftop');
      const rooftopBoldLoaded = await checkFontLoaded('Rooftop');
      const manyChatGravityLoaded = await checkFontLoaded('ManyChatGravity');
      const cofoSansMonoLoaded = await checkFontLoaded('CoFo Sans Mono');
      
      setFontInfo({
        loaded: true,
        fontFamilies,
        bodyFont: bodyStyle.fontFamily,
        h1Font: h1Style.fontFamily,
        customFontsLoaded: {
          rooftop: !!rooftopLoaded,
          rooftopBold: !!rooftopBoldLoaded,
          manyChatGravity: !!manyChatGravityLoaded,
          cofoSansMono: !!cofoSansMonoLoaded
        }
      });
    };
    
    // Update font info after a short delay to allow fonts to load
    const timer = setTimeout(updateFontInfo, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!fontInfo.loaded) {
    return <div>Loading font information...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-[1.2rem] shadow-lg p-4 max-w-md max-h-[80vh] overflow-auto">
      <h3 className="text-lg font-bold mb-2">Font Debugger</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Applied Fonts:</h4>
          <div className="text-sm">
            <div><span className="font-medium">Body:</span> {fontInfo.bodyFont}</div>
            <div><span className="font-medium">H1:</span> {fontInfo.h1Font}</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">Custom Fonts Status:</h4>
          <div className="text-sm">
            <div className={fontInfo.customFontsLoaded.rooftop ? 'text-green-600' : 'text-red-600'}>
              Rooftop Regular: {fontInfo.customFontsLoaded.rooftop ? '✓ Loaded' : '✗ Not Loaded'}
            </div>
            <div className={fontInfo.customFontsLoaded.rooftopBold ? 'text-green-600' : 'text-red-600'}>
              Rooftop Bold: {fontInfo.customFontsLoaded.rooftopBold ? '✓ Loaded' : '✗ Not Loaded'}
            </div>
            <div className={fontInfo.customFontsLoaded.manyChatGravity ? 'text-green-600' : 'text-red-600'}>
              ManyChatGravity: {fontInfo.customFontsLoaded.manyChatGravity ? '✓ Loaded' : '✗ Not Loaded'}
            </div>
            <div className={fontInfo.customFontsLoaded.cofoSansMono ? 'text-green-600' : 'text-red-600'}>
              CoFo Sans Mono: {fontInfo.customFontsLoaded.cofoSansMono ? '✓ Loaded' : '✗ Not Loaded'}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">Font Samples:</h4>
          <div className="space-y-2">
            <div className="font-sans">This text uses font-sans (Rooftop)</div>
            <div className="font-gravity">This text uses font-gravity (ManyChatGravity)</div>
            <div className="font-cofo">This text uses font-cofo (CoFo Sans Mono)</div>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()} 
          className="bg-cobalt text-white px-3 py-1 rounded-[0.8rem] text-sm"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default FontDebugger;