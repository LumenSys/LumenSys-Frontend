import { useNavigate } from 'react-router-dom'
import { routes } from '../../routes/routes'
import Logo from '../../assets/images/logo.png'

export default function Header() {
  const navigate = useNavigate()
  const handleLoginClick = () => navigate(routes.LOGIN)

  return (
    <header className="w-full bg-primary text-textPrimary shadow-md fixed top-0 z-50">
      <div className="w-full flex items-center justify-between h-[58px] px-4 md:px-16">


        <div className="order-1">
          <a href="/">
            <img src={Logo} alt="Logo" className="h-12 md:h-14 rounded cursor-pointer" />
          </a>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 order-2">
          <nav className="hidden md:flex space-x-4 text-sm font-normal">
            <a href="/dashboard" className="hover:text-textSecondary">Home</a>
            <a href="#" className="hover:text-textSecondary">Our Story</a>
            <a href="#" className="hover:text-textSecondary">Our Team</a>
          </nav>
          <button
            onClick={handleLoginClick}
            className="hidden md:inline-block bg-surface px-3 py-1.5 border border-textSecondary text-textSecondary rounded text-sm transition hover:bg-neutralLighter"
          >
            Access Account
          </button>
          <button
            onClick={() => { }}
            className="hidden md:inline-block bg-secondary text-white px-3 py-1.5 rounded text-sm transition hover:bg-hoverSuccess hover:text-textSecondary"
          >
            Join Us
          </button>
          <button className="md:hidden text-xl leading-none">
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
