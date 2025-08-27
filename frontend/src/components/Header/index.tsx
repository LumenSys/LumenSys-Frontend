import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { routes } from '../../routes/routes'
import Logo from '../../assets/images/logo.png'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLoginClick = () => navigate(routes.LOGIN)
  const handleJoinClick = () => navigate(routes.USERSIGNUP)

  const knownPaths = [routes.LANDING, routes.LOGIN, routes.USERSIGNUP, routes.DASHBOARD, routes.MANAGE_PLANS, routes.CADASTRO_EMPRESA];
  const isNotFound = !knownPaths.includes(location.pathname);
  const showAuthButtons = [routes.LANDING, routes.LOGIN, routes.USERSIGNUP].includes(location.pathname) && !isNotFound;
  const showNavLinks = ![routes.LANDING, routes.LOGIN, routes.USERSIGNUP].includes(location.pathname) && !isNotFound;

  return (

    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 text-textPrimary shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl flex items-center h-20 px-2">
        {/* Logo */}
        <div className="flex items-center justify-start flex-1 mr-8">
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
      </div>

      {showAuthButtons && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-4">
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
    </header>
  )
}