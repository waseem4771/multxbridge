
// import React from 'react';
// import './../../assets/css/Modal.css'; // Yahan apni CSS file import karein

// // Yeh component yeh properties lega:
// // - isOpen: Yeh batayega ke modal khula hai ya band
// // - onClose: Yeh woh kaam karega jo modal band hone par karna hai
// // - title: Modal ka title kya hoga
// // - children: Modal ke andar jo content dikhana hai
// const Modal = ({ isOpen, onClose, title, children }) => {
//   // Agar modal khula nahi hai, to kuch bhi mat dikhao
//   if (!isOpen) {
//     return null;
//   }

//   return (
//     // 1. Overlay: Poori screen par phelne wala background
//     //    - Animation ke liye custom class lagayi gayi hai
//     <div 
//       onClick={onClose}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm modal-fade-enter modal-fade-enter-active"
//     >
//       {/* 2. Modal Panel: Asal content wala card */}
//       {/*    - Animation aur behtar styling ke liye classes update ki gayi hain */}
//       <div 
//         // Is par click karne se modal band nahi hoga
//         onClick={(e) => e.stopPropagation()}
//         className="w-full max-w-md bg-gray-900 rounded-xl p-6 border border-gray-700/50 shadow-2xl shadow-black/20 modal-scale-enter modal-scale-enter-active"
//       >
        
//         {/* 3. Modal ka Header */}
//         <div className="flex justify-between items-center pb-3 border-b border-gray-700">
//           <h2 className="text-xl font-semibold text-white">{title}</h2>
          
//           {/* Behtar close button (SVG icon ke sath) */}
//           <button 
//             onClick={onClose} 
//             className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/80 transition-colors duration-200"
//             aria-label="Close modal"
//           >
//             <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
        
//         {/* 4. Modal ka Content */}
//         {/*    - Content area ko thoda margin diya gaya hai */}
//         <div className="mt-4 text-gray-300">
//           {children}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Modal;




// -------------------------------- Mobile Screen Responsive ------------------------------

import React from 'react';
import './../../assets/css/Modal.css'; // Yahan apni CSS file import karein

// Yeh component yeh properties lega:
// - isOpen: Yeh batayega ke modal khula hai ya band
// - onClose: Yeh woh kaam karega jo modal band hone par karna hai
// - title: Modal ka title kya hoga
// - children: Modal ke andar jo content dikhana hai
const Modal = ({ isOpen, onClose, title, children }) => {
  // Agar modal khula nahi hai, to kuch bhi mat dikhao
  if (!isOpen) {
    return null;
  }

  return (
    // --- RESPONSIVE ENHANCEMENT: Overlay ko padding di gayi hai ---
    //    - 'p-4' add karne se modal choti screens par kinaron se nahi chipkega.
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 modal-fade-enter modal-fade-enter-active"
    >
      {/* 2. Modal Panel: Asal content wala card */}
      {/*    --- RESPONSIVE ENHANCEMENT: Padding ko adjust kiya gaya hai --- */}
      <div 
        // Is par click karne se modal band nahi hoga
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-2xl shadow-black/20 modal-scale-enter modal-scale-enter-active"
      >
        
        {/* 3. Modal ka Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-700">
          {/* --- RESPONSIVE ENHANCEMENT: Title ka font size adjust kiya gaya hai --- */}
          <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
          
          {/* Behtar close button (SVG icon ke sath) */}
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/80 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 4. Modal ka Content */}
        {/*    - Content area ko thoda margin diya gaya hai */}
        <div className="mt-4 text-gray-300">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;