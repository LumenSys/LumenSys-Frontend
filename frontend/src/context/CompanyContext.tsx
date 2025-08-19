// src/contexts/CompanyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Company {
  id: number;
  name: string;
  cnpj: string;
  email: string;
  tradeName?: string;
  phone?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  uf?: string;
}

interface CompanyContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: number, company: Partial<Company>) => void;
  deleteCompany: (id: number) => void;
  getCompanyById: (id: number) => Company | undefined;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const mockCompanies: Company[] = [
  { id: 1, name: "Empresa Alpha", cnpj: "12.345.678/0001-99", email: "contato@alpha.com" },
  { id: 2, name: "Empresa Beta", cnpj: "98.765.432/0001-11", email: "contato@beta.com" },
  { id: 3, name: "Empresa Gama", cnpj: "11.222.333/0001-44", email: "contato@gama.com" },
  { id: 4, name: "Empresa Delta", cnpj: "22.333.444/0001-55", email: "contato@delta.com" },
  { id: 5, name: "Empresa Epsilon", cnpj: "33.444.555/0001-66", email: "contato@epsilon.com" },
  { id: 6, name: "Empresa Zeta", cnpj: "44.555.666/0001-77", email: "contato@zeta.com" },
];

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);

  const addCompany = (companyData: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...companyData,
      id: Math.max(...companies.map(c => c.id), 0) + 1,
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: number, updatedData: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id ? { ...company, ...updatedData } : company
      )
    );
  };

  const deleteCompany = (id: number) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  const getCompanyById = (id: number) => {
    return companies.find(company => company.id === id);
  };

  return (
    <CompanyContext.Provider value={{
      companies,
      addCompany,
      updateCompany,
      deleteCompany,
      getCompanyById
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanies = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompanyProvider');
  }
  return context;
};