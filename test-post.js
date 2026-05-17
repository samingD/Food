import fetch from 'node-fetch';

async function run() {
  const loginRes = await fetch('http://localhost:3000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "admin@imaniglobal.com", password: "sammy1122" })
  });
  const { token } = await loginRes.json();

  const addRes = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: "Another Prod", description: "Desc", price: 100, image: "" })
  });
  console.log('Add status:', addRes.status, await addRes.text());
}
run();
