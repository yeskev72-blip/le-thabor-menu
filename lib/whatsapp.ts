// Composition du message de commande et du lien WhatsApp. Fonctions pures.

import { trouverPlat } from "../data/menu.ts";
import { DEVISE, NUMERO_WHATSAPP, RESTAURANT, formatPrix } from "./config.ts";
import { type Panier, prixLigne, total } from "./panier.ts";

export type Mode = "sur-place" | "emporter" | "livraison";

export type Commande = {
  mode: Mode;
  /** Sur place */
  table?: string;
  /** À emporter et livraison */
  nom?: string;
  /** À emporter */
  heure?: string;
  /** Livraison */
  telephone?: string;
  adresse?: string;
  remarques?: string;
};

export const LIBELLES_MODE: Record<Mode, string> = {
  "sur-place": "Sur place",
  emporter: "À emporter",
  livraison: "Livraison",
};

/** Champs obligatoires du mode, vides ou absents. Vide = commande envoyable. */
export function champsManquants(commande: Commande): string[] {
  const requis: Record<Mode, (keyof Commande)[]> = {
    "sur-place": ["table"],
    emporter: ["nom"],
    livraison: ["nom", "telephone", "adresse"],
  };
  return requis[commande.mode].filter((champ) => !commande[champ]?.trim());
}

function enTete(commande: Commande): string[] {
  const lignes = [`Commande ${RESTAURANT}`];
  switch (commande.mode) {
    case "sur-place":
      lignes.push(`Mode : Sur place — table ${commande.table}`);
      break;
    case "emporter":
      lignes.push(
        `Mode : À emporter${commande.heure ? ` — retrait ${commande.heure}` : ""}`,
      );
      lignes.push(`Client : ${commande.nom}`);
      break;
    case "livraison":
      lignes.push("Mode : Livraison");
      lignes.push(`Client : ${commande.nom} — ${commande.telephone}`);
      lignes.push(`Adresse : ${commande.adresse}`);
      break;
  }
  return lignes;
}

export function construireMessage(panier: Panier, commande: Commande): string {
  const articles = panier.flatMap((ligne) => {
    const plat = trouverPlat(ligne.platId);
    if (!plat) return [];
    const variante = ligne.varianteNom ? ` (${ligne.varianteNom})` : "";
    const lignes = [
      `• ${ligne.quantite}x ${plat.nom}${variante} — ${formatPrix(prixLigne(ligne))}`,
    ];
    const options = [...ligne.accompagnements, ...(ligne.sauce ? [ligne.sauce] : [])];
    if (options.length > 0) lignes.push(`  ${options.join(", ")}`);
    return lignes;
  });

  const bloc = [
    enTete(commande).join("\n"),
    articles.join("\n"),
    `TOTAL : ${formatPrix(total(panier))} ${DEVISE}`,
  ];
  if (commande.remarques?.trim()) {
    bloc.push(`Remarques : ${commande.remarques.trim()}`);
  }
  return bloc.join("\n\n");
}

export function lienWhatsApp(panier: Panier, commande: Commande): string {
  const texte = encodeURIComponent(construireMessage(panier, commande));
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${texte}`;
}
