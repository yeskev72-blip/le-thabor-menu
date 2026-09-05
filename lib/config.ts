export const RESTAURANT = "Le Thabor";
export const SIGNATURE = "Enjoy Italian Taste";
export const DEVISE = "FCFA";

/**
 * Numéro WhatsApp du restaurant, format international sans + ni espaces.
 * 01 91 41 11 11 au Bénin : l'indicatif 229 précède le numéro national, dont le
 * 01 initial fait partie et se conserve.
 *
 * Surchargeable par NEXT_PUBLIC_WHATSAPP dans l'environnement Vercel, pour
 * pointer un numéro de test sans toucher au code.
 */
export const NUMERO_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "2290191411111";

/** 15700 → "15 700". Espace insécable normale, lisible partout y compris dans WhatsApp. */
export function formatPrix(montant: number): string {
  return montant.toLocaleString("fr-FR").replace(/ | /g, " ");
}
