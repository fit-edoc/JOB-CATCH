@echo off
echo ==========================================
echo Building Job Catch Web Application...
echo ==========================================

echo [1/3] Installing Server Dependencies...
cd server
call npm install
cd ..

echo [2/3] Installing Client Dependencies...
cd client
call npm install

echo [3/3] Building Client Production Bundle...
call npm run build
cd ..

echo ==========================================
echo Build Completed Successfully!
echo To run backend: cd server && npm start
echo To preview built frontend: cd client && npm run preview
echo ==========================================
