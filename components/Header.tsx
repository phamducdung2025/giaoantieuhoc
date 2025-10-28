import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            <i className="fa-solid fa-leaf text-black text-2xl"></i>
          </div>
          <h1 className="text-xl font-bold text-black">
            Trình tạo Giáo án Tiểu học
          </h1>
        </div>
        <button className="text-gray-600 hover:text-black p-2 rounded-full hover:bg-gray-100">
          <i className="fa-solid fa-gear text-xl"></i>
        </button>
      </div>
    </header>
  );
};