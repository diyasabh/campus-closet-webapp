export default function PrivacyPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc-light-peach to-cc-cream">
        <div className="max-w-4xl mx-auto py-16 px-6">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-cc-dark-red mb-4">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">Last updated: June 1, 2025</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-8">
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-cc-dark-red border-b-2 border-cc-pink pb-2">
                Information We Collect
              </h2>
              <div className="space-y-6">
                <div className="bg-cc-pink/30 rounded-xl p-6">
                  <h3 className="font-serif text-xl font-medium mb-3 text-cc-dark-red">Account Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you create an account, we collect your Stanford email address, full name, phone number, and optional Instagram handle.
                  </p>
                </div>
                <div className="bg-cc-light-orange/20 rounded-xl p-6">
                  <h3 className="font-serif text-xl font-medium mb-3 text-cc-dark-red">Listing Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you list items, we collect photos, descriptions, pricing, and other details about your clothing items.
                  </p>
                </div>
                <div className="bg-cc-cream/50 rounded-xl p-6">
                  <h3 className="font-serif text-xl font-medium mb-3 text-cc-dark-red">Transaction Data</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We record rental transactions, including dates, fees, and communication between users for safety and dispute resolution.
                  </p>
                </div>
              </div>
            </section>
  
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-cc-dark-red border-b-2 border-cc-pink pb-2">
                How We Use Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Facilitate clothing rentals between Stanford students",
                  "Verify Stanford community membership",
                  "Communicate rental details and updates",
                  "Ensure platform safety and prevent fraud"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/50 rounded-lg p-4">
                    <div className="w-2 h-2 bg-cc-red rounded-full"></div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>
  
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-cc-dark-red border-b-2 border-cc-pink pb-2">
                Information Sharing
              </h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-cc-pink/20 to-cc-light-orange/20 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-cc-dark-red">With Other Users:</strong> Your name and Instagram handle are visible to other users when you list items or rent from others. Contact information is shared only when a rental is confirmed.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-cc-light-orange/20 to-cc-cream/30 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-cc-dark-red">We Never Share:</strong> Your email address, phone number, or personal information with third parties for marketing purposes.
                  </p>
                </div>
              </div>
            </section>
  
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-cc-dark-red border-b-2 border-cc-pink pb-2">
                Your Rights
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Access and download your personal data",
                  "Correct inaccurate information",
                  "Delete your account and associated data",
                  "Opt out of non-essential communications"
                ].map((right, index) => (
                  <div key={index} className="bg-cc-pink/20 rounded-lg p-4 border-l-4 border-cc-red">
                    <p className="text-gray-700 font-medium">{right}</p>
                  </div>
                ))}
              </div>
            </section>
  
            <section className="bg-gradient-to-r from-cc-dark-red to-cc-red rounded-xl p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-white">Contact Us</h2>
              <p className="text-white/90 text-lg">
                Questions about this privacy policy? Contact us at{' '}
                <a href="mailto:privacy@campuscloset.stanford.edu" className="underline text-cc-light-peach hover:text-white transition-colors">
                  privacy@campuscloset.stanford.edu
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }