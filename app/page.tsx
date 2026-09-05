"use client";

import { useEffect, useState } from "react";
import { CARTE, type Plat } from "@/data/menu";
import { DEVISE, RESTAURANT, SIGNATURE, formatPrix } from "@/lib/config";
import {
  type Ligne,
  type Panier,
  ajouter,
  changerQuantite,
  charger,
  nombreArticles,
  sauvegarder,
  total,
} from "@/lib/panier";
import ChoixPlat from "@/components/ChoixPlat";
import PanierPanneau from "@/components/PanierPanneau";
import Vignette from "@/components/Vignette";
import Credits from "@/components/Credits";

/** Un plat à variantes ou à options passe par la feuille de choix. */
function demandeUnChoix(plat: Plat): boolean {
  return Boolean(plat.variantes || plat.options);
}

function libellePrix(plat: Plat): string {
  if (!plat.variantes) return formatPrix(plat.prix ?? 0);
  const prix = plat.variantes.map((v) => v.prix);
  return `${formatPrix(Math.min(...prix))} – ${formatPrix(Math.max(...prix))}`;
}

export default function Page() {
  const [panier, setPanier] = useState<Panier>([]);
  const [charge, setCharge] = useState(false);
  // Le plat ouvert dans la feuille, avec la photo de repli de sa catégorie.
  const [choix, setChoix] = useState<{ plat: Plat; image?: string } | null>(null);
  const [panierOuvert, setPanierOuvert] = useState(false);

  // Le panier est lu après le montage : le serveur ne connaît pas localStorage.
  useEffect(() => {
    setPanier(charger());
    setCharge(true);
  }, []);

  useEffect(() => {
    if (charge) sauvegarder(panier);
  }, [panier, charge]);

  const ajouterLigne = (ligne: Ligne) => {
    setPanier((p) => ajouter(p, ligne));
    setChoix(null);
  };

  const articles = nombreArticles(panier);

  return (
    <>
      <header className="border-b border-accent/30 px-5 py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-accent">{RESTAURANT}</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{SIGNATURE}</p>
      </header>

      <nav
        aria-label="Catégories"
        className="sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur"
      >
        {CARTE.map((categorie) => (
          <a
            key={categorie.id}
            href={`#${categorie.id}`}
            className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-sm whitespace-nowrap"
          >
            {categorie.nom}
          </a>
        ))}
      </nav>

      <main className="mx-auto w-full max-w-2xl px-4 pb-32">
        {CARTE.map((categorie) => (
          <section key={categorie.id} id={categorie.id} className="scroll-mt-16 pt-8">
            <h2 className="mb-3 text-xl font-bold text-accent">{categorie.nom}</h2>
            <ul className="divide-y divide-white/10">
              {categorie.plats.map((plat) => {
                const indisponible = plat.disponible === false;
                return (
                  <li key={plat.id} className="flex items-start gap-3 py-3">
                    <Vignette plat={plat} imageCategorie={categorie.image} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium ${indisponible ? "text-muted" : ""}`}>
                        {plat.nom}
                      </p>
                      {plat.description && (
                        <p className="text-sm text-muted">{plat.description}</p>
                      )}
                      <p className="mt-0.5 text-sm text-accent">{libellePrix(plat)}</p>
                    </div>
                    <button
                      disabled={indisponible}
                      onClick={() =>
                        demandeUnChoix(plat)
                          ? setChoix({ plat, image: categorie.image })
                          : ajouterLigne({
                              platId: plat.id,
                              accompagnements: [],
                              quantite: 1,
                            })
                      }
                      aria-label={`Ajouter ${plat.nom}`}
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xl leading-none font-bold text-black disabled:bg-white/10 disabled:text-muted"
                    >
                      +
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <Credits />
      </main>

      {articles > 0 && !panierOuvert && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/30 bg-background/95 p-4 backdrop-blur">
          <button
            onClick={() => setPanierOuvert(true)}
            className="mx-auto flex w-full max-w-2xl items-center justify-between rounded-xl bg-accent px-5 py-3 font-semibold text-black"
          >
            <span>
              {articles} article{articles > 1 ? "s" : ""}
            </span>
            <span>
              {formatPrix(total(panier))} {DEVISE}
            </span>
          </button>
        </div>
      )}

      {choix && (
        <ChoixPlat
          plat={choix.plat}
          imageCategorie={choix.image}
          onFermer={() => setChoix(null)}
          onAjouter={ajouterLigne}
        />
      )}

      {panierOuvert && (
        <PanierPanneau
          panier={panier}
          onFermer={() => setPanierOuvert(false)}
          onChangerQuantite={(cible, delta) =>
            setPanier((p) => changerQuantite(p, cible, delta))
          }
        />
      )}
    </>
  );
}
