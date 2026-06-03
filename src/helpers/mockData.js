import hoodieImage from "../assets/product-hoodie.png";
import tshirtImage from "../assets/product-tshirt.png";

export const MOCK_CATEGORIES = [
  { id: 1, name: "Hoodies" },
  { id: 2, name: "Camisetas" },
  { id: 3, name: "Accesorios" },
];

export const MOCK_ALL_SIZES = ["S", "M", "L", "XL", "Único"];

export const MOCK_ALL_COLORS = [
  { id: 1, value: "Negro", hexColor: "#1a1c1c" },
  { id: 2, value: "Gris", hexColor: "#5f5e5e" },
  { id: 3, value: "Blanco", hexColor: "#fafafa" },
  { id: 4, value: "Rojo", hexColor: "#e60012" },
  { id: 5, value: "Azul", hexColor: "#1a3a5c" },
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Sudadera 'Cyber-Neo' Edición Limitada",
    price: 145.0,
    description:
      "Diseñada con precisión geométrica y una filosofía de espacio negativo. La sudadera Cyber-Neo fusiona la estética técnica con el minimalismo japonés. Cortada en un tejido estructurado que mantiene su forma arquitectónica, ofreciendo un refugio contra el ruido visual del entorno urbano.",
    images: [hoodieImage, hoodieImage, hoodieImage],
    categories: [{ id: 1, name: "Hoodies" }],
    colors: [
      { id: 1, value: "Negro", hexColor: "#1a1c1c" },
      { id: 2, value: "Gris", hexColor: "#5f5e5e" },
      { id: 3, value: "Blanco", hexColor: "#fafafa" },
    ],
    sizes: [
      { label: "S", stock: 5 },
      { label: "M", stock: 3 },
      { label: "L", stock: 0 },
      { label: "XL", stock: 2 },
    ],
    reviews: [
      { id: 1, rating: 5, title: "Hiroshi T.", description: "La calidad del tejido es excepcional. Mantiene su forma perfectamente y el corte geométrico es muy favorecedor. Un básico elevado.", date: "12 OCT 2023" },
      { id: 2, rating: 4, title: "Elena M.", description: "Minimalismo en su máxima expresión. Me encanta la estructura de los hombros y el acabado mate del color negro.", date: "06 OCT 2023" },
    ],
  },
  {
    id: 2,
    name: "T-Shirt Unit-02",
    price: 45.0,
    description: "Remera de algodón premium con corte recto y acabado minimalista. Inspirada en la estética de la nueva era digital.",
    images: [tshirtImage, tshirtImage],
    categories: [{ id: 2, name: "Camisetas" }],
    colors: [
      { id: 1, value: "Negro", hexColor: "#1a1c1c" },
      { id: 4, value: "Rojo", hexColor: "#e60012" },
    ],
    sizes: [
      { label: "S", stock: 8 },
      { label: "M", stock: 4 },
      { label: "L", stock: 2 },
    ],
    reviews: [
      { id: 1, rating: 5, title: "Carlos R.", description: "Excelente calidad, el algodón es muy suave y el corte es perfecto.", date: "20 NOV 2023" },
    ],
  },
  {
    id: 3,
    name: "Hoodie Type-01 'Ghost'",
    price: 120.0,
    description: "Hoodie de edición limitada con diseño fantasma. Tejido de alta densidad para máxima durabilidad.",
    images: [hoodieImage],
    categories: [{ id: 1, name: "Hoodies" }],
    colors: [{ id: 1, value: "Negro", hexColor: "#1a1c1c" }],
    sizes: [
      { label: "M", stock: 2 },
      { label: "L", stock: 5 },
      { label: "XL", stock: 1 },
    ],
    reviews: [],
  },
  {
    id: 4,
    name: "T-Shirt Evangelion Unit-00",
    price: 45.0,
    description: "Remera inspirada en el clásico anime. Algodón 100%, corte regular.",
    images: [tshirtImage],
    categories: [{ id: 2, name: "Camisetas" }],
    colors: [
      { id: 5, value: "Azul", hexColor: "#1a3a5c" },
      { id: 1, value: "Negro", hexColor: "#1a1c1c" },
    ],
    sizes: [
      { label: "S", stock: 3 },
      { label: "M", stock: 6 },
      { label: "L", stock: 4 },
      { label: "XL", stock: 2 },
    ],
    reviews: [],
  },
  {
    id: 5,
    name: "Sudadera Minimal Arc",
    price: 130.0,
    description: "Sudadera de líneas limpias y espacio negativo.",
    images: [hoodieImage],
    categories: [{ id: 1, name: "Hoodies" }],
    colors: [{ id: 2, value: "Gris", hexColor: "#5f5e5e" }],
    sizes: [
      { label: "S", stock: 4 },
      { label: "M", stock: 2 },
    ],
    reviews: [],
  },
  {
    id: 6,
    name: "T-Shirt Geo Pattern",
    price: 40.0,
    description: "Remera con patrón geométrico sutil.",
    images: [tshirtImage],
    categories: [{ id: 2, name: "Camisetas" }],
    colors: [{ id: 1, value: "Negro", hexColor: "#1a1c1c" }],
    sizes: [
      { label: "S", stock: 6 },
      { label: "M", stock: 4 },
      { label: "L", stock: 3 },
    ],
    reviews: [],
  },
  {
    id: 7,
    name: "Cinturón Táctico Urbano",
    price: 35.0,
    description: "Cinturón de nylon de alta resistencia.",
    images: [tshirtImage],
    categories: [{ id: 3, name: "Accesorios" }],
    colors: [{ id: 1, value: "Negro", hexColor: "#1a1c1c" }],
    sizes: [{ label: "Único", stock: 10 }],
    reviews: [],
  },
  {
    id: 8,
    name: "Gorra Cyber Minimal",
    price: 30.0,
    description: "Gorra con visera plana y bordado minimalista.",
    images: [tshirtImage],
    categories: [{ id: 3, name: "Accesorios" }],
    colors: [
      { id: 1, value: "Negro", hexColor: "#1a1c1c" },
      { id: 2, value: "Gris", hexColor: "#5f5e5e" },
    ],
    sizes: [{ label: "Único", stock: 8 }],
    reviews: [],
  },
  {
    id: 9,
    name: "T-Shirt Ghost Protocol",
    price: 45.0,
    description: "Remera de algodón con diseño fantasma.",
    images: [tshirtImage],
    categories: [{ id: 2, name: "Camisetas" }],
    colors: [{ id: 2, value: "Gris", hexColor: "#5f5e5e" }],
    sizes: [
      { label: "M", stock: 5 },
      { label: "L", stock: 3 },
    ],
    reviews: [],
  },
];
