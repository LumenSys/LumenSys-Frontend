export default function LandingPage() {
  return (<main
    className="
      bg-background
      pt-4
      md:pt-0
      md:flex md:items-center md:justify-center
      md:min-h-[calc(100vh-120px)]
    "
  >
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold text-textPrimary leading-tight">
          Sistema completo para sua empresa!
        </h1>
        <p className="mt-4 text-sm md:text-base text-textSecondary leading-relaxed">
          Discover how our innovative designs can transform your brand and captivate your audience.
        </p>
        <button className="mt-6 bg-secondary text-background text-sm md:text-base px-5 py-2 md:px-6 md:py-3 rounded-lg hover:bg-hoverButton transition">
          Começar agora
        </button>
      </div>
      <div className="flex justify-center">
        <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </main>

  );
}
