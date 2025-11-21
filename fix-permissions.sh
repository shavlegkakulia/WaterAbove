#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║  🔧 WaterAbove - EPERM Fix Troubleshooting                ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 1. Check current process
echo "1️⃣  Check: What processes are running on port 8081?"
lsof -i :8081 2>/dev/null || echo "   ✅ Port 8081 is free"
echo ""

# 2. Check Node.js
echo "2️⃣  Node.js Info:"
echo "   Path: $(which node)"
echo "   Version: $(node --version)"
echo ""

# 3. Check Cursor process
echo "3️⃣  Cursor Process:"
ps aux | grep -i cursor | grep -v grep | head -3 || echo "   ⚠️  Cursor process not found"
echo ""

# 4. Permission test
echo "4️⃣  Network Permission Test:"
echo "   Attempting to bind to port 9999 (test)..."
node -e "
const net = require('net');
const server = net.createServer();
server.listen(9999, '0.0.0.0', () => {
  console.log('   ✅ SUCCESS! Node.js has network permissions');
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
  echo "║  ❌ Problem: Network Permissions are missing!                ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
  echo ""
  echo "🔧 Solution:"
  echo ""
  echo "A) Full Disk Access (Recommended):"
  echo "   1. System Settings"
  echo "   2. Privacy & Security → Full Disk Access"
  echo "   3. Click 🔒 (unlock) below"
  echo "   4. Click + (plus)"
  echo "   5. Select: /Applications/Cursor.app"
  echo "   6. Enable ✅ checkbox"
  echo "   7. Cmd+Q → Restart Cursor"
  echo ""
  echo "B) Or try Terminal.app:"
  echo "   1. Open Applications → Utilities → Terminal.app"
  echo "   2. cd /Users/shakokakulia/dev/WaterAbove"
  echo "   3. yarn ios"
  echo ""
else
  echo "╔═══════════════════════════════════════════════════════════╗"
  echo "║  ✅ Node.js Permissions OK!                                ║"
  echo "╚═══════════════════════════════════════════════════════════╝"
  echo ""
  echo "Problem is elsewhere. Possible reasons:"
  echo ""
  echo "1. Cursor doesn't have Full Disk Access"
  echo "2. macOS Firewall is blocking"
  echo "3. Antivirus software"
  echo ""
  echo "🔧 Try:"
  echo "   yarn ios --verbose"
  echo ""
fi

echo "════════════════════════════════════════════════════════════"
