import Landing from "../../assets/images/landing.png";

export default function LandingPage() {
  return (
    <main className="bg-background min-h-[calc(100vh-120px)] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Seção de Texto */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-secondary/10 rounded-full">
              <span className="text-secondary text-sm font-medium">
                ✨ Solução Empresarial Completa
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-textPrimary leading-tight">
              Sistema completo para{" "}
              <span className="text-secondary">sua empresa</span>!
            </h1>
            
            <p className="text-lg text-textSecondary leading-relaxed max-w-xl">
              Transforme a gestão da sua empresa com nossa plataforma inovadora. 
              Controle financeiro, gestão de equipes e relatórios inteligentes em um só lugar.
            </p>
          </div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">📊</span>
              </div>
              <span className="text-sm font-medium text-textPrimary">Relatórios Avançados</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">🔒</span>
              </div>
              <span className="text-sm font-medium text-textPrimary">Segurança Total</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <span className="text-secondary text-sm">⚡</span>
              </div>
              <span className="text-sm font-medium text-textPrimary">Setup Rápido</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="bg-secondary text-background text-base font-semibold px-8 py-4 rounded-xl hover:bg-hoverButton2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => window.location.href = "/cadastroempresa"}
            >
              Começar Gratuitamente
            </button>
            
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center bg-white text-textPrimary text-base font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-secondary hover:text-secondary transition-all duration-300"
            >
              Ver Dashboard
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Seção da Imagem */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            
            {/* Container da imagem */}
            <div className="relative bg-white p-4 rounded-2xl">
              <img
                src={Landing}
                alt="Dashboard da plataforma LumenSys mostrando interface moderna e intuitiva"
                className="w-full h-auto max-w-lg rounded-xl"
              />
              
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}