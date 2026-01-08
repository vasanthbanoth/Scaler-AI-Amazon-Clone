const BASE_URL = typeof window === 'undefined' ? "https://amazon-clone-backend-yft6.onrender.com/api" : "https://amazon-clone-backend-yft6.onrender.com/api";

export async function getProducts(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (search) params.append("search", search);
  
  const res = await fetch(`${BASE_URL}/products?${params.toString()}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${BASE_URL}/cart`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(productId: number, quantity: number = 1) {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function updateCartItem(itemId: number, quantity: number) {
  const res = await fetch(`${BASE_URL}/cart/${itemId}?quantity=${quantity}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update cart");
  return res.json();
}

export async function deleteCartItem(itemId: number) {
  const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove item");
  return res.json();
}

export async function placeOrder(shippingAddress: string) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shipping_address: shippingAddress }),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${BASE_URL}/orders`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getOrder(id: string) {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function getWishlist() {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
}

export async function addToWishlist(productId: number) {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });
  if (!res.ok) throw new Error("Failed to add to wishlist");
  return res.json();
}

export async function deleteFromWishlist(productId: number) {
  const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from wishlist");
  return res.json();
}
