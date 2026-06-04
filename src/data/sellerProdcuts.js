import tshirtImage from "../assets/product-tshirt.png";
import hoodieImage from "../assets/product-hoodie.png";

export const sellerProducts = [
  {
    id: 1,
    name: "Camiseta",
    price: 19.99,
    stock: 50,
    isActive: true,
    image: tshirtImage,
    variants: [
      {
        id: 1,
        color: "red",
        size: "S",
        stock: 50,
        price: 19.99,
      },
    ],
  },
  {
    id: 2,
    name: "Buzo",
    price: 39.99,
    stock: 30,
    isActive: false,
    image: hoodieImage,
    variants: [
      {
        id: 1,
        color: "blue",
        size: "M",
        stock: 30,
        price: 39.99,
      },
    ],
  },
];
