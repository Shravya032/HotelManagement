# 🏨 Grand Horizon - Luxury Hotel Management System

An enterprise-ready, full-stack Web Application built with **Java Spring Boot REST Services** and a **React Glassmorphic Interactive Frontend**.

It features full role separation between the **Admin Module** and **User View**, complete **CRUD Operations** (Create, Read, Update, Upload, Delete) for both Rooms and Reservations, integrated **Multipart File Storage** for guest ID proofs and room photography, and dynamic price calculations.

---

## ✨ Features Overview

### 🛡️ Admin Operations Console
- **Live Metrics Dashboard**: Real-time tracking of Total Revenue ($), Active Bookings, Available Rooms, and Occupancy Rate (%).
- **Reservations Management (Full CRUD + Upload)**:
  - Search by guest name, contact number, or room number.
  - Status filter pills (`ALL`, `CONFIRMED`, `CHECKED_IN`, `PENDING`, `CANCELLED`).
  - **Create Reservation**: Admin override booking creation for any guest.
  - **Edit Reservation**: Modify guest details, room assignment, stay dates, and pricing.
  - **Status Patching**: Quick state transitions (Check-In, Check-Out, Cancel, Confirm).
  - **Upload Guest Document**: Attach Passport / Government ID proof or invoice PDF to any reservation.
  - **Delete Reservation**: Delete record with modal confirmation prompt.
- **Rooms Inventory Catalog (Full CRUD + Upload)**:
  - Gallery grid & tabular room management.
  - **Create Room**: Add room number, room type, nightly price, guest capacity, amenities list, description, and **upload custom room photo**.
  - **Edit Room**: Update room specs, status (Available / Occupied / Maintenance), or photo.
  - **Delete Room**: Delete room from inventory.
- **Document & Image Storage Vault**: Centralized media manager for all uploaded room photos and guest ID files.

### 👤 Guest User Portal
- **Browse & Book Luxury Rooms**:
  - Filter rooms by category (*Deluxe Sea View, Executive King, Presidential Penthouse, Garden Villa*).
  - **Interactive Booking Engine**: Select stay dates with **Live Dynamic Price Calculator** (auto-calculates total stay amount based on stay duration and room rates).
- **My Bookings Dashboard**:
  - Filter active and past stays.
  - **Attach Guest ID Proof**: Upload Passport/Aadhaar proof directly to booking.
  - **Cancel Reservation**: One-click cancellation.
  - **Print Invoice Summary**: Formatted luxury hotel receipt modal with print functionality.

### ⚡ 1-Click Role Switcher & Demo Login
- **Navbar Role Toggle**: Switch between `[ADMIN VIEW]` and `[USER VIEW]` instantly from the sticky navbar.
- **Preset Quick Login Buttons**: 1-click preset login as Admin or Guest User on the login page for effortless grading and demonstration.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Java 17+, Spring Boot 3.x / 4.x, Spring WebMVC, Spring Data JPA |
| **Persistence & Database** | Hibernate ORM, H2 In-Memory Database (Zero-setup default), MySQL |
| **File Storage** | Custom Multipart File Storage Engine (`uploads/` directory with REST serving) |
| **Frontend Framework** | React.js 19, React Router DOM v7, Axios HTTP Client |
| **UI Aesthetics & Icons** | Vanilla CSS Glassmorphism Design System, Lucide React Icons, Google Plus Jakarta Sans Fonts |

---

## 📁 Repository Structure

```text
HotelManagement/
├── src/main/java/com/hotel/
│   ├── controller/
│   │   ├── FileController.java          # REST Endpoint for file uploads & downloads
│   │   ├── RoomController.java          # REST Endpoint for Room CRUD & photo upload
│   │   └── ReservationController.java   # REST Endpoint for Reservation CRUD & document upload
│   ├── entity/
│   │   ├── Room.java                    # Room Entity (pricing, capacity, status, amenities)
│   │   └── Reservation.java             # Reservation Entity (dates, guest email, status, documentUrl)
│   ├── repository/
│   │   ├── RoomRepository.java          # JPA Repository for Rooms
│   │   └── ReservationRepository.java   # JPA Repository for Reservations
│   └── service/
│       ├── FileStorageService.java      # Local multipart storage service
│       ├── RoomService.java             # Business logic & preloaded room data
│       └── ReservationService.java      # Business logic & preloaded reservation data
├── src/main/resources/
│   └── application.properties           # H2 & Multipart upload configuration
├── hotel-app/                           # React Frontend Application
│   ├── src/
│   │   ├── components/                  # Navbar, Login, Signup
│   │   ├── context/                     # AuthContext & Role Manager
│   │   ├── pages/                       # AdminDashboard, UserDashboard, Welcome, About
│   │   ├── services/                    # Axios API client (api.js)
│   │   ├── App.js                       # React Router configuration
│   │   └── index.css / App.css          # Glassmorphism Design Tokens & Utilities
│   └── package.json
├── mvnw.cmd                             # Maven Wrapper (Windows)
└── pom.xml                              # Maven Configuration
```

---

## 🔌 REST API Endpoints Summary

### 🏨 Rooms API (`/api/rooms`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rooms` | Fetch all rooms |
| `GET` | `/api/rooms/available` | Fetch available rooms only |
| `GET` | `/api/rooms/{id}` | Fetch room by ID |
| `POST` | `/api/rooms` | Create new room |
| `PUT` | `/api/rooms/{id}` | Update room details |
| `DELETE` | `/api/rooms/{id}` | Delete room |
| `POST` | `/api/rooms/{id}/upload-image` | Upload room photo |

### 📅 Reservations API (`/reservations`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reservations` | Fetch all reservations (Admin) |
| `GET` | `/reservations/guest/{name}` | Fetch reservations by guest name (User) |
| `GET` | `/reservations/{id}` | Fetch reservation by ID |
| `POST` | `/reservations` | Create reservation |
| `PUT` | `/reservations/{id}` | Update reservation details |
| `PATCH` | `/reservations/{id}/status` | Update status (`CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`) |
| `POST` | `/reservations/{id}/upload-document` | Upload guest ID proof / document |
| `DELETE` | `/reservations/{id}` | Delete reservation |

### 📁 File Management API (`/api/files`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/files/upload` | Upload multipart file (Returns relative file URL) |
| `GET` | `/api/files/download/{fileName}` | Download / view stored file |

---

## 🚀 Quick Start & Execution Guide

### Prerequisites
- **Java JDK 17+**
- **Node.js 18+** & `npm`

---

### Step 1: Launch Spring Boot Backend
Open a terminal in the root folder (`HotelManagement`):

#### In PowerShell (Windows):
```powershell
.\mvnw.cmd spring-boot:run
```

#### In Command Prompt (CMD):
```cmd
mvnw.cmd spring-boot:run
```

*Backend runs at `http://localhost:8080` with H2 Web Console at `http://localhost:8080/h2-console`.*

---

### Step 2: Launch React Frontend
Open a **second terminal** in the `hotel-app` directory:

```bash
cd hotel-app
npm start
```

*Frontend web app automatically opens in browser at `http://localhost:3000`.*

---

## 🧪 Testing Guide

1. Open `http://localhost:3000`.
2. Click **"Login Admin"** to access the **Admin Console** with metric counters, room inventory CRUD, reservation management table, and document uploads.
3. Toggle the **Navbar Role Pill** (`[ADMIN VIEW] <-> [USER VIEW]`) to instantly test the **User Portal** for room reservation with live stay price calculations.
