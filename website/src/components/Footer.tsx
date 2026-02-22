import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 px-4">
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">
              About
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[#9e9e9e]">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  ShopX Stories
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">
              Help
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[#9e9e9e]">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Payments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cancellation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">
              Policy
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[#9e9e9e]">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms Of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">
              Social
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[#9e9e9e]">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#333333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[#6b7280] font-bold tracking-widest uppercase px-4 text-center">
          <div className="flex gap-8">
            <span>© 2024 SHOPX. INC.</span>
            <span className="cursor-pointer hover:text-white">India</span>
          </div>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-white">
              Modern Retail Experience
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
