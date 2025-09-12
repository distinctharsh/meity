import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#0B2C6A] text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          
          {/* Left Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">USEFUL LINKS</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Archives</a></li>
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Sitemap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Website Policies</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Website Policies</a></li>
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Related Links</h4>
              <ul className="space-y-2 text-base">
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Related Links</a></li>
                <li><a href="#" className="hover:underline flex items-center"><span aria-hidden="true" className="material-symbols-outlined bhashini-skip-translation mr-2">chevron_right</span>Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="text-lg font-semibold">SUBSCRIBE FOR UPDATES</h4>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#"><Image src="/images/footer/x.jpg" alt="Twitter" width={28} height={28} /></a>
              <a href="#"><Image src="/images/footer/youtube.jpg" alt="YouTube" width={28} height={28} /></a>
              <a href="#"><Image src="/images/footer/facebook.jpg" alt="Facebook" width={28} height={28} /></a>
              <a href="#"><Image src="/images/footer/instagram.jpg" alt="Instagram" width={28} height={28} /></a>
            </div>

            {/* Logos */}
            <div className="flex space-x-8">
              <div className="bg-white p-3 rounded-lg">
                <Image src="/images/footer/mygovmerisarkar.jpg" alt="MyGov" width={90} height={40} />
              </div>
              <div className="bg-white p-3 rounded-lg">
                <Image src="/images/footer/indiaportal.svg" alt="India Portal" width={90} height={40} />
              </div>
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-300">Last Updated On: 12.09.2025</p>
          </div>
        </div>

        {/* Footer Bottom Text */}
        <div className=" text-left text-gray-300 text-base">
          This Website belongs to Ministry of Electronics and Information Technology, Government of India
        </div>
      </div>
    </footer>
  );
};

export default Footer;
