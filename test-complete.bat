@echo off
echo.
echo ========================================
echo      TEST RAPIDE ECOLOOP API
echo ========================================
echo.

cd /d "%~dp0backend"

echo 🧪 Test de l'API EcoLoop...
echo.

:: Vérifier si le serveur est en cours d'exécution
call node test-api-complete.js

if errorlevel 1 (
    echo.
    echo ❌ Tests échoués
    echo 💡 Assurez-vous que le serveur backend est démarré
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Tous les tests sont passés !
echo.
echo 🎯 L'API EcoLoop fonctionne correctement
echo 📱 Vous pouvez maintenant utiliser l'application frontend
echo.

pause
