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
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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