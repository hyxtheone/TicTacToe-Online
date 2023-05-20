import {Routes, Route} from "react-router-dom";

import Home from './pages/home/home.jsx';
import Play from './pages/play/play.jsx';
import Online from './pages/online/online.jsx'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="play" element={<Play />} />
        <Route path="online" element={<Online />} />
      </Routes>
    </div>
  );
}

export default App;