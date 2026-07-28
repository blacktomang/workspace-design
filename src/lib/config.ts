/**
 * monis.rent's WhatsApp business number (international format, no "+").
 * Override via NEXT_PUBLIC_MONIS_WHATSAPP in .env / Vercel env vars.
 */
export const MONIS_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_MONIS_WHATSAPP ?? "6281234567890";
