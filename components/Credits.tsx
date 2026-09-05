import { CREDITS } from "@/data/credits";
import { trouverPlat } from "@/data/menu";

/**
 * Attribution des photos. Les licences CC BY et CC BY-SA l'exigent : auteur,
 * licence et lien vers la source doivent rester accessibles depuis la page.
 */
export default function Credits() {
  if (CREDITS.length === 0) return null;

  return (
    <details className="mx-auto mt-12 w-full max-w-2xl px-4 pb-8 text-xs text-muted">
      <summary className="cursor-pointer py-2">Crédits photos</summary>
      <p className="mt-2">
        Photos issues de{" "}
        <a
          href="https://commons.wikimedia.org"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Wikimedia Commons
        </a>
        , sous licences libres. Les visuels de catégorie proviennent de la carte
        imprimée du restaurant. Ces photos sont illustratives et ne représentent pas
        nécessairement l&apos;assiette servie.
      </p>
      <ul className="mt-3 space-y-1">
        {CREDITS.map((credit) => (
          <li key={credit.platId}>
            {trouverPlat(credit.platId)?.nom ?? credit.platId} —{" "}
            <a href={credit.page} target="_blank" rel="noreferrer" className="underline">
              {credit.titre}
            </a>{" "}
            · {credit.auteur} · {credit.licence}
          </li>
        ))}
      </ul>
    </details>
  );
}
