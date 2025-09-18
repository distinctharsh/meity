"use client";
import { FaSitemap, FaUsers, FaThLarge, FaChartBar } from "react-icons/fa";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-15 bg-white">
      <div className="flex flex-col gap-10 max-w-[1200px] mx-auto px-5 md:flex-row md:items-start md:justify-between">
        {/* Left Column - Content */}
        <div className="md:flex-[2]">
          <div className="flex items-center mb-5">
            <FaSitemap className="text-[28px] text-[#162f6a] mr-[15px]" />
            <h2 className="text-[24px] font-bold text-[#162f6a] m-0 pb-[5px] relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[50px] after:h-[3px] after:bg-[#ff6b35]">About Us</h2>
          </div>
          <p className="text-[15px] text-[#333] leading-[1.8] mb-[30px]">
            The Cabinet Secretariat, under Government of India, is a
            stand-alone ministerial agency, responsible for formulating and implementing national policies
            and programs aimed at enabling the continuous development of the electronics and IT industry.
            Cabinet Secretariat focus areas include the development, promotion, and regulation of the electronics and IT
            industry in India, fostering digital governance, enabling innovation in emerging technologies and
            promoting cybersecurity initiatives within country.
          </p>

          <div className="flex gap-5 flex-col sm:flex-row">
            <div className="flex-1 border border-[#162f6a] rounded p-[15px] px-[10px] text-center cursor-pointer transition-colors hover:bg-[#f0f4ff]">
              <FaUsers className="text-[20px] text-[#162f6a] mb-[10px] mx-auto" />
              <span className="text-[14px] font-semibold text-[#333]">Our Team</span>
            </div>
            <div className="flex-1 border border-[#162f6a] rounded p-[15px] px-[10px] text-center cursor-pointer transition-colors hover:bg-[#f0f4ff]">
              <FaThLarge className="text-[20px] text-[#162f6a] mb-[10px] mx-auto" />
              <span className="text-[14px] font-semibold text-[#333]">Our Organisations</span>
            </div>
            <div className="flex-1 border border-[#162f6a] rounded p-[15px] px-[10px] text-center cursor-pointer transition-colors hover:bg-[#f0f4ff]">
              <FaChartBar className="text-[20px] text-[#162f6a] mb-[10px] mx-auto" />
              <span className="text-[14px] font-semibold text-[#333]">Our Performance</span>
            </div>
          </div>
        </div>

        {/* Right Column - Ministers */}
        <div className="md:flex-[1]">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Minister 1 */}
            <div className="flex flex-col items-center">
              <div className="w-[215px] h-[200px] border-2 border-[#ebeaea] border-b-[6px] border-b-[#162f6a] flex items-center justify-center overflow-hidden bg-white">
                <Image
                  src="/images/about/ashwini.jpg"
                  alt="Shri Ashwini Vaishnaw"
                  width={215}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-[10px] text-center">
                <h3 className="text-[14px] font-bold text-[#162f6a] mb-[3px]">Shri Ashwini Vaishnaw</h3>
                <div className="text-[11px] text-[#666] uppercase tracking-[0.5px]">HON’BLE MINISTER</div>
              </div>
            </div>

            {/* Minister 2 */}
            <div className="flex flex-col items-center">
              <div className="w-[215px] h-[200px] border-2 border-[#ebeaea] border-b-[6px] border-b-[#162f6a] flex items-center justify-center overflow-hidden bg-white">
                <Image
                  src="/images/about/jitin.jpg"
                  alt="Shri Jitin Prasada"
                  width={215}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-[10px] text-center">
                <h3 className="text-[14px] font-bold text-[#162f6a] mb-[3px]">Shri Jitin Prasada</h3>
                <div className="text-[11px] text-[#666] uppercase tracking-[0.5px]">HON’BLE MINISTER OF STATE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
