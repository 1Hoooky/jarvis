@echo off
cd /d C:\Users\hoook\projetos\jarvis
start "Jarvis" /min cmd /k npm start
timeout /t 10 /nobreak
start chrome --app=http://localhost:5173