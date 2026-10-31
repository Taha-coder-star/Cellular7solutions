import { useLocation } from 'react-router-dom';
import { whatsappMessageLink } from '@/utils/whatsapp';

// Floating chat button. Product pages already have their own WhatsApp CTA, so it hides there.
export default function WhatsAppFab() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/product/')) return null;
  return (
    <a
      className="whatsapp-fab"
      href={whatsappMessageLink('Hi Cellular Solutions, I have a question.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04z" />
      </svg>
    </a>
  );
}
