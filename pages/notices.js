import Offerings from "@/components/Offerings";
import Footer from "@/components/Footer";
import { t } from '@/lib/translations';

export default function OfferingsPage() {
  return (
    <>
      <main id="main">
        {/* Offerings Hero Section */}
        <section className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('our_offerings')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {t('offerings_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Main Offerings Component */}
        <Offerings />

        {/* Additional Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                {t('digital_services')}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">account_balance</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">{t('digital_governance')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('digital_governance_desc')}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• {t('online_application_processing')}</li>
                    <li>• {t('digital_document_verification')}</li>
                    <li>• {t('e_governance_portals')}</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">school</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">{t('digital_education')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('digital_education_desc')}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• {t('online_learning_platforms')}</li>
                    <li>• {t('digital_classrooms')}</li>
                    <li>• {t('e_library_resources')}</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">health_and_safety</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">{t('digital_health')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('digital_health_desc')}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• {t('telemedicine_services')}</li>
                    <li>• {t('digital_health_records')}</li>
                    <li>• {t('health_monitoring_apps')}</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">business</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">{t('digital_commerce')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('digital_commerce_desc')}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• {t('online_marketplaces')}</li>
                    <li>• {t('digital_payment_systems')}</li>
                    <li>• {t('e_invoicing_solutions')}</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">security</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">{t('cybersecurity')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('cybersecurity_desc')}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• {t('threat_detection')}</li>
                    <li>• {t('data_protection')}</li>
                    <li>• {t('security_audits')}</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#123a6b] rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#123a6b]">{t('ai_innovation')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('ai_innovation_desc')}
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• {t('ai_powered_services')}</li>
                    <li>• {t('machine_learning_tools')}</li>
                    <li>• {t('innovation_labs')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#123a6b]">
                {t('success_stories')}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-[#123a6b] to-[#1e4a7a] text-white p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">{t('digital_india_impact')}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t('digital_transactions')}</span>
                      <span className="text-2xl font-bold">₹100+ Cr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('citizens_served')}</span>
                      <span className="text-2xl font-bold">50+ Cr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('services_online')}</span>
                      <span className="text-2xl font-bold">3000+</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-[#123a6b]">{t('key_achievements')}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>100% {t('digital_payment_infrastructure')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>{t('universal_internet_connectivity')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>{t('digital_literacy_programs')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-green-500 mr-3 mt-1">check_circle</span>
                      <span>{t('e_governance_excellence')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
