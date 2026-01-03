#!/bin/bash
# Quick fix script to restart backend with new database configuration

echo "🔄 Restarting SynapticCare Backend..."
echo ""
echo "Current configuration:"
echo "  Database: SQLite (file:./prisma/dev.db)"
echo "  Port: 5050"
echo ""

cd "$(dirname "$0")/../backend"

# Check if database exists
if [ -f "prisma/dev.db" ]; then
    echo "✅ SQLite database found"
else
    echo "⚠️  Database not found, creating..."
    npx prisma db push --accept-data-loss
fi

echo ""
echo "📝 Please manually restart your backend server:"
echo "   1. Stop the backend server (Ctrl+C)"
echo "   2. Run: npm run dev"
echo ""
