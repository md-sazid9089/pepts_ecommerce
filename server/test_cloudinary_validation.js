
const API_URL = 'http://127.0.0.1:3000';
const ADMIN_EMAIL = 'maruflol62@gmail.com';
const ADMIN_PASS = 'Maruf$@21REDO&';

async function testUploadValidation() {
  console.log("Testing Cloudinary Pipeline Validation...");

  // 1. Login to get token
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS })
  });
  const { data } = await loginRes.json();
  const token = data.token;

  // 2. Get a product ID
  const prodRes = await fetch(`${API_URL}/api/products?pageSize=1`);
  const prodData = await prodRes.json();
  const productId = prodData.data.items[0].id;

  // 3. Try to upload a dummy non-image file
  const formData = new FormData();
  const blob = new Blob(["this is not an image"], { type: "application/pdf" });
  formData.append("image", blob, "test.pdf");

  const uploadRes = await fetch(`${API_URL}/api/products/${productId}/upload-image`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const uploadData = await uploadRes.json();
  console.log(`Status: ${uploadRes.status}`);
  console.log(`Message: ${uploadData.message}`);

  if (uploadRes.status === 400 && uploadData.message.includes("Invalid file type")) {
    console.log("✅ SUCCESS: Non-image file correctly rejected.");
  } else {
    console.log("❌ FAILURE: Validation did not work as expected.");
  }
}

testUploadValidation().catch(e => console.error(e));
