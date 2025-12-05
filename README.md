# 🚗 Vehicle Rental System

A robust RESTful API backend for managing vehicle rentals, built with Node.js, TypeScript, Express.js, and PostgreSQL. This system provides complete functionality for vehicle inventory management, customer accounts, booking operations, and role-based access control.

---

## 🔑 Quick Access

| Environment     | URL                            | Admin Email       | Admin Password |
| --------------- | ------------------------------ | ----------------- | -------------- |
| **Production**  | https://b6a2.vercel.app/api/v1 | `admin@gmail.com` | `Ab@12345`     |
| **Development** | http://localhost:8080/api/v1   | `admin@gmail.com` | `Ab@12345`     |

> 💡 **Tip:** Use these credentials to test admin-only endpoints like vehicle management and user listing.

---

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)

---

## 🏗️ Architecture

The system follows a **modular layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Request                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Express.js App                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Middleware Layer                   │   │
│  │  • Request Validation (Zod)                         │   │
│  │  • Authentication (JWT)                             │   │
│  │  • Role-based Authorization                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Feature Modules                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Auth   │ │ Vehicles │ │  Users   │ │ Bookings │       │
│  │ ───────  │ │ ───────  │ │ ───────  │ │ ───────  │       │
│  │ Routes   │ │ Routes   │ │ Routes   │ │ Routes   │       │
│  │Controller│ │Controller│ │Controller│ │Controller│       │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │       │
│  │ Schema   │ │ Schema   │ │ Schema   │ │ Schema   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   Core Layer                                │
│  • Database Connection (pg)                                 │
│  • JWT Token Management                                     │
│  • Password Hashing (bcrypt)                               │
│  • Response Handling                                        │
│  • Logging                                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   PostgreSQL Database                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Users   │ │ Vehicles │ │ Bookings │ │ Sessions │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Category              | Technology    | Purpose                            |
| --------------------- | ------------- | ---------------------------------- |
| **Runtime**           | Node.js       | JavaScript runtime environment     |
| **Language**          | TypeScript    | Type-safe JavaScript superset      |
| **Framework**         | Express.js v5 | Web application framework          |
| **Database**          | PostgreSQL    | Relational database                |
| **Validation**        | Zod v4        | Schema validation & type inference |
| **Authentication**    | JWT           | Stateless token-based auth         |
| **Password Security** | bcryptjs      | Password hashing                   |
| **Deployment**        | Vercel        | Serverless deployment platform     |
| **Linting**           | ESLint        | Code quality                       |
| **Formatting**        | Prettier      | Code formatting                    |

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration with email validation
- Secure login with JWT access tokens
- Refresh token rotation for session management
- Role-based access control (Admin & Customer)
- Password hashing with bcrypt

### 🚗 Vehicle Management

- Full CRUD operations for vehicles
- Vehicle types: Car, Bike, Van, SUV
- Real-time availability tracking
- Unique registration number enforcement
- Deletion protection for vehicles with active bookings

### 👥 User Management

- Admin-only user listing
- Profile updates (self or admin)
- Role management (admin-only)
- Deletion protection for users with active bookings

### 📅 Booking System

- Create bookings with automatic price calculation
- Price formula: `daily_rent_price × number_of_days`
- Automatic vehicle availability updates
- Role-based booking visibility
- Customer cancellation (before start date)
- Admin-only return marking
- **Auto-return via Vercel Cron Jobs** (daily at midnight UTC)

### 🔄 Business Logic

- Vehicle status auto-updates on booking lifecycle
- Booking constraints enforcement
- Comprehensive input validation
- Standardized API response format

---

## 📁 Project Structure

```
src/
├── app.ts                 # Express app configuration
├── index.ts               # Application entry point
├── config/                # Environment & constants
│   ├── env.ts             # Environment variables
│   └── index.ts           # Config exports
├── core/                  # Core utilities
│   ├── db.ts              # Database connection & init
│   ├── jwt-token.ts       # JWT utilities
│   ├── password-hashing.ts# Bcrypt utilities
│   ├── send-response.ts   # Standardized responses
│   ├── async-handler.ts   # Async error wrapper
│   ├── logger.ts          # Logging utility
│   └── status-code.ts     # HTTP status codes
├── middleware/            # Express middleware
│   ├── request-validator.ts # Zod validation
│   └── index.ts           # Middleware exports
├── modules/               # Feature modules
│   ├── auth/              # Authentication
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts
│   ├── vehicles/          # Vehicle management
│   │   ├── vehicles.routes.ts
│   │   ├── vehicles.controller.ts
│   │   ├── vehicles.service.ts
│   │   ├── vehicles.schema.ts
│   │   └── vehicles.types.ts
│   ├── users/             # User management
│   │   ├── users.routes.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.schema.ts
│   │   └── users.types.ts
│   ├── bookings/          # Booking management
│   │   ├── bookings.routes.ts
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   ├── bookings.schema.ts
│   │   ├── bookings.types.ts
│   │   └── bookings.cron.ts
│   └── index.ts           # Dynamic route loader
├── routes/                # Route aggregation
│   ├── index.ts           # API v1 router
│   └── cron.routes.ts     # Cron job routes
├── schema/                # Global schemas
│   └── env.schema.ts      # Environment validation
└── types/                 # Global TypeScript types
    └── express.d.ts       # Express type extensions
```

---

## 📊 Database Schema

### Users Table

| Column     | Type         | Constraints        |
| ---------- | ------------ | ------------------ |
| id         | SERIAL       | PRIMARY KEY        |
| name       | VARCHAR(100) | NOT NULL           |
| email      | VARCHAR(100) | UNIQUE, NOT NULL   |
| password   | VARCHAR(255) | NOT NULL           |
| phone      | VARCHAR(20)  | NOT NULL           |
| role       | VARCHAR(20)  | DEFAULT 'customer' |
| created_at | TIMESTAMP    | DEFAULT NOW()      |
| updated_at | TIMESTAMP    | DEFAULT NOW()      |

### Vehicles Table

| Column              | Type          | Constraints         |
| ------------------- | ------------- | ------------------- |
| id                  | SERIAL        | PRIMARY KEY         |
| vehicle_name        | VARCHAR(100)  | NOT NULL            |
| type                | VARCHAR(20)   | NOT NULL            |
| registration_number | VARCHAR(50)   | UNIQUE, NOT NULL    |
| daily_rent_price    | DECIMAL(10,2) | NOT NULL            |
| availability_status | VARCHAR(20)   | DEFAULT 'available' |
| created_at          | TIMESTAMP     | DEFAULT NOW()       |
| updated_at          | TIMESTAMP     | DEFAULT NOW()       |

### Bookings Table

| Column          | Type          | Constraints             |
| --------------- | ------------- | ----------------------- |
| id              | SERIAL        | PRIMARY KEY             |
| customer_id     | INTEGER       | REFERENCES users(id)    |
| vehicle_id      | INTEGER       | REFERENCES vehicles(id) |
| rent_start_date | DATE          | NOT NULL                |
| rent_end_date   | DATE          | NOT NULL                |
| total_price     | DECIMAL(10,2) | NOT NULL                |
| status          | VARCHAR(20)   | DEFAULT 'active'        |
| created_at      | TIMESTAMP     | DEFAULT NOW()           |
| updated_at      | TIMESTAMP     | DEFAULT NOW()           |

### Sessions Table

| Column        | Type      | Constraints          |
| ------------- | --------- | -------------------- |
| id            | SERIAL    | PRIMARY KEY          |
| user_id       | INTEGER   | REFERENCES users(id) |
| refresh_token | TEXT      | NOT NULL             |
| expires_at    | TIMESTAMP | NOT NULL             |
| created_at    | TIMESTAMP | DEFAULT NOW()        |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- Yarn (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mehedisarkar2k/B6A2.git
   cd B6A2
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   yarn dev
   ```

5. **Build for production**
   ```bash
   yarn build
   yarn start
   ```

---

## 📖 API Documentation

### Base URL

```
Development: http://localhost:8080/api/v1
Production:  https://b6a2.vercel.app/api/v1
```

### Response Format

**Success Response**

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error Response**

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

---

### 🔐 Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/signup
```

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

**Response** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "01712345678",
    "role": "customer"
  }
}
```

---

#### Login User

```http
POST /api/v1/auth/signin
```

**Request Body**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "01712345678",
      "role": "customer"
    }
  }
}
```

---

### 🚗 Vehicle Endpoints

#### Create Vehicle

```http
POST /api/v1/vehicles
Authorization: Bearer <admin_token>
```

**Request Body**

```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 50,
    "availability_status": "available"
  }
}
```

---

#### Get All Vehicles

```http
GET /api/v1/vehicles
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_name": "Toyota Camry 2024",
      "type": "car",
      "registration_number": "ABC-1234",
      "daily_rent_price": 50,
      "availability_status": "available"
    }
  ]
}
```

---

#### Get Vehicle by ID

```http
GET /api/v1/vehicles/:vehicleId
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Vehicle retrieved successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 50,
    "availability_status": "available"
  }
}
```

---

#### Update Vehicle

```http
PUT /api/v1/vehicles/:vehicleId
Authorization: Bearer <admin_token>
```

**Request Body** (all fields optional)

```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024 Premium",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 55,
    "availability_status": "available"
  }
}
```

---

#### Delete Vehicle

```http
DELETE /api/v1/vehicles/:vehicleId
Authorization: Bearer <admin_token>
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

> ⚠️ **Note:** Vehicles with active bookings cannot be deleted.

---

### 👥 User Endpoints

#### Get All Users

```http
GET /api/v1/users
Authorization: Bearer <admin_token>
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "01712345678",
      "role": "customer"
    }
  ]
}
```

---

#### Update User

```http
PUT /api/v1/users/:userId
Authorization: Bearer <token>
```

**Request Body** (all fields optional)

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "01712345679",
  "role": "admin"
}
```

> **Note:** Customers can only update their own profile and cannot change their role.

**Response** `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "01712345679",
    "role": "customer"
  }
}
```

---

#### Delete User

```http
DELETE /api/v1/users/:userId
Authorization: Bearer <admin_token>
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

> ⚠️ **Note:** Users with active bookings cannot be deleted.

---

### 📅 Booking Endpoints

#### Create Booking

```http
POST /api/v1/bookings
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

**Response** `201 Created`

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "active",
    "vehicle": {
      "vehicle_name": "Honda Civic 2023",
      "daily_rent_price": 50
    }
  }
}
```

---

#### Get All Bookings

```http
GET /api/v1/bookings
Authorization: Bearer <token>
```

**Response (Admin View)** `200 OK`

```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "customer": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "vehicle": {
        "vehicle_name": "Honda Civic 2023",
        "registration_number": "XYZ-5678"
      }
    }
  ]
}
```

**Response (Customer View)** `200 OK`

```json
{
  "success": true,
  "message": "Your bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "vehicle": {
        "vehicle_name": "Honda Civic 2023",
        "registration_number": "XYZ-5678",
        "type": "car"
      }
    }
  ]
}
```

---

#### Update Booking Status

```http
PUT /api/v1/bookings/:bookingId
Authorization: Bearer <token>
```

**Cancel Booking (Customer)**

```json
{
  "status": "cancelled"
}
```

> ⚠️ Customers can only cancel before the `rent_start_date`.

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "cancelled"
  }
}
```

**Mark as Returned (Admin)**

```json
{
  "status": "returned"
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Booking marked as returned. Vehicle is now available",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "returned",
    "vehicle": {
      "availability_status": "available"
    }
  }
}
```

---

### HTTP Status Codes

| Code | Meaning               | Usage                       |
| ---- | --------------------- | --------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE |
| 201  | Created               | Successful POST             |
| 400  | Bad Request           | Validation errors           |
| 401  | Unauthorized          | Missing/invalid token       |
| 403  | Forbidden             | Insufficient permissions    |
| 404  | Not Found             | Resource doesn't exist      |
| 500  | Internal Server Error | Server errors               |

---

## 🔧 Environment Variables

| Variable                   | Description                          | Required           |
| -------------------------- | ------------------------------------ | ------------------ |
| `NODE_ENV`                 | Environment (development/production) | Yes                |
| `PORT`                     | Server port                          | No (default: 8080) |
| `DATABASE_URL`             | PostgreSQL connection string         | Yes                |
| `JWT_SECRET_KEY`           | Secret for access tokens             | Yes                |
| `REFRESH_TOKEN_SECRET_KEY` | Secret for refresh tokens            | Yes                |
| `CRON_SECRET`              | Secret for Vercel Cron Jobs          | No                 |

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mehedi Sarkar**

- GitHub: [@mehedisarkar2k](https://github.com/mehedisarkar2k)
