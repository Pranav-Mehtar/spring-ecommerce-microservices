# 🛒 E-Commerce Backend — Spring Boot + JWT + PostgreSQL

## Tech Stack
- **Spring Boot 3.2**
- **Spring Security + JWT** (stateless authentication)
- **PostgreSQL** (database)
- **Spring Data JPA + Hibernate**
- **Lombok** (reduces boilerplate)
- **Maven**

---

## 📁 Project Structure

```
src/main/java/com/ecommerce/
│
├── EcommerceApplication.java       ← Main class
│
├── entities/
│   ├── User.java                   ← User entity (id, name, email, password, role)
│   ├── Product.java                ← Product entity
│   ├── Order.java                  ← Order entity
│   ├── OrderItem.java              ← Order items (product + quantity)
│   └── Role.java                   ← Enum: USER, ADMIN
│
├── dto/
│   ├── RegisterRequest.java        ← Register form data
│   ├── LoginRequest.java           ← Login form data
│   ├── AuthResponse.java           ← JWT token + user info response
│   ├── ProductRequest.java         ← Add/update product form
│   ├── OrderRequest.java           ← Place order form
│   └── ApiResponse.java            ← Universal response wrapper
│
├── repositories/
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   └── OrderRepository.java
│
├── services/
│   ├── AuthService.java            ← Register + Login logic
│   ├── ProductService.java         ← Product CRUD
│   └── OrderService.java           ← Order placement + management
│
├── security/
│   ├── JwtService.java             ← Generate + validate JWT tokens
│   └── JwtAuthFilter.java          ← Intercepts every request, validates token
│
├── controllers/
│   ├── AuthController.java         ← /api/auth/**
│   ├── ProductController.java      ← /api/products/**
│   └── OrderController.java        ← /api/orders/**
│
└── config/
    ├── SecurityConfig.java         ← Spring Security rules + BCrypt
    └── GlobalExceptionHandler.java ← Handles errors globally
```

---

## ⚙️ Setup

### 1. Create PostgreSQL Database
```sql
CREATE DATABASE ecommerce_db;
```

### 2. Configure application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
jwt.secret=your_super_secret_key_at_least_256_bits_long
jwt.expiration=86400000
```

### 3. Run
```bash
mvn spring-boot:run
```
Tables are created automatically via `ddl-auto=update`.

---

## 🔐 How JWT Works in This Project

```
1. User calls POST /api/auth/register or /api/auth/login
2. Server validates credentials, returns a JWT token
3. User sends token in every subsequent request:
   Header: Authorization: Bearer <token>
4. JwtAuthFilter intercepts request, validates token
5. If valid → user is authenticated, request proceeds
6. If invalid/missing → 401 Unauthorized
```

---

## 📡 API Endpoints

### 🔓 Auth (Public — no token needed)

| Method | URL | Description | Body |
|--------|-----|-------------|------|
| POST | `/api/auth/register` | Register as USER | `{fullName, email, password, phone?, address?}` |
| POST | `/api/auth/login` | Login, get JWT | `{email, password}` |
| POST | `/api/auth/register-admin` | Register as ADMIN | `{fullName, email, password}` |

### 📦 Products

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/products/all` | Public | Get all products |
| GET | `/api/products/{id}` | Public | Get single product |
| GET | `/api/products/search?name=shoes` | Public | Search products |
| GET | `/api/products/category/{cat}` | Public | Filter by category |
| POST | `/api/products/add` | **ADMIN** | Add new product |
| PUT | `/api/products/update/{id}` | **ADMIN** | Update product |
| DELETE | `/api/products/delete/{id}` | **ADMIN** | Delete product |

### 🛒 Orders

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/orders/place` | USER | Place new order |
| GET | `/api/orders/my-orders` | USER | Get my orders |
| GET | `/api/orders/{id}` | USER | Get order by ID |
| PUT | `/api/orders/cancel/{id}` | USER | Cancel order |
| GET | `/api/orders/admin/all` | **ADMIN** | Get all orders |
| PUT | `/api/orders/admin/status/{id}?status=SHIPPED` | **ADMIN** | Update order status |

---

## 🧪 Test with Postman/curl

### Register
```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
Response gives you a `token`.

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Use token in all other requests
```
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### Place Order
```json
POST /api/orders/place
Authorization: Bearer <token>

{
  "items": [
    {"productId": 1, "quantity": 2},
    {"productId": 3, "quantity": 1}
  ],
  "shippingAddress": "123 Main St, City"
}
```

---

## 🔒 Role-Based Access

| Role | Can Do |
|------|--------|
| **USER** | Register, Login, View products, Place orders, View own orders, Cancel own orders |
| **ADMIN** | Everything USER can do + Add/Edit/Delete products, View ALL orders, Update order status |
