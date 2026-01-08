from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from database.db import get_db
from database.models import CartItem as CartItemModel, Product as ProductModel
from models.schemas import CartItem as CartItemSchema, CartItemCreate

router = APIRouter()

@router.get("/", response_model=List[CartItemSchema])
async def get_cart(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CartItemModel).options(selectinload(CartItemModel.product))
    )
    return result.scalars().all()

@router.post("/", response_model=CartItemSchema)
async def add_to_cart(item: CartItemCreate, db: AsyncSession = Depends(get_db)):
    # Check if product exists
    prod_result = await db.execute(select(ProductModel).filter(ProductModel.id == item.product_id))
    product = prod_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if already in cart
    result = await db.execute(select(CartItemModel).filter(CartItemModel.product_id == item.product_id))
    db_item = result.scalar_one_or_none()
    
    if db_item:
        db_item.quantity += item.quantity
    else:
        db_item = CartItemModel(product_id=item.product_id, quantity=item.quantity)
        db.add(db_item)
    
    await db.commit()
    await db.refresh(db_item)
    
    # Reload with product relationship
    result = await db.execute(
        select(CartItemModel)
        .filter(CartItemModel.id == db_item.id)
        .options(selectinload(CartItemModel.product))
    )
    return result.scalar_one()

@router.put("/{item_id}", response_model=CartItemSchema)
async def update_cart_item(item_id: int, quantity: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CartItemModel).filter(CartItemModel.id == item_id))
    db_item = result.scalar_one_or_none()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    if quantity <= 0:
        await db.delete(db_item)
    else:
        db_item.quantity = quantity
    
    await db.commit()
    
    if quantity > 0:
        await db.refresh(db_item)
        result = await db.execute(
            select(CartItemModel)
            .filter(CartItemModel.id == item_id)
            .options(selectinload(CartItemModel.product))
        )
        return result.scalar_one()
    return None # Or handle deletion response

@router.delete("/{item_id}")
async def delete_cart_item(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CartItemModel).filter(CartItemModel.id == item_id))
    db_item = result.scalar_one_or_none()
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    await db.delete(db_item)
    await db.commit()
    return {"message": "Item removed from cart"}
