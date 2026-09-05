# Menu digital Le Thabor — Design

Date : 2026-09-05
Statut : validé

## Objectif

Digitaliser la carte du restaurant Le Thabor (Bénin, glacier et restaurant,
« Enjoy Italian Taste »). Le client consulte le menu sur son téléphone, compose
sa commande, et l'envoie au restaurant via WhatsApp. Le restaurateur reçoit un
message texte lisible dans la conversation qu'il utilise déjà. Aucun nouvel
outil à apprendre pour lui.

## Périmètre

Dans le périmètre :

- Consultation de la carte par catégories, sur mobile
- Choix d'une variante quand le plat en propose (taille de pizza, nombre de
  boules de glace)
- Choix d'un accompagnement et d'une sauce sur les plats concernés, avec
  supplément facturé
- Panier : ajout, quantités, total
- Choix du mode de commande : sur place / à emporter / livraison
- Champ de remarques libre et optionnel pour l'ensemble de la commande
- Envoi de la commande via lien WhatsApp pré-rempli
- Persistance du panier entre les rechargements de page

Hors périmètre :

- Paiement en ligne
- Comptes clients, authentification
- Back-office d'édition de la carte : la carte est un fichier de données édité
  à la main
- Gestion de stock, suivi de commande, historique
- Calcul automatique des frais de livraison
- Photos des plats

## Architecture

Site statique, sans backend et sans base de données. Le transport de la commande
est délégué à WhatsApp via un lien `wa.me` dont le corps du message est
pré-rempli et encodé en URL.

Stack : Next.js (App Router) + Tailwind CSS, déployé sur Vercel.

Conséquence directe de l'absence de backend : rien à sécuriser côté serveur,
rien à maintenir, coût d'hébergement nul. Le prix à payer est que la carte se
met à jour par un commit, pas par une interface.

## Identité visuelle

Reprise du support imprimé : fond noir, magenta vif en couleur d'accent
(échantillonné sur le logo), texte blanc. Le logo « Le Thabor » et sa signature
« Enjoy Italian Taste » servent d'en-tête.

## Composants

### 1. `data/menu.ts` — la carte

Source unique de vérité pour le contenu.

```ts
type Variante = {
  nom: string;   // "Moyenne", "Grande", "2 boules"
  prix: number;
};

type OptionsPlat = {
  accompagnements: boolean; // propose la liste partagée des accompagnements
  sauces: boolean;          // propose la liste partagée des sauces
};

type Plat = {
  id: string;              // stable, sert de clé de panier
  nom: string;
  description?: string;
  prix?: number;           // plat à prix unique
  variantes?: Variante[];  // plat à choix de taille ; exclusif avec prix
  options?: OptionsPlat;   // accompagnement et sauce, si applicable
  disponible?: boolean;    // défaut true ; false = affiché grisé, non commandable
};

type Categorie = {
  id: string;
  nom: string;
  plats: Plat[];
};
```

Un plat porte soit `prix`, soit `variantes`, jamais les deux. Les `id` doivent
rester stables : ils servent de clés dans le panier persisté.

Les listes d'accompagnements et de sauces sont définies une seule fois, à part,
et référencées par les plats via `options`. Elles sont communes à toute la carte.

Un seul fichier à éditer pour changer un prix, ajouter un plat ou marquer une
rupture.

### 2. `lib/panier.ts` — l'état du panier

Logique pure, sans dépendance à React ni au DOM, donc testable directement.

Une ligne de panier est identifiée par la combinaison plat + variante +
accompagnement + sauce. Deux ajouts du même plat avec des options différentes
forment deux lignes distinctes ; avec des options identiques, ils incrémentent
la même ligne.

- Ajouter une ligne, incrémenter / décrémenter la quantité, retirer une ligne
- Calculer le prix d'une ligne : prix de base (variante ou prix unique) plus les
  suppléments, le tout multiplié par la quantité
- Calculer le total
- Sérialiser / désérialiser vers `localStorage`

Au chargement, les lignes persistées dont le plat ou la variante n'existent plus
dans la carte sont ignorées, silencieusement. Un plat retiré de la carte ne doit
pas faire planter le panier d'un client revenu trois jours plus tard.

### 3. Règles de prix

- Un accompagnement est inclus dans le prix du plat. Chaque accompagnement
  supplémentaire ajoute 1 000 F.
- Les sauces sont gratuites.
- Sur les sandwichs et burgers, la portion de frites en supplément est un
  accompagnement supplémentaire ordinaire, au même tarif de 1 000 F.

### 4. `lib/whatsapp.ts` — génération du message

Fonction pure : prend le panier, le mode de commande, les champs client et les
remarques ; retourne l'URL `wa.me` complète.

Format du message :

```
Commande Le Thabor
Mode : À emporter — retrait 19h30
Client : Kofi

2x Pizza Regina (Grande) ....... 9 000
1x Poulet yassa ................ 5 000
   Attiéké, sauce tomate
1x Cornet 2 boules ............. 1 700

TOTAL : 15 700 FCFA

Remarques : pas trop pimenté
```

Les variantes et options choisies apparaissent sous la ligne du plat. Les lignes
`Mode`, `Client` et `Remarques` s'adaptent au mode et sont omises quand elles
sont vides. Le corps est encodé via `encodeURIComponent`.

### 5. Page menu (`/`)

Mobile-first. Navigation par catégories, plats avec nom, description et prix (ou
fourchette de prix quand le plat a des variantes). Barre de panier fixe en bas
de l'écran affichant le nombre d'articles et le total, qui ouvre le panier au
clic.

Un plat sans variante ni option s'ajoute au panier en un seul geste. Un plat qui
en a ouvre une feuille de choix avant l'ajout.

### 6. Panier

Vue des lignes avec leurs options et ajustement des quantités, total, puis :

- Sélecteur de mode : sur place / à emporter / livraison
- Champs conditionnels au mode :
  - Sur place : numéro de table
  - À emporter : nom, heure de retrait souhaitée
  - Livraison : nom, téléphone, adresse
- Champ `Remarques (optionnel)` : texte libre, une seule note pour toute la
  commande
- Bouton « Envoyer sur WhatsApp »

Le bouton est désactivé tant que le panier est vide ou qu'un champ obligatoire du
mode choisi n'est pas rempli.

## Contenu de la carte

Extrait du PDF fourni le 2026-09-05, 17 catégories, environ 150 articles :

Entrées · Pizzas (2 tailles) · Pâtes · Sandwichs & burgers · Plats de viande ·
Plats de poissons & crustacés · Brochettes · Traditions · Glaces (coupes
composées) · Boules (cornet, coupe, pot) · Milk-shakes · Suppléments glace ·
Menu enfant · Jus de fruits · Cocktails sans alcool · Cocktails des tropiques ·
Boissons froides

Accompagnements partagés : frite, riz, pomme sautée, pomme vapeur, alloco,
couscous, légumes, haricot vert, spaghetti, pâte de maïs, akassa, télibo,
agbéli, pomme purée.

Sauces partagées : poivre, champignons, citron, forestière, tomate.

Prix en francs CFA, affichés sans décimale, séparateur de milliers par espace.

## Gestion des erreurs

| Cas | Comportement |
|---|---|
| Panier vide | Bouton d'envoi désactivé |
| Champ obligatoire manquant | Bouton désactivé, champ signalé |
| Plat ou variante absents de la carte | Ligne ignorée au chargement, sans erreur |
| WhatsApp non installé | Le lien `wa.me` bascule sur WhatsApp Web dans le navigateur — comportement natif, rien à coder |
| Message très long | Aucune troncature côté application ; les commandes réalistes restent bien en deçà des limites d'URL |

## Vérification

Un fichier de test sur les deux modules de logique pure :

- `lib/panier.ts` : ajout, fusion des lignes identiques, séparation des lignes
  aux options différentes, incrément, décrément jusqu'à zéro, prix d'une ligne
  avec supplément, total, filtrage des plats disparus de la carte
- `lib/whatsapp.ts` : format du message pour chacun des trois modes, avec
  variantes, avec options, avec et sans remarques, et encodage de l'URL

Le reste — mise en page, rendu mobile — se vérifie à l'œil sur le site déployé.

## Points en attente

Ne bloquent pas le développement, bloquent la mise en production :

- **Numéro WhatsApp du restaurant**, au format international. Un numéro factice
  est utilisé en attendant.
- **Prix à confirmer** : quatre pages du PDF sont des images en 189×267 pixels,
  illisibles avec certitude. Concerne les cornets, coupes et pots de glace, les
  cocktails des tropiques, les brochettes, les boissons froides, et le prix des
  assortiments de tapas masqué par une photo. Les valeurs lues sont saisies
  telles quelles et signalées en commentaire dans `data/menu.ts`.

## Évolutions possibles

Explicitement non construites aujourd'hui, notées pour mémoire :

- Interface d'administration de la carte, si l'édition par commit devient une
  gêne réelle
- Photos des plats
- Version anglaise
