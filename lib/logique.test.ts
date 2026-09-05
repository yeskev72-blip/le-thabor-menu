// Vérifie les deux modules de logique pure. `npm test`.

import assert from "node:assert/strict";
import { test } from "node:test";
import { PRIX_ACCOMPAGNEMENT_SUP } from "../data/menu.ts";
import {
  type Ligne,
  ajouter,
  changerQuantite,
  cle,
  nettoyer,
  prixLigne,
  total,
} from "./panier.ts";
import { champsManquants, construireMessage, lienWhatsApp } from "./whatsapp.ts";

const nue = (platId: string, extra: Partial<Ligne> = {}): Ligne => ({
  platId,
  accompagnements: [],
  quantite: 1,
  ...extra,
});

test("deux ajouts identiques fusionnent en une ligne", () => {
  const panier = ajouter(ajouter([], nue("hamburger")), nue("hamburger"));
  assert.equal(panier.length, 1);
  assert.equal(panier[0].quantite, 2);
});

test("des options différentes forment deux lignes", () => {
  const panier = ajouter(
    ajouter([], nue("poulet-yassa", { accompagnements: ["Riz"] })),
    nue("poulet-yassa", { accompagnements: ["Alloco"] }),
  );
  assert.equal(panier.length, 2);
});

test("l'ordre des accompagnements ne change pas l'identité d'une ligne", () => {
  const a = nue("poulet-yassa", { accompagnements: ["Riz", "Alloco"] });
  const b = nue("poulet-yassa", { accompagnements: ["Alloco", "Riz"] });
  assert.equal(cle(a), cle(b));
});

test("décrémenter jusqu'à zéro retire la ligne", () => {
  const panier = ajouter([], nue("hamburger"));
  assert.deepEqual(changerQuantite(panier, cle(panier[0]), -1), []);
});

test("le premier accompagnement est inclus, les suivants sont facturés", () => {
  const sansSupplement = prixLigne(nue("poulet-yassa", { accompagnements: ["Riz"] }));
  const avecDeux = prixLigne(
    nue("poulet-yassa", { accompagnements: ["Riz", "Alloco"] }),
  );
  assert.equal(sansSupplement, 5000);
  assert.equal(avecDeux, 5000 + PRIX_ACCOMPAGNEMENT_SUP);
});

test("le prix d'une variante l'emporte sur le prix unique", () => {
  assert.equal(prixLigne(nue("pizza-regina", { varianteNom: "Grande" })), 4500);
  assert.equal(prixLigne(nue("pizza-regina", { varianteNom: "Moyenne" })), 4000);
});

test("la quantité multiplie le prix de la ligne", () => {
  assert.equal(prixLigne(nue("hamburger", { quantite: 3 })), 10500);
});

test("le total additionne les lignes", () => {
  const panier = ajouter(ajouter([], nue("hamburger")), nue("jus-orange"));
  assert.equal(total(panier), 3500 + 1500);
});

test("nettoyer écarte les lignes devenues inservables", () => {
  const garde = nue("hamburger");
  const rejets: unknown[] = [
    nue("plat-supprime-de-la-carte"),
    nue("pizza-regina"), // variante obligatoire, absente
    nue("pizza-regina", { varianteNom: "Familiale" }), // variante inconnue
    nue("hamburger", { quantite: 0 }),
    nue("hamburger", { accompagnements: ["Caviar"] }),
    nue("hamburger", { sauce: "Sauce inconnue" }),
    "pas un objet",
  ];
  assert.deepEqual(nettoyer([garde, ...rejets]), [garde]);
  assert.deepEqual(nettoyer("pas un panier"), []);
});

test("le message sur place porte le numéro de table", () => {
  const panier = ajouter([], nue("pizza-regina", { varianteNom: "Grande", quantite: 2 }));
  const message = construireMessage(panier, { mode: "sur-place", table: "12" });
  assert.match(message, /Mode : Sur place — table 12/);
  assert.match(message, /2x Regina \(Grande\) — 9 000/);
  assert.match(message, /TOTAL : 9 000 FCFA/);
  assert.doesNotMatch(message, /Remarques/);
});

test("le message à emporter porte le nom, l'heure et les remarques", () => {
  const panier = ajouter([], nue("hamburger"));
  const message = construireMessage(panier, {
    mode: "emporter",
    nom: "Kofi",
    heure: "19:30",
    remarques: "pas trop pimenté",
  });
  assert.match(message, /Mode : À emporter — retrait 19:30/);
  assert.match(message, /Client : Kofi/);
  assert.match(message, /Remarques : pas trop pimenté/);
});

test("le message de livraison porte le téléphone et l'adresse", () => {
  const panier = ajouter([], nue("hamburger"));
  const message = construireMessage(panier, {
    mode: "livraison",
    nom: "Ama",
    telephone: "97000000",
    adresse: "Fidjrossè, rue 12",
  });
  assert.match(message, /Client : Ama — 97000000/);
  assert.match(message, /Adresse : Fidjrossè, rue 12/);
});

test("les options choisies suivent la ligne du plat", () => {
  const panier = ajouter(
    [],
    nue("poulet-yassa", { accompagnements: ["Alloco"], sauce: "Sauce tomate" }),
  );
  const message = construireMessage(panier, { mode: "sur-place", table: "3" });
  assert.match(message, /Alloco, Sauce tomate/);
});

test("le lien encode le message", () => {
  const panier = ajouter([], nue("hamburger"));
  const lien = lienWhatsApp(panier, { mode: "sur-place", table: "1" });
  assert.match(lien, /^https:\/\/wa\.me\/\d+\?text=/);
  assert.ok(!lien.includes("\n"), "le corps du message doit être encodé");
});

test("les champs obligatoires dépendent du mode", () => {
  assert.deepEqual(champsManquants({ mode: "sur-place", table: "4" }), []);
  assert.deepEqual(champsManquants({ mode: "sur-place", table: "  " }), ["table"]);
  assert.deepEqual(champsManquants({ mode: "emporter" }), ["nom"]);
  assert.deepEqual(champsManquants({ mode: "livraison", nom: "Ama" }), [
    "telephone",
    "adresse",
  ]);
});
