
const API_URL = 'http://127.0.0.1:3000';
const ADMIN_EMAIL = 'maruflol62@gmail.com';
const ADMIN_PASS = 'Maruf$@21REDO&';

async function testUpload() {
  console.log("Testing Image Upload Logic...");

  // 1. Login
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS })
  });
  const { data: authData } = await loginRes.json();
  const token = authData.token;
  console.log(`Logged in as: ${authData.user.email} (Role: ${authData.user.role})`);

  // 2. Get Product
  const prodRes = await fetch(`${API_URL}/api/products?pageSize=1`);
  const { data: prodData } = await prodRes.json();
  const productId = prodData.items[0].id;
  console.log(`Targeting Product: ${productId}`);

  // 3. Upload
  const formData = new FormData();
  const blob = new Blob(["fake image content"], { type: "image/jpeg" });
  formData.append("image", blob, "test.jpg");

  const uploadRes = await fetch(`${API_URL}/api/products/${productId}/upload-image`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const uploadData = await uploadRes.json();
  console.log(`Upload Status: ${uploadRes.status}`);
  console.log(`Response:`, JSON.stringify(uploadData, null, 2));

  if (uploadRes.ok) {
    console.log("✅ SUCCESS: Image uploaded and DB updated.");
  } else {
    console.log("❌ FAILURE.");
  }
}

testUpload().catch(e => console.error(e));
