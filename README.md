# 🌾 FarmConnect

**FarmConnect** is a full-stack agricultural marketplace platform that connects farmers directly with consumers. Farmers can list their crops with ML-predicted MSP suggestions, consumers can browse and buy fresh produce via Razorpay UPI, and both parties can chat in real time. The system combines Spring Boot, Node.js, Flask, React, MongoDB, and MySQL into a unified platform.

---

## 🚀 Features

### 👨‍🌾 For Farmers
- OTP-based signup/login
- List crops with images, quantity, and price
- View ML-predicted MSP for crops (Flask API)
- Receive payments via Razorpay UPI (Flask)
- Real-time chat with consumers

### 🧑‍🌾 For Consumers
- OTP-based signup/login
- Browse crops
- Purchase via Razorpay UPI
- Real-time chat with farmers
- View order/payment history

---

## 🛠️ Tech Stack

| Component             | Tech                                      |
|-----------------------|-------------------------------------------|
| Frontend              | React.js (inside `chat_app_mern/`)        |
| Web Backend           | Spring Boot + MySQL (`farmersmarket/`)    |
| Chat Backend          | Node.js + Express (`chat_app_mern/`)      |
| Chat DB               | MongoDB                                   |
| ML Prediction API     | Flask (`model.py`)                        |
| Payment API           | Flask + Razorpay (`payment.py`)           |

---

## 📁 Folder Structure

```
FarmConnect/
├── chat_app_mern/           # Node.js + React app (chat + frontend)
│   ├── backend/             # Node.js server with MongoDB
│   └── frontend/            # React frontend
├── farmersmarket/           # Spring Boot backend for web APIs
├── model.py                 # Flask API for MSP price prediction
├── payment.py               # Flask Razorpay integration
├── README.md
```

---

## 📊 Dataset Info

### 🔗 Source: 
- [Agmarknet – Price and Arrivals](https://www.agmarknet.gov.in/PriceAndArrivals/DatewiseCommodityReport.aspx)

### 📂 Dataset Folder:
- [Google Drive Dataset](https://drive.google.com/drive/folders/11TZXBJN0CBeChQw6vAIKrxS8IcxW6S1n)

### 🔧 `model.py` Configuration:
```python
BASE_PATH = "C:\Users\SHREYASH\Documents\FarmConnect\dataset\"
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/shreyash1231/FarmConnect.git
cd FarmConnect
```

### 2. Start the Application
```bash
cd chat_app_mern
npm install
npm run build
npm start
```

### 4. Start the Spring Boot Web Backend
```bash
cd farmersmarket
./mvnw spring-boot:run
```

> ⚠️ **Update MySQL password** in `farmersmarket/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=Shreyash1@#  # ✅ change it here
```

### 5. Start the ML API (Flask)
```bash
python model.py
```

### 6. Start the Payment API (Flask + Razorpay)
```bash
python payment.py
```

---

## 🔐 Environment Variables

### ✅ `.env` for Flask APIs
```env
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### ✅ `.env` to Access the Application
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/chatapp
```

---

## 🤝 Contributing

Feel free to fork, submit pull requests, or raise issues.  
For major changes, please open an issue first to discuss.

---


## ✨ Author

**Shreyash Chandwadkar**  
[LinkedIn](https://www.linkedin.com/in/shreyash-chandwadkar)  
[GitHub](https://github.com/shreyash1231)
[Email] (chandwadkarshreyash@gmail.com)
