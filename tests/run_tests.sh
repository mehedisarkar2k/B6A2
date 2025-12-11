#!/bin/bash

# Vehicle Rental System - API Test Runner
# ========================================

echo "🚗 Vehicle Rental System - API Test Suite"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3."
    exit 1
fi

# Navigate to tests directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt -q

# Run tests
echo ""
echo "🧪 Running tests..."
echo ""
python3 api_test.py "$@"

# Deactivate virtual environment
deactivate
