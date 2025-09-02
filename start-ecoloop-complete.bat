@echo off
echo.
echo ========================================
echo    DEMARRAGE COMPLET D'ECOLOOP
echo ========================================
echo.

:: Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    echo 💡 Téléchargez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

:: Aller dans le dossier backend
cd /d "%~dp0backend"

echo 📦 Installation des dépendances backend...
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances backend
    pause
    exit /b 1
)

echo ✅ Dépendances backend installées
echo.

echo 🚀 Initialisation de la base de données...
call node setup-complete.js
if errorlevel 1 (
    echo ❌ Erreur lors de l'initialisation de la base de données
    pause
    exit /b 1
)

echo ✅ Base de données initialisée
echo.

:: Aller dans le dossier frontend
cd ..\frontend

echo 📦 Installation des dépendances frontend...
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances frontend
    pause
    exit /b 1
)

echo ✅ Dépendances frontend installées
echo.

echo 🌐 Démarrage des serveurs...
echo.
echo 🔧 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo.
echo 📋 Comptes de test:
echo    👤 Utilisateur: user@demo.com / demo123
echo    🔑 Admin: admin@demo.com / admin123
echo.
echo ⚠️  Ne fermez pas cette fenêtre tant que vous utilisez l'application
echo.

:: Démarrer le backend en arrière-plan
start "EcoLoop Backend" cmd /c "cd /d %~dp0backend && npm run dev"

:: Attendre un peu que le backend démarre
timeout /t 5 /nobreak >nul

:: Démarrer le frontend
start "EcoLoop Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo ✅ Serveurs démarrés !
echo.
echo 🎯 L'application va s'ouvrir automatiquement dans votre navigateur
echo 📱 Si ce n'est pas le cas, visitez: http://localhost:3000
echo.

:: Attendre un peu puis ouvrir le navigateur
timeout /t 10 /nobreak >nul
start http://localhost:3000

echo 🎉 EcoLoop est maintenant accessible !
echo.
echo 📖 Pour arrêter l'application:
echo    1. Fermez les fenêtres de terminal qui se sont ouvertes
echo    2. Ou utilisez Ctrl+C dans chaque terminal
echo.

pause
