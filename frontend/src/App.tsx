import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';
import ListOfCompanies from './pages/Listofcompanies';
import CadastroEmpresa from './pages/CadastroEmpresa';
import Registration from './pages/Registration/UserRegistration';
import Login from './pages/LoginPage';
import Landing from './pages/LandingPage';
import GerenciarPlanos from './pages/GerenciarPlanos';
import DashBoard from './pages/DashBoard';
import Servicos from './pages/Servicos';
import Contratos from './pages/Contratos';
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
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/gerenciarplanos" element={<GerenciarPlanos />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/contratos" element={<Contratos/>} />
            </Routes>
          </main>
        </div>
      </Router>
    </CompanyProvider>
  );
}

export default App;