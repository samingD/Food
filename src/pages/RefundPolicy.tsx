export default function RefundPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8 uppercase tracking-wider text-black border-b pb-4">Refund / Return Policy</h1>
        <div className="prose prose-lg text-text-muted max-w-none">
          <p>We ensure that our products meet export quality standards before dispatch. Our return policy assumes the following guidelines.</p>
          
          <h2 className="text-black font-bold mt-8 mb-4">1. Eligibility</h2>
          <p>Due to the nature of agricultural commodities, returns are only accepted if the product does not materially match the specifications outlined in the final sales agreement. You must notify us within 3 days of receiving the cargo if there is an issue.</p>
          
          <h2 className="text-black font-bold mt-8 mb-4">2. Process</h2>
          <p>To initiate a review, please contact us immediately with clear photographic evidence of any issues. Our quality assurance team will evaluate the claim.</p>

          <h2 className="text-black font-bold mt-8 mb-4">3. Refunds</h2>
          <p>If a return/refund is approved, refunds will optionally be credited securely via the original method of payment or compensated through replacement in future shipments, depending on our agreement.</p>
        </div>
      </div>
    </div>
  );
}
