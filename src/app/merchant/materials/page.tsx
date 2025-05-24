'use client';

import { 
  Squares2X2Icon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

export default function Materials() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fadeIn">
      <div className="max-w-md mx-auto text-center px-6">
        {/* QR-style decorative element */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Main QR-style grid */}
            <div className="w-24 h-24 bg-white border-2 border-slate-800 rounded-lg p-2">
              <div className="w-full h-full grid grid-cols-4 gap-1">
                {/* QR code pattern */}
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-slate-800 rounded-sm"></div>
                <div className="bg-white"></div>
                <div className="bg-slate-800 rounded-sm"></div>
              </div>
            </div>
            
            {/* Tool icon overlay */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <WrenchScrewdriverIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Материалы
        </h1>
        
        {/* Simple status message */}
        <p className="text-slate-600 mb-6">
          Раздел находится в разработке
        </p>
        
        {/* Simple status indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          <span>В процессе</span>
        </div>
      </div>
    </div>
  );
}