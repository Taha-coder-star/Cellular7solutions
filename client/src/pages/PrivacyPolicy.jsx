const h2 = { fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', margin: '32px 0 12px' };
const p = { fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', margin: '0 0 12px' };

export default function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto" style={{ padding: 'var(--space-10) var(--space-6) var(--pad-section)', maxWidth: '760px' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', margin: '0 0 8px' }}>
        Privacy Policy
      </h1>
      <p style={{ ...p, color: 'var(--text-muted)' }}>Last updated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <h2 style={h2}>What we collect</h2>
      <p style={p}>When you submit a website form, we collect the information it asks for. Repair and buy/sell enquiries open as WhatsApp drafts; they are not submitted to our website or admin panel. If you tap Send in WhatsApp, the conversation is handled there.</p>

      <h2 style={h2}>How we use it</h2>
      <p style={p}>We use information from website forms to fulfil the relevant request, such as processing an order or displaying a review. Repair and buy/sell enquiries are handled through the WhatsApp conversation. We do not sell or rent your information to third parties.</p>

      <h2 style={h2}>Where it's stored</h2>
      <p style={p}>Data submitted through website forms is stored in a MongoDB Atlas database. Product and request images are hosted by Cloudinary. Repair and buy/sell messages sent through WhatsApp are handled by WhatsApp, not stored as new requests in our website database.</p>

      <h2 style={h2}>Cookies</h2>
      <p style={p}>We do not use tracking or advertising cookies. The admin panel uses browser local storage to keep an administrator signed in — this is functional only and not used to track visitors.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions about your data can be sent through our <a href="/contact" style={{ color: 'var(--brand-primary)' }}>contact page</a>.</p>
    </div>
  );
}
