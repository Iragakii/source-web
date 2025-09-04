# WebComing API - ASP.NET Core with MongoDB Authentication

This is the backend API for the WebComing application, built with ASP.NET Core and MongoDB for user authentication.

## Features

- User Registration (Sign Up)
- User Login
- User Logout
- JWT Token-based Authentication
- Password Hashing with BCrypt
- MongoDB Integration
- CORS Support for Frontend Integration
- Swagger API Documentation

## Prerequisites

- .NET 8.0 SDK
- MongoDB Atlas account (connection string provided)
- Visual Studio Code or Visual Studio

## Getting Started

### 1. Install Dependencies

```bash
cd be
dotnet restore
```

### 2. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (min 3 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "confirmPassword": "string (must match password)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "success": true,
    "message": "Account created successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "email@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "email@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /api/auth/logout
Logout and invalidate the current token.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /api/auth/profile
Get current user profile information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/auth/validate
Validate the current JWT token.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid"
}
```

### Health Check Endpoints

#### GET /
Basic API information.

**Response:**
```json
{
  "message": "WebComing API is running!",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Configuration

### MongoDB Connection
The MongoDB connection string is configured in `appsettings.json`:
```json
{
  "MongoDB": {
    "ConnectionString": "mongodb+srv://ngocvan:1111@cluster0.le6tolu.mongodb.net/",
    "DatabaseName": "WebComingDB"
  }
}
```

### JWT Configuration
JWT settings are configured in `appsettings.json`:
```json
{
  "JWT": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "WebComingAPI",
    "Audience": "WebComingClient",
    "ExpiryInHours": 24
  }
}
```

### CORS Configuration
CORS is configured to allow requests from the frontend:
```json
{
  "CORS": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173"
    ]
  }
}
```

## Frontend Integration

To integrate with your React frontend, update your authentication calls to use these endpoints:

### Example Frontend Usage

```javascript
// Register
const register = async (userData) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

// Login
const login = async (credentials) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return await response.json();
};

// Logout
const logout = async (token) => {
  const response = await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};
```

## Database Schema

### User Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "passwordHash": "string (bcrypt hashed)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime",
  "isActive": "boolean"
}
```

## Security Features

- Password hashing using BCrypt
- JWT token-based authentication
- Token blacklisting for logout
- Input validation and sanitization
- CORS protection
- HTTPS support

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Development

### Project Structure
```
be/
├── Controllers/
│   └── AuthController.cs
├── Data/
│   └── MongoDbContext.cs
├── Models/
│   ├── User.cs
│   └── DTOs/
│       └── AuthDTOs.cs
├── Services/
│   ├── IAuthService.cs
│   └── AuthService.cs
├── Properties/
│   └── launchSettings.json
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── WebComingAPI.csproj
```

### Running in Development
```bash
dotnet run --environment Development
```

### Building for Production
```bash
dotnet build --configuration Release
dotnet publish --configuration Release
