// La carte du Thabor. Fichier unique à éditer pour changer un prix, ajouter un
// plat ou marquer une rupture (`disponible: false`).
//
// Les `id` servent de clés dans le panier persisté chez le client : les changer
// invalide silencieusement les paniers en cours. Les réutiliser pour un autre
// plat, en revanche, afficherait le mauvais plat. Ne pas recycler un id.
//
// Saisi depuis le PDF du 2026-09-05. Les prix marqués `À CONFIRMER` viennent de
// pages scannées en 189×267 px, illisibles avec certitude.

export type Variante = {
  nom: string;
  prix: number;
};

export type OptionsPlat = {
  /** Propose la liste ACCOMPAGNEMENTS : le premier est inclus, les suivants sont facturés. */
  accompagnements?: boolean;
  /** Propose la liste SAUCES, toujours gratuite. */
  sauces?: boolean;
};

export type Plat = {
  id: string;
  nom: string;
  description?: string;
  /** Plat à prix unique. Exclusif avec `variantes`. */
  prix?: number;
  /** Plat à choix de taille ou de quantité. Exclusif avec `prix`. */
  variantes?: Variante[];
  options?: OptionsPlat;
  /** Défaut true. `false` affiche le plat grisé et non commandable. */
  disponible?: boolean;
  /**
   * Photo du plat, dans public/plats/. Absente, la vignette retombe sur celle
   * de la catégorie, puis sur une pastille à l'initiale.
   */
  image?: string;
};

export type Categorie = {
  id: string;
  nom: string;
  /** Photo de repli pour les plats de la catégorie sans image propre. */
  image?: string;
  plats: Plat[];
};

/** Le premier accompagnement d'un plat est inclus ; chaque suivant coûte ceci. */
export const PRIX_ACCOMPAGNEMENT_SUP = 1000;

export const ACCOMPAGNEMENTS = [
  "Frite",
  "Riz",
  "Pomme sautée",
  "Pomme vapeur",
  "Alloco",
  "Couscous",
  "Légumes",
  "Haricot vert",
  "Spaghetti",
  "Pâte de maïs",
  "Akassa",
  "Télibo",
  "Agbéli",
  "Pomme purée",
];

export const SAUCES = [
  "Sauce au poivre",
  "Sauce aux champignons",
  "Sauce citron",
  "Sauce forestière",
  "Sauce tomate",
];

/** Plats servis avec un accompagnement inclus et une sauce au choix. */
const AVEC_ACCOMPAGNEMENT: OptionsPlat = { accompagnements: true, sauces: true };

export const CARTE: Categorie[] = [
  {
    id: "entrees",
    nom: "Entrées",
    image: "/plats/cat-entrees.jpg",
    plats: [
      {
        id: "salade-crudites",
      image: "/plats/salade-crudites.jpg",
        nom: "Salade de crudités",
        description: "Laitue, tomate, concombre, carotte, oignon",
        prix: 3700,
      },
      {
        id: "salade-cesar",
      image: "/plats/salade-cesar.jpg",
        nom: "Salade César épicée",
        description:
          "Laitue, lardon, blanc de poulet grillé, crouton à l'ail, parmesan, oignon",
        prix: 5900,
      },
      {
        id: "salade-choux",
      image: "/plats/salade-choux.jpg",
        nom: "Salade de choux",
        description: "Choux, tomate, oignon, carotte, œuf, poivron",
        prix: 4000,
      },
      { id: "oeuf-mimosa", image: "/plats/oeuf-mimosa.jpg", nom: "Œuf mimosa", prix: 3500 },
      { id: "eventail-avocat", image: "/plats/eventail-avocat.jpg", nom: "Éventail d'avocat", prix: 3000 },
      {
        id: "tartare-merou",
        nom: "Tartare de mérou",
        description: "Poisson, persil, poivron",
        prix: 5000,
      },
      {
        id: "salade-thabor",
        nom: "Salade Thabor",
        description:
          "Laitue, pomme de terre, blanc de poulet, haricot vert, crème, œuf, oignon",
        prix: 6000,
      },
      {
        id: "foie-gras-poele",
      image: "/plats/foie-gras-poele.jpg",
        nom: "Foie gras poêlé",
        description: "Foie gras, pain, tomate, sirop de porto, gingembre, menthe",
        prix: 8500,
      },
      {
        id: "salade-fraicheur",
      image: "/plats/salade-fraicheur.jpg",
        nom: "Salade fraîcheur",
        description:
          "Mozzarella, tomate, poivron, concombre, œuf, pomme fruit, mangue, pastel",
        prix: 5000,
      },
      {
        id: "assortiment-tapas",
      image: "/plats/assortiment-tapas.jpg",
        nom: "Assortiments de tapas",
        description:
          "Olives et carottes marinées, chips de patate douce, pastel, zata d'aubergine",
        prix: 2500, // À CONFIRMER : prix masqué par une photo dans le PDF
      },
    ],
  },

  {
    id: "pizzas",
    nom: "Pizzas",
    image: "/plats/cat-pizzas.jpg",
    plats: [
      {
        id: "pizza-marguarita",
      image: "/plats/pizza-marguarita.jpg",
        nom: "Marguarita",
        description: "Tomate, fromage, olive",
        variantes: [
          { nom: "Moyenne", prix: 3000 },
          { nom: "Grande", prix: 4000 },
        ],
      },
      {
        id: "pizza-regina",
      image: "/plats/pizza-regina.jpg",
        nom: "Regina",
        description: "Tomate, fromage, jambon, champignon, olive",
        variantes: [
          { nom: "Moyenne", prix: 4000 },
          { nom: "Grande", prix: 4500 },
        ],
      },
      {
        id: "pizza-fruits-mer",
      image: "/plats/pizza-fruits-mer.jpg",
        nom: "Fruits de mer",
        description: "Tomate, fromage, crevettes, calamar, thon",
        variantes: [
          { nom: "Moyenne", prix: 5000 },
          { nom: "Grande", prix: 6000 },
        ],
      },
      {
        id: "pizza-quatre-saisons",
      image: "/plats/pizza-quatre-saisons.jpg",
        nom: "Quatre saisons",
        description:
          "Tomate, fromage, cœur d'artichaut, olive, champignon, aubergine, jambon",
        variantes: [
          { nom: "Moyenne", prix: 4500 },
          { nom: "Grande", prix: 5500 },
        ],
      },
      {
        id: "pizza-calzone",
      image: "/plats/pizza-calzone.jpg",
        nom: "Calzone",
        description: "Tomate, fromage, champignon, œuf, jambon, oignon",
        variantes: [
          { nom: "Moyenne", prix: 4000 },
          { nom: "Grande", prix: 4500 },
        ],
      },
      {
        id: "pizza-vegetarienne",
      image: "/plats/pizza-vegetarienne.jpg",
        nom: "Végétarienne",
        description: "Tomate, fromage, maïs, oignon, poivron, origan, olive, champignon",
        variantes: [
          { nom: "Moyenne", prix: 3000 },
          { nom: "Grande", prix: 4000 },
        ],
      },
      {
        id: "pizza-4-fromages",
      image: "/plats/pizza-4-fromages.jpg",
        nom: "4 fromages",
        description: "Tomate, mozzarella, emmental, parmesan, feta",
        variantes: [
          { nom: "Moyenne", prix: 5500 },
          { nom: "Grande", prix: 6000 },
        ],
      },
      {
        id: "pizza-thabor",
      image: "/plats/pizza-thabor.jpg",
        nom: "Thabor",
        description:
          "Tomate, légumes sautés, viande hachée, fromage, olive, crème fraîche",
        variantes: [
          { nom: "Moyenne", prix: 4500 },
          { nom: "Grande", prix: 5500 },
        ],
      },
      {
        id: "pizza-bbq",
        nom: "BBQ",
        description: "Sauce BBQ, bacon, merguez, oignon, olive, fromage, origan",
        variantes: [
          { nom: "Moyenne", prix: 4500 },
          { nom: "Grande", prix: 5500 },
        ],
      },
      {
        id: "pizza-du-chef",
      image: "/plats/pizza-du-chef.jpg",
        nom: "Du chef",
        description: "Voir ardoise",
        variantes: [
          { nom: "Moyenne", prix: 4000 },
          { nom: "Grande", prix: 5000 },
        ],
      },
      {
        id: "pizza-carbonara",
      image: "/plats/pizza-carbonara.jpg",
        nom: "Carbonara",
        description: "Crème fraîche, lardon, œuf, fromage, olive",
        variantes: [
          { nom: "Moyenne", prix: 4000 },
          { nom: "Grande", prix: 5000 },
        ],
      },
      {
        id: "pizza-bolognaise",
      image: "/plats/pizza-bolognaise.jpg",
        nom: "Bolognaise",
        description: "Tomate, viande hachée, oignon, carotte, olive, origan",
        variantes: [
          { nom: "Moyenne", prix: 4000 },
          { nom: "Grande", prix: 4500 },
        ],
      },
    ],
  },

  {
    id: "pates",
    nom: "Pâtes",
    image: "/plats/cat-pates.jpg",
    plats: [
      { id: "spaghetti-bolognaise", image: "/plats/spaghetti-bolognaise.jpg", nom: "Spaghetti bolognaise", prix: 5000 },
      { id: "tagliatelle-carbonara", image: "/plats/tagliatelle-carbonara.jpg", nom: "Tagliatelle carbonara", prix: 5500 },
      {
        id: "tagliatelle-fruits-mer",
      image: "/plats/tagliatelle-fruits-mer.jpg",
        nom: "Tagliatelle aux fruits de mer",
        prix: 6000,
      },
      { id: "penne-4-fromages", image: "/plats/penne-4-fromages.jpg", nom: "Penne 4 fromages", prix: 5500 },
      { id: "lasagne", nom: "Lasagne", prix: 5000 },
    ],
  },

  {
    id: "sandwichs",
    nom: "Sandwichs & burgers",
    image: "/plats/cat-sandwichs.jpg",
    plats: [
      { id: "hamburger", image: "/plats/hamburger.jpg", nom: "Hamburger", prix: 3500 },
      { id: "cheese-burger", image: "/plats/cheese-burger.jpg", nom: "Cheese burger", prix: 4000 },
      { id: "fish-burger", image: "/plats/fish-burger.jpg", nom: "Fish burger", prix: 4500 },
      { id: "chicken-burger", image: "/plats/chicken-burger.jpg", nom: "Chicken burger", prix: 3500 },
      { id: "croque-monsieur", image: "/plats/croque-monsieur.jpg", nom: "Croque monsieur", prix: 4500 },
      { id: "croque-madame", image: "/plats/croque-madame.jpg", nom: "Croque madame", prix: 4500 },
      { id: "chawarma-viande", nom: "Chawarma viande", prix: 2500 },
      { id: "chawarma-poulet", image: "/plats/chawarma-poulet.jpg", nom: "Chawarma poulet", prix: 2000 },
      { id: "club-sandwich", image: "/plats/club-sandwich.jpg", nom: "Club sandwich au poulet épicé", prix: 5000 },
      { id: "sandwich-tchatchenga", nom: "Sandwich tchatchenga", prix: 3500 },
      { id: "panini-fromage", image: "/plats/panini-fromage.jpg", nom: "Panini fromage", prix: 2000 },
      { id: "panini-bacon", image: "/plats/panini-bacon.jpg", nom: "Panini bacon", prix: 3000 },
      { id: "panini-jambon-fromage", image: "/plats/panini-jambon-fromage.jpg", nom: "Panini jambon fromage", prix: 2500 },
      {
        id: "portion-frite",
      image: "/plats/portion-frite.jpg",
        nom: "Portion de frites",
        description: "Supplément",
        prix: 1000,
      },
    ],
  },

  {
    id: "viandes",
    nom: "Plats de viande",
    image: "/plats/cat-viandes.jpg",
    plats: [
      { id: "steak-boeuf", image: "/plats/steak-boeuf.jpg", nom: "Steak de bœuf", prix: 5500, options: AVEC_ACCOMPAGNEMENT },
      { id: "cote-boeuf", nom: "Côte de bœuf", prix: 6000, options: AVEC_ACCOMPAGNEMENT },
      {
        id: "filet-boeuf",
        nom: "Filet de bœuf au poivre ou au champignon",
        prix: 6000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "langue-boeuf",
      image: "/plats/langue-boeuf.jpg",
        nom: "Langue de bœuf sauce piquante",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "emince-boeuf",
      image: "/plats/emince-boeuf.jpg",
        nom: "Émincé de bœuf sauce basquaise",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "boeuf-bourguignon",
      image: "/plats/boeuf-bourguignon.jpg",
        nom: "Bœuf bourguignon",
        prix: 6000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      { id: "lapin-braise", image: "/plats/lapin-braise.jpg", nom: "Lapin braisé", prix: 6500, options: AVEC_ACCOMPAGNEMENT },
      {
        id: "lapin-champignons",
        nom: "Lapin aux champignons",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "poulet-estragon",
      image: "/plats/poulet-estragon.jpg",
        nom: "Poulet à l'estragon",
        prix: 6000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "poulet-bicyclette",
      image: "/plats/poulet-bicyclette.jpg",
        nom: "Poulet bicyclette grillé",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "demi-poulet",
      image: "/plats/demi-poulet.jpg",
        nom: "Demi poulet chair grillé",
        prix: 5800,
        options: AVEC_ACCOMPAGNEMENT,
      },
      { id: "pilon-grille", nom: "Pilon grillé", prix: 6000, options: AVEC_ACCOMPAGNEMENT },
      {
        id: "aileron-dinde",
        nom: "Aileron de dinde",
        prix: 5800,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "cote-porc",
      image: "/plats/cote-porc.jpg",
        nom: "Côte de porc grillé",
        prix: 6000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "travers-porc",
      image: "/plats/travers-porc.jpg",
        nom: "Travers de porc sauce au miel",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "magret-canard",
      image: "/plats/magret-canard.jpg",
        nom: "Magret de canard",
        prix: 10000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "cote-agneau",
      image: "/plats/cote-agneau.jpg",
        nom: "Côte d'agneau",
        description: "Gâteau d'attiéké et banane plantain",
        prix: 8500,
        options: { sauces: true },
      },
    ],
  },

  {
    id: "poissons",
    nom: "Poissons & crustacés",
    image: "/plats/cat-poissons.jpg",
    plats: [
      {
        id: "poisson-braise",
      image: "/plats/poisson-braise.jpg",
        nom: "Poisson braisé",
        description: "Bar ou dorade",
        prix: 5500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "filet-poisson",
      image: "/plats/filet-poisson.jpg",
        nom: "Filet de poisson",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      { id: "sole-meuniere", image: "/plats/sole-meuniere.jpg", nom: "Sole meunière", prix: 6500, options: AVEC_ACCOMPAGNEMENT },
      {
        id: "crevette-curry",
        nom: "Crevette curry sauce crème",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "crevette-provencale",
        nom: "Crevette à la provençale",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      { id: "fish-and-chips", image: "/plats/fish-and-chips.jpg", nom: "Fish & chips sauce tartare", prix: 6500 },
      {
        id: "merou-choux-fleur",
        nom: "Filet de mérou crème de chou-fleur",
        description: "Mérou, crème de chou, chips de patate douce",
        prix: 7500,
      },
      {
        id: "gambas-gari",
      image: "/plats/gambas-gari.jpg",
        nom: "Gambas en croûte de gari, chutney ananas et mangue",
        description: "Gambas, gari, ananas, guacamole d'avocat, mangue, arachide, sauce",
        prix: 12000,
      },
      {
        id: "mix-grille-mer",
      image: "/plats/mix-grille-mer.jpg",
        nom: "Mix grillé de la mer",
        description: "Langouste, poisson, gambas, crevettes",
        prix: 13000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "merou-pane",
        nom: "Filet de mérou pané",
        description: "Sauce provençale, boulette de riz",
        prix: 7500,
      },
    ],
  },

  {
    id: "brochettes",
    nom: "Brochettes",
    image: "/plats/cat-brochettes.jpg",
    // Tous les prix de cette catégorie sont À CONFIRMER (page scannée illisible).
    plats: [
      {
        id: "brochette-boeuf",
      image: "/plats/brochette-boeuf.jpg",
        nom: "Brochettes de bœuf",
        description: "2 tiges",
        prix: 5000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "brochette-gesier",
      image: "/plats/brochette-gesier.jpg",
        nom: "Brochettes de gésier",
        description: "2 tiges",
        prix: 5000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "brochette-escargot",
        nom: "Brochettes d'escargot",
        description: "2 tiges",
        prix: 5500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "brochette-poisson",
        nom: "Brochettes de poisson",
        description: "2 tiges",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "brochette-gambas",
      image: "/plats/brochette-gambas.jpg",
        nom: "Brochettes de gambas",
        description: "2 tiges",
        prix: 6500,
        options: AVEC_ACCOMPAGNEMENT,
      },
      {
        id: "brochette-poulet",
      image: "/plats/brochette-poulet.jpg",
        nom: "Brochettes de poulet",
        description: "2 tiges",
        prix: 5000,
        options: AVEC_ACCOMPAGNEMENT,
      },
    ],
  },

  {
    id: "traditions",
    nom: "Traditions",
    image: "/plats/cat-traditions.jpg",
    plats: [
      { id: "dakouin", nom: "Dakouin", prix: 6000, options: AVEC_ACCOMPAGNEMENT },
      { id: "assrokouin", nom: "Assrokouin", prix: 5000, options: AVEC_ACCOMPAGNEMENT },
      { id: "sauce-arachide", nom: "Sauce arachide", prix: 5500, options: AVEC_ACCOMPAGNEMENT },
      { id: "crin-crin", image: "/plats/crin-crin.jpg", nom: "Crin-crin", prix: 5000, options: AVEC_ACCOMPAGNEMENT },
      {
        id: "gboman",
      image: "/plats/gboman.jpg",
        nom: "Gboman",
        description: "Mantindjan",
        prix: 6000,
        options: AVEC_ACCOMPAGNEMENT,
      },
      { id: "monyo", image: "/plats/monyo.jpg", nom: "Monyo", prix: 5500, options: AVEC_ACCOMPAGNEMENT },
      { id: "ndole", image: "/plats/ndole.jpg", nom: "Ndolè", prix: 6000, options: AVEC_ACCOMPAGNEMENT },
      { id: "poulet-yassa", image: "/plats/poulet-yassa.jpg", nom: "Poulet yassa", prix: 5000, options: AVEC_ACCOMPAGNEMENT },
    ],
  },

  {
    id: "menu-enfant",
    nom: "Menu enfant",
    image: "/plats/cat-menu-enfant.jpg",
    plats: [
      {
        id: "enfant-burger",
        nom: "Mini burger",
        description: "1 boule de glace + boisson RC",
        prix: 4000,
      },
      {
        id: "enfant-spaghetti",
      image: "/plats/enfant-spaghetti.jpg",
        nom: "Spaghetti bolognaise",
        description: "1 boisson RC + 1 boule de glace",
        prix: 4000,
      },
    ],
  },

  {
    id: "glaces",
    nom: "Coupes glacées",
    image: "/plats/cat-glaces.jpg",
    plats: [
      {
        id: "dolce-vita",
      image: "/plats/dolce-vita.jpg",
        nom: "Dolce vita",
        description:
          "1 boule fraise + 2 sorbets framboise + coulis de fruit + crêpe dentelle + chantilly",
        prix: 3000,
      },
      {
        id: "fraicheur-des-iles",
        nom: "Fraîcheur des îles",
        description:
          "1 sorbet citron + 1 framboise + 1 mangue + ananas frais + coulis de fruit + chantilly",
        prix: 3500,
      },
      {
        id: "biscoto",
        nom: "Biscoto",
        description: "1 boule vanille + 2 boules biscoto + sauce caramel + chantilly",
        prix: 3000,
      },
      {
        id: "irresistible",
      image: "/plats/irresistible.jpg",
        nom: "Irrésistible",
        description:
          "1 boule vanille + 1 boule chocolat + 1 vanille/cookies + sauce chocolat + 1 cookies + chantilly",
        prix: 3500,
      },
      {
        id: "banana",
        nom: "Banana",
        description:
          "1 boule vanille + 1 boule choco + 1 boule fraise + 1 banane + sauce chocolat + chantilly",
        prix: 3500,
      },
      {
        id: "cafe-chocolat-beninois",
        nom: "Café ou chocolat béninois",
        description:
          "2 boules café ou chocolat + 1 boule vanille + sauce café ou choco + chantilly",
        prix: 4000,
      },
      {
        id: "mambo",
      image: "/plats/mambo.jpg",
        nom: "Mambo",
        description:
          "2 boules coco + 1 chocolat + banane et orange en morceaux + sauce chocolat + chantilly",
        prix: 3500,
      },
      {
        id: "dame-yovo",
        nom: "Dame yovo",
        description: "2 vanilles + 1 stracciatella + sauce chocolat + chantilly",
        prix: 3500,
      },
      {
        id: "dame-mewoui",
      image: "/plats/dame-mewoui.jpg",
        nom: "Dame Mèwoui",
        description: "2 chocolat + 1 caramel + sauce caramel + konkada + chantilly",
        prix: 3500,
      },
      {
        id: "iceberg",
      image: "/plats/iceberg.jpg",
        nom: "Iceberg",
        description: "2 boules menthe/chocolat + 1 boule chocolat + sauce chocolat",
        prix: 4500,
      },
      {
        id: "oncle-fred",
        nom: "Oncle Fred",
        description:
          "1 vanille + 1 stracciatella + 1 chocolat + sauce chocolat + chantilly",
        prix: 4500,
      },
      {
        id: "colonel-thabor",
        nom: "Colonel Thabor",
        description: "2 sorbets citron + vodka",
        prix: 4500,
      },
    ],
  },

  {
    id: "boules",
    nom: "Boules de glace",
    image: "/plats/cat-boules.jpg",
    // Prix À CONFIRMER : page scannée illisible.
    plats: [
      {
        id: "cornet",
      image: "/plats/cornet.jpg",
        nom: "Cornet",
        variantes: [
          { nom: "1 boule", prix: 1000 },
          { nom: "2 boules", prix: 1700 },
          { nom: "3 boules", prix: 2400 },
        ],
      },
      {
        id: "coupe",
        nom: "Coupe",
        variantes: [
          { nom: "2 boules", prix: 1600 },
          { nom: "3 boules", prix: 2400 },
          { nom: "4 boules", prix: 3000 },
        ],
      },
      {
        id: "pot",
        nom: "Pot",
        variantes: [
          { nom: "1 boule", prix: 900 },
          { nom: "2 boules", prix: 1700 },
          { nom: "3 boules", prix: 2400 },
        ],
      },
      { id: "supplement-chantilly", image: "/plats/supplement-chantilly.jpg", nom: "Supplément crème chantilly", prix: 500 },
      { id: "supplement-fruits", image: "/plats/supplement-fruits.jpg", nom: "Supplément fruits de saison", prix: 500 },
      { id: "supplement-chocolat", image: "/plats/supplement-chocolat.jpg", nom: "Supplément chocolat", prix: 500 },
    ],
  },

  {
    id: "milkshakes",
    nom: "Milk-shakes",
    image: "/plats/cat-milkshakes.jpg",
    plats: [
      { id: "milkshake-fraise", image: "/plats/milkshake-fraise.jpg", nom: "Milk-shake fraise", prix: 2800 },
      { id: "milkshake-vanille", nom: "Milk-shake vanille", prix: 2800 },
      { id: "milkshake-chocolat", nom: "Milk-shake chocolat", prix: 2800 },
    ],
  },

  {
    id: "jus",
    nom: "Jus de fruits au verre",
    image: "/plats/cat-jus.jpg",
    plats: [
      { id: "jus-ananas", image: "/plats/jus-ananas.jpg", nom: "Ananas", prix: 1500 },
      { id: "jus-gingembre", image: "/plats/jus-gingembre.jpg", nom: "Gingembre", prix: 1500 },
      { id: "jus-orange", nom: "Orange", prix: 1500 },
      { id: "jus-pomme", image: "/plats/jus-pomme.jpg", nom: "Pomme", prix: 1500 },
      { id: "jus-pasteque", image: "/plats/jus-pasteque.jpg", nom: "Pastèque", prix: 1800 },
      { id: "jus-bissap", image: "/plats/jus-bissap.jpg", nom: "Bissap", prix: 1500 },
      { id: "jus-mangue", image: "/plats/jus-mangue.jpg", nom: "Mangue", prix: 1500 },
    ],
  },

  {
    id: "cocktails",
    nom: "Cocktails sans alcool",
    image: "/plats/cat-cocktails.jpg",
    plats: [
      {
        id: "virgin-mojito",
      image: "/plats/virgin-mojito.jpg",
        nom: "Virgin mojito",
        description: "Jus de citron vert, menthe, sucre roux, eau gazéifiée",
        prix: 2500,
      },
      {
        id: "diabolo",
        nom: "Diabolo menthe ou grenadine",
        description: "Limonade, sirop de menthe ou grenadine",
        prix: 2000,
      },
      {
        id: "biberon-cocktail",
      image: "/plats/biberon-cocktail.jpg",
        nom: "Biberon cocktail",
        description: "Jus d'orange, sirop",
        prix: 2100,
      },
      {
        id: "san-francisco",
      image: "/plats/san-francisco.jpg",
        nom: "San Francisco",
        description: "Orange, citron, ananas, pêche, sirop de grenadine, sucre en poudre",
        prix: 2500,
      },
      {
        id: "florida",
        nom: "Florida",
        description: "Jus d'orange, sirop de grenadine, citron",
        prix: 2200,
      },
      {
        id: "chantaco",
        nom: "Chantaco",
        description: "Jus d'orange, citron, pamplemousse, sirop de fraise",
        prix: 2100,
      },
      {
        id: "cocktail-etage",
      image: "/plats/cocktail-etage.jpg",
        nom: "Cocktail à l'étage",
        description: "Sirop de fraise, jus d'orange, limonade, colorant bleu, glaçons",
        prix: 2300,
      },
      {
        id: "arc-en-ciel",
      image: "/plats/arc-en-ciel.jpg",
        nom: "Arc-en-ciel",
        description: "Sirop de grenadine, jus d'ananas, Schweppes, colorant vert",
        prix: 2500,
      },
      {
        id: "malgache",
      image: "/plats/malgache.jpg",
        nom: "Malgache",
        description: "Jus d'ananas, pamplemousse, citron, sirop de fraise, mangue fruit",
        prix: 2500,
      },
      {
        id: "milky-mangue",
        nom: "Milky mangue",
        description: "Mangue fruit, crème coco, eau, citron vert, sucre",
        prix: 2000,
      },
      {
        id: "will-cake",
        nom: "Will cake",
        description: "Citron, sirop de fraise, Coca-Cola",
        prix: 1800,
      },
      {
        id: "tropic-menthe",
        nom: "Tropic menthe",
        description: "Jus de mangue, jus de goyave, jus d'ananas, sirop de menthe, glaçons",
        prix: 3000,
      },
      {
        id: "virgin-colada",
      image: "/plats/virgin-colada.jpg",
        nom: "Virgin colada",
        description: "Jus mixte, orange, ananas, lait de coco",
        prix: 2500,
      },
    ],
  },

  {
    id: "cocktails-tropiques",
    nom: "Cocktails des tropiques",
    image: "/plats/cat-cocktails-tropiques.jpg",
    // Prix et compositions À CONFIRMER : page scannée illisible, descriptions omises.
    plats: [
      { id: "tropical-sweet", image: "/plats/tropical-sweet.jpg", nom: "Tropical sweet", prix: 3500 },
      { id: "king-of-kloa", image: "/plats/king-of-kloa.jpg", nom: "King of Kloa", prix: 3000 },
      { id: "tropical-sunrise", nom: "Tropical sunrise", prix: 2500 },
      { id: "thabor-tropical", nom: "Thabor tropical", prix: 3000 },
    ],
  },

  {
    id: "boissons",
    nom: "Boissons fraîches",
    image: "/plats/cat-boissons.jpg",
    // Prix À CONFIRMER : page scannée illisible.
    plats: [
      {
        id: "sucrerie",
        nom: "Sucrerie",
        description: "Coca-Cola, Fanta ou Sprite",
        prix: 1000,
      },
      {
        id: "youki",
      image: "/plats/youki.jpg",
        nom: "Youki",
        description: "Pamplemousse, cocktail ou soda",
        prix: 1000,
      },
      { id: "possotome-gaz-05", image: "/plats/possotome-gaz-05.jpg", nom: "Possotomè gazéifiée 0,5 L", prix: 1500 },
      { id: "possotome-gaz-1", nom: "Possotomè gazéifiée 1 L", prix: 2000 },
      { id: "eau-minerale-05", nom: "Eau minérale 0,5 L", prix: 800 },
      { id: "eau-minerale-15", nom: "Eau minérale 1,5 L", prix: 1500 },
      { id: "eau-plate-06", nom: "Eau plate Possotomè 0,6 L", prix: 700 },
      { id: "eau-plate-15", image: "/plats/eau-plate-15.jpg", nom: "Eau plate Possotomè 1,5 L", prix: 1400 },
    ],
  },
];

const INDEX_PLATS = new Map<string, Plat>(
  CARTE.flatMap((categorie) => categorie.plats.map((plat) => [plat.id, plat])),
);

export function trouverPlat(id: string): Plat | undefined {
  return INDEX_PLATS.get(id);
}

/** Prix de base d'un plat : celui de la variante nommée, ou le prix unique. */
export function prixDeBase(plat: Plat, varianteNom?: string): number | undefined {
  if (plat.variantes) {
    return plat.variantes.find((v) => v.nom === varianteNom)?.prix;
  }
  return varianteNom === undefined ? plat.prix : undefined;
}
