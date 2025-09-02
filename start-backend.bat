@echo off
echo =================================
echo     ECOLOOP BACKEND SERVER
echo =================================
echo.

cd /d "%~dp0backend"

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

echo Initialisation de la base de donnees...
npm run init-db
if errorlevel 1 (
    echo ERREUR: Echec de l'initialisation de la base de donnees
    pause
    exit /b 1
)

echo.
echo =================================
echo    DEMARRAGE DU SERVEUR...
echo =================================
echo.
echo Serveur disponible sur: http://localhost:5000
echo API disponible sur: http://localhost:5000/api
echo Health check: http://localhost:5000/health
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

npm run dev
