import Landing from "../../assets/images/landing.png";

export default function LandingPage() {
  return (
    <main className=" bg-background pt-4 md:pt-0 md:flex md:items-center md:justify-center md:min-h-[calc(100vh-120px)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-textPrimary leading-tight">
            Sistema completo para sua empresa!
          </h1>
          <p className="mt-4 text-sm md:text-base text-textSecondary leading-relaxed">
            Discover how our innovative designs can transform your brand and captivate your audience.
          </p>
          <button
            className="mt-6 bg-secondary text-background text-sm md:text-base px-5 py-2 md:px-6 md:py-3 rounded-lg hover:bg-hoverButton2 transition"
            onClick={() => window.location.href = "/cadastroempresa"}
          >
            Começar agora
          </button>
          <a
            href="/dashboard"
            className="inline-block mt-4 ml-4 bg-primary text-background text-sm md:text-base px-5 py-2 md:px-6 md:py-3 rounded-lg hover:bg-hoverButton2 transition"
          >
            Ir para Dashboard
          </a>
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center items-center">
            <img
              src={Landing}
              alt="Ilustração de dashboard"
              className="max-w-full h-auto md:h-[420px]"
            />
          </div>
        </div>
      </div>
    </main>

  );
}
