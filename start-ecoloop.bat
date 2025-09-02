@echo off
echo =================================
echo       ECOLOOP PLATEFORME
echo    Demarrage Complet du Systeme
echo =================================
echo.

echo Ce script va demarrer le backend et le frontend
echo dans deux fenetres separees.
echo.
pause

echo Demarrage du backend...
start "Ecoloop Backend" cmd /k "%~dp0start-backend.bat"

echo Attente de 5 secondes pour le demarrage du backend...
timeout /t 5 /nobreak >nul

echo Demarrage du frontend...
start "Ecoloop Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo =================================
echo     PLATEFORME ECOLOOP DEMARREE
echo =================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Les deux services ont ete demarres dans des fenetres separees.
echo Fermez les fenetres correspondantes pour arreter les services.
echo.
pause
