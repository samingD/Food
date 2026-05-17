export default function ShippingPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8 uppercase tracking-wider text-black border-b pb-4">Shipping Policy</h1>
        <div className="prose prose-lg text-text-muted max-w-none">
          <p>IMANIGLOBAL leverages trusted global logistics partners to deliver your agricultural products securely and efficiently.</p>
          
          <h2 className="text-black font-bold mt-8 mb-4">1. Dispatch Times</h2>
          <p>All orders are processed post payment clearance. Freight logistics vary depending on the country selected and standard processing time.</p>
          
          <h2 className="text-black font-bold mt-8 mb-4">2. Shipping Options</h2>
          <p>We provide multiple shipping routes (Cargo and Standard Shipping). Timelines and rates depend exclusively on the shipping type selected during checkout.</p>

          <h2 className="text-black font-bold mt-8 mb-4">3. Customs, Duties & Taxes</h2>
          <p>IMANIGLOBAL is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</p>
        </div>
      </div>
    </div>
  );
}
