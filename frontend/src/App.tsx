import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';
import ListOfCompanies from './pages/Listofcompanies';
import CadastroEmpresa from './pages/CadastroEmpresa';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <CompanyProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <main className="ml-64 flex-1 min-h-screen">
            <Routes>
              <Route path="/listaempresas" element={<ListOfCompanies />} />
              <Route path="/CadastroEmpresa" element={<CadastroEmpresa />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CompanyProvider>
  );
}

export default App;