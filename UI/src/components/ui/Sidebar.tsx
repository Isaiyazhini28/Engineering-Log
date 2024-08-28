

import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-full h-full bg-black text-white flex flex-col flex justify-start">
      <div className="p-4 border-b border-gray-700 ">
        <h2 className="text-2xl">Sidebar</h2>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-700 text-white">Home</a>
          </li>
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-700 text-white">About</a>
          </li>
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-700 text-white">Services</a>
          </li>
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-700 text-white">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
