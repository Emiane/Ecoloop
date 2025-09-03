-- Schéma de base de données pour le système de suivi avicole

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'basic', 'pro', 'premium')),
  subscription_expires_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table des lots de volaille
CREATE TABLE IF NOT EXISTS poultry_lots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  strain TEXT,
  initial_quantity INTEGER NOT NULL,
  current_quantity INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  expected_end_date TEXT,
  actual_end_date TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
  goals TEXT, -- JSON pour objectifs (poids cible, FCR, etc.)
  building_info TEXT, -- JSON pour info bâtiment
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table de suivi quotidien
CREATE TABLE IF NOT EXISTS daily_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  mortality INTEGER DEFAULT 0,
  feed_consumption REAL,
  weight_sample REAL,
  water_consumption REAL,
  temperature REAL,
  humidity REAL,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES poultry_lots(id) ON DELETE CASCADE,
  UNIQUE(lot_id, date)
);

-- Table des coûts
CREATE TABLE IF NOT EXISTS costs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('feed', 'medication', 'labor', 'utilities', 'maintenance', 'other')),
  description TEXT,
  amount REAL NOT NULL,
  quantity REAL,
  unit TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES poultry_lots(id) ON DELETE CASCADE
);

-- Table des événements sanitaires
CREATE TABLE IF NOT EXISTS health_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vaccination', 'treatment', 'diagnosis', 'mortality_event')),
  disease_id TEXT,
  affected_quantity INTEGER,
  treatment_used TEXT,
  cost REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES poultry_lots(id) ON DELETE CASCADE
);

-- Table des maladies/pathologies référentielles
CREATE TABLE IF NOT EXISTS diseases (
  id TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  symptoms TEXT,
  treatment TEXT,
  prevention TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_poultry_lots_user_id ON poultry_lots(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tracking_lot_date ON daily_tracking(lot_id, date);
CREATE INDEX IF NOT EXISTS idx_costs_lot_date ON costs(lot_id, date);
CREATE INDEX IF NOT EXISTS idx_health_events_lot_date ON health_events(lot_id, date);

-- Insertion de données de référence pour les maladies
INSERT OR IGNORE INTO diseases VALUES 
('Newcastle', 'Maladie de Newcastle', 'Newcastle Disease', 'viral', 
 'Difficultés respiratoires, diarrhée verte, chute de ponte', 
 'Aucun traitement spécifique, soins de soutien', 
 'Vaccination régulière'),
('Coccidiosis', 'Coccidiose', 'Coccidiosis', 'parasitic',
 'Diarrhée sanglante, perte d''appétit, retard de croissance',
 'Anticoccidiens (amprolium, sulfaméthoxypyridazine)',
 'Hygiène, rotation des parcours'),
('Gumboro', 'Maladie de Gumboro', 'Infectious Bursal Disease', 'viral',
 'Diarrhée blanchâtre, prostration, immunodépression',
 'Aucun traitement spécifique, soins de soutien',
 'Vaccination précoce'),
('Bronchitis', 'Bronchite infectieuse', 'Infectious Bronchitis', 'viral',
 'Toux, éternuements, chute de ponte',
 'Antibiotiques pour infections secondaires',
 'Vaccination, biosécurité'),
('Salmonella', 'Salmonellose', 'Salmonellosis', 'bacterial',
 'Diarrhée, déshydratation, septicémie',
 'Antibiotiques spécifiques selon antibiogramme',
 'Hygiène stricte, contrôle alimentaire');
