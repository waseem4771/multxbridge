
// import React from 'react';

// // Yeh component kuch cheezain lega:
// // - children: Button ke andar jo text ya icon hoga
// // - variant: Button ki look kaisi hogi ('primary' ya 'secondary')
// // - className: Agar koi extra style dena ho
// // - ...props: Button ki baaki properties jaise onClick ya disabled
// const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  
//   // --- ENHANCEMENT: Base style ko behtar animations ke sath update kiya gaya hai ---
//   // - 'px-4 py-2 font-semibold rounded-lg': Aapka original size, font, aur corner style bilkul waisa hi hai
//   // - 'transition-all duration-300 ease-in-out': Animation ko har cheez (rang, shadow, size) par smooth apply kiya gaya hai
//   // - 'active:scale-95': Click karne par halka sa dabne ka effect
//   // - 'focus:outline-none focus-visible:ring-2 ...': Keyboard users ke liye ek saaf outline
//   const baseStyle = 'px-4 py-2 font-semibold rounded-lg transition-all duration-300 ease-in-out active:scale-95 focus:outline-none disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed';

//   // --- ENHANCEMENT: Original colors ko barkarar rakhte hue effects add kiye gaye hain ---
//   const variantStyles = {
//     // Primary: Original color, lekin hover par halka sa oopar uthne aur shadow barhne ka effect
//     primary: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    
//     // Secondary: Original color, lekin hover par halka sa oopar uthne ka effect
//     secondary: 'bg-gray-600 text-white hover:bg-gray-500 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
//   };

//   // Yahan hum sab styles ko mila rahe hain
//   const combinedClassName = `${baseStyle} ${variantStyles[variant]} ${className}`;

//   return (
//     <button className={combinedClassName} {...props}>
//       {children}
//     </button>
//   );
// };

// export default Button;



// --------------- Mobile Responsive ---------------------



import React from 'react';

// Yeh component kuch cheezain lega:
// - children: Button ke andar jo text ya icon hoga
// - variant: Button ki look kaisi hogi ('primary' ya 'secondary')
// - className: Agar koi extra style dena ho
// - ...props: Button ki baaki properties jaise onClick ya disabled
const Button = ({ children, variant = 'primary', className = '', fullWidth, ...props }) => {
  
  // --- RESPONSIVE ENHANCEMENT: Base style ko mobile ke liye adjust kiya gaya hai ---
  // - Padding aur font-size ko mobile (default) aur sm screens (desktop) ke liye alag kiya gaya hai.
  // - Mobile par thori zyada vertical padding (py-2.5) behtar tap target faraham karti hai.
  const baseStyle = 'px-4 py-2.5 sm:py-2 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 ease-in-out active:scale-95 focus:outline-none disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed';

  // --- ENHANCEMENT: Hover effects sirf desktop par kaam karenge, mobile par ignore ho jayenge ---
  const variantStyles = {
    // Primary: Original color, lekin hover par halka sa oopar uthne aur shadow barhne ka effect
    primary: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    
    // Secondary: Original color, lekin hover par halka sa oopar uthne ka effect
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
  };

  // fullWidth prop ko className mein add karein, lekin DOM element ko pass na karein
  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseStyle} ${variantStyles[variant]} ${widthClass} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;



//------------------decrease Shadow code-----------



// import React from 'react';

// // Yeh component kuch cheezain lega:
// // - children: Button ke andar jo text ya icon hoga
// // - variant: Button ki look kaisi hogi ('primary' ya 'secondary')
// // - className: Agar koi extra style dena ho
// // - ...props: Button ki baaki properties jaise onClick ya disabled
// const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  
//   // Base style bilkul waisa hi hai
//   const baseStyle = 'px-4 py-2 font-semibold rounded-lg transition-all duration-300 ease-in-out active:scale-95 focus:outline-none disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed';

//   // --- ENHANCEMENT: Sirf focus ring/shadow ko halka kiya gaya hai ---
//   const variantStyles = {
//     // Primary: Sirf 'focus-visible:ring-blue-500/50' mein tabdeeli ki gayi hai
//     primary: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    
//     // Secondary: Sirf 'focus-visible:ring-gray-500/50' mein tabdeeli ki gayi hai
//     secondary: 'bg-gray-600 text-white hover:bg-gray-500 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gray-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
//   };

//   // Yahan hum sab styles ko mila rahe hain
//   const combinedClassName = `${baseStyle} ${variantStyles[variant]} ${className}`;

//   return (
//     <button className={combinedClassName} {...props}>
//       {children}
//     </button>
//   );
// };

// export default Button;