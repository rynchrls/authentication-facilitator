## 🔒 Authentication Facilitator  
A simple and secure **JWT authentication helper** for Node/Express.js.  

### 🚀 Features  
✅ **Token Generation** – Create JWT access tokens  
✅ **Token Authentication** – Verify and decode JWT tokens  
✅ **Middleware** – Enforce JWT authentication in Express  

---

## 📦 Installation  
```sh
npm install authentication-facilitator
```

---

## 🚀 Usage  

### 1️⃣ **Import the Module**  
```js
const { buildToken, authenticateToken, resolveToken, enforceJWT } = require("authentication-facilitator");
```

### 2️⃣ **Generate a Token**  
```js
const userPayload = { userId: 123 };
const secretKey = "your_secret_key";
const token = buildToken(userPayload, secretKey);
console.log(token);
```

### 3️⃣ **Verify & Decode a Token**  
```js
const decoded = await authenticateToken(token, secretKey);
console.log(decoded); // { userId: 123, iat: ... , exp: ... }
```

### 4️⃣ **Extract Token from Request Headers**  
```js
const sampleToken = 'token1234'
const tokenFromHeader = resolveToken(token);
console.log(tokenFromHeader);
```

### 5️⃣ **Use JWT Middleware in Express**  
```js
const express = require("express");
const app = express();

app.use(enforceJWT("your_secret_key"));

app.get("/protected", (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## 📜 API Reference  

### 🔹 `buildToken(payload, secret, expiresIn = "1h")`  
- **payload** (Object) – Data to include in the token  
- **secret** (String) – Secret key to sign the token  
- **expiresIn** (String) – Expiration time (default: `"1h"`)  
- **Returns**: A JWT string  

### 🔹 `authenticateToken(token, secret)`  
- **token** (String) – The JWT token to verify  
- **secret** (String) – Secret key used for verification  
- **Returns**: Decoded payload or `null` if invalid  

### 🔹 `resolveToken(token)`  
- **token** (String) – Express request string  
- **Returns**: Extracted token from `Authorization` header  

### 🔹 `enforceJWT(secret)`  
- **secret** (String) – Secret key for verification  
- **Returns**: Express middleware to enforce authentication  

---

## 🧪 Running Tests  
```sh
npm test
```

---

## 🌟 License  
MIT License  

📌 **Author**: Ryan Charles Alcaraz ([github](https://github.com/rynchrls/authentication-facilitator))  

