"use client";

import { useEffect } from "react";

/** Panneau qui monte du bas de l'écran, avec fond assombri. Fermé par Échap. */
export default function Feuille({
  titre,
  onFermer,
  children,
  pied,
}: {
  titre: string;
  onFermer: () => void;
  children: React.ReactNode;
  pied?: React.ReactNode;
}) {
  useEffect(() => {
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFermer();
    };
    document.addEventListener("keydown", auClavier);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", auClavier);
      document.body.style.overflow = "";
    };
  }, [onFermer]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Fermer"
        className="absolute inset-0 bg-black/70"
        onClick={onFermer}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        className="relative flex max-h-[88vh] flex-col rounded-t-2xl border-t border-accent/40 bg-surface"
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold">{titre}</h2>
          <button
            onClick={onFermer}
            aria-label="Fermer"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-xl leading-none hover:bg-white/20"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {pied && <div className="border-t border-white/10 px-5 py-4">{pied}</div>}
      </div>
    </div>
  );
}
