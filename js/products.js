/**
 * VELORA - Haute Couture & Prêt-à-Porter
 * Product Database & Inventory (Vanilla JavaScript)
 */

const VELORA_PRODUCTS = [
  {
    id: "velora-01",
    name: "Double-Breasted Wool & Cashmere Coat",
    category: "outerwear",
    categoryLabel: "Outerwear",
    gender: "women",
    price: 680,
    originalPrice: 850,
    rating: 4.9,
    reviewCount: 42,
    badge: "Bestseller",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Camel", hex: "#C5A880" },
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Ivory", hex: "#F5F2EB" }
    ],
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=900&auto=format&fit=crop"
    ],
    description: "Sculpted from a sumptuous blend of 85% virgin wool and 15% Mongolian cashmere. Featuring structured padded shoulders, horn buttons, and a tailored cinched silhouette designed for effortless winter sophistication.",
    details: [
      "85% Virgin Wool, 15% Mongolian Cashmere",
      "Full cupro lining with interior ticket pocket",
      "Natural horn button closure with pick-stitch detailing",
      "Dry clean only by leather and luxury garment specialist",
      "Handcrafted in Biella, Italy"
    ],
    inStock: true,
    featured: true
  },
  {
    id: "velora-02",
    name: "Mulberry Silk Charmeuse Evening Gown",
    category: "dresses",
    categoryLabel: "Dresses",
    gender: "women",
    price: 520,
    originalPrice: null,
    rating: 5.0,
    reviewCount: 28,
    badge: "New Season",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Champagne Gold", hex: "#D4AF37" },
      { name: "Midnight Black", hex: "#111111" },
      { name: "Emerald Green", hex: "#1B3B2B" }
    ],
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop"
    ],
    description: "An ethereal floor-length slip silhouette cut on the bias in heavy 22-momme Grade 6A mulberry silk. Features a low draped cowl back and micro-rouleau adjustable shoulder straps.",
    details: [
      "100% Grade 6A Mulberry Silk (22-Momme)",
      "Bias-cut drape that contours naturally to movement",
      "Delicate hand-rolled hems and concealed side seam zipper",
      "Dry clean or hand wash cold with silk detergent",
      "Crafted in Lyon, France"
    ],
    inStock: true,
    featured: true
  },
  {
    id: "velora-03",
    name: "Architectural Tailored Wool Blazer",
    category: "tailoring",
    categoryLabel: "Tailoring",
    gender: "women",
    price: 490,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 35,
    badge: "Iconic",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal Melange", hex: "#2C2C2C" },
      { name: "Warm Taupe", hex: "#8E8070" },
      { name: "Bone White", hex: "#ECE6DD" }
    ],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=900&auto=format&fit=crop"
    ],
    description: "A masterclass in modern sartorial precision. Cut with clean geometric lines, single horn-button stance, peak lapels, and an hourglass waist contour that commands understated presence.",
    details: [
      "100% Super 130s Merino Fine Wool",
      "Half-canvas construction for long-term chest shape retention",
      "Functional surgeon cuffs with genuine horn buttons",
      "Dry clean only",
      "Designed in Milan, Italy"
    ],
    inStock: true,
    featured: true
  },
  {
    id: "velora-04",
    name: "Handcrafted Calfskin 'Atelier' Tote Bag",
    category: "accessories",
    categoryLabel: "Accessories",
    gender: "unisex",
    price: 740,
    originalPrice: 890,
    rating: 4.9,
    reviewCount: 64,
    badge: "Limited Edition",
    sizes: ["One Size"],
    colors: [
      { name: "Caramel Brown", hex: "#8A5A36" },
      { name: "Noir Black", hex: "#111111" },
      { name: "Cream Stone", hex: "#E7DFD5" }
    ],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=900&auto=format&fit=crop"
    ],
    description: "Constructed by third-generation Tuscan artisans using vegetable-tanned full-grain calfskin. Structured trapezoid body, custom gold-finished hardware, and suede microfiber interior.",
    details: [
      "100% Full-Grain Tuscan Calf Leather",
      "Hand-painted leather edges and saddle stitching",
      "Removable internal zip pouch and protective metal base feet",
      "Treated with organic vegetable oils for bespoke patina over time",
      "Handmade in Florence, Italy"
    ],
    inStock: true,
    featured: true
  },
  {
    id: "velora-05",
    name: "Pleated High-Rise Wide-Leg Trousers",
    category: "tailoring",
    categoryLabel: "Tailoring",
    gender: "women",
    price: 340,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 19,
    badge: "Essential",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Muted Olive", hex: "#555A4C" },
      { name: "Ivory Linen", hex: "#F2EEE8" },
      { name: "Deep Charcoal", hex: "#1F2022" }
    ],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop"
    ],
    description: "Flowing wide-leg tailoring featuring double forward pleats, an elongated high-waist band with concealed tab closure, and pressed centre creases for fluid elongation.",
    details: [
      "70% Fine Virgin Wool, 30% Lyocell",
      "Double forward pleats with relaxed drape",
      "Side slant pockets and rear jetted pockets",
      "Dry clean only",
      "Made in Portugal"
    ],
    inStock: true,
    featured: false
  },
  {
    id: "velora-06",
    name: "Seamless Ribbed Cashmere Turtleneck",
    category: "knitwear",
    categoryLabel: "Knitwear",
    gender: "women",
    price: 380,
    originalPrice: 420,
    rating: 4.8,
    reviewCount: 52,
    badge: "Sustainable",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Oatmeal Heather", hex: "#D6CEBF" },
      { name: "Espresso", hex: "#37271F" },
      { name: "Jet Black", hex: "#111111" }
    ],
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop"
    ],
    description: "Knitted from 12-gauge 2-ply recycled Mongolian cashmere with zero waste. Features a sculptured fold-over turtleneck, ribbed cuffs, and featherweight thermal insulation.",
    details: [
      "100% GOTS & SFA-Certified Mongolian Cashmere",
      "Seamless 3D knit technology for supreme skin comfort",
      "Hypoallergenic and temperature-regulating",
      "Hand wash cold, reshape and dry flat",
      "Spun in Scotland"
    ],
    inStock: true,
    featured: true
  },
  {
    id: "velora-07",
    name: "Sculptural Heel Minimalist Leather Mule",
    category: "footwear",
    categoryLabel: "Footwear",
    gender: "women",
    price: 430,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 31,
    badge: "New Season",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Polished Nappa", hex: "#111111" },
      { name: "Pecan Brown", hex: "#7E4B31" },
      { name: "Chalk White", hex: "#F5F3EF" }
    ],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop"
    ],
    description: "An aerodynamic silhouette resting on a 65mm curved brass-inlaid kitten heel. Butter-soft Italian nappa leather band paired with an ergonomically cushioned memory arch.",
    details: [
      "100% Italian Lambskin Nappa upper",
      "Leather sole with non-slip injected rubber forefoot tip",
      "65mm architectural curved heel with balanced center-of-gravity",
      "Comes with dust bag and spare heel tips",
      "Handmade in Civitanova Marche, Italy"
    ],
    inStock: true,
    featured: false
  },
  {
    id: "velora-08",
    name: "Hammered 18K Gold Vermeil Horizon Earrings",
    category: "accessories",
    categoryLabel: "Accessories",
    gender: "unisex",
    price: 210,
    originalPrice: 260,
    rating: 5.0,
    reviewCount: 47,
    badge: "Bestseller",
    sizes: ["One Size"],
    colors: [
      { name: "18K Yellow Gold", hex: "#D4AF37" },
      { name: "Sterling Silver", hex: "#D9D9D9" }
    ],
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=900&auto=format&fit=crop"
    ],
    description: "Organic sculptural drop earrings handcrafted with molten texture inspired by Aegean tides. Finished in thick 3.0-micron 18K yellow gold vermeil over recycled 925 sterling silver.",
    details: [
      "Recycled 925 Sterling Silver base with 3.0 Micron 18k Gold plating",
      "Hypoallergenic titanium posts with secure butterfly backing",
      "Ultra-lightweight hollow-cast design (5.2g per ear)",
      "Anti-tarnish protective microscopic e-coating",
      "Atelier cast in Athens, Greece"
    ],
    inStock: true,
    featured: true
  },
  {
    id: "velora-09",
    name: "Oversized Heavyweight Poplin Shirt",
    category: "tops",
    categoryLabel: "Tops",
    gender: "unisex",
    price: 260,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 22,
    badge: "Essential",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Crisp Pure White", hex: "#FFFFFF" },
      { name: "Sky Pinstripe", hex: "#A8C0D8" },
      { name: "Midnight Navy", hex: "#182238" }
    ],
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=900&auto=format&fit=crop"
    ],
    description: "Woven from 120s two-fold Giza Egyptian cotton with a crisp paper-touch hand feel. Cut with dropped shoulders, exaggerated pointed collar, and mother-of-pearl buttons.",
    details: [
      "100% Long-Staple Giza Egyptian Cotton Poplin",
      "Genuine Australian Mother-of-Pearl buttons",
      "French seams and curved split hem for versatile tucking",
      "Machine wash 30°C delicate or dry clean",
      "Tailored in Porto, Portugal"
    ],
    inStock: true,
    featured: false
  },
  {
    id: "velora-10",
    name: "Classic Men's Double-Breasted Wool Tuxedo",
    category: "tailoring",
    categoryLabel: "Tailoring",
    gender: "men",
    price: 920,
    originalPrice: 1100,
    rating: 4.9,
    reviewCount: 39,
    badge: "Ceremonial",
    sizes: ["38R", "40R", "42R", "44R"],
    colors: [
      { name: "Midnight Navy", hex: "#0E1524" },
      { name: "Onyx Black", hex: "#0C0C0C" }
    ],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop"
    ],
    description: "The pinnacle of black-tie eveningwear. Featuring dramatic silk grosgrain peak lapels, full floating horsehair canvas, and matching flat-front satin-striped trousers.",
    details: [
      "100% Super 150s Baratheas Wool woven in Yorkshire",
      "Silk faille peak lapels and covered buttons",
      "Full canvas construction moldable to the wearer's physique",
      "Includes tailored blazer and unhemmed trousers for custom fitting",
      "Hand-finished in Savile Row tradition"
    ],
    inStock: true,
    featured: true
  },
  {
    id: "velora-11",
    name: "Belted Trench Coat with Storm Flap",
    category: "outerwear",
    categoryLabel: "Outerwear",
    gender: "women",
    price: 580,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 31,
    badge: "Iconic",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Classic Sand", hex: "#D6C6B0" },
      { name: "Olive Drab", hex: "#4C4E3D" },
      { name: "Deep Ink", hex: "#141724" }
    ],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop"
    ],
    description: "Crafted in waterproof cotton gabardine, this quintessential trench coat boasts storm flaps, epaulettes, buffalo-horn D-ring buckled belt, and vintage checked undercollar.",
    details: [
      "100% Water-repellent Cotton Gabardine",
      "Horn buckle closures and storm-shield back cape",
      "Raglan sleeves for natural layering over thick knits",
      "Dry clean recommended",
      "Made in England"
    ],
    inStock: true,
    featured: false
  },
  {
    id: "velora-12",
    name: "Pure Silk Twill Heritage Carré Scarf",
    category: "accessories",
    categoryLabel: "Accessories",
    gender: "unisex",
    price: 195,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 44,
    badge: "Artisanal",
    sizes: ["90 x 90 cm"],
    colors: [
      { name: "Sienna & Ivory", hex: "#A0522D" },
      { name: "Cobalt Azure", hex: "#1C3F6E" },
      { name: "Gilded Emerald", hex: "#2E5C42" }
    ],
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop"
    ],
    description: "A 90x90cm canvas of hand-drawn astrological motifs screen-printed onto lustrous silk twill, finished with artisanal hand-rolled French roulotté borders.",
    details: [
      "100% Heavy Silk Twill 16-Momme",
      "14-color traditional screen print",
      "Hand-rolled and hand-stitched borders (roulotté)",
      "Presented in embossed VELORA gold-foil keepsake box",
      "Screen printed in Como, Italy"
    ],
    inStock: true,
    featured: false
  }
];

// Product Service utilities
const VeloraProducts = {
  getAll() {
    return VELORA_PRODUCTS;
  },

  getFeatured() {
    return VELORA_PRODUCTS.filter(p => p.featured);
  },

  getById(id) {
    return VELORA_PRODUCTS.find(p => p.id === id);
  },

  getCategories() {
    const categories = new Set(VELORA_PRODUCTS.map(p => p.category));
    return ["all", ...Array.from(categories)];
  },

  filter(criteria = {}) {
    let result = [...VELORA_PRODUCTS];

    if (criteria.category && criteria.category !== "all") {
      result = result.filter(p => p.category.toLowerCase() === criteria.category.toLowerCase());
    }

    if (criteria.gender && criteria.gender !== "all") {
      result = result.filter(p => p.gender.toLowerCase() === criteria.gender.toLowerCase() || p.gender === "unisex");
    }

    if (criteria.minPrice !== undefined) {
      result = result.filter(p => p.price >= criteria.minPrice);
    }

    if (criteria.maxPrice !== undefined) {
      result = result.filter(p => p.price <= criteria.maxPrice);
    }

    if (criteria.size) {
      result = result.filter(p => p.sizes.includes(criteria.size));
    }

    if (criteria.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    if (criteria.search) {
      const q = criteria.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (criteria.sortBy) {
      switch (criteria.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "featured":
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  }
};
