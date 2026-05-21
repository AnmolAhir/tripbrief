@echo off
echo Starting TripBrief...
docker compose up -d
echo Opening browser...
start http://localhost:5173
echo Done!
pause
