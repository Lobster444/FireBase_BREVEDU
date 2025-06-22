import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="px-4 py-4">
        <p className="text-center text-sm text-gray-600">
          © 2025 MyCompany. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;