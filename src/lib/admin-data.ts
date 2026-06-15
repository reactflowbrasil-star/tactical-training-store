import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, formatBRL } from "@/lib/products";

const STORAGE_KEY = "tactical-training-admin-store-v1";

export type RecordStatus = "active" | "draft" | "inactive";
export type OrderStatus =
  | "Novo pedido"
  | "Em analise"
  | "Pago"
  | "Em separacao"
  | "Enviado"
  | "Entregue"
  | "Cancelado";

export type UserRole =
  | "Administrador geral"
  | "Editor de conteudo"
  | "Gestor de produtos"
  | "Cliente"
  | "Atendente";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  salePrice: number;
  sku: string;
  stock: number;
  status: RecordStatus;
  featured: boolean;
  novelty: boolean;
  promotion: boolean;
  inStock: boolean;
  shortDescription: string;
  description: string;
  images: string[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  imageAlt: string;
  weight: string;
  dimensions: string;
  attributes: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentId: string;
  status: RecordStatus;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: RecordStatus;
  permissions: string[];
  createdAt: string;
  lastAccess: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  status: OrderStatus;
  total: number;
  payment: "PIX" | "Cartao" | "Boleto";
  address: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBanner {
  id: string;
  area: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  desktopImage: string;
  mobileImage: string;
  status: RecordStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeoEntry {
  id: string;
  type: "global" | "page" | "product" | "category";
  target: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt: string;
  linkedTo: string;
  type: "produto" | "categoria" | "banner" | "institucional";
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  privacyPolicy: string;
  terms: string;
  shippingInfo: string;
  paymentInfo: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultKeywords: string;
  defaultShareImage: string;
  canonicalUrl: string;
  pwaShortName: string;
  pwaThemeColor: string;
  pwaDescription: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  area: string;
  createdAt: string;
}

export interface AdminState {
  products: AdminProduct[];
  categories: AdminCategory[];
  users: AdminUser[];
  orders: AdminOrder[];
  banners: AdminBanner[];
  seoEntries: SeoEntry[];
  media: MediaItem[];
  settings: StoreSettings;
  activityLogs: ActivityLog[];
}

export interface AiCopyInput {
  productName: string;
  category: string;
  audience: string;
  tone: string;
  focusKeyword: string;
  benefits: string;
  differentials: string;
  objective: string;
}

export interface AiCopyResult {
  title: string;
  shortDescription: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  cta: string;
  imageAlt: string;
  improvements: string[];
}

const now = "2026-06-14T20:00:00.000Z";

export const orderStatuses: OrderStatus[] = [
  "Novo pedido",
  "Em analise",
  "Pago",
  "Em separacao",
  "Enviado",
  "Entregue",
  "Cancelado",
];

export const userRoles: UserRole[] = [
  "Administrador geral",
  "Editor de conteudo",
  "Gestor de produtos",
  "Cliente",
  "Atendente",
];

export const bannerAreas = [
  "Banner principal da home",
  "Banners secundarios",
  "Banner de categoria",
  "Banner promocional",
  "Banner mobile",
];

export function makeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function makeId(prefix = "item") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toIsoDate(daysAgo: number) {
  const base = new Date("2026-06-14T13:00:00.000Z");
  base.setDate(base.getDate() - daysAgo);
  return base.toISOString();
}

const initialProducts: AdminProduct[] = PRODUCTS.map((product, index) => ({
  id: product.id,
  name: product.name,
  slug: product.id,
  category: product.category,
  price: product.price,
  salePrice: product.oldPrice ? product.price : 0,
  sku: `TT-${String(index + 1).padStart(4, "0")}`,
  stock: [6, 18, 9, 34, 4, 27, 13, 8][index] ?? 12,
  status: "active",
  featured: Boolean(product.bestseller),
  novelty: Boolean(product.novelty),
  promotion: Boolean(product.oldPrice),
  inStock: true,
  shortDescription: product.description,
  description: `${product.description} Produto selecionado para uso em campo, com curadoria focada em durabilidade, ergonomia e desempenho para atividades outdoor.`,
  images: [product.image],
  tags: [product.brand, product.category, product.badge ?? "outdoor"].filter(Boolean),
  metaTitle: `${product.name} | Tactical Training`,
  metaDescription: product.description,
  focusKeyword: product.name.split(" ").slice(0, 2).join(" ").toLowerCase(),
  imageAlt: `${product.name} para uso tatico outdoor`,
  weight: `${(index + 1) * 0.7} kg`,
  dimensions: "40 x 28 x 18 cm",
  attributes: product.specs.map((spec) => `${spec.label}: ${spec.value}`).join("\n"),
  displayOrder: index + 1,
  createdAt: toIsoDate(30 - index),
  updatedAt: toIsoDate(index),
}));

const categoryImages = Object.fromEntries(
  PRODUCTS.map((product) => [product.category, product.image]),
) as Record<string, string>;

const initialCategories: AdminCategory[] = CATEGORIES.map((category, index) => ({
  id: category.slug,
  name: category.label,
  slug: category.slug,
  description: `Selecao de produtos para ${category.label.toLowerCase()} com foco em desempenho, seguranca e resistencia.`,
  image: categoryImages[category.slug] ?? PRODUCTS[0]?.image ?? "",
  icon: ["Target", "Fish", "Tent", "Shirt", "Package"][index] ?? "Package",
  parentId: "",
  status: "active",
  displayOrder: index + 1,
  metaTitle: `${category.label} | Tactical Training`,
  metaDescription: `Compre equipamentos de ${category.label.toLowerCase()} na Tactical Training.`,
  focusKeyword: category.label.toLowerCase(),
  createdAt: toIsoDate(50 - index),
  updatedAt: toIsoDate(index + 2),
}));

const initialUsers: AdminUser[] = [
  {
    id: "usr-admin",
    name: "Alexandre Admin",
    email: "admin@tacticaltraining.local",
    phone: "(11) 99999-1000",
    role: "Administrador geral",
    status: "active",
    permissions: ["Produtos", "Pedidos", "SEO", "Usuarios", "Configuracoes"],
    createdAt: toIsoDate(80),
    lastAccess: toIsoDate(0),
  },
  {
    id: "usr-editor",
    name: "Marina Conteudo",
    email: "conteudo@tacticaltraining.local",
    phone: "(11) 98888-2000",
    role: "Editor de conteudo",
    status: "active",
    permissions: ["Banners", "SEO", "IA"],
    createdAt: toIsoDate(45),
    lastAccess: toIsoDate(1),
  },
  {
    id: "usr-products",
    name: "Rafael Produtos",
    email: "produtos@tacticaltraining.local",
    phone: "(11) 97777-3000",
    role: "Gestor de produtos",
    status: "active",
    permissions: ["Produtos", "Categorias", "Midia"],
    createdAt: toIsoDate(28),
    lastAccess: toIsoDate(3),
  },
  {
    id: "usr-client",
    name: "Cliente Exemplo",
    email: "cliente@email.com",
    phone: "(21) 96666-4000",
    role: "Cliente",
    status: "active",
    permissions: ["Conta"],
    createdAt: toIsoDate(14),
    lastAccess: toIsoDate(4),
  },
];

const initialOrders: AdminOrder[] = [
  {
    id: "TT-1028",
    customer: "Carlos Menezes",
    email: "carlos@email.com",
    phone: "(31) 99912-3456",
    status: "Novo pedido",
    total: 1888.9,
    payment: "PIX",
    address: "Rua das Palmeiras, 120 - Belo Horizonte, MG",
    items: [
      { productId: "mochila-tactical-45l", name: "Mochila Tatica Molle 45 Litros", qty: 1, price: 689 },
      { productId: "binoculo-tactical-10x50", name: "Binoculo Tatico 10x50 Long Range", qty: 1, price: 899.9 },
      { productId: "lanterna-tactical-2000lm", name: "Lanterna Tatica LED 2000 Lumens", qty: 1, price: 300 },
    ],
    internalNotes: "Cliente pediu envio prioritario pelo WhatsApp.",
    createdAt: toIsoDate(0),
    updatedAt: toIsoDate(0),
  },
  {
    id: "TT-1027",
    customer: "Patricia Lopes",
    email: "patricia@email.com",
    phone: "(41) 98822-1111",
    status: "Pago",
    total: 1299,
    payment: "Cartao",
    address: "Avenida Batel, 740 - Curitiba, PR",
    items: [{ productId: "barraca-camp-4p", name: "Barraca Tactical Camp 4 Pessoas", qty: 1, price: 1299 }],
    internalNotes: "Pagamento aprovado. Separar estoque fisico.",
    createdAt: toIsoDate(1),
    updatedAt: toIsoDate(1),
  },
  {
    id: "TT-1026",
    customer: "Joao Ribeiro",
    email: "joao@email.com",
    phone: "(85) 98765-1221",
    status: "Enviado",
    total: 808,
    payment: "Boleto",
    address: "Rua Dragao do Mar, 200 - Fortaleza, CE",
    items: [
      { productId: "faca-tactical-bushcraft", name: "Faca Tatica Bushcraft com Bainha", qty: 1, price: 349 },
      { productId: "lanterna-tactical-2000lm", name: "Lanterna Tatica LED 2000 Lumens", qty: 1, price: 459 },
    ],
    internalNotes: "Codigo de rastreio enviado por e-mail.",
    createdAt: toIsoDate(3),
    updatedAt: toIsoDate(2),
  },
];

const initialBanners: AdminBanner[] = [
  {
    id: "bn-home-main",
    area: "Banner principal da home",
    title: "Domine o terreno",
    subtitle: "Equipamentos taticos para caca, pesca e camping.",
    ctaLabel: "Comprar agora",
    ctaUrl: "/produtos",
    desktopImage: PRODUCTS[0]?.image ?? "",
    mobileImage: PRODUCTS[5]?.image ?? "",
    status: "active",
    displayOrder: 1,
    createdAt: toIsoDate(18),
    updatedAt: toIsoDate(2),
  },
  {
    id: "bn-promo",
    area: "Banner promocional",
    title: "15% off no primeiro pedido",
    subtitle: "Use o cupom TACTICAL15 no checkout.",
    ctaLabel: "Usar cupom",
    ctaUrl: "/carrinho",
    desktopImage: PRODUCTS[4]?.image ?? "",
    mobileImage: PRODUCTS[3]?.image ?? "",
    status: "active",
    displayOrder: 2,
    createdAt: toIsoDate(12),
    updatedAt: toIsoDate(1),
  },
];

const initialSeoEntries: SeoEntry[] = [
  {
    id: "seo-home",
    type: "page",
    target: "Pagina inicial",
    slug: "/",
    metaTitle: "Tactical Training - Equipamentos para Caca, Pesca e Camping",
    metaDescription:
      "Loja virtual de equipamentos taticos premium para aventuras outdoor, caca, pesca e camping.",
    focusKeyword: "equipamentos taticos",
    secondaryKeywords: "caca, pesca, camping, outdoor",
    canonicalUrl: "https://tacticaltraining.com.br/",
    ogTitle: "Tactical Training",
    ogDescription: "Equipamentos taticos para outdoor extremo.",
    ogImage: PRODUCTS[0]?.image ?? "",
    robots: "index, follow",
    updatedAt: toIsoDate(1),
  },
  ...initialCategories.map((category) => ({
    id: `seo-cat-${category.slug}`,
    type: "category" as const,
    target: category.name,
    slug: `/categoria/${category.slug}`,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
    focusKeyword: category.focusKeyword,
    secondaryKeywords: "loja outdoor, equipamento tatico",
    canonicalUrl: `https://tacticaltraining.com.br/categoria/${category.slug}`,
    ogTitle: category.metaTitle,
    ogDescription: category.metaDescription,
    ogImage: category.image,
    robots: "index, follow",
    updatedAt: category.updatedAt,
  })),
];

const initialMedia: MediaItem[] = PRODUCTS.slice(0, 8).map((product, index) => ({
  id: `media-${product.id}`,
  name: `${makeSlug(product.name)}.jpg`,
  url: product.image,
  alt: `${product.name} em fundo de loja Tactical Training`,
  linkedTo: product.name,
  type: "produto",
  createdAt: toIsoDate(20 - index),
  updatedAt: toIsoDate(index),
}));

const initialSettings: StoreSettings = {
  storeName: "TACTICAL TRAINING",
  logoUrl: "",
  faviconUrl: "/icon.svg",
  primaryColor: "#f0252b",
  whatsapp: "+55 11 99999-0000",
  email: "contato@tacticaltraining.com.br",
  address: "Rua Operacao Outdoor, 100 - Sao Paulo, SP",
  instagram: "https://instagram.com/tacticaltraining",
  facebook: "https://facebook.com/tacticaltraining",
  privacyPolicy:
    "Coletamos apenas dados necessarios para processar pedidos, atendimento e comunicacoes comerciais autorizadas.",
  terms:
    "Ao comprar na loja, o cliente declara estar de acordo com prazos, condicoes de pagamento, entrega e troca.",
  shippingInfo:
    "Frete gratis acima de R$ 499. Entregas calculadas por CEP e prazo estimado no checkout.",
  paymentInfo: "PIX com desconto, cartao em ate 12x sem juros e boleto bancario.",
  defaultSeoTitle: "TACTICAL TRAINING - Caca, Pesca e Camping",
  defaultSeoDescription:
    "Equipamentos taticos premium para quem exige resistencia, desempenho e confianca no outdoor.",
  defaultKeywords: "equipamentos taticos, caca, pesca, camping",
  defaultShareImage: PRODUCTS[0]?.image ?? "",
  canonicalUrl: "https://tacticaltraining.com.br",
  pwaShortName: "Tactical",
  pwaThemeColor: "#0d0d0d",
  pwaDescription: "Loja e painel Tactical Training em formato PWA.",
};

const initialActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    action: "Produto atualizado",
    user: "Alexandre Admin",
    area: "Produtos",
    createdAt: toIsoDate(0),
  },
  {
    id: "log-2",
    action: "SEO da home revisado",
    user: "Marina Conteudo",
    area: "SEO",
    createdAt: toIsoDate(1),
  },
  {
    id: "log-3",
    action: "Pedido TT-1027 marcado como pago",
    user: "Rafael Produtos",
    area: "Pedidos",
    createdAt: toIsoDate(1),
  },
];

export const initialAdminState: AdminState = {
  products: initialProducts,
  categories: initialCategories,
  users: initialUsers,
  orders: initialOrders,
  banners: initialBanners,
  seoEntries: initialSeoEntries,
  media: initialMedia,
  settings: initialSettings,
  activityLogs: initialActivityLogs,
};

function mergeStoredState(stored: Partial<AdminState>): AdminState {
  return {
    ...initialAdminState,
    ...stored,
    settings: { ...initialAdminState.settings, ...stored.settings },
  };
}

export function useAdminStore() {
  const [state, setState] = useState<AdminState>(initialAdminState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(mergeStoredState(JSON.parse(raw) as Partial<AdminState>));
      } catch {
        setState(initialAdminState);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const logAction = useCallback((action: string, area: string) => {
    setState((current) => ({
      ...current,
      activityLogs: [
        {
          id: makeId("log"),
          action,
          area,
          user: getAdminSession()?.name ?? "Administrador",
          createdAt: new Date().toISOString(),
        },
        ...current.activityLogs,
      ].slice(0, 40),
    }));
  }, []);

  const upsertProduct = useCallback(
    (product: AdminProduct) => {
      setState((current) => {
        const exists = current.products.some((item) => item.id === product.id);
        return {
          ...current,
          products: exists
            ? current.products.map((item) => (item.id === product.id ? product : item))
            : [product, ...current.products],
        };
      });
      logAction(`Produto ${product.name} salvo`, "Produtos");
    },
    [logAction],
  );

  const removeProduct = useCallback(
    (id: string) => {
      setState((current) => ({
        ...current,
        products: current.products.filter((item) => item.id !== id),
      }));
      logAction("Produto removido", "Produtos");
    },
    [logAction],
  );

  const updateCollection = useCallback(
    <Key extends keyof AdminState>(key: Key, value: AdminState[Key], action?: string, area?: string) => {
      setState((current) => ({ ...current, [key]: value }));
      if (action && area) logAction(action, area);
    },
    [logAction],
  );

  const resetStore = useCallback(() => {
    setState(initialAdminState);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return useMemo(
    () => ({
      state,
      ready,
      setState,
      updateCollection,
      upsertProduct,
      removeProduct,
      logAction,
      resetStore,
    }),
    [state, ready, updateCollection, upsertProduct, removeProduct, logAction, resetStore],
  );
}

export function createBlankProduct(): AdminProduct {
  return {
    id: makeId("prod"),
    name: "",
    slug: "",
    category: CATEGORIES[0]?.slug ?? "caca",
    price: 0,
    salePrice: 0,
    sku: `TT-${Math.floor(1000 + Math.random() * 9000)}`,
    stock: 0,
    status: "draft",
    featured: false,
    novelty: false,
    promotion: false,
    inStock: true,
    shortDescription: "",
    description: "",
    images: [],
    tags: [],
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    imageAlt: "",
    weight: "",
    dimensions: "",
    attributes: "",
    displayOrder: 99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function scoreSeo(entry: Pick<SeoEntry, "metaTitle" | "metaDescription" | "focusKeyword" | "canonicalUrl">) {
  let score = 0;
  if (entry.metaTitle.length >= 35 && entry.metaTitle.length <= 65) score += 25;
  if (entry.metaDescription.length >= 90 && entry.metaDescription.length <= 160) score += 30;
  if (entry.focusKeyword.length >= 3) score += 25;
  if (entry.canonicalUrl.startsWith("http")) score += 20;
  return score;
}

export function getSeoHints(score: number) {
  if (score >= 85) return "SEO forte";
  if (score >= 60) return "Revisar detalhes";
  return "Campos incompletos";
}

export function generateAiCopy(input: AiCopyInput): AiCopyResult {
  const product = input.productName || "Produto Tactical Training";
  const category = input.category || "outdoor";
  const keyword = input.focusKeyword || makeSlug(product).replaceAll("-", " ");
  const audience = input.audience || "aventureiros exigentes";
  const tone = input.tone || "Profissional";
  const benefits = input.benefits || "resistencia, desempenho e seguranca";
  const differentials = input.differentials || "acabamento premium e curadoria especializada";
  const objective = input.objective || "aumentar conversao";

  return {
    title: `${product}: desempenho real para ${category}`,
    shortDescription: `${product} para ${audience}, com foco em ${benefits}. Copy em tom ${tone.toLowerCase()} para ${objective}.`,
    description:
      `${product} foi selecionado para quem precisa de confianca em campo. ` +
      `A proposta combina ${benefits} com ${differentials}, entregando uma experiencia objetiva para ${audience}. ` +
      `Use em jornadas de ${category}, operacoes outdoor ou preparacao pessoal com uma compra simples, segura e pronta para conversao.`,
    metaTitle: `${product} | Tactical Training`,
    metaDescription: `Compre ${product} na Tactical Training. Produto para ${category} com ${benefits}. Envio rapido e pagamento seguro.`,
    keywords: [keyword, category, "equipamento tatico", "loja outdoor"].join(", "),
    cta: "Comprar agora",
    imageAlt: `${product} para ${category} com ${benefits}`,
    improvements: [
      "Inserir a palavra-chave no titulo e no primeiro paragrafo.",
      "Adicionar prova de confianca, como garantia, troca ou avaliacao.",
      "Usar beneficios concretos antes de especificacoes tecnicas.",
      "Criar FAQ curto para reduzir duvidas antes do checkout.",
    ],
  };
}

export function getAdminSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("tactical-training-admin-session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as { name: string; email: string; role: UserRole };
  } catch {
    return null;
  }
}

export function setAdminSession(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    "tactical-training-admin-session",
    JSON.stringify({
      name: email.includes("@") ? email.split("@")[0] : "Administrador",
      email,
      role: "Administrador geral",
    }),
  );
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("tactical-training-admin-session");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function money(value: number) {
  return formatBRL(Number.isFinite(value) ? value : 0);
}

export function csvToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function arrayToCsv(value: string[]) {
  return value.join(", ");
}
