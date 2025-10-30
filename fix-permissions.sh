#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║  🔧 WaterAbove - EPERM Fix Troubleshooting                ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 1. Check current process
echo "1️⃣  შემოწმება: რა process-ებია გაშვებული port 8081-ზე?"
lsof -i :8081 2>/dev/null || echo "   ✅ Port 8081 თავისუფალია"
echo ""

# 2. Check Node.js
echo "2️⃣  Node.js Info:"
echo "   Path: $(which node)"
echo "   Version: $(node --version)"
echo ""

# 3. Check Cursor process
echo "3️⃣  Cursor Process:"
ps aux | grep -i cursor | grep -v grep | head -3 || echo "   ⚠️  Cursor process ვერ მოიძებნა"
echo ""

# 4. Permission test
echo "4️⃣  Network Permission Test:"
echo "   ვცდილობთ port 9999-ზე bind-ს (test)..."
node -e "
const net = require('net');
const server = net.createServer();
server.listen(9999, '0.0.0.0', () => {
  console.log('   ✅ SUCCESS! Node.js აქვს network permissions');
  server.close();
  process.exit(0);
});
server.on('error', (err) => {
  console.log('   ❌ ERROR:', err.code, err.message);
  process.exit(1);
});
" 2>&1
TEST_RESULT=$?
echo ""

if [ $TEST_RESULT -ne 0 ]; then
  echo "╔═══════════════════════════════════════════════════════════╗"
  echo "║  ❌ პრობლემა: Network Permissions არ არის!                ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
  echo ""
  echo "🔧 გადაწყვეტა:"
  echo ""
  echo "A) Full Disk Access (რეკომენდებული):"
  echo "   1. System Settings"
  echo "   2. Privacy & Security → Full Disk Access"
  echo "   3. დააჭირე 🔒 (unlock) ქვემოთ"
  echo "   4. დააჭირე + (plus)"
  echo "   5. აირჩიე: /Applications/Cursor.app"
  echo "   6. ჩართე ✅ checkbox"
  echo "   7. Cmd+Q → Restart Cursor"
  echo ""
  echo "B) ან სცადე Terminal.app:"
  echo "   1. გახსენი Applications → Utilities → Terminal.app"
  echo "   2. cd /Users/shakokakulia/dev/WaterAbove"
  echo "   3. yarn ios"
  echo ""
else
  echo "╔═══════════════════════════════════════════════════════════╗"
  echo "║  ✅ Node.js Permissions OK!                                ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
  echo ""
  echo "პრობლემა სხვაგან არის. შესაძლო მიზეზები:"
  echo ""
  echo "1. Cursor-ს არ აქვს Full Disk Access"
  echo "2. macOS Firewall აბლოკავს"
  echo "3. Antivirus software"
  echo ""
  echo "🔧 სცადე:"
  echo "   yarn ios --verbose"
  echo ""
fi

echo "════════════════════════════════════════════════════════════"
