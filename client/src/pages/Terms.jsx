const h2 = { fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', margin: '32px 0 12px' };
const p = { fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', margin: '0 0 12px' };

export default function Terms() {
  return (
    <div className="max-w-7xl mx-auto" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', maxWidth: '760px' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', margin: '0 0 8px' }}>
        Terms &amp; Conditions
      </h1>
      <p style={{ ...p, color: 'var(--text-muted)' }}>Last updated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <h2 style={h2}>Product inquiries</h2>
      <p style={p}>Product listings are for browsing and inquiry. This website does not display product prices or accept checkout orders. Contact us on WhatsApp about a specific product to confirm its price and availability before making a decision.</p>

      <h2 style={h2}>Repairs</h2>
      <p style={p}>Repair enquiries open a prefilled WhatsApp chat. You must tap Send in WhatsApp for your message to reach us. Our team can then reply about next steps and an estimate. We are not responsible for pre-existing damage or data loss — back up your device before service.</p>

      <h2 style={h2}>Buy &amp; sell</h2>
      <p style={p}>Quotes for devices submitted through our buy/sell form are estimates and may change after in-person inspection. We are not obligated to purchase any device we determine to be misrepresented, stolen, or non-functional beyond the stated condition.</p>

      <h2 style={h2}>Reviews</h2>
      <p style={p}>Reviews must reflect genuine opinions about a product. We may remove reviews that are abusive, spam, or unrelated to the product.</p>

      <h2 style={h2}>Disclaimer</h2>
      <p style={p}>The site and its services are provided "as is" without warranties of any kind beyond those stated on individual repair or product listings. We are not liable for indirect or incidental damages arising from use of the site.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions about these terms can be sent through our <a href="/contact" style={{ color: 'var(--brand-primary)' }}>contact page</a>.</p>
    </div>
  );
}
