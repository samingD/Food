import fetch from 'node-fetch';

async function run() {
  const getRes = await fetch('http://localhost:3000/api/products');
  console.log('GET status:', getRes.status, await getRes.text());
}
run();
