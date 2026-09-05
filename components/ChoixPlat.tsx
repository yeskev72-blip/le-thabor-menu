"use client";

import { useState } from "react";
import {
  ACCOMPAGNEMENTS,
  PRIX_ACCOMPAGNEMENT_SUP,
  SAUCES,
  type Plat,
} from "@/data/menu";
import { formatPrix } from "@/lib/config";
import { type Ligne, prixLigne } from "@/lib/panier";
import Feuille from "./Feuille";
import Vignette from "./Vignette";

/** Feuille de choix ouverte avant l'ajout d'un plat à variantes ou à options. */
export default function ChoixPlat({
  plat,
  imageCategorie,
  onFermer,
  onAjouter,
}: {
  plat: Plat;
  imageCategorie?: string;
  onFermer: () => void;
  onAjouter: (ligne: Ligne) => void;
}) {
  const [varianteNom, setVarianteNom] = useState(plat.variantes?.[0]?.nom);
  const [accompagnements, setAccompagnements] = useState<string[]>([]);
  const [sauce, setSauce] = useState<string | undefined>(undefined);

  const ligne: Ligne = { platId: plat.id, varianteNom, accompagnements, sauce, quantite: 1 };
  const supplements = Math.max(0, accompagnements.length - 1);

  const basculer = (nom: string) =>
    setAccompagnements((actuels) =>
      actuels.includes(nom) ? actuels.filter((a) => a !== nom) : [...actuels, nom],
    );

  return (
    <Feuille
      titre={plat.nom}
      onFermer={onFermer}
      pied={
        <button
          onClick={() => onAjouter(ligne)}
          className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-black"
        >
          Ajouter — {formatPrix(prixLigne(ligne))}
        </button>
      }
    >
      <div className="mb-5 flex items-center gap-4">
        <Vignette plat={plat} imageCategorie={imageCategorie} taille={96} />
        {plat.description && <p className="text-sm text-muted">{plat.description}</p>}
      </div>

      {plat.variantes && (
        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Format
          </legend>
          <div className="flex flex-wrap gap-2">
            {plat.variantes.map((v) => (
              <button
                key={v.nom}
                onClick={() => setVarianteNom(v.nom)}
                aria-pressed={v.nom === varianteNom}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  v.nom === varianteNom
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/15"
                }`}
              >
                {v.nom} · {formatPrix(v.prix)}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {plat.options?.accompagnements && (
        <fieldset className="mb-6">
          <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">
            Accompagnement
          </legend>
          <p className="mb-2 text-xs text-muted">
            Le premier est inclus. Chaque accompagnement en plus :{" "}
            {formatPrix(PRIX_ACCOMPAGNEMENT_SUP)}.
          </p>
          <div className="flex flex-wrap gap-2">
            {ACCOMPAGNEMENTS.map((nom) => (
              <button
                key={nom}
                onClick={() => basculer(nom)}
                aria-pressed={accompagnements.includes(nom)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  accompagnements.includes(nom)
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/15"
                }`}
              >
                {nom}
              </button>
            ))}
          </div>
          {supplements > 0 && (
            <p className="mt-2 text-xs text-accent">
              {supplements} supplément{supplements > 1 ? "s" : ""} ·{" "}
              {formatPrix(supplements * PRIX_ACCOMPAGNEMENT_SUP)}
            </p>
          )}
        </fieldset>
      )}

      {plat.options?.sauces && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Sauce
          </legend>
          <div className="flex flex-wrap gap-2">
            {SAUCES.map((nom) => (
              <button
                key={nom}
                onClick={() => setSauce((actuelle) => (actuelle === nom ? undefined : nom))}
                aria-pressed={sauce === nom}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  sauce === nom ? "border-accent bg-accent/15 text-accent" : "border-white/15"
                }`}
              >
                {nom}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </Feuille>
  );
}
