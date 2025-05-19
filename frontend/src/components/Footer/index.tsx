export default function Footer() {

  return (
    <footer className="bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex justify-center space-x-6 text-sm text-textPrimary">
          <a href="#" className="hover:underline">Sobre nós</a>
          <a href="#" className="hover:underline">Our Work</a>
          <a href="#" className="hover:underline">Connect with Us</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </nav>
      </div>

      <div className="mx-auto w-5/6 border-t-[0.5px] border-neutralDark"></div>
      <div className="max-w-4xl mx-auto px-20 py-4 flex flex-col md:flex-row items-center justify-between text-[16px] text-textPrimary">
        <p className="mb-0">
          © 2025 Todos os direitos reservados. LumenSys.
        </p>

        <div className="flex flex-col md:flex-row items-center md:space-x-4">
          <a href="#" className="hover:underline">Política de Privacidade</a>
          <a href="#" className="hover:underline">Termos de Serviços</a>
          <a href="#" className="hover:underline">Preferência de Cookies</a>
        </div>
      </div>

    </footer>
  );
}