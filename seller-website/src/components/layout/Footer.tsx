export function Footer() {
  return (
    <footer className="bg-black text-white py-20 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-20">
          <div className="space-y-6">
            <div className="text-2xl font-bold tracking-tighter italic">
              Trend<span className="text-gray-400">Mart</span>{" "}
              <span className="text-black bg-white px-2 py-0.5 rounded text-xs uppercase tracking-widest font-black">
                Sellers
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
              The world's most advanced platform for premium digital commerce.
              Built for trendsetters.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
              Support
            </h4>
            <ul className="space-y-4">
              {[
                "Help Center",
                "Seller Policies",
                "Contact Support",
                "API Reference",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
              Company
            </h4>
            <ul className="space-y-4">
              {[
                "About Us",
                "Sustainability",
                "Terms of Service",
                "Privacy Pact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
              Global Offices
            </h4>
            <div className="space-y-2">
              <p className="text-sm font-bold">
                Paris • Milan • Brussels • Tokyo
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                © 2026 TrendMart Signature
              </p>
            </div>
          </div>
        </div>

        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            Elite Seller Tier • Verified Identity Required
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
            <span>Instagram</span>
            <span>Vogue</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
