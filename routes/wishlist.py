from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from database.db import get_db
from database.models import WishlistItem as WishlistItemModel, Product as ProductModel
from models.schemas import WishlistItem as WishlistItemSchema, WishlistItemBase
from modules.logger import ic, logger

router = APIRouter()

@router.get("/", response_model=List[WishlistItemSchema])
async def get_wishlist(db: AsyncSession = Depends(get_db)):
    ic("Fetching wishlist")
    result = await db.execute(
        select(WishlistItemModel).options(selectinload(WishlistItemModel.product))
    )
    return result.scalars().all()

@router.post("/", response_model=WishlistItemSchema)
async def add_to_wishlist(item: WishlistItemBase, db: AsyncSession = Depends(get_db)):
    ic("Adding to wishlist", item)
    # Check if product exists
    prod_result = await db.execute(select(ProductModel).filter(ProductModel.id == item.product_id))
    product = prod_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if already in wishlist
    result = await db.execute(select(WishlistItemModel).filter(WishlistItemModel.product_id == item.product_id))
    db_item = result.scalar_one_or_none()
    
    if db_item:
        logger.info("Product already in wishlist")
    else:
        db_item = WishlistItemModel(product_id=item.product_id)
        db.add(db_item)
        await db.commit()
    
    await db.refresh(db_item)
    
    # Reload with product relationship
    result = await db.execute(
        select(WishlistItemModel)
        .filter(WishlistItemModel.id == db_item.id)
        .options(selectinload(WishlistItemModel.product))
    )
    return result.scalar_one()

@router.delete("/{product_id}")
async def delete_wishlist_item(product_id: int, db: AsyncSession = Depends(get_db)):
    ic("Removing from wishlist", product_id)
    result = await db.execute(select(WishlistItemModel).filter(WishlistItemModel.product_id == product_id))
    db_item = result.scalar_one_or_none()
    if not db_item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    
    await db.delete(db_item)
    await db.commit()
    return {"message": "Item removed from wishlist"}
