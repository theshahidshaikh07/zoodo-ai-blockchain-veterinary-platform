import os
import jwt
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import httpx

class AuthManager:
    def __init__(self):
        self.jwt_secret = os.getenv("JWT_SECRET", "your-secret-key")
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:8080")
        self.token_expiry = timedelta(hours=24)

    async def verify_token(self, token: str) -> Optional[str]:
        """Verify JWT token and return user ID"""
        try:
            # Decode token
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            
            # Check if token is expired
            if datetime.fromtimestamp(payload["exp"]) < datetime.utcnow():
                return None
            
            return payload.get("user_id")
            
        except jwt.ExpiredSignatureError:
            print("Token has expired")
            return None
        except jwt.InvalidTokenError:
            print("Invalid token")
            return None
        except Exception as e:
            print(f"Error verifying token: {str(e)}")
            return None

    async def verify_token_with_backend(self, token: str) -> Optional[str]:
        """Verify token with backend service"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.backend_url}/api/auth/verify",
                    headers={"Authorization": f"Bearer {token}"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("user_id")
                else:
                    print(f"Backend verification failed: {response.status_code}")
                    return None
                    
        except Exception as e:
            print(f"Error verifying token with backend: {str(e)}")
            return None

    def create_token(self, user_id: str, user_type: str) -> str:
        """Create JWT token for user"""
        payload = {
            "user_id": user_id,
            "user_type": user_type,
            "exp": datetime.utcnow() + self.token_expiry,
            "iat": datetime.utcnow()
        }
        
        return jwt.encode(payload, self.jwt_secret, algorithm="HS256")

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Decode JWT token without verification"""
        try:
            return jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
        except:
            return None

# Global auth manager instance
auth_manager = AuthManager()

async def verify_token(token: str) -> str:
    """Verify token and return user ID"""
    user_id = await auth_manager.verify_token(token)
    if not user_id:
        # Try backend verification as fallback
        user_id = await auth_manager.verify_token_with_backend(token)
    
    if not user_id:
        raise ValueError("Invalid or expired token")
    
    return user_id 