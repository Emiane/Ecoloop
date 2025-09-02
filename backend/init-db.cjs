const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database', 'broiler_farm.db');
const schemaPath = path.join(__dirname, 'database', 'broiler_schema.sql');

// Créer le dossier database s'il n'existe pas
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialiser la base de données
const db = new sqlite3.Database(dbPath);

console.log('🔧 Initialisation de la base de données EcoLoop...');

if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('❌ Erreur lors de l\'initialisation:', err);
    } else {
      console.log('✅ Base de données initialisée avec succès!');
      console.log('📊 Tables créées:');
      console.log('   - users (utilisateurs)');
      console.log('   - flocks (lots de poulets)');
      console.log('   - daily_production (production quotidienne)');
      console.log('   - financial_transactions (finances)');
      console.log('   - alerts (alertes)');
      console.log('   - health_records (santé/vaccinations)');
      console.log('   - equipment (équipements)');
      console.log('   - training_progress (formation)');
      console.log('   - forum_posts (forum)');
      console.log('   - sensor_data (capteurs IoT)');
      console.log('🐔 Données de démonstration ajoutées');
    }
    db.close();
  });
} else {
  console.error('❌ Fichier schema SQL non trouvé:', schemaPath);
  db.close();
}
