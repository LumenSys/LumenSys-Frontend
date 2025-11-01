import { useState } from "react";
import Logo from "../../assets/images/logo.png"; // Try this path

type PopupType = "sobre" | "trabalho" | "conecte" | "contato" | "privacidade" | "termos" | "cookies" | "direitos";

const popups = {
  privacidade: "Política de Privacidade",
  termos: "Termos de Serviço",
  cookies: "Preferência de Cookies",
};

export default function Footer() {
  const [popupType, setPopupType] = useState<PopupType | null>(null);

  const closePopup = () => setPopupType(null);

  const renderPopupContent = () => {
    switch (popupType) {
      case "privacidade":
        return (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">🔒 Política de Privacidade</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                A Lumensys valoriza sua privacidade. Coletamos dados da sua empresa e representantes para oferecer nossos serviços com segurança.
              </p>
              <div>
                <strong className="text-gray-800">Usamos seus dados para:</strong>
                <p>Operar a plataforma, emitir cobranças, prestar suporte e cumprir obrigações legais.</p>
              </div>
              <div>
                <strong className="text-gray-800">Segurança:</strong>
                <p>Seus dados estão protegidos com criptografia e controle de acesso. Não vendemos suas informações.</p>
              </div>
              <div>
                <strong className="text-gray-800">Seus direitos:</strong>
                <p>Acesso, correção, exclusão e revogação de consentimentos.</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm">
                  📧 <a href="mailto:privacidade@lumensys.com.br" className="text-blue-600 hover:text-blue-700 underline">privacidade@lumensys.com.br</a>
                </p>
              </div>
            </div>
          </>
        );
      case "termos":
        return (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">📄 Termos de Serviço</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Ao utilizar nossos serviços, você concorda com os termos descritos aqui. Estes incluem regras de uso, responsabilidades e limitações legais.
              </p>
              <div>
                <strong className="text-gray-800">Uso adequado:</strong>
                <p>Não é permitido utilizar a plataforma para fins ilegais ou prejudiciais.</p>
              </div>
              <div>
                <strong className="text-gray-800">Responsabilidades:</strong>
                <p>A Lumensys não se responsabiliza por danos causados por uso indevido ou interrupções externas.</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm">
                  Para mais detalhes, entre em contato:<br />
                  📧 <a href="mailto:termos@lumensys.com.br" className="text-blue-600 hover:text-blue-700 underline">termos@lumensys.com.br</a>
                </p>
              </div>
            </div>
          </>
        );
      case "cookies":
        return (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">🍪 Preferência de Cookies</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo.
              </p>
              <div>
                <strong className="text-gray-800">Tipos de cookies:</strong>
                <p>Essenciais, de desempenho, de funcionalidade e de publicidade.</p>
              </div>
              <div>
                <strong className="text-gray-800">Controle:</strong>
                <p>Você pode gerenciar suas preferências a qualquer momento nas configurações do navegador.</p>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm">
                  📧 <a href="mailto:cookies@lumensys.com.br" className="text-blue-600 hover:text-blue-700 underline">cookies@lumensys.com.br</a>
                </p>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Seção Principal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo e Descrição */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 ">
                <img
                  src={Logo}
                  alt="LumenSys Logo"
                  className="w-8 h-8 mr-3 object-contain rounded"
                />
                <h3 className="text-xl font-bold">LumenSys</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Transformando a gestão empresarial com tecnologia inovadora.
                Soluções completas para o crescimento do seu negócio.
              </p>
              <div className="flex space-x-4">
                {/* Instagram */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Úteis */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Nosso trabalho</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fale Conosco</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Suporte</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Conecte-se Conosco</a></li>
                <li><a href="mailto:contato@lumensys.com.br" className="text-gray-300 hover:text-white transition-colors">contato@lumensys.com.br</a></li>
              </ul>
            </div>
          </div>

          {/* Linha Divisória */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Copyright */}
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Todos os direitos reservados. LumenSys.
              </div>

              {/* Links Legais */}
              <div className="flex flex-wrap justify-center gap-6">
                <button
                  onClick={() => setPopupType("privacidade")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Política de Privacidade
                </button>
                <button
                  onClick={() => setPopupType("termos")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Termos de Serviços
                </button>
                <button
                  onClick={() => setPopupType("cookies")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Preferência de Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal dos Popups */}
      {popupType && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {renderPopupContent()}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closePopup}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}