from pydantic import BaseModel
from typing import List, Optional

class StatSchema(BaseModel):
    id: Optional[str] = None
    label: str
    value: str
    trend: str
    trendType: str
    class Config:
        from_attributes = True

class OperationSummarySchema(BaseModel):
    id: Optional[str] = None
    label: str
    value: int
    sub: str
    badge: str
    badgeColor: str
    class Config:
        from_attributes = True

class RecentOperationSchema(BaseModel):
    ref: str
    type: str
    typeColor: str
    from_loc: Optional[str] = None
    to_loc: Optional[str] = None
    # Add camelCase aliases for frontend
    from_pos: Optional[str] = None
    to_pos: Optional[str] = None
    item: str
    qty: str
    status: str
    statusColor: str
    date: str
    class Config:
        from_attributes = True

class RecentOperationCreate(BaseModel):
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

class ProductSchema(BaseModel):
    sku: str
    name: str
    category: str
    categoryColor: str
    branch: str
    onHand: float
    unit: str
    forecast: float
    rule: str
    price: str
    status: str
    statusColor: str
    progress: int
    class Config:
        from_attributes = True

class ForecastSchema(BaseModel):
    day: str
    value: int
    color: str
    border: Optional[str] = None
    desc: str
    class Config:
        from_attributes = True

class BranchSchema(BaseModel):
    name: str
    loc: str
    status: str
    statusColor: str
    capacity: str
    items: int
    value: str
    score: str
    util: int
    utilDesc: str
    class Config:
        from_attributes = True

class AIReplySchema(BaseModel):
    question: str
    reply: str
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    name: str
    role: Optional[str] = "Manager"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserSchema(UserBase):
    id: int
    class Config:
        from_attributes = True

class DashboardDataSchema(BaseModel):
    stats: List[StatSchema]
    operations: List[OperationSummarySchema]
    recentOperations: List[dict] # Use dict to allow flexible keys like 'from'/'to'
    products: List[ProductSchema]
    forecast: List[ForecastSchema]
    branches: List[BranchSchema]
    aiReplies: List[AIReplySchema]
