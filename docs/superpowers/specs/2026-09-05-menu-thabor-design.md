# Menu digital Le Thabor — Design

Date : 2026-09-05
Statut : validé

## Objectif

Digitaliser la carte du restaurant Le Thabor. Le client consulte le menu sur son
téléphone, compose sa commande, et l'envoie au restaurant via WhatsApp. Le
restaurateur reçoit un message texte lisible dans la conversation qu'il utilise
déjà. Aucun nouvel outil à apprendre pour lui.

## Périmètre

Dans le périmètre :

- Consultation de la carte par catégories, sur mobile
- Panier : ajout de plats, quantités, total
- Choix du mode de commande : sur place / à emporter / livraison
- Champ de remarques libre et optionnel pour l'ensemble de la commande
- Envoi de la commande via lien WhatsApp pré-rempli
- Persistance du panier entre les rechargements de page

Hors périmètre (à ne pas construire) :

- Paiement en ligne
- Comptes clients, authentification
- Back-office d'édition de la carte : la carte est un fichier de données édité
  à la main
- Gestion de stock, suivi de commande, historique
- Calcul automatique des frais de livraison

## Architecture

Site statique, sans backend et sans base de données. Le transport de la commande
est délégué à WhatsApp via un lien `wa.me` dont le corps du message est
pré-rempli et encodé en URL.

Stack : Next.js (App Router) + Tailwind CSS, déployé sur Vercel.

Conséquence directe de l'absence de backend : rien à sécuriser côté serveur,
rien à maintenir, coût d'hébergement nul. Le prix à payer est que la carte se
met à jour par un commit, pas par une interface.

## Composants

### 1. `data/menu.ts` — la carte

Source unique de vérité pour le contenu. Structure :

```ts
type Plat = {
  id: string;          // stable, sert de clé de panier
  nom: string;
  description?: string;
  prix: number;        // entier, dans l'unité monétaire de base
  disponible?: boolean; // défaut true ; false = affiché grisé, non commandable
};

type Categorie = {
  id: string;
  nom: string;
  plats: Plat[];
};
```

Un seul fichier à éditer pour changer un prix, ajouter un plat ou marquer une
rupture. Les `id` doivent rester stables : ils servent de clés dans le panier
persisté.

### 2. `lib/panier.ts` — l'état du panier

Logique pure, sans dépendance à React ni au DOM, donc testable directement.

- Ajouter un plat, incrémenter / décrémenter la quantité, retirer un plat
- Calculer le total
- Sérialiser / désérialiser vers `localStorage`

Au chargement, les entrées du panier persisté dont l'`id` n'existe plus dans la
carte sont ignorées, silencieusement. Un plat retiré de la carte ne doit pas
faire planter le panier d'un client revenu trois jours plus tard.

### 3. `lib/whatsapp.ts` — génération du message

Fonction pure : prend le panier, le mode de commande, les champs client et les
remarques ; retourne l'URL `wa.me` complète.

Format du message :

```
Commande Le Thabor
Mode : À emporter — retrait 19h30
Client : Kofi

2x Poulet braisé ......... 6 000
1x Attiéké ............... 1 500

TOTAL : 7 500 FCFA

Remarques : pas trop pimenté, sonner deux fois
```

Les lignes `Mode`, `Client` et `Remarques` s'adaptent au mode choisi et sont
omises quand elles sont vides. Le corps est encodé via `encodeURIComponent`.

### 4. Page menu (`/`)

Mobile-first. Liste des catégories, plats avec nom, description, prix et un
bouton d'ajout. Barre de panier fixe en bas de l'écran affichant le nombre
d'articles et le total, qui ouvre le panier au clic.

### 5. Panier

Vue des lignes avec ajustement des quantités, total, puis :

- Sélecteur de mode : sur place / à emporter / livraison
- Champs conditionnels au mode :
  - Sur place : numéro de table
  - À emporter : nom, heure de retrait souhaitée
  - Livraison : nom, téléphone, adresse
- Champ `Remarques (optionnel)` : texte libre, une seule note pour toute la
  commande
- Bouton « Envoyer sur WhatsApp »

Le bouton est désactivé tant que le panier est vide ou qu'un champ obligatoire
du mode choisi n'est pas rempli.

## Flux

1. Le client scanne le QR code posé sur la table, ou ouvre le lien
2. Il parcourt la carte et ajoute des plats au panier
3. Il ouvre le panier, ajuste les quantités
4. Il choisit son mode de commande et remplit les champs correspondants
5. Il ajoute éventuellement une remarque
6. Il clique sur « Envoyer sur WhatsApp » : WhatsApp s'ouvre avec le message
   pré-rempli
7. Il appuie sur envoyer. Le restaurateur répond dans la conversation.

## Gestion des erreurs

| Cas | Comportement |
|---|---|
| Panier vide | Bouton d'envoi désactivé |
| Champ obligatoire manquant | Bouton désactivé, champ signalé |
| Plat du panier absent de la carte | Ligne ignorée au chargement, sans erreur |
| WhatsApp non installé | Le lien `wa.me` bascule sur WhatsApp Web dans le navigateur — comportement natif, rien à coder |
| Message très long | Aucune troncature côté application ; les commandes réalistes restent bien en deçà des limites d'URL |

## Vérification

Un fichier de test sur les deux modules de logique pure :

- `lib/panier.ts` : ajout, incrément, décrément jusqu'à zéro, calcul du total,
  filtrage des plats disparus de la carte
- `lib/whatsapp.ts` : format du message pour chacun des trois modes, avec et
  sans remarques, et vérification de l'encodage de l'URL

Le reste — mise en page, rendu mobile — se vérifie à l'œil sur le site déployé.

## Données à fournir

Ces éléments manquent et bloquent la mise en production, pas le développement :

- Le contenu de la carte : catégories, plats, descriptions, prix
- Le numéro WhatsApp du restaurant, au format international
- La devise et le pays, qui fixent le formatage des prix et la langue

En leur absence, le développement se fait sur une carte d'exemple et un numéro
factice, tous deux remplacés à la livraison du contenu réel.

## Évolutions possibles

Explicitement non construites aujourd'hui, notées pour mémoire :

- Interface d'administration de la carte, si l'édition par commit devient une
  gêne réelle
- Photos des plats
- Version multilingue
