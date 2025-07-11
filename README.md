# ARC - Air Purification Control Web App

## 🌱 Project Overview

ARC (Air Refinement Controller) is a smart air purification hardware system. This project is the **web interface** for controlling and monitoring that machine.
The hardware purifies the surrounding environment and releases clean air. This web app acts as the bridge between users and the machine — letting them configure, monitor, and control the ARC unit from anywhere.

### 🧩 Key Features

* 🖥️ Web-based control dashboard for the ARC air-purifier hardware
* 🔍 Real-time data monitoring (air quality, filters, machine status)
* ⚙️ Backend built with Express.js + MongoDB for data storage
* 🎨 Frontend built using HTML / Bootstrap (upgradeable to React)
* 🐳 Fully Dockerized (frontend, backend, and MongoDB)
* 🛠️ Easily fork, customize, and redeploy on your own systems

---

## 🔗 Live Demo Links (Local Setup)

* Frontend UI: https://arc-pi-beryl.vercel.app/
* Backend API: https://arc-tf9r.onrender.com/  [use '/api/signup' or '/api/signin' to check the routes on postman API]


---

## 📦 Tech Stack

* **Frontend**: HTML, CSS and JS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Containerization**: Docker, Docker Compose

---

## 🧪 Local Setup Using Docker

1. Clone the repository:

```bash
To contribute, fork the repo first, copy the forked link and paste below

git clone <link>.git ARC_Copy  #you'll have a folder ARC_Copy created with the folders in original repo
cd ARC_Copy
```

2. Build and run the app:

```bash
docker-compose up --build
```

If want to do things seperately, 

3. Access the services:

* Frontend: [http://localhost:8080]
* Backend API: [http://localhost:5000/api]

4. Stop the services (but retain images for faster next start):

```bash
[ctrl + c] and then 
docker-compose down
```

5. Restart later without rebuilding:

```bash
docker-compose up
```

6. Make your changes (e.g. update frontend UI or add routes to backend)
7. Rebuild and test:

```bash
docker-compose up --build
```

8. Push changes to your GitHub fork 

git init
git remote add origin <link_of_forked_repo>
git pull origin main [optional]
git add .
git commit -m "msg"
git push origin main

Can also create branches for different features that you've developing
---

## 📜 License

This project is under the MIT License. Feel free to use and build upon it.

---

ARC Copy - Built with ❤️ for smart environmental solutions.
