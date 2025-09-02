@echo off
echo =================================
echo     ECOLOOP FRONTEND CLIENT
echo =================================
echo.

cd /d "%~dp0frontend"

echo Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detecte!
echo.

echo Installation des dependances...
if not exist "node_modules" (
    echo Installation en cours...
    npm install
    if errorlevel 1 (
        echo ERREUR: Echec de l'installation des dependances
        pause
        exit /b 1
    )
    echo.
)

echo.
echo =================================
echo    DEMARRAGE DU CLIENT...
echo =================================
echo.
echo Application disponible sur: http://localhost:3000
echo.
echo IMPORTANT: Assurez-vous que le backend est demarre
echo            (executez start-backend.bat dans un autre terminal)
echo.
echo Appuyez sur Ctrl+C pour arreter l'application
echo.

npm run dev
