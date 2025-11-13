
// import React from 'react';

// // Yeh component ab yeh extra properties bhi le sakta hai:
// // - hasError: (boolean) Agar true ho, to error style dikhayega
// // - disabled: (boolean) Agar true ho, to input ghair fa'aal hoga
// const Input = ({ className = '', hasError = false, disabled = false, ...props }) => {

//   // Yeh hamare input ka default style hai
//   const baseStyle = `
//     w-full 
//     bg-gray-900 
//     text-white 
//     placeholder-gray-500 
//     p-3 
//     rounded-lg 
//     border 
//     transition-all
//     duration-200
//     focus:outline-none
//   `;

//   // Halat (state) ke hisab se style
//   // - Normal state mein halka border
//   // - Focus karne par neela ring
//   // - Error hone par surkh ring
//   // - Disable hone par alag style
//   const stateStyle = disabled
//     ? 'border-gray-700 bg-gray-800 cursor-not-allowed text-gray-500' // Disabled style
//     : hasError
//       ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/30' // Error style
//       : 'border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'; // Normal/Focus style

//   // Agar koi extra class di gayi ho to usko bhi sath mila do
//   const combinedClassName = `${baseStyle} ${stateStyle} ${className}`;

//   return (
//     <input 
//       className={combinedClassName}
//       disabled={disabled}
//       {...props}
//     />
//   );
// };

// export default Input;













//--------------------- Mobile Resposnive ----------------------------


import React from 'react';

// Yeh component ab yeh extra properties bhi le sakta hai:
// - hasError: (boolean) Agar true ho, to error style dikhayega
// - disabled: (boolean) Agar true ho, to input ghair fa'aal hoga
const Input = ({ className = '', hasError = false, disabled = false, ...props }) => {

  // --- RESPONSIVE ENHANCEMENT: Base style ko mobile ke liye adjust kiya gaya hai ---
  const baseStyle = `
    w-full 
    bg-gray-900 
    text-white 
    placeholder-gray-500 
    p-3 
    text-sm sm:text-base  /* Mobile par chota font, desktop par normal */
    rounded-lg 
    border 
    transition-all
    duration-200
    focus:outline-none
  `;

  // Halat (state) ke hisab se style (Ismein koi tabdeeli nahi)
  const stateStyle = disabled
    ? 'border-gray-700 bg-gray-800 cursor-not-allowed text-gray-500' // Disabled style
    : hasError
      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/30' // Error style
      : 'border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'; // Normal/Focus style

  // Agar koi extra class di gayi ho to usko bhi sath mila do
  const combinedClassName = `${baseStyle} ${stateStyle} ${className}`;

  return (
    <input 
      className={combinedClassName}
      disabled={disabled}
      {...props}
    />
  );
};

export default Input;