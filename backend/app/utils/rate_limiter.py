"""
Rate Limiter - Simple rate limiting for API endpoints
"""
from collections import defaultdict
from datetime import datetime, timedelta
from threading import Lock
from app.config import Config


class RateLimiter:
    """Simple in-memory rate limiter."""

    def __init__(self, max_requests: int = None, period_seconds: int = None):
        """
        Initialize rate limiter.

        Args:
            max_requests: Maximum requests allowed
            period_seconds: Time period in seconds
        """
        self.max_requests = max_requests or Config.RATE_LIMIT_REQUESTS
        self.period_seconds = period_seconds or Config.RATE_LIMIT_PERIOD
        self.requests = defaultdict(list)
        self.lock = Lock()

    def is_allowed(self, identifier: str) -> bool:
        """
        Check if request is allowed for identifier.

        Args:
            identifier: Unique identifier (e.g., IP address)

        Returns:
            True if request is allowed
        """
        with self.lock:
            now = datetime.now()
            cutoff = now - timedelta(seconds=self.period_seconds)

            # Get requests for this identifier
            request_times = self.requests[identifier]

            # Remove old requests
            request_times[:] = [t for t in request_times if t > cutoff]

            # Check if limit exceeded
            if len(request_times) >= self.max_requests:
                return False

            # Add current request
            request_times.append(now)
            return True

    def clear(self, identifier: str = None):
        """
        Clear rate limit data.

        Args:
            identifier: Specific identifier to clear (None for all)
        """
        with self.lock:
            if identifier:
                if identifier in self.requests:
                    del self.requests[identifier]
            else:
                self.requests.clear()

    def get_remaining(self, identifier: str) -> int:
        """
        Get remaining requests for identifier.

        Args:
            identifier: Unique identifier

        Returns:
            Number of remaining requests
        """
        with self.lock:
            now = datetime.now()
            cutoff = now - timedelta(seconds=self.period_seconds)

            # Get requests for this identifier
            request_times = self.requests.get(identifier, [])

            # Remove old requests
            request_times = [t for t in request_times if t > cutoff]

            remaining = self.max_requests - len(request_times)
            return max(0, remaining)


# Global rate limiter instance
_rate_limiter = RateLimiter()


def check_rate_limit(identifier: str, max_requests: int = None, period_seconds: int = None) -> bool:
    """
    Check if request is allowed for identifier.

    Args:
        identifier: Unique identifier (e.g., IP address)
        max_requests: Optional override for max requests
        period_seconds: Optional override for period

    Returns:
        True if request is allowed
    """
    if max_requests is not None or period_seconds is not None:
        # Create temporary limiter with custom limits
        limiter = RateLimiter(
            max_requests=max_requests or Config.RATE_LIMIT_REQUESTS,
            period_seconds=period_seconds or Config.RATE_LIMIT_PERIOD
        )
        return limiter.is_allowed(identifier)

    return _rate_limiter.is_allowed(identifier)


def get_remaining_requests(identifier: str) -> int:
    """
    Get remaining requests for identifier.

    Args:
        identifier: Unique identifier

    Returns:
        Number of remaining requests
    """
    return _rate_limiter.get_remaining(identifier)


def clear_rate_limit(identifier: str = None):
    """
    Clear rate limit data.

    Args:
        identifier: Specific identifier to clear (None for all)
    """
    _rate_limiter.clear(identifier)


def rate_limit_middleware(identifier: str) -> tuple:
    """
    Middleware helper for rate limiting.

    Args:
        identifier: Unique identifier

    Returns:
        Tuple of (is_allowed, remaining_requests)
    """
    is_allowed = check_rate_limit(identifier)
    remaining = get_remaining_requests(identifier)

    return is_allowed, remaining
