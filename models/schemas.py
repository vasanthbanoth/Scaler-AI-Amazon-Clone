from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category: str
    image_main: str
    images: List[str]
    specifications: Dict[str, str]

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    product: Product

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItem(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_order: float
    product: Product

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address: str

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True

class OrderMinimal(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class WishlistItemBase(BaseModel):
    product_id: int

class WishlistItem(WishlistItemBase):
    id: int
    product: Product

    class Config:
        from_attributes = True
