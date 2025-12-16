# EcoWave

EcoWave is a sustainable marketplace application connecting eco-conscious buyers and sellers.

## Quick Start

The easiest way to run the application is using the provided script:

```bash
chmod +x run.sh
./run.sh
```

This will start:
- **Backend Server** on `http://localhost:5001`
- **Frontend Application** on `http://localhost:8080` (or next available port)

## Manual Setup

If you prefer to run them separately:

### 1. Backend

```bash
cd Backend
# Install dependencies (first time only)
pip3 install -r requirements.txt
# Run server
python3 main.py
```

### 2. Frontend

```bash
cd Frontend
# Install dependencies (first time only)
npm install
# Run development server
npm run dev
```

## Features

- **Product Listing**: Sell your eco-friendly items.
- **Product Marketplace**: Browse and buy sustainable products.
- **Impact Tracking**: See the CO2 saved and waste reduced.
- **User Profiles**: Track your activity and badges.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Flask, Python, MongoDB
