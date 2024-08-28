
import contact from '@/components/ui/contact'
import Sidebar from '@/components/ui/sidebar';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex w-full h-screen flex justify-start">
      <Sidebar />
      <main className="flex-grow p-4 bg-white text-black">
        <h1 className="text-3xl font-bold mb-4">Home Page</h1>
        <p>
          This is the main content area. Add your content here.Some text about me. Some text about me. I am lorem ipsum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
                
      </main>
    </div>
  );
};

export default HomePage;
