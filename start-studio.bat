@echo off
title LokUpdate Rajasthan - News Creative Studio
echo ========================================================
echo   LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
echo   Starting local server at http://localhost:3000
echo ========================================================
start http://localhost:3000
python -m http.server 3000
pause
