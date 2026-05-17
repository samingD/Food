import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const JWT_SECRET = "super-secret-key-for-imaniglobal";
const token = jwt.sign({ email: "admin@imaniglobal.com" }, JWT_SECRET, { expiresIn: "24h" });

async function run() {
  const addRes = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "New Product",
      description: "Desc",
      price: 100
    })
  });
  console.log('Status:', addRes.status, await addRes.text());
}
run();
