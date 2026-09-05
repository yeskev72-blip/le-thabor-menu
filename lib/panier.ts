// État du panier. Logique pure : aucune dépendance à React ni au DOM, hors des
// deux fonctions de persistance en fin de fichier.

import {
  ACCOMPAGNEMENTS,
  PRIX_ACCOMPAGNEMENT_SUP,
  SAUCES,
  prixDeBase,
  trouverPlat,
} from "../data/menu.ts";

export type Ligne = {
  platId: string;
  varianteNom?: string;
  accompagnements: string[];
  sauce?: string;
  quantite: number;
};

export type Panier = Ligne[];

/**
 * Identité d'une ligne : deux ajouts du même plat avec les mêmes options
 * fusionnent, avec des options différentes forment deux lignes.
 */
export function cle(ligne: Ligne): string {
  return JSON.stringify([
    ligne.platId,
    ligne.varianteNom ?? null,
    [...ligne.accompagnements].sort(),
    ligne.sauce ?? null,
  ]);
}

export function ajouter(panier: Panier, ligne: Ligne): Panier {
  const cible = cle(ligne);
  const existante = panier.find((l) => cle(l) === cible);
  if (!existante) return [...panier, ligne];
  return panier.map((l) =>
    cle(l) === cible ? { ...l, quantite: l.quantite + ligne.quantite } : l,
  );
}

/** Retire la ligne quand la quantité tombe à zéro. */
export function changerQuantite(panier: Panier, cible: string, delta: number): Panier {
  return panier
    .map((l) => (cle(l) === cible ? { ...l, quantite: l.quantite + delta } : l))
    .filter((l) => l.quantite > 0);
}

export function retirer(panier: Panier, cible: string): Panier {
  return panier.filter((l) => cle(l) !== cible);
}

/**
 * Prix d'une ligne, quantité comprise. Le premier accompagnement est inclus
 * dans le prix du plat, chacun des suivants est facturé.
 */
export function prixLigne(ligne: Ligne): number {
  const plat = trouverPlat(ligne.platId);
  if (!plat) return 0;
  const base = prixDeBase(plat, ligne.varianteNom);
  if (base === undefined) return 0;
  const extras = Math.max(0, ligne.accompagnements.length - 1);
  return (base + extras * PRIX_ACCOMPAGNEMENT_SUP) * ligne.quantite;
}

export function total(panier: Panier): number {
  return panier.reduce((somme, ligne) => somme + prixLigne(ligne), 0);
}

export function nombreArticles(panier: Panier): number {
  return panier.reduce((somme, ligne) => somme + ligne.quantite, 0);
}

/**
 * Ne garde que les lignes encore servables : plat et variante toujours à la
 * carte, options connues, quantité entière positive. Un plat retiré de la carte
 * disparaît du panier sans erreur.
 */
export function nettoyer(valeur: unknown): Panier {
  if (!Array.isArray(valeur)) return [];
  return valeur.filter((ligne): ligne is Ligne => {
    if (typeof ligne !== "object" || ligne === null) return false;
    const l = ligne as Record<string, unknown>;
    if (typeof l.platId !== "string") return false;
    if (l.varianteNom !== undefined && typeof l.varianteNom !== "string") return false;
    if (!Number.isInteger(l.quantite) || (l.quantite as number) <= 0) return false;
    if (!Array.isArray(l.accompagnements)) return false;
    if (!l.accompagnements.every((a) => ACCOMPAGNEMENTS.includes(a as string))) return false;
    if (l.sauce !== undefined && !SAUCES.includes(l.sauce as string)) return false;

    const plat = trouverPlat(l.platId);
    if (!plat || plat.disponible === false) return false;
    return prixDeBase(plat, l.varianteNom as string | undefined) !== undefined;
  });
}

const CLE_STOCKAGE = "thabor-panier";

export function charger(): Panier {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    return brut ? nettoyer(JSON.parse(brut)) : [];
  } catch {
    return [];
  }
}

export function sauvegarder(panier: Panier): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(panier));
  } catch {
    // Navigation privée ou stockage plein : le panier vit en mémoire, sans plus.
  }
}
