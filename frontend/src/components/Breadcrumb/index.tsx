import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="text-sm text-textSecondary mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/dashboard" className="hover:underline">Home</Link>
        </li>
        {pathnames.map((name, idx) => {
          const routeTo = '/' + pathnames.slice(0, idx + 1).join('/');
          const isLast = idx === pathnames.length - 1;
          return (
            <li key={routeTo} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="font-semibold text-textPrimary">{decodeURIComponent(name)}</span>
              ) : (
                <Link to={routeTo} className="hover:underline">{decodeURIComponent(name)}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

