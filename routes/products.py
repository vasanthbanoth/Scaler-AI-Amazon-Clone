from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from database.db import get_db
from database.models import Product as ProductModel
from models.schemas import Product as ProductSchema

router = APIRouter()

@router.get("/", response_model=List[ProductSchema])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(ProductModel)
    if category:
        query = query.filter(ProductModel.category == category)
    if search:
        query = query.filter(ProductModel.name.contains(search))
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{product_id}", response_model=ProductSchema)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProductModel).filter(ProductModel.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
