
// import { Routes, Route } from 'react-router-dom';


// import MainLayout from './components/layout/MainLayout';
// import BridgePage from './pages/BridgePage';
// import HistoryPage from './pages/HistoryPage';


// function App() {
//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
        
//         <Route path="/" element={<BridgePage />} />
        
//         <Route path="/history" element={<HistoryPage />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;










import { Routes, Route } from 'react-router-dom';

// --- ENHANCEMENT 1: Toaster ko import kiya gaya hai ---
// Yeh component aapke tamam notifications ko khubsurat banayega
import { Toaster } from 'react-hot-toast';

import MainLayout from './components/layout/MainLayout';
import BridgePage from './pages/BridgePage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    // --- ENHANCEMENT 2: React Fragment (<>) add kiya gaya hai ---
    // Taake Routes aur Toaster dono ek saath aa saken
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<BridgePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>

      {/* --- ENHANCEMENT 3: Toaster component ko behtareen style ke saath add kiya gaya hai --- */}
      {/* Yeh poori application mein notifications ke design ko control karega */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Dark theme ke liye default style
          style: {
            background: '#1e293b', // Tailwind ka slate-800 color
            color: '#e2e8f0',       // Tailwind ka slate-200 color
            border: '1px solid #334155', // Tailwind ka slate-700 color
          },
        }}
      />
    </>
  );
}

export default App;












