import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IndustryProvider } from './context/IndustryContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';

export default function App() {
  return (
    <IndustryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </IndustryProvider>
  );
}
