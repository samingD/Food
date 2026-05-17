export default function About() {
  return (
    <div className="min-h-screen bg-bg py-16 px-8 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-primary uppercase font-bold text-xs tracking-[0.15em] mb-4 block">
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-black mb-6">
            About Us
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="prose prose-lg max-w-none text-text-muted">
            <p className="text-xl leading-relaxed text-black font-medium mb-8 text-center">
              IMANIGLOBAL AGRO LIMITED is a trusted supplier of high-quality agricultural commodities. We specialize in sourcing and delivering charcoal, cashew nuts, shea butter, cola nuts, and hibiscus flower to businesses and individuals worldwide.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
              <div>
                <h3 className="font-bold text-black text-xl mb-4 uppercase tracking-wider">Our Mission</h3>
                <p>
                  To bridge the gap between local farmers and global markets by providing a reliable, transparent, and efficient supply chain for premium agricultural products. We are committed to sustainable practices that benefit both our clients and the communities we source from.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-black text-xl mb-4 uppercase tracking-wider">Our Vision</h3>
                <p>
                  To be the leading global exporter of African agricultural commodities, recognized for our unwavering commitment to quality, integrity, and customer satisfaction.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded border border-gray-100 text-center mt-12">
              <h3 className="font-display text-2xl font-bold text-black mb-4">Our Focus is Simple</h3>
              <p className="text-lg text-primary font-semibold italic">
                Quality, Reliability, and Customer Satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
