import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardEditorPage } from './pages/DashboardEditorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/:id" element={<DashboardEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
