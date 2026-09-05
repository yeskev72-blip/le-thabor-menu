"use client";

import { useState } from "react";
import { trouverPlat } from "@/data/menu";
import { DEVISE, formatPrix } from "@/lib/config";
import { type Panier, cle, prixLigne, total } from "@/lib/panier";
import {
  type Commande,
  type Mode,
  LIBELLES_MODE,
  champsManquants,
  lienWhatsApp,
} from "@/lib/whatsapp";
import Feuille from "./Feuille";

const CHAMP =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-base placeholder:text-muted focus:border-accent focus:outline-none";

export default function PanierPanneau({
  panier,
  onFermer,
  onChangerQuantite,
}: {
  panier: Panier;
  onFermer: () => void;
  onChangerQuantite: (cible: string, delta: number) => void;
}) {
  const [commande, setCommande] = useState<Commande>({ mode: "sur-place" });
  const modifier = (champ: keyof Commande, valeur: string) =>
    setCommande((c) => ({ ...c, [champ]: valeur }));

  const manquants = champsManquants(commande);
  const envoyable = panier.length > 0 && manquants.length === 0;

  return (
    <Feuille
      titre="Votre commande"
      onFermer={onFermer}
      pied={
        envoyable ? (
          <a
            href={lienWhatsApp(panier, commande)}
            target="_blank"
            rel="noreferrer"
            className="block w-full rounded-xl bg-accent px-4 py-3 text-center font-semibold text-black"
          >
            Envoyer sur WhatsApp — {formatPrix(total(panier))} {DEVISE}
          </a>
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-white/10 px-4 py-3 font-semibold text-muted"
          >
            {panier.length === 0 ? "Panier vide" : "Complétez les champs signalés"}
          </button>
        )
      }
    >
      {panier.length === 0 ? (
        <p className="py-8 text-center text-muted">
          Votre panier est vide. Ajoutez des plats depuis la carte.
        </p>
      ) : (
        <>
          <ul className="mb-6 divide-y divide-white/10">
            {panier.map((ligne) => {
              const plat = trouverPlat(ligne.platId);
              if (!plat) return null;
              const identite = cle(ligne);
              const options = [
                ...ligne.accompagnements,
                ...(ligne.sauce ? [ligne.sauce] : []),
              ];
              return (
                <li key={identite} className="flex items-start gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {plat.nom}
                      {ligne.varianteNom && (
                        <span className="text-muted"> · {ligne.varianteNom}</span>
                      )}
                    </p>
                    {options.length > 0 && (
                      <p className="text-sm text-muted">{options.join(", ")}</p>
                    )}
                    <p className="text-sm text-accent">{formatPrix(prixLigne(ligne))}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => onChangerQuantite(identite, -1)}
                      aria-label={`Retirer un ${plat.nom}`}
                      className="size-8 rounded-full bg-white/10 text-lg leading-none hover:bg-white/20"
                    >
                      −
                    </button>
                    <span className="w-5 text-center tabular-nums">{ligne.quantite}</span>
                    <button
                      onClick={() => onChangerQuantite(identite, 1)}
                      aria-label={`Ajouter un ${plat.nom}`}
                      className="size-8 rounded-full bg-white/10 text-lg leading-none hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mb-5 flex gap-2">
            {(Object.keys(LIBELLES_MODE) as Mode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setCommande({ mode })}
                aria-pressed={commande.mode === mode}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                  commande.mode === mode
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/15"
                }`}
              >
                {LIBELLES_MODE[mode]}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {commande.mode === "sur-place" && (
              <label className="block">
                <span className="mb-1 block text-sm text-muted">Numéro de table</span>
                <input
                  className={CHAMP}
                  inputMode="numeric"
                  value={commande.table ?? ""}
                  onChange={(e) => modifier("table", e.target.value)}
                  placeholder="12"
                />
              </label>
            )}

            {commande.mode !== "sur-place" && (
              <label className="block">
                <span className="mb-1 block text-sm text-muted">Votre nom</span>
                <input
                  className={CHAMP}
                  value={commande.nom ?? ""}
                  onChange={(e) => modifier("nom", e.target.value)}
                  placeholder="Nom"
                />
              </label>
            )}

            {commande.mode === "emporter" && (
              <label className="block">
                <span className="mb-1 block text-sm text-muted">
                  Heure de retrait souhaitée (optionnel)
                </span>
                <input
                  type="time"
                  className={CHAMP}
                  value={commande.heure ?? ""}
                  onChange={(e) => modifier("heure", e.target.value)}
                />
              </label>
            )}

            {commande.mode === "livraison" && (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm text-muted">Téléphone</span>
                  <input
                    type="tel"
                    className={CHAMP}
                    value={commande.telephone ?? ""}
                    onChange={(e) => modifier("telephone", e.target.value)}
                    placeholder="97 00 00 00"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-muted">Adresse de livraison</span>
                  <textarea
                    className={CHAMP}
                    rows={2}
                    value={commande.adresse ?? ""}
                    onChange={(e) => modifier("adresse", e.target.value)}
                    placeholder="Quartier, rue, repère"
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-1 block text-sm text-muted">Remarques (optionnel)</span>
              <textarea
                className={CHAMP}
                rows={2}
                value={commande.remarques ?? ""}
                onChange={(e) => modifier("remarques", e.target.value)}
                placeholder="Pas trop pimenté, sonner deux fois…"
              />
            </label>
          </div>
        </>
      )}
    </Feuille>
  );
}
