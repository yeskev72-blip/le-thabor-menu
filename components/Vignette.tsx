"use client";

import { useState } from "react";
import type { Plat } from "@/data/menu";

/**
 * Photo du plat, déclarée par `plat.image`. À défaut on affiche celle de la
 * catégorie, et si elle manque aussi une pastille à l'initiale — jamais une
 * image cassée.
 *
 * Les chemins sont explicites, jamais devinés depuis l'id : un plat sans photo
 * déclenchait sinon un 404 par affichage avant de retomber sur la catégorie.
 */
export default function Vignette({
  plat,
  imageCategorie,
  taille = 64,
}: {
  plat: Plat;
  imageCategorie?: string;
  taille?: number;
}) {
  const sources = [plat.image, imageCategorie].filter((s): s is string => Boolean(s));
  const [essai, setEssai] = useState(0);

  if (essai >= sources.length) {
    return (
      <div
        aria-hidden
        style={{ width: taille, height: taille }}
        className="grid shrink-0 place-items-center rounded-xl bg-accent/15 text-lg font-bold text-accent"
      >
        {plat.nom.charAt(0)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- fichiers locaux déjà
    // recadrés en 400×400 : l'optimiseur n'a rien à gagner ici.
    <img
      src={sources[essai]}
      alt=""
      width={taille}
      height={taille}
      loading="lazy"
      decoding="async"
      onError={() => setEssai((n) => n + 1)}
      style={{ width: taille, height: taille }}
      className="shrink-0 rounded-xl object-cover"
    />
  );
}
