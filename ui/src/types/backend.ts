export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_main: string;
  images: string[];
  specifications: Record<string, string>;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_order: number;
  product: Product;
}

export interface Order {
  id: number;
  total_amount: number;
  shipping_address: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
}
