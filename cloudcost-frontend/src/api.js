fetch("https://cloudcost-analyz.onrender.com/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
})
  .then((res) => res.json())
  .then((data) => {
    if (data.token) {
      localStorage.setItem("token", data.token); // or set global state
      alert("✅ Login Successful");
    } else {
      alert(data.message || "❌ Login failed");
    }
  })
  .catch((err) => console.error("Error:", err));
