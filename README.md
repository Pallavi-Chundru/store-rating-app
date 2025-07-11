<<<<<<< HEAD
# store-rating-app
=======

# Store Rating App

A full-stack web application that allows users to submit ratings for stores registered on the platform. It features role-based access control, supporting System Administrators, Normal Users, and Store Owners.

---

## 🚀 Features

### ✅ System Administrator
- Add stores and users (admin/user/store owner)
- View dashboards with total users, stores, and ratings
- View and filter users and stores
- View detailed user info (including ratings if store owner)

### ✅ Normal User
- Register and login
- View and search for stores
- Submit and update ratings (1-5)

### ✅ Store Owner
- View ratings for their store
- See average rating of their store

---

## 🛠 Tech Stack

- **Frontend**: React.js, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT + bcryptjs
- **Styling**: Basic CSS (Bootstrap/Tailwind optional)
**API Testing**: Postman 

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Pallavi-Chundru/store-rating-app.git
cd store-rating-app
```

### 2. Setup the MySQL Database
```sql
CREATE DATABASE store_rating_db;
```
Then run the SQL script in `backend/models/schema.sql` or:
```bash
mysql -u root -p store_rating_db < backend/models/schema.sql
```

### 3. Backend Setup
```bash
cd backend
npm install
```

#### Configure `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=*********
DB_NAME=store_rating_db
JWT_SECRET=*********
PORT=5001
```

#### Run the Server
```bash
npx nodemon index.js
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Make sure `frontend/package.json` includes:
```json
"proxy": "http://localhost:5001"
```

---

## 📡 API Endpoints (Sample)

### Auth
- `POST /auth/register` – Register user
- `POST /auth/login` – Login and get JWT

### Admin
- `GET /admin/dashboard` – Stats
- `GET /admin/users` – User list
- `GET /admin/stores` – Store list
- `POST /admin/add-user` – Add new user

### User
- `GET /user/stores` – List/Search stores
- `POST /user/rate/:storeId` – Rate store

### Owner
- `GET /owner/ratings` – View ratings for store
- `GET /owner/average-rating` – Avg rating

---

## ☁️ Deployment Instructions

### Backend 
1. Set environment variables
2. Connect to hosted MySQL database 
3. Deploy using `npm start` or `node index.js`

### Frontend 
1. Build React app:
```bash
npm run build
```
2. Deploy `/frontend/build` folder
3. Set `REACT_APP_API_URL` if using external backend

---




>>>>>>> b1108d0 (Initial commit for store-rating-app)
