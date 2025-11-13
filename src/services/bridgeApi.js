// // Apne backend ka base URL yahan daalein.
// // Behtar hai ke isay .env file mein rakhein.
// const API_BASE_URL = 'http://localhost:3001'; // Example URL

// // Yeh function signatures ke liye API ko poll karega
// export const pollForSignatures = (bridgeTxHash) => {
//   // Hum Promise return kar rahe hain taake UI iske complete hone ka intezar kar sake
//   return new Promise((resolve, reject) => {
    
//     // Har 10 second mein check karne ke liye interval set karein
//     const interval = setInterval(async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/bridge/signatures/${bridgeTxHash}`);
        
//         if (!response.ok) {
//           // Agar server error de, to polling rok dein
//           throw new Error(`API request failed with status ${response.status}`);
//         }

//         const data = await response.json();

//         // Documentation ke mutabiq, jab 'ready' true ho to signatures mil gaye
//         if (data && data.ready) {
//           clearInterval(interval); // Polling rok dein
//           clearTimeout(timeout);  // Timeout bhi clear kar dein
//           resolve(data.releaseParams); // Kamyabi par data return karein
//         }
//         // Agar ready nahi, to interval chalta rahega
//       } catch (error) {
//         clearInterval(interval);
//         clearTimeout(timeout);
//         reject(error);
//       }
//     }, 10000); // Har 10 second (10,000 ms)

//     // 5 minute ka timeout set karein. Agar 5 min tak signatures na milein to error de dein.
//     const timeout = setTimeout(() => {
//       clearInterval(interval);
//       reject(new Error("Polling for signatures timed out after 5 minutes."));
//     }, 300000); // 5 minutes in ms
//   });
// };















// Apne backend ka base URL yahan daalein.
// Behtar hai ke isay .env file mein rakhein.
const API_BASE_URL = 'http://localhost:3001'; // Example URL

// Yeh function signatures ke liye API ko poll karega
export const pollForSignatures = (bridgeTxHash) => {
  // Hum Promise return kar rahe hain taake UI iske complete hone ka intezar kar sake
  return new Promise((resolve, reject) => {
    
    // Har 10 second mein check karne ke liye interval set karein
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bridge/signatures/${bridgeTxHash}`);
        
        if (!response.ok) {
          // Agar server error de, to polling rok dein
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Documentation ke mutabiq, jab 'ready' true ho to signatures mil gaye
        if (data && data.ready) {
          clearInterval(interval); // Polling rok dein
          clearTimeout(timeout);  // Timeout bhi clear kar dein
          resolve(data.releaseParams); // Kamyabi par data return karein
        }
        // Agar ready nahi, to interval chalta rahega
      } catch (error) {
        clearInterval(interval);
        clearTimeout(timeout);
        reject(error);
      }
    }, 10000); // Har 10 second (10,000 ms)

    // 5 minute ka timeout set karein. Agar 5 min tak signatures na milein to error de dein.
    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject(new Error("Polling for signatures timed out after 5 minutes."));
    }, 300000); // 5 minutes in ms
  });
};


// --- YAHAN NAYA FUNCTION ADD KIYA GAYA HAI ---

/**
 * User address ke liye backend se transaction history fetch karta hai.
 * @param {string} userAddress - User ka wallet address.
 * @returns {Promise<Array>} - Transactions ka array.
 */
export const getUserTransactions = async (userAddress) => {
  // Agar address mojood nahi to call na karein aur khali array return karein
  if (!userAddress) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bridge/transactions/${userAddress}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // API response se 'transactions' ka array return karein, warna khali array
    return data.transactions || [];

  } catch (error) {
    console.error("Failed to fetch user transactions:", error);
    // Error ki soorat mein khali array return karein taake app crash na ho
    return [];
  }
};