import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="relative aspect-[4/5] rounded-2xl bg-gray-200"></div>
      <div className="pt-8 px-4 flex flex-col items-center">
        <div className="w-24 h-3 bg-gray-100 rounded-full mb-3"></div>
        <div className="w-full h-6 bg-gray-200 rounded-full mb-3"></div>
        <div className="w-20 h-3 bg-gray-100 rounded-full mb-4"></div>
        <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export const BannerSkeleton = () => {
  return (
    <div className="w-full h-[600px] md:h-[850px] bg-gray-200 animate-pulse"></div>
  );
};


