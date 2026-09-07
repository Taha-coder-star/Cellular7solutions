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
      <p style={p}>When you book a repair, submit a buy/sell request, place an order, or leave a review, we collect the information you provide directly: name, email, phone number, and (for repairs and orders) your address. We do not require an account and do not collect data beyond what a given form asks for.</p>

      <h2 style={h2}>How we use it</h2>
      <p style={p}>We use this information solely to fulfil your request — confirming a repair booking, following up on a buy/sell offer, processing an order, or displaying your review. We do not sell or rent your information to third parties.</p>

      <h2 style={h2}>Where it's stored</h2>
      <p style={p}>Data is stored in a MongoDB Atlas database. Product and request images are hosted by Cloudinary. Both providers process data on our behalf under their own security and compliance standards.</p>

      <h2 style={h2}>Cookies</h2>
      <p style={p}>We do not use tracking or advertising cookies. The admin panel uses browser local storage to keep an administrator signed in — this is functional only and not used to track visitors.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions about your data can be sent through our <a href="/contact" style={{ color: 'var(--brand-primary)' }}>contact page</a>.</p>
    </div>
  );
}
