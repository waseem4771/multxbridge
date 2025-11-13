
// // src/components/layout/MainLayout.jsx

// import React, { useRef, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import Header from './Header';
// import Footer from './Footer';

// import backgroundVideo from '../../assets/videos/video2.mp4';

// const MainLayout = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (videoRef.current) {
//       // --- VIDEO KI SPEED BOHOT SLOW KARNA ---
//       // Hum isko 0.25 (25% speed) kar rahe hain for a very slow effect.
//       videoRef.current.playbackRate = 0.25;
//     }
//   }, []);

//   return (
//     <div className="relative flex min-h-screen flex-col font-sans text-slate-100">
      
//       <video
//         ref={videoRef}
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="absolute top-0 left-0 w-full h-full object-cover -z-10"
//         src={backgroundVideo}
//       />
      
//       {/* --- UI ENHANCEMENT: Gehra (Darker) Background Overlay --- */}
//       {/* Hum ne yahan opacity values ko bohot high kar diya hai */}
//       <div className="absolute top-0 left-0 w-full h-full 
//                      bg-gradient-to-b from-slate-950/95 via-indigo-950/90 to-slate-950/95 -z-10" />

//       {/* --- PAGE CONTENT (Yeh sab waise hi rahega) --- */}
//       <div className="z-10 flex flex-grow flex-col">
//         <Toaster 
//           position="top-center"
//           toastOptions={{
//             style: {
//               background: 'rgba(30, 41, 59, 0.8)',
//               backdropFilter: 'blur(10px)',
//               color: '#f1f5f9',
//               border: '1px solid #334155',
//             },
//           }}
//         />
        
//         <Header />
        
//         <main className="w-full max-w-5xl mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
//           <Outlet />
//         </main>
        
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default MainLayout;













// -----Responsive Code ------------------------------------



// src/components/layout/MainLayout.jsx

import React, { useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './Header';
import Footer from './Footer';

import backgroundVideo from '../../assets/videos/video1.mp4';

const MainLayout = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // --- VIDEO KI SPEED BOHOT SLOW KARNA ---
      // Hum isko 0.25 (25% speed) kar rahe hain for a very slow effect.
      videoRef.current.playbackRate = 0.25;
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col font-sans text-slate-100">
      
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src={backgroundVideo}
      />
      
      {/* --- UI ENHANCEMENT: Gehra (Darker) Background Overlay --- */}
      {/* Hum ne yahan opacity values ko bohot high kar diya hai */}
      <div className="absolute top-0 left-0 w-full h-full 
                     bg-gradient-to-b from-slate-950/95 via-indigo-950/90 to-slate-950/95 -z-10" />

      {/* --- PAGE CONTENT (Yeh sab waise hi rahega) --- */}
      <div className="z-10 flex flex-grow flex-col">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
        
        <Header />
        
        {/* === RESPONSIVE CHANGE HERE === */}
        {/* Vertical padding ko mobile ke liye thoda kam kiya gaya hai (py-6) */}
        {/* Bari screens par padding waisi hi rahegi (md:py-8) */}
        <main className="w-full max-w-5xl mx-auto flex-grow px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;