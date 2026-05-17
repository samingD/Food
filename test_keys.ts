import fetch from 'node-fetch';

async function test() {
  const res = await fetch("http://localhost:3000/api/public/payment-keys");
  const data = await res.text();
  console.log(data);
}
test();
