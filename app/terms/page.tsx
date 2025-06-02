export default function TermsPage() {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto py-16 px-6">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600 text-lg">Last updated: June 1, 2025</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-gray-900 border-b-2 border-gray-200 pb-2">
                Eligibility
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Must be a current Stanford University student, faculty, or staff member",
                  "Must verify identity with valid Stanford email address",
                  "Must be 18+ years old or have parental consent",
                  "Must agree to all terms and conditions"
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-cc-orange">
                    <p className="text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </section>
  
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-gray-900 border-b-2 border-gray-200 pb-2">
                Platform Rules
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="font-serif text-xl font-medium mb-4 text-gray-900">For Renters</h3>
                  <ul className="space-y-3">
                    {[
                      "Return items in the same condition as received",
                      "Pay rental fees and deposits on time",
                      "Communicate respectfully with item owners",
                      "Report any damages or issues immediately"
                    ].map((rule, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-cc-red rounded-full mt-2"></div>
                        <p className="text-gray-700">{rule}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="font-serif text-xl font-medium mb-4 text-gray-900">For Lenders</h3>
                  <ul className="space-y-3">
                    {[
                      "List items honestly and accurately",
                      "Ensure items are clean and in good condition",
                      "Respond to rental requests promptly",
                      "Be available for pickup and return coordination"
                    ].map((rule, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-cc-orange rounded-full mt-2"></div>
                        <p className="text-gray-700">{rule}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
  
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-gray-900 border-b-2 border-gray-200 pb-2">
                Payments & Deposits
              </h2>
              <div className="space-y-4">
                {[
                  "Rental fees are paid upfront when booking is confirmed",
                  "Security deposits are held during rental period",
                  "Deposits are fully refunded upon safe return of items",
                  "Damage costs may be deducted from security deposits"
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-cc-orange">
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>
  
            <section>
              <h2 className="font-serif text-3xl font-semibold mb-6 text-gray-900 border-b-2 border-gray-200 pb-2">
                Liability & Disputes
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Campus Closet facilitates connections between students but is not responsible for:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Lost, stolen, or damaged items",
                    "Failed meetups or communication issues",
                    "Disputes between users",
                    "Third-party payment processing issues"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Users engage in rentals at their own risk and are encouraged to communicate clearly and meet in safe, public locations on campus.
                </p>
              </div>
            </section>
  
            <section className="bg-cc-dark-red rounded-xl p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-white">Questions?</h2>
              <p className="text-white/90 text-lg">
                Contact us at{' '}
                <a href="mailto:legal@campuscloset.stanford.edu" className="underline text-white hover:text-gray-200 transition-colors">
                  legal@campuscloset.stanford.edu
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }