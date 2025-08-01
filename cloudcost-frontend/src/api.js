fetch("https://cloudcost-analyz.onrender.com/api/auth/login", {
  method: "POST",
  credentials: "include", // only if you use cookies/session
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
})



