
# 🌾 FarmConnect

**FarmConnect** is a full-stack agricultural marketplace that connects farmers directly with consumers. Farmers can list their crops with ML-predicted MSP suggestions, receive payments via Razorpay UPI, and interact with consumers in real time. The system integrates **Spring Boot**, **Node.js**, **Flask**, **React**, **MongoDB**, and **MySQL** into a seamless platform.

---

## 🚀 Features

### 👨‍🌾 For Farmers
- OTP-based signup/login
- Crop listing with images, quantity, and pricing
- ML-predicted Minimum Support Price (MSP) suggestions (via Flask)
- Accept payments via Razorpay UPI (via Flask)
- Real-time chat with consumers (via MERN stack)

### 🧑‍🌾 For Consumers
- OTP-based signup/login
- Browse and search for crops
- Pay using Razorpay UPI
- Real-time chat with farmers
- View order and payment history

---

## 🛠️ Tech Stack

| Component           | Tech                                        |
|---------------------|---------------------------------------------|
| Frontend            | React.js (`chat_app_mern/frontend`)         |
| Chat Backend        | Node.js + Express (`chat_app_mern/backend`) |
| Web Backend         | Spring Boot + MySQL (`farmersmarket/`)      |
| Chat Database       | MongoDB                                     |
| ML Prediction API   | Flask (`model.py`)                          |
| Payment API         | Flask + Razorpay (`payment.py`)             |

---

## 📁 Folder Structure

FarmConnect/
├── chat_app_mern/           # MERN stack app
│   ├── backend/             # Node.js + MongoDB server
│   └── frontend/            # React UI
├── farmersmarket/           # Spring Boot backend
├── model.py                 # Flask ML prediction API
├── payment.py               # Flask Razorpay integration
├── requirements.txt         # Python dependencies
├── README.md

---

## 📊 Dataset Info

- **Source:** [Agmarknet – Price and Arrivals](https://www.agmarknet.gov.in/PriceAndArrivals/DatewiseCommodityReport.aspx)
- **Google Drive Dataset:** [Download Here](https://drive.google.com/drive/folders/11TZXBJN0CBeChQw6vAIKrxS8IcxW6S1n)
- **Configured in:** `model.py`
BASE_PATH = "C:\Users\SHREYASH\Documents\FarmConnect\dataset\"

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
git clone https://github.com/shreyash1231/FarmConnect.git
cd FarmConnect

### 2. Run the Frontend
cd chat_app_mern
npm install
npm run build
npm start

### 3. Start the Chat Backend (Node.js)
cd backend
npm install
npm start

### 4. Run the Web Backend (Spring Boot)
cd farmersmarket
./mvnw spring-boot:run

🔐 **Update MySQL credentials** in `farmersmarket/src/main/resources/application.properties`:
spring.datasource.username=root
spring.datasource.password=Shreyash1@#

### 5. Start the ML Prediction API
python model.py

### 6. Start the Payment API (Razorpay)
python payment.py

---

## 🔐 Environment Variables

### For `payment.py`
Create a `.env` file and add:
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

### For Chat App (`chat_app_mern/backend/.env`)
PORT=8000
MONGO_URI=mongodb://localhost:27017/chatapp

---

## 📦 Python Requirements

Install dependencies for ML and Payment Flask apps:
pip install -r requirements.txt

### ✅ `requirements.txt` contains:
flask==2.3.3
flask-cors==4.0.0
razorpay==1.3.0
pandas==2.2.1
numpy==1.26.4
scikit-learn==1.4.1.post1
xgboost==2.0.3
catboost==1.2.5
joblib==1.4.2

---

## 🤝 Contributing

Want to help improve FarmConnect?  
Feel free to fork, open pull requests, or raise issues. For major changes, please start a discussion.

---

## ✨ Author

**Shreyash Chandwadkar**  
🔗 LinkedIn: https://www.linkedin.com/in/shreyash-chandwadkar  
🐙 GitHub: https://github.com/shreyash1231  
📧 Email: chandwadkarshreyash@gmail.com
