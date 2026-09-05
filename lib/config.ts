export const RESTAURANT = "Le Thabor";
export const SIGNATURE = "Enjoy Italian Taste";
export const DEVISE = "FCFA";

/**
 * Numéro WhatsApp du restaurant, format international sans + ni espaces.
 *
 * TODO: remplacer le numéro factice par le vrai, ou définir
 * NEXT_PUBLIC_WHATSAPP dans l'environnement Vercel.
 */
export const NUMERO_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "22900000000";

/** 15700 → "15 700". Espace insécable normale, lisible partout y compris dans WhatsApp. */
export function formatPrix(montant: number): string {
  return montant.toLocaleString("fr-FR").replace(/ | /g, " ");
}
