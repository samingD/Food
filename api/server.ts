import express from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-imaniglobal";

let supabase: ReturnType<typeof createClient> | null = null;

let fallbackProducts = [
  { id: "1", name: "Premium Hardwood Charcoal", description: "High-quality, long-burning hardwood charcoal perfect for industrial and domestic use.", price: 450, image: "https://picsum.photos/seed/charcoal/600/400" },
  { id: "2", name: "Raw Cashew Nuts", description: "Sun-dried, premium quality raw cashew nuts sourced directly from the best farms.", price: 1200, image: "https://picsum.photos/seed/cashew/600/400" },
  { id: "3", name: "Unrefined Shea Butter", description: "100% pure, unrefined shea butter rich in vitamins A and E.", price: 300, image: "https://picsum.photos/seed/sheabutter/600/400" },
  { id: "4", name: "Fresh Cola Nuts", description: "Carefully selected fresh cola nuts with high caffeine content.", price: 150, image: "https://picsum.photos/seed/colanut/600/400" },
  { id: "5", name: "Dried Hibiscus Flower", description: "Vibrant, tart, and premium dried hibiscus flowers for teas and extracts.", price: 250, image: "https://picsum.photos/seed/hibiscus/600/400" }
];

function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
    
    if (!supabaseKey) return null;
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const countryNames = [ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (DRC)", "Congo (Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

let shippingRates = countryNames.map((country, idx) => ({
  id: String(idx + 1),
  country: country,
  cargo: 150,
  shipping: 50
}));

const app = express();
app.use(express.json({ limit: '10mb' }));

let paymentKeysCache: any = null;

async function getPaymentKeys() {
  if (paymentKeysCache) return paymentKeysCache;
  const db = getSupabase();
  if (db) {
    try {
      const { data, error } = await (db as any).from("products").select("description").eq("id", "00000000-0000-0000-0000-000000000001").single();
      if (!error && data && data.description) {
        paymentKeysCache = JSON.parse(data.description);
        return paymentKeysCache;
      }
    } catch (e) {}
  }
  return {
    stripePublishableKey: "",
    stripeSecretKey: "",
    paypalClientId: "",
    paypalSecretKey: ""
  };
}

let stripeClient: any = null;
async function getStripe() {
  const keys = await getPaymentKeys();
  const key = keys.stripeSecretKey;
  if (!stripeClient && key) {
    stripeClient = new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
  } else if (key && stripeClient && stripeClient._apiKey !== key) {
    // If key changed
    stripeClient = new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
  }
  return stripeClient;
}

app.get("/api/public/payment-keys", async (req, res) => {
  const keys = await getPaymentKeys();
  res.json({
    stripePublishableKey: keys.stripePublishableKey,
    paypalClientId: keys.paypalClientId
  });
});

app.get("/api/admin/payment-keys", authenticateAdmin, async (req, res) => {
  const keys = await getPaymentKeys();
  // Return masked secret keys
  res.json({
    stripePublishableKey: keys.stripePublishableKey,
    stripeSecretKey: keys.stripeSecretKey ? "************************" : "",
    paypalClientId: keys.paypalClientId,
    paypalSecretKey: keys.paypalSecretKey ? "************************" : ""
  });
});

app.put("/api/admin/payment-keys", authenticateAdmin, async (req, res) => {
  const currentKeys = await getPaymentKeys();
  const newKeys = { ...currentKeys };
  
  if (req.body.stripePublishableKey !== undefined) newKeys.stripePublishableKey = req.body.stripePublishableKey;
  if (req.body.stripeSecretKey && req.body.stripeSecretKey !== "************************") newKeys.stripeSecretKey = req.body.stripeSecretKey;
  if (req.body.paypalClientId !== undefined) newKeys.paypalClientId = req.body.paypalClientId;
  if (req.body.paypalSecretKey && req.body.paypalSecretKey !== "************************") newKeys.paypalSecretKey = req.body.paypalSecretKey;

  paymentKeysCache = newKeys;
  // Re-init stripe client with new keys
  stripeClient = null; 

  try {
    const db = getSupabase();
    if (db) {
       await (db as any).from("products").upsert({
          id: "00000000-0000-0000-0000-000000000001",
          name: "_settings_payment",
          description: JSON.stringify(newKeys),
          price: 0,
          image: ""
       });
    }
  } catch (err) {}
  
  res.json({ success: true });
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const stripe = await getStripe();
    if (!stripe) return res.status(400).json({ error: "Online payment is currently unavailable. Please contact support." });

    const { items, total } = req.body;
    if (!total || isNaN(Number(total))) return res.status(400).json({ error: "Invalid total amount" });
    
    const amount = Math.round(Number(total) * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Stripe error create-payment-intent:", err.message);
    let errorMessage = "Failed to initialize payment method. Please try again or contact support.";
    if (err.message.includes("Expired API Key") || err.message.includes("Invalid API Key")) {
      errorMessage = "Payment system configuration error: The API key provided is expired or invalid. Please update the Stripe credentials in the Admin Dashboard.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const keys = await getPaymentKeys();
    if (!keys.paypalClientId || !keys.paypalSecretKey) {
       return res.status(400).json({ error: "PayPal keys not configured." });
    }
    const { total } = req.body;
    
    const baseURL = "https://api-m.paypal.com"; 

    const auth = Buffer.from(`${keys.paypalClientId}:${keys.paypalSecretKey}`).toString('base64');
    const tokenResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!tokenResponse.ok) {
        throw new Error("Failed to authenticate with PayPal. Check your Live Client ID and Secret Key.");
    }

    const { access_token } = await tokenResponse.json();

    const orderResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: { currency_code: "USD", value: total.toString() }
        }]
      })
    });

    if (!orderResponse.ok) throw new Error("Failed to create explicit live order.");
    const orderData = await orderResponse.json();
    res.json(orderData);
  } catch(e: any) {
    console.error("PayPal Error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const { orderID } = req.body;
    const keys = await getPaymentKeys();
    const baseURL = "https://api-m.paypal.com";
    const auth = Buffer.from(`${keys.paypalClientId}:${keys.paypalSecretKey}`).toString('base64');
    
    const tokenResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    
    if (!tokenResponse.ok) throw new Error("Failed to authenticate.");
    const { access_token } = await tokenResponse.json();

    const captureResponse = await fetch(`${baseURL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      }
    });

    if (!captureResponse.ok) throw new Error("Failed to capture order.");
    const captureData = await captureResponse.json();
    res.json(captureData);
  } catch(e: any) {
    console.error("PayPal Error:", e);
    res.status(500).json({ error: e.message });
  }
});

let fallbackOrders: any[] = [];

app.post("/api/orders", async (req, res) => {
  try {
    const db = getSupabase();
    const orderData = { ...req.body, created_at: new Date().toISOString() };
    orderData.id = Date.now().toString();

    if (!db) {
      fallbackOrders.push(orderData);
      return res.status(201).json(orderData);
    }

    // Try to save order in products table to guarantee persistence since 'orders' table might not exist
    const { data, error } = await (db as any).from("products").insert([{
      name: "_order_" + orderData.id,
      description: JSON.stringify(orderData),
      price: 0,
      image: ""
    }]);

    if (error) {
       fallbackOrders.push(orderData);
       return res.status(201).json(orderData);
    }
    res.status(201).json(orderData);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create order" });
  }
});

app.get("/api/orders", authenticateAdmin, async (req, res) => {
  try {
    const db = getSupabase();
    if (!db) return res.json(fallbackOrders);
    
    // Fetch orders from products table
    const { data, error } = await (db as any).from("products")
      .select("description, created_at")
      .like("name", "_order_%");
      
    if (error) {
      return res.json(fallbackOrders);
    }

    let parsedOrders = data.map((row: any) => {
      try {
        const o = JSON.parse(row.description);
        return { ...o, created_at: o.created_at || row.created_at };
      } catch(e) { return null; }
    }).filter(Boolean);

    // Sort by created_at descending
    parsedOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(parsedOrders);
  } catch (err: any) {
    res.json(fallbackOrders);
  }
});

app.put("/api/orders/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const db = getSupabase();
    if (!db) {
      const idx = fallbackOrders.findIndex((o: any) => o.id === req.params.id);
      if (idx !== -1) {
        fallbackOrders[idx].status = status;
        return res.json(fallbackOrders[idx]);
      }
      return res.status(404).json({ error: "Order not found" });
    }

    // Fetch the order from products table
    const { data: orderRow, error: fetchErr } = await (db as any).from("products")
      .select("*")
      .eq("name", "_order_" + req.params.id)
      .single();

    if (fetchErr || !orderRow) throw new Error("Order not found");

    const orderData = JSON.parse(orderRow.description);
    orderData.status = status;

    const { data, error } = await (db as any).from("products").update({
      description: JSON.stringify(orderData)
    }).eq("name", "_order_" + req.params.id);

    if (error) throw error;
    res.json(orderData);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update order" });
  }
});

app.get("/api/shipping-rates", async (req, res) => {
  try {
    const db = getSupabase();
    if (!db) return res.json(shippingRates);
    const { data, error } = await (db as any).from("products").select("description").eq("id", "00000000-0000-0000-0000-000000000000").single();
    if (error) {
      if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('not find the table') || error.code === '42P01') {
        return res.json(shippingRates);
      }
      throw error;
    }
    if (data && data.description) shippingRates = JSON.parse(data.description);
    res.json(shippingRates);
  } catch(err) {
    res.json(shippingRates);
  }
});

app.put("/api/shipping-rates", authenticateAdmin, async (req, res) => {
  if (Array.isArray(req.body)) {
    shippingRates = req.body;
    try {
      const db = getSupabase();
      if (db) {
         await (db as any).from("products").upsert({
            id: "00000000-0000-0000-0000-000000000000",
            name: "_settings_shipping",
            description: JSON.stringify(shippingRates),
            price: 0,
            image: ""
         });
      }
    } catch (err) {}
  }
  res.json(shippingRates);
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  const adminEmails = ["admin@imaniglobal.com", "chukwuebukablaize11@gmail.com"];
  if (adminEmails.includes(email.trim().toLowerCase()) && password === "sammy1122") {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/products", async (req, res) => {
  try {
    const db = getSupabase();
    if (!db) return res.json(fallbackProducts);
    const { data, error } = await db.from("products").select("*").order("created_at", { ascending: true });
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('not find the table') || error.code === '42P01') {
        return res.json(fallbackProducts);
      }
      throw error;
    }
    const filteredData = data.filter((p: any) => p.name && !String(p.name).startsWith("_"));
    res.json(filteredData);
  } catch (error: any) {
    res.json(fallbackProducts);
  }
});

app.post("/api/products", authenticateAdmin, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const db = getSupabase();
    if (!db) {
      const newProduct = { id: Date.now().toString(), name, description, price: Number(price), image: image || "https://picsum.photos/seed/agro/600/400" };
      fallbackProducts.push(newProduct);
      return res.status(201).json(newProduct);
    }
    const { data, error } = await (db as any).from("products").insert([{ name, description, price: Number(price), image: image || "https://picsum.photos/seed/agro/600/400" }]).select().single();
    if (error) {
       if (error.code === 'PGRST205' || error.message?.includes('not find the table') || error.code === '42P01') {
          const newProduct = { id: Date.now().toString(), name, description, price: Number(price), image: image || "https://picsum.photos/seed/agro/600/400" };
          fallbackProducts.push(newProduct);
          return res.status(201).json(newProduct);
       }
       throw error;
    }
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to add product" });
  }
});

app.put("/api/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
    const db = getSupabase();
    if (!db) {
      const index = fallbackProducts.findIndex(p => p.id === id);
      if (index === -1) return res.status(404).json({ error: "Product not found" });
      fallbackProducts[index] = { ...fallbackProducts[index], name: name || fallbackProducts[index].name, description: description || fallbackProducts[index].description, price: price ? Number(price) : fallbackProducts[index].price, image: image || fallbackProducts[index].image };
      return res.json(fallbackProducts[index]);
    }
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (image) updateData.image = image;
    const { data, error } = await (db as any).from("products").update(updateData).eq("id", id).select().single();
    if (error) {
       if (error.code === 'PGRST205' || error.message?.includes('not find the table') || error.code === '42P01') {
          const index = fallbackProducts.findIndex(p => p.id === id);
          if (index === -1) return res.status(404).json({ error: "Product not found" });
          fallbackProducts[index] = { ...fallbackProducts[index], name: name || fallbackProducts[index].name, description: description || fallbackProducts[index].description, price: price ? Number(price) : fallbackProducts[index].price, image: image || fallbackProducts[index].image };
          return res.json(fallbackProducts[index]);
       }
       throw error;
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update product" });
  }
});

app.delete("/api/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getSupabase();
    if (!db) {
      fallbackProducts = fallbackProducts.filter(p => p.id !== id);
      return res.json({ success: true });
    }
    const { error } = await db.from("products").delete().eq("id", id);
    if (error) {
       if (error.code === 'PGRST205' || error.message?.includes('not find the table') || error.code === '42P01') {
           fallbackProducts = fallbackProducts.filter(p => p.id !== id);
           return res.json({ success: true });
       }
       throw error;
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete product" });
  }
});

export default app;
