import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { routes } from "../../routes/routes";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

export default function LandingPage() {
  useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(routes.LOGIN);
  };

  return (
    <div className="flex">
      <header className="w-full h-[55px] bg-primary text-textPrimary shadow-md fixed ">
        <div className="max-w-7x1 flex items-center justify-between h-full px-4 space-x-[15px] mr-8">

          {/* Logo */}
          <div className="flex items-center h-full ml-8">
            <img src={Logo} alt="Logo" className="h-12 rounded" />
          </div>

          <div className="flex items-center gap-2 h-full">
          <nav className="flex space-x-4 text-textPrimary font-normal text-3x4">
              <a href="#" className="hover:text-primary">Home</a>
              <a href="#" className="hover:text-primary">Our Story</a>
              <a href="#" className="hover:text-primary">Our Team</a>
            </nav>

            <button
              onClick={handleLoginClick}
              className="bg-surface px-4 py-1.5 border border-textSecondary text-textSecondary rounded transition hover:bg-neutralLighter text-3x4"
            >
              Access Account
            </button>
            <button
              onClick={() => console.log('Join Us clicked')}
              className="bg-secondary text-white hover:bg-hoverSuccess px-4 py-1.5 rounded transition text-3x4"
            >
              Join Us
            </button>
          </div>

        </div>
      </header>
    </div>
  );
}
