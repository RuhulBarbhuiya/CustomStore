import { localProductsByCategory } from "./localProducts";

export const categoryProducts = {
  tshirts: {
    slug: "tshirt",
    title: "T-Shirts",
    breadcrumb: "HOME | T-SHIRTS",
    description: "Everyday comfortable t-shirts for casual wear, teams, and events.",
    products: localProductsByCategory.tshirt,
  },
  hoodies: {
    slug: "hoodie",
    title: "Hoodies",
    breadcrumb: "HOME | HOODIES",
    description: "Warm hoodies for everyday wear, teams, and events.",
    products: localProductsByCategory.hoodie,
  },
  fullSleeves: {
    slug: "full-sleeve",
    title: "Full Sleeves",
    breadcrumb: "HOME | FULL SLEEVES",
    description: "Comfortable full sleeve wear for teams, events, and everyday use.",
    products: localProductsByCategory["full-sleeve"],
  },
  mugs: {
    slug: "mug",
    title: "Mugs",
    breadcrumb: "HOME | MUGS",
    description: "Mugs for daily use, gifting, teams, and office desks.",
    products: localProductsByCategory.mug,
  },
  caps: {
    slug: "cap",
    title: "Caps",
    breadcrumb: "HOME | CAPS",
    description: "Caps in fresh colors for daily wear and team kits.",
    products: localProductsByCategory.cap,
  },
};

export const customizableCategoryProducts = Object.fromEntries(
  Object.entries(categoryProducts).map(([slug, category]) => [
    slug,
    {
      ...category,
      title: `Custom ${category.title}`,
      breadcrumb: `HOME | CUSTOMIZE | ${category.title.toUpperCase()}`,
      description: `${category.description} Add your text, logos, and artwork in the design editor.`,
      products: category.products.map((product) => ({
        ...product,
        name: product.name.includes("Custom")
          ? product.name
          : `Custom ${product.name}`,
        isCustomizable: true,
      })),
    },
  ])
);

export const customizableCategoryLinks = [
  {
    slug: "tshirts",
    title: "Custom T-shirts",
    image: "/homepage/tshirt.png",
    description: "Upload artwork, add names, and place designs on tees.",
  },
  {
    slug: "hoodies",
    title: "Custom Hoodies",
    image: "/homepage/hoodie.png",
    description: "Build branded hoodies for teams, creators, and events.",
  },
  {
    slug: "full-sleeves",
    title: "Custom Full Sleeves",
    image: "/homepage/tshirt.png",
    description: "Add names, logos, and artwork to long sleeve apparel.",
  },
  {
    slug: "caps",
    title: "Custom Caps",
    image: "/caps/set5/black.png",
    description: "Create caps with front logo and text placement.",
  },
  {
    slug: "mugs",
    title: "Custom Mugs",
    image: "/homepage/mug.png",
    description: "Add names, logos, and artwork to everyday mugs.",
  },
];

export function findCategoryProduct(productId) {
  return Object.values(categoryProducts)
    .flatMap((category) => category.products)
    .find((product) => product.id === productId);
}

export function findCustomizableProduct(productId) {
  return Object.values(customizableCategoryProducts)
    .flatMap((category) => category.products)
    .find((product) => product.id === productId);
}

export function findCustomizableCategory(categorySlug) {
  const categoryKey =
    categorySlug === "full-sleeves" ? "fullSleeves" : categorySlug;

  return customizableCategoryProducts[categoryKey];
}
