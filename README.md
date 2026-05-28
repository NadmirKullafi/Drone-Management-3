# 🚁 DroneControl - Sistem Menaxhimi dhe Monitorimi Dronash

Projekt full-stack MERN (MongoDB, Express, React, Node.js) për menaxhimin dhe monitorimin e dronave.

---

## 📁 Struktura e Projektit

```
drone-management/
├── backend/                    # Node.js + Express API
│   ├── models/
│   │   ├── User.js             # Modeli i përdoruesit
│   │   ├── Drone.js            # Modeli i dronit
│   │   ├── Flight.js           # Modeli i fluturimit
│   │   └── Alert.js            # Modeli i alarmit
│   ├── routes/
│   │   ├── auth.js             # Autentifikimi (login/register)
│   │   ├── drones.js           # CRUD dronat
│   │   ├── flights.js          # CRUD fluturimet
│   │   └── alerts.js           # CRUD alarmet
│   ├── middleware/
│   │   └── auth.js             # Middleware JWT
│   ├── server.js               # Serveri kryesor
│   ├── .env.example            # Variablat e mjedisit
│   └── package.json
│
└── frontend/                   # React App
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js  # Menaxhimi i autentifikimit
        ├── components/
        │   └── Layout.js/css   # Sidebar + Navbar
        ├── pages/
        │   ├── Login.js/css    # Faqja e hyrjes
        │   ├── Register.js     # Regjistrimi
        │   ├── Dashboard.js/css # Paneli kryesor
        │   ├── Drones.js/css   # Lista e dronave + shtim
        │   ├── DroneDetaje.js/css # Detajet e dronit
        │   ├── Flights.js/css  # Fluturimet
        │   └── Alerts.js/css   # Alarmet
        ├── App.js
        ├── index.js
        └── index.css
```

---

## 🚀 Si të instaloni dhe ekzekutoni

### Kërkesat paraprake
- Node.js v16+
- MongoDB (lokale ose MongoDB Atlas)
- npm ose yarn

### 1. Klononi projektin
```bash
cd drone-management
```

### 2. Konfiguroni Backend
```bash
cd backend
npm install
cp .env.example .env
# Edito .env dhe vendosni MONGO_URI tuaj
npm run dev
```

Serveri do të nisi në: `http://localhost:5000`

### 3. Konfiguroni Frontend
```bash
cd frontend
npm install
npm start
```

Aplikacioni do të hapet në: `http://localhost:3000`

---

## 🔑 API Endpoints

### Autentifikimi
| Metoda | URL | Përshkrimi |
|--------|-----|------------|
| POST | /api/auth/regjistro | Regjistro përdorues |
| POST | /api/auth/hyrje | Hyrje / Login |
| GET | /api/auth/profili | Merr profilin (🔒) |

### Dronat
| Metoda | URL | Përshkrimi |
|--------|-----|------------|
| GET | /api/drones | Merr të gjithë dronat (🔒) |
| GET | /api/drones/statistika | Statistikat (🔒) |
| GET | /api/drones/:id | Merr dron specifik (🔒) |
| POST | /api/drones | Shto dron të ri (🔒) |
| PUT | /api/drones/:id | Përditëso dronin (🔒) |
| DELETE | /api/drones/:id | Fshi dronin (🔒 Admin) |

### Fluturimet
| Metoda | URL | Përshkrimi |
|--------|-----|------------|
| GET | /api/flights | Merr fluturimet (🔒) |
| GET | /api/flights/statistika | Statistikat (🔒) |
| POST | /api/flights | Regjistro fluturim (🔒) |
| PUT | /api/flights/:id/perfundo | Përfundo fluturimin (🔒) |
| DELETE | /api/flights/:id | Fshi fluturimin (🔒) |

### Alarmet
| Metoda | URL | Përshkrimi |
|--------|-----|------------|
| GET | /api/alerts | Merr alarmet (🔒) |
| POST | /api/alerts | Krijo alarm (🔒) |
| PUT | /api/alerts/:id/lexo | Shëno si lexuar (🔒) |
| PUT | /api/alerts/:id/zgjidh | Zgjidh alarmin (🔒) |

> 🔒 = Kërkon autentifikim (Bearer JWT Token)

---

## ✨ Veçoritë Kryesore

- **Dashboard** interaktiv me grafikë (Recharts)
- **Menaxhimi i Dronave** - CRUD i plotë, filtrim, kërkim
- **Gjurmimi i Fluturimeve** - Regjistrim, monitorim, historik
- **Sistemi i Alarmeve** - Nivele prioriteti, zgjidhje
- **Autentifikim JWT** - Login/Register, role-based access
- **UI Modern** - Dark theme, responsive, animacione
- **Statistika** me grafikë vizuale

---

## 🛠️ Teknologjitë e Përdorura

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** (jsonwebtoken) - Autentifikim
- **bcryptjs** - Enkriptim fjalëkalimesh
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI Library
- **React Router v6** - Navigim SPA
- **Axios** - HTTP Client
- **Recharts** - Grafikë dhe vizualizim
- **CSS Custom Properties** - Theming

---

## 👨‍💻 Zhvilluar nga
Nadmir Kullafi - Detyra e Kursit Web 2026
