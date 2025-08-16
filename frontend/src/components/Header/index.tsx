import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { routes } from '../../routes/routes'
import Logo from '../../assets/images/logo.png'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const handleLoginClick = () => navigate(routes.LOGIN)
  const handleJoinClick = () => navigate(routes.USERSIGNUP)

  const knownPaths = [routes.LANDING, routes.LOGIN, routes.USERSIGNUP, routes.DASHBOARD, routes.MANAGE_PLANS, routes.CADASTRO_EMPRESA];
  const isNotFound = !knownPaths.includes(location.pathname);
  const showAuthButtons = [routes.LANDING, routes.LOGIN, routes.USERSIGNUP].includes(location.pathname) && !isNotFound;
  const showNavLinks = ![routes.LANDING, routes.LOGIN, routes.USERSIGNUP].includes(location.pathname) && !isNotFound;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 text-textPrimary shadow-sm fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-8">
          {/* Logo */}
            <div className="flex items-center justify-start flex-1 mr-16">
              <a href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <img 
                src={Logo} 
                alt="LumenSys Logo" 
                className="h-16 w-auto rounded-lg transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <span className="text-2xl font-bold text-gray-800 hidden sm:block">
                LumenSys
              </span>
              </a>
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 justify-end">
            {showNavLinks && (
              <nav className="flex space-x-10 mr-8">
                <a 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-secondary font-medium transition-colors duration-200 relative group px-2 py-3"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-secondary font-medium transition-colors duration-200 relative group px-2 py-3"
                >
                  Nossa História
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-secondary font-medium transition-colors duration-200 relative group px-2 py-3"
                >
                  Equipe
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-secondary font-medium transition-colors duration-200 relative group px-2 py-3"
                >
                  Contato
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                </a>
              </nav>
            )}

            {showAuthButtons && (
              <div className="flex items-center space-x-6 ml-8">
                <button
                  onClick={handleLoginClick}
                  className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Fazer Login
                </button>
                <button
                  onClick={handleJoinClick}
                  className="px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-hoverButton2 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Começar Agora
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {!isNotFound && (
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <svg 
                className={`w-7 h-7 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && !isNotFound && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-8 py-6 space-y-6">
              {showNavLinks && (
                <nav className="space-y-5">
                  <a 
                    href="/dashboard" 
                    className="block text-gray-700 hover:text-secondary font-medium py-3 border-b border-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </a>
                  <a 
                    href="#" 
                    className="block text-gray-700 hover:text-secondary font-medium py-3 border-b border-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    Nossa História
                  </a>
                  <a 
                    href="#" 
                    className="block text-gray-700 hover:text-secondary font-medium py-3 border-b border-gray-100"
                    onClick={toggleMobileMenu}
                  >
                    Equipe
                  </a>
                  <a 
                    href="#" 
                    className="block text-gray-700 hover:text-secondary font-medium py-3"
                    onClick={toggleMobileMenu}
                  >
                    Contato
                  </a>
                </nav>
              )}

              {showAuthButtons && (
                <div className="pt-6 border-t border-gray-200 flex flex-row items-center justify-between space-x-4">
                  <button
                    onClick={() => {
                      handleLoginClick()
                      toggleMobileMenu()
                    }}
                    className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex-1"
                  >
                    Fazer Login
                  </button>
                  <button
                    onClick={() => {
                      handleJoinClick()
                      toggleMobileMenu()
                    }}
                    className="px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-hoverButton2 transition-colors duration-200 flex-1"
                  >
                    Começar Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}