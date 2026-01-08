from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from database.db import get_db
from database.models import Order as OrderModel, OrderItem as OrderItemModel, CartItem as CartItemModel, Product as ProductModel
from models.schemas import Order as OrderSchema, OrderCreate, OrderMinimal
from modules.logger import ic, logger

router = APIRouter()

@router.post("/", response_model=OrderSchema)
async def place_order(order_data: OrderCreate, db: AsyncSession = Depends(get_db)):
    ic("Placing order", order_data)
    # Get all cart items
    cart_result = await db.execute(
        select(CartItemModel).options(selectinload(CartItemModel.product))
    )
    cart_items = cart_result.scalars().all()
    
    if not cart_items:
        logger.warning("Attempted to place order with empty cart")
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    total_amount = sum(item.product.price * item.quantity for item in cart_items)
    
    # Create Order
    new_order = OrderModel(
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        status="Placed"
    )
    db.add(new_order)
    await db.flush() # To get order ID
    
    # Create Order Items
    for item in cart_items:
        order_item = OrderItemModel(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_order=item.product.price
        )
        db.add(order_item)
        
        # Optionally update stock
        item.product.stock -= item.quantity
        
        # Remove from cart
        await db.delete(item)
    
    await db.commit()
    await db.refresh(new_order)
    
    # Reload with items and products
    result = await db.execute(
        select(OrderModel)
        .filter(OrderModel.id == new_order.id)
        .options(selectinload(OrderModel.items).selectinload(OrderItemModel.product))
    )
    
    # Mock Email Notification
    import os
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    if smtp_user and smtp_pass:
        # TODO: Implement actual SMTP sending logic
        logger.info(f"Email notification sent for order {new_order.id} to {smtp_user}")
    else:
        logger.info(f"SMTP credentials missing. Skipping email notification for order {new_order.id}")

    return result.scalar_one()

@router.get("/", response_model=List[OrderMinimal])
async def get_orders(db: AsyncSession = Depends(get_db)):
    ic("Fetching all orders")
    result = await db.execute(
        select(OrderModel)
    )
    return result.scalars().all()

@router.get("/{order_id}", response_model=OrderSchema)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(OrderModel)
        .filter(OrderModel.id == order_id)
        .options(selectinload(OrderModel.items).selectinload(OrderItemModel.product))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
