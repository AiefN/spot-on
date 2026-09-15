import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AddSpot from './pages/AddSpot';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/add-spot" element={<AddSpot />} />
          </Routes>
    );
}

export default App;
