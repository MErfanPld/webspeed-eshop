export type CartItem = {
  id: string; // unique: productId-size-color
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};
