import binoculo from "@/assets/p-binoculo.jpg";
import faca from "@/assets/p-faca.jpg";
import carretilha from "@/assets/p-carretilha.jpg";
import lanterna from "@/assets/p-lanterna.jpg";
import barraca from "@/assets/p-barraca.jpg";
import mochila from "@/assets/p-mochila.jpg";
import jaqueta from "@/assets/p-jaqueta.jpg";
import cooler from "@/assets/p-cooler.jpg";

export type Category = "caca" | "pesca" | "camping" | "vestuario" | "acessorios";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  specs: { label: string; value: string }[];
  bestseller?: boolean;
  novelty?: boolean;
}

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "caca", label: "Caça" },
  { slug: "pesca", label: "Pesca" },
  { slug: "camping", label: "Camping" },
  { slug: "vestuario", label: "Vestuário" },
  { slug: "acessorios", label: "Acessórios" },
];

export const PRODUCTS: Product[] = [
  {
    id: "binoculo-tactical-10x50",
    name: "Binóculo Tático 10x50 Long Range",
    brand: "Tasco",
    price: 899.9,
    oldPrice: 1199.9,
    category: "caca",
    image: binoculo,
    rating: 4.8,
    reviews: 142,
    badge: "-25%",
    bestseller: true,
    description:
      "Binóculo de alta performance com lentes multicamadas, ideal para observação em longa distância em ambientes hostis.",
    specs: [
      { label: "Aumento", value: "10x" },
      { label: "Lente Objetiva", value: "50mm" },
      { label: "Campo de Visão", value: "114m / 1000m" },
      { label: "Peso", value: "850g" },
    ],
  },
  {
    id: "faca-tactical-bushcraft",
    name: "Faca Tática Bushcraft com Bainha",
    brand: "Cimo",
    price: 349.9,
    category: "caca",
    image: faca,
    rating: 4.9,
    reviews: 287,
    bestseller: true,
    description:
      "Faca forjada em aço carbono de alta dureza, cabo em madeira nobre e bainha em couro reforçado.",
    specs: [
      { label: "Lâmina", value: "Aço Carbono 1095" },
      { label: "Comprimento", value: "24cm" },
      { label: "Cabo", value: "Madeira maciça" },
    ],
  },
  {
    id: "carretilha-prozon-x9",
    name: "Carretilha Prozon X9 Perfil Baixo",
    brand: "Prozon",
    price: 599.0,
    oldPrice: 749.0,
    category: "pesca",
    image: carretilha,
    rating: 4.7,
    reviews: 98,
    badge: "OFERTA",
    bestseller: true,
    description:
      "Carretilha de perfil baixo com 9 rolamentos e sistema anti-reverso instantâneo. Performance profissional.",
    specs: [
      { label: "Rolamentos", value: "9+1" },
      { label: "Recolhimento", value: "7.1:1" },
      { label: "Drag Max", value: "8kg" },
    ],
  },
  {
    id: "lanterna-tactical-2000lm",
    name: "Lanterna Tática LED 2000 Lúmens",
    brand: "Nitecore",
    price: 459.0,
    category: "acessorios",
    image: lanterna,
    rating: 4.9,
    reviews: 412,
    bestseller: true,
    novelty: true,
    description:
      "Lanterna ultra-resistente com corpo em alumínio aeronáutico, 5 modos de iluminação e estroboscópio tático.",
    specs: [
      { label: "Potência", value: "2000 lm" },
      { label: "Alcance", value: "320m" },
      { label: "Bateria", value: "18650 recarregável" },
    ],
  },
  {
    id: "barraca-camp-4p",
    name: "Barraca Tactical Camp 4 Pessoas",
    brand: "Nautika",
    price: 1299.0,
    oldPrice: 1599.0,
    category: "camping",
    image: barraca,
    rating: 4.6,
    reviews: 76,
    badge: "NOVO",
    novelty: true,
    description:
      "Barraca para 4 pessoas com dupla camada impermeável, coluna d'água 3000mm e montagem rápida.",
    specs: [
      { label: "Capacidade", value: "4 pessoas" },
      { label: "Coluna d'água", value: "3000mm" },
      { label: "Peso", value: "4.2kg" },
    ],
  },
  {
    id: "mochila-tactical-45l",
    name: "Mochila Tática Molle 45 Litros",
    brand: "5.11",
    price: 689.0,
    category: "acessorios",
    image: mochila,
    rating: 4.8,
    reviews: 234,
    bestseller: true,
    description:
      "Mochila tática com sistema MOLLE, múltiplos compartimentos e tecido 1000D resistente à abrasão.",
    specs: [
      { label: "Capacidade", value: "45L" },
      { label: "Tecido", value: "Cordura 1000D" },
      { label: "Sistema", value: "MOLLE/PALS" },
    ],
  },
  {
    id: "jaqueta-camo-woodland",
    name: "Jaqueta Camuflada Woodland Pro",
    brand: "Bélica",
    price: 429.0,
    category: "vestuario",
    image: jaqueta,
    rating: 4.5,
    reviews: 67,
    novelty: true,
    description:
      "Jaqueta camuflada em tecido ripstop, leve, respirável e com tratamento DWR para repelência à água.",
    specs: [
      { label: "Tecido", value: "Ripstop 65/35" },
      { label: "Tratamento", value: "DWR" },
    ],
  },
  {
    id: "cooler-tactical-40l",
    name: "Cooler Térmico Tactical 40L",
    brand: "Coleman",
    price: 899.0,
    oldPrice: 1099.0,
    category: "camping",
    image: cooler,
    rating: 4.7,
    reviews: 121,
    badge: "-18%",
    novelty: true,
    description:
      "Cooler robusto com isolamento de alta densidade. Mantém gelo por até 5 dias. Construção indestrutível.",
    specs: [
      { label: "Capacidade", value: "40 litros" },
      { label: "Retenção", value: "Até 5 dias" },
    ],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getByCategory = (slug: Category) =>
  PRODUCTS.filter((p) => p.category === slug);

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
