from pydantic import BaseModel
from typing import List, Optional

class StatSchema(BaseModel):
    label: str
    value: str
    trend: str
    trend_type: str
    class Config:
        from_attributes = True

class OperationSummarySchema(BaseModel):
    label: str
    value: int
    sub: str
    badge: str
    badge_color: str
    class Config:
        from_attributes = True

class RecentOperationSchema(BaseModel):
    ref: str
    type: str
    type_color: str
    from_loc: str
    to_loc: str
    item: str
    qty: str
    status: str
    status_color: str
    date: str
    class Config:
        from_attributes = True

class ProductSchema(BaseModel):
    sku: str
    name: str
    category: str
    category_color: str
    branch: str
    on_hand: float
    unit: str
    forecast: float
    rule: str
    price: str
    status: str
    status_color: str
    progress: int
    class Config:
        from_attributes = True

class ForecastSchema(BaseModel):
    day: str
    value: int
    color: str
    border: Optional[str] = None
    description: str
    class Config:
        from_attributes = True

class BranchSchema(BaseModel):
    name: str
    loc: str
    status: str
    status_color: str
    capacity: str
    items: int
    value: str
    score: str
    util: int
    util_desc: str
    class Config:
        from_attributes = True

class DashboardDataSchema(BaseModel):
    stats: List[StatSchema]
    operations: List[OperationSummarySchema]
    recentOperations: List[RecentOperationSchema]
    products: List[ProductSchema]
    forecast: List[ForecastSchema]
    branches: List[BranchSchema]
