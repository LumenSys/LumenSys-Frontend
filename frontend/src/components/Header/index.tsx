import { useNavigate} from 'react-router-dom';
import { routes } from "../../routes/routes";
import Logo from "../../assets/images/logo.png";

export default function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(routes.LOGIN);
  };

  return (
    <header className="w-full h-[58px] bg-primary text-textPrimary shadow-md fixed ">
    <div className="flex items-center justify-between h-full px-4 space-x-[15px] mr-8">

      <div className="flex items-center h-full ml-8 rounded">
        <img src={Logo} alt="Logo" className="h-11 rounded" />
      </div>

      <div className="flex items-center gap-5 h-full">
      <nav className="flex space-x-4 text-textPrimary font-normal text-sm">
          <a href="#" className="hover:text-textSecondary ">Home</a>
          <a href="#" className="hover:text-textSecondary">Our Story</a>
          <a href="#" className="hover:text-textSecondary">Our Team</a>
        </nav>

        <button
          onClick={handleLoginClick}
          className="bg-surface px-3 py-1.5 border border-textSecondary text-textSecondary rounded transition hover:bg-neutralLighter text-sm"
        >
          Access Account
        </button>
        <button
          onClick={() => console.log('Join Us clicked')}
          className="bg-secondary text-white hover:bg-hoverSuccess px-3 py-1.5 rounded transition hover:text-textSecondary text-sm"
        >
          Join Us
        </button>
      </div>

    </div>
  </header>

);
}
