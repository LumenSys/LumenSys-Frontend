export default function Footer() {

  return (
<footer className="w-full bg-footer py-2">
      <div className="container mx-auto px-2">
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-2 text-xs text-textPrimary">
          <a href="#" className="hover:underline">Sobre nós</a>
          <a href="#" className="hover:underline">Our Work</a>
          <a href="#" className="hover:underline">Connect with Us</a>
          <a href="#" className="hover:underline">Contact Us</a>
          </div>

          <div className="mx-auto w-5/6 border-t-[0.5px] border-textSecondary space-x-2.5 md:space-x-4 "></div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs text-textSecondary ">
            <p className="m-0">© 2025 Todos os direitos reservados. LumenSys.</p>
            <a href="#" className="hover:underline">Política de Privacidade</a>
            <a href="#" className="hover:underline">Termos de Serviços</a>
            <a href="#" className="hover:underline">Preferência de Cookies</a>
          </div>
        </div>
      </div>
    </footer>

  );
}