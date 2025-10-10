"""
Pydantic Models and Schemas
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


class ChatMessage(BaseModel):
    """Chat message model."""
    role: str = Field(..., description="Message role (user or assistant)")
    content: str = Field(..., description="Message content")

    @validator('role')
    def validate_role(cls, v):
        """Validate role is either user or assistant."""
        if v not in ['user', 'assistant', 'model']:
            raise ValueError('Role must be user, assistant, or model')
        return v


class ChatRequest(BaseModel):
    """Chat request model."""
    message: str = Field(..., min_length=1, max_length=10000, description="User message")
    history: Optional[List[ChatMessage]] = Field(default=None, description="Chat history")

    @validator('message')
    def validate_message(cls, v):
        """Validate message is not empty."""
        if not v.strip():
            raise ValueError('Message cannot be empty')
        return v.strip()


class ChatResponse(BaseModel):
    """Chat response model."""
    success: bool = Field(..., description="Request success status")
    message: str = Field(..., description="AI response message")
    history: Optional[List[dict]] = Field(default=None, description="Updated chat history")
    error: Optional[str] = Field(default=None, description="Error message if failed")


class ArticleRequest(BaseModel):
    """Article analysis request model."""
    title: str = Field(..., min_length=1, max_length=500, description="Article title")
    content: str = Field(..., min_length=1, max_length=50000, description="Article content")
    url: Optional[str] = Field(default=None, description="Article URL")

    @validator('title', 'content')
    def validate_not_empty(cls, v):
        """Validate fields are not empty."""
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v.strip()


class ArticleAnalysisResponse(BaseModel):
    """Article analysis response model."""
    success: bool = Field(..., description="Analysis success status")
    analysis: str = Field(..., description="Article analysis")
    title: str = Field(..., description="Article title")
    url: Optional[str] = Field(default=None, description="Article URL")
    error: Optional[str] = Field(default=None, description="Error message if failed")


class NewsArticle(BaseModel):
    """News article model."""
    title: str = Field(..., description="Article title")
    url: str = Field(..., description="Article URL")
    content: str = Field(default='', description="Article content/excerpt")
    date: str = Field(default='', description="Publication date")
    author: str = Field(default='', description="Article author")
    source: str = Field(..., description="News source name")
    image_url: str = Field(default='', description="Article image URL")

    class Config:
        """Pydantic config."""
        json_schema_extra = {
            "example": {
                "title": "Nova lei trabalhista aprovada",
                "url": "https://example.com/noticia",
                "content": "Resumo da notícia...",
                "date": "2024-01-15",
                "author": "João Silva",
                "source": "Portal Trabalhista",
                "image_url": "https://example.com/image.jpg"
            }
        }


class NewsResponse(BaseModel):
    """News list response model."""
    success: bool = Field(..., description="Request success status")
    count: int = Field(..., description="Number of articles")
    articles: List[NewsArticle] = Field(..., description="List of news articles")
    error: Optional[str] = Field(default=None, description="Error message if failed")


class SourcesResponse(BaseModel):
    """News sources response model."""
    success: bool = Field(..., description="Request success status")
    sources: List[str] = Field(..., description="List of news source names")
    error: Optional[str] = Field(default=None, description="Error message if failed")


class ErrorResponse(BaseModel):
    """Error response model."""
    success: bool = Field(default=False, description="Always False for errors")
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(default=None, description="Additional error details")


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = Field(..., description="Service status")
    timestamp: Optional[str] = Field(default=None, description="Current timestamp")

    class Config:
        """Pydantic config."""
        json_schema_extra = {
            "example": {
                "status": "ok",
                "timestamp": "2024-01-15T10:30:00"
            }
        }
