#!/bin/bash
export DATABASE_URL="postgresql://mind:mind_dev@localhost:5432/mind_dev?schema=public"
export JWT_SECRET="mind-dev-secret-change-in-production"
export NODE_ENV=development

cd /Users/irfan/mind

# Start API server in background
npm run dev -- --filter=@mind/api &
API_PID=$!

# Wait for API to start
sleep 5

# Start frontend in background
npm run dev -- --filter=@mind/web &
WEB_PID=$!

echo "API PID: $API_PID"
echo "Web PID: $WEB_PID"

# Wait for both
wait
