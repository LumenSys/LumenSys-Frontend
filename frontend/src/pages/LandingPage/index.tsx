export default function LandingPage() {
  return (
    <main className="flex-grow pt-[120px] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold text-textPrimary">
            Sistema completo para sua empresa!
          </h1>
          <p className="text-textSecondary mt-4">
            Discover how our innovative designs can transform your brand and captivate your audience.
          </p>
          <button className="mt-6 bg-secondary text-background px-6 py-3 rounded-lg hover:bg-hoverButton transition">
            Começar agora
          </button>
        </div>
        <div>
          <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </main>
  );
}
