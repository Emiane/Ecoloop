const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de données
const dbPath = path.join(__dirname, 'database', 'broiler_farm.db');
const db = new sqlite3.Database(dbPath);

// Initialiser la base de données
const initDatabase = () => {
  const schemaPath = path.join(__dirname, 'database', 'broiler_schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
      if (err) {
        console.error('Erreur initialisation DB:', err);
      } else {
        console.log('✅ Base de données initialisée avec succès');
      }
    });
  }
};

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  jwt.verify(token, 'ecoloop_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, location, farm_name } = req.body;
    
    // Vérifier si l'utilisateur existe
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur serveur' });
      }
      if (row) {
        return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insérer l'utilisateur
      db.run(
        'INSERT INTO users (name, email, password, phone, location, farm_name) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, phone, location, farm_name],
        function(err) {
          if (err) {
            return res.status(500).json({ success: false, message: 'Erreur création compte' });
          }
          
          const token = jwt.sign(
            { id: this.lastID, email, name },
            'ecoloop_secret_key',
            { expiresIn: '24h' }
          );
          
          res.json({
            success: true,
            message: 'Compte créé avec succès',
            token,
            user: { id: this.lastID, name, email, farm_name }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur serveur' });
      }
      if (!user) {
        return res.status(400).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        'ecoloop_secret_key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          farm_name: user.farm_name,
          subscription_plan: user.subscription_plan
        }
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Routes des lots de poulets
app.get('/api/flocks', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM flocks WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur récupération lots' });
      }
      res.json({ success: true, flocks: rows });
    }
  );
});

app.post('/api/flocks', authenticateToken, (req, res) => {
  const { name, breed, initial_count, hatch_date, expected_slaughter_date, housing_type } = req.body;
  
  db.run(
    'INSERT INTO flocks (user_id, name, breed, initial_count, current_count, hatch_date, expected_slaughter_date, housing_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, name, breed, initial_count, initial_count, hatch_date, expected_slaughter_date, housing_type],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur création lot' });
      }
      res.json({ success: true, message: 'Lot créé avec succès', flock_id: this.lastID });
    }
  );
});

// Routes de production quotidienne
app.get('/api/production/:flockId', authenticateToken, (req, res) => {
  const { flockId } = req.params;
  
  db.all(
    `SELECT dp.* FROM daily_production dp
     JOIN flocks f ON dp.flock_id = f.id
     WHERE f.id = ? AND f.user_id = ?
     ORDER BY dp.date DESC`,
    [flockId, req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur récupération production' });
      }
      res.json({ success: true, production: rows });
    }
  );
});

app.post('/api/production', authenticateToken, (req, res) => {
  const { flock_id, date, mortality, weight_sample_count, average_weight, feed_consumed_kg, water_consumed_liters, temperature_celsius, humidity_percent, notes } = req.body;
  
  // Vérifier que le lot appartient à l'utilisateur
  db.get('SELECT id FROM flocks WHERE id = ? AND user_id = ?', [flock_id, req.user.id], (err, flock) => {
    if (err || !flock) {
      return res.status(403).json({ success: false, message: 'Accès refusé au lot' });
    }
    
    db.run(
      'INSERT OR REPLACE INTO daily_production (flock_id, date, mortality, weight_sample_count, average_weight, feed_consumed_kg, water_consumed_liters, temperature_celsius, humidity_percent, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [flock_id, date, mortality, weight_sample_count, average_weight, feed_consumed_kg, water_consumed_liters, temperature_celsius, humidity_percent, notes],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Erreur enregistrement production' });
        }
        
        // Mettre à jour le nombre actuel de poulets
        db.run(
          'UPDATE flocks SET current_count = current_count - ? WHERE id = ?',
          [mortality, flock_id]
        );
        
        res.json({ success: true, message: 'Production enregistrée avec succès' });
      }
    );
  });
});

// Routes financières
app.get('/api/finances', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM financial_transactions WHERE user_id = ? ORDER BY transaction_date DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur récupération finances' });
      }
      res.json({ success: true, transactions: rows });
    }
  );
});

app.post('/api/finances', authenticateToken, (req, res) => {
  const { flock_id, type, category, description, amount, transaction_date, supplier_buyer } = req.body;
  
  db.run(
    'INSERT INTO financial_transactions (user_id, flock_id, type, category, description, amount, transaction_date, supplier_buyer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, flock_id, type, category, description, amount, transaction_date, supplier_buyer],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur enregistrement transaction' });
      }
      res.json({ success: true, message: 'Transaction enregistrée avec succès' });
    }
  );
});

// Routes des alertes
app.get('/api/alerts', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur récupération alertes' });
      }
      res.json({ success: true, alerts: rows });
    }
  );
});

app.put('/api/alerts/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE alerts SET is_read = 1 WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur mise à jour alerte' });
      }
      res.json({ success: true, message: 'Alerte marquée comme lue' });
    }
  );
});

// Routes de santé/vaccinations
app.get('/api/health/:flockId', authenticateToken, (req, res) => {
  const { flockId } = req.params;
  
  db.all(
    `SELECT hr.* FROM health_records hr
     JOIN flocks f ON hr.flock_id = f.id
     WHERE f.id = ? AND f.user_id = ?
     ORDER BY hr.administration_date DESC`,
    [flockId, req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur récupération santé' });
      }
      res.json({ success: true, health_records: rows });
    }
  );
});

// Routes du forum
app.get('/api/forum/posts', (req, res) => {
  db.all(
    `SELECT fp.*, u.name as author_name 
     FROM forum_posts fp
     JOIN users u ON fp.user_id = u.id
     ORDER BY fp.created_at DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erreur récupération posts' });
      }
      res.json({ success: true, posts: rows });
    }
  );
});

// Route de statistiques dashboard
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_flocks FROM flocks WHERE user_id = ? AND status = "active"',
    'SELECT SUM(current_count) as total_chickens FROM flocks WHERE user_id = ? AND status = "active"',
    'SELECT COUNT(*) as unread_alerts FROM alerts WHERE user_id = ? AND is_read = 0',
    'SELECT SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) - SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as profit FROM financial_transactions WHERE user_id = ? AND transaction_date >= date("now", "-30 days")'
  ];
  
  let stats = {};
  let completed = 0;
  
  queries.forEach((query, index) => {
    db.get(query, [req.user.id], (err, row) => {
      if (!err) {
        switch(index) {
          case 0: stats.total_flocks = row.total_flocks || 0; break;
          case 1: stats.total_chickens = row.total_chickens || 0; break;
          case 2: stats.unread_alerts = row.unread_alerts || 0; break;
          case 3: stats.monthly_profit = row.profit || 0; break;
        }
      }
      completed++;
      if (completed === queries.length) {
        res.json({ success: true, stats });
      }
    });
  });
});

// Route de test santé
app.get('/api/health-check', (req, res) => {
  res.json({ 
    success: true, 
    message: 'EcoLoop Backend API - Élevage de poulets de chair',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route non trouvée - ${req.originalUrl}` });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur EcoLoop démarré sur le port ${PORT}`);
  console.log(`🐔 API spécialisée pour l'élevage de poulets de chair`);
  initDatabase();
});

module.exports = app;
