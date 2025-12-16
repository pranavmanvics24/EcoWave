#!/bin/bash

# Function to kill processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "Starting EcoWave..."

# Start Backend
echo "Starting Backend on port 5001..."
cd Backend
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready (simple sleep)
sleep 2

# Start Frontend
echo "Starting Frontend..."
cd Frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Both servers are running!"
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:8080"
echo "Press Ctrl+C to stop both."

wait
