@echo off
echo 🚀 Démarrage d'EcoLoop - Complet et Fonctionnel...

echo.
echo 📂 Démarrage du backend...
start "EcoLoop Backend" cmd /k "cd /d C:\Users\TAMO\Documents\Poultry\pro\backend && node server.js"

echo.
echo ⏳ Attente de 3 secondes pour le démarrage du backend...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Démarrage du frontend...
start "EcoLoop Frontend" cmd /k "cd /d C:\Users\TAMO\Documents\Poultry\pro\frontend && npm run dev"

echo.
echo ✅ EcoLoop est maintenant COMPLET et FONCTIONNEL !
echo.
echo 🌐 L'application est disponible sur :
echo    Backend API : http://localhost:5000
echo    Frontend    : http://localhost:3000
echo.
echo 📚 Fonctionnalités disponibles :
echo    ✅ Formation (gratuit)
echo    ✅ Suivi Pro (abonnement Pro)
echo    ✅ Surveillance Premium (abonnement Premium)
echo    ✅ Forum communautaire
echo    ✅ Interface admin
echo.
echo 👤 Comptes de test :
echo    Utilisateur: user@demo.com / demo123
echo    Admin     : admin@demo.com / admin123
echo.
echo 💡 Pour arrêter les serveurs, fermez les fenêtres de terminal.
echo 🔄 L'application se recharge automatiquement lors des modifications.
echo.
pause
