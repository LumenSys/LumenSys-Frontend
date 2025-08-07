import { useState } from "react";

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
            <h2 className="text-lg font-semibold mb-2">🔒 Política de Privacidade – Lumensys</h2>
            <p className="mb-2">
              A Lumensys valoriza sua privacidade. Coletamos dados da sua empresa e representantes para oferecer nossos serviços com segurança.
            </p>
            <p className="mb-2">
              <strong>Usamos seus dados para:</strong> Operar a plataforma, emitir cobranças, prestar suporte e cumprir obrigações legais.
            </p>
            <p className="mb-2">
              <strong>Segurança:</strong> Seus dados estão protegidos com criptografia e controle de acesso. Não vendemos suas informações.
            </p>
            <p className="mb-2">
              <strong>Seus direitos:</strong> Acesso, correção, exclusão e revogação de consentimentos.
            </p>
            <p className="mb-4">
              📧 <a href="mailto:privacidade@lumensys.com.br" className="text-blue-600 underline">privacidade@lumensys.com.br</a>
            </p>
          </>
        );
      case "termos":
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">📄 Termos de Serviço – Lumensys</h2>
            <p className="mb-2">
              Ao utilizar nossos serviços, você concorda com os termos descritos aqui. Estes incluem regras de uso, responsabilidades e limitações legais.
            </p>
            <p className="mb-2">
              <strong>Uso adequado:</strong> Não é permitido utilizar a plataforma para fins ilegais ou prejudiciais.
            </p>
            <p className="mb-2">
              <strong>Responsabilidades:</strong> A Lumensys não se responsabiliza por danos causados por uso indevido ou interrupções externas.
            </p>
            <p className="mb-4">
              Para mais detalhes, entre em contato: 
              📧 <a href="mailto:termos@lumensys.com.br" className="text-blue-600 underline">termos@lumensys.com.br</a>
            </p>
          </>
        );
      case "cookies":
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">🍪 Preferência de Cookies – Lumensys</h2>
            <p className="mb-2">
              Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo.
            </p>
            <p className="mb-2">
              <strong>Tipos de cookies:</strong> Essenciais, de desempenho, de funcionalidade e de publicidade.
            </p>
            <p className="mb-2">
              <strong>Controle:</strong> Você pode gerenciar suas preferências a qualquer momento nas configurações do navegador.
            </p>
            <p className="mb-4">
              📧 <a href="mailto:cookies@lumensys.com.br" className="text-blue-600 underline">cookies@lumensys.com.br</a>
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <footer className="w-full bg-footer py-2">
        <div className="container mx-auto px-2">
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-2 text-xs text-textPrimary">
              <a href="#" className="hover:underline">Sobre nós</a>
              <a href="#" className="hover:underline">Nosso trabalho</a>
              <a href="#" className="hover:underline">Conecte-se Conosco</a>
              <a href="#" className="hover:underline">Fale Conosco</a>
            </div>

            <div className="mx-auto w-5/6 border-t-[0.5px] border-textSecondary space-x-2.5 md:space-x-4"></div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs text-textSecondary">
              <p className="m-0">© 2025 Todos os direitos reservados. LumenSys.</p>
              <button
                onClick={() => setPopupType("privacidade")}
                className="hover:underline text-textSecondary"
              >
                Política de Privacidade
              </button>
              <button
                onClick={() => setPopupType("termos")}
                className="hover:underline text-textSecondary"
              >
                Termos de Serviços
              </button>
              <button
                onClick={() => setPopupType("cookies")}
                className="hover:underline text-textSecondary"
              >
                Preferência de Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      {popupType && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md shadow-lg text-sm text-gray-700">
            {renderPopupContent()}
            <button
              onClick={closePopup}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
