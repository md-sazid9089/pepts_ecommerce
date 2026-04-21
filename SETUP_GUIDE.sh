#!/bin/bash

# ============================================================================
# QUICK START - FRONTEND & BACKEND CONNECTION
# ============================================================================

echo "🚀 PEPTS Frontend & Backend Integration"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Start Backend Server${NC}"
echo "Run in one terminal:"
echo "  cd server"
echo "  npm install"
echo "  npm run prisma:migrate"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}✓ Backend will run at: http://localhost:3000${NC}"
echo ""

echo -e "${BLUE}Step 2: Start Frontend Dev Server${NC}"
echo "Run in another terminal:"
echo "  cd client"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}✓ Frontend will run at: http://localhost:5173${NC}"
echo ""

echo -e "${BLUE}Step 3: Test the Connection${NC}"
echo "Open browser console (F12) and run:"
echo ""
echo "  import { productsApi } from '@/services/api'"
echo "  const res = await productsApi.getAll(1, 10)"
echo "  console.log(res)"
echo ""
echo -e "${GREEN}✅ If you see products data, connection works!${NC}"
echo ""

echo -e "${BLUE}Step 4: Use API Services in Components${NC}"
echo ""
echo "Example - Login:"
echo "  import { authApi } from '@/services/api'"
echo "  const response = await authApi.login('email@example.com', 'password')"
echo ""
echo "Example - Fetch Products:"
echo "  import { productsApi } from '@/services/api'"
echo "  const response = await productsApi.getAll(1, 20)"
echo ""
echo "Example - Submit Inquiry:"
echo "  import { inquiriesApi } from '@/services/api'"
echo "  const response = await inquiriesApi.submit({"
echo "    companyName: 'Store Name',"
echo "    contactEmail: 'email@example.com',"
echo "    productName: 'Fashion Dolls',"
echo "    requestedQuantity: 500"
echo "  })"
echo ""

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📚 See BACKEND_INTEGRATION.md for more examples"
echo ""
