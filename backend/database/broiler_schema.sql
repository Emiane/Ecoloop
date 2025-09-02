-- Base de données spécialisée pour l'élevage de poulets de chair
-- EcoLoop Cameroun - Système complet de gestion

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    farm_name TEXT,
    subscription_plan TEXT DEFAULT 'free', -- free, pro, premium
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des lots de poulets de chair
CREATE TABLE IF NOT EXISTS flocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    breed TEXT NOT NULL, -- Cobb 500, Ross 308, Hubbard, etc.
    initial_count INTEGER NOT NULL,
    current_count INTEGER NOT NULL,
    hatch_date DATE NOT NULL,
    expected_slaughter_date DATE,
    actual_slaughter_date DATE,
    status TEXT DEFAULT 'active', -- active, completed, sold
    housing_type TEXT, -- poulailler, enclos, mixte
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table de production quotidienne
CREATE TABLE IF NOT EXISTS daily_production (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flock_id INTEGER NOT NULL,
    date DATE NOT NULL,
    mortality INTEGER DEFAULT 0,
    weight_sample_count INTEGER DEFAULT 0,
    average_weight DECIMAL(5,2) DEFAULT 0,
    feed_consumed_kg DECIMAL(8,2) DEFAULT 0,
    water_consumed_liters DECIMAL(8,2) DEFAULT 0,
    temperature_celsius DECIMAL(4,1),
    humidity_percent DECIMAL(4,1),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flock_id) REFERENCES flocks(id),
    UNIQUE(flock_id, date)
);

-- Table des finances
CREATE TABLE IF NOT EXISTS financial_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    flock_id INTEGER,
    type TEXT NOT NULL, -- income, expense
    category TEXT NOT NULL, -- feed, medication, equipment, sales, etc.
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'FCFA',
    transaction_date DATE NOT NULL,
    receipt_number TEXT,
    supplier_buyer TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flock_id) REFERENCES flocks(id)
);

-- Table des alertes et notifications
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    flock_id INTEGER,
    type TEXT NOT NULL, -- health, feed, weight, mortality, environment
    severity TEXT NOT NULL, -- low, medium, high, critical
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    resolved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flock_id) REFERENCES flocks(id)
);

-- Table des vaccinations et soins
CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flock_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- vaccination, medication, treatment
    product_name TEXT NOT NULL,
    dosage TEXT,
    administration_date DATE NOT NULL,
    administered_by TEXT,
    cost DECIMAL(10,2),
    notes TEXT,
    next_due_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flock_id) REFERENCES flocks(id)
);

-- Table des équipements et matériels
CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- feeder, drinker, heater, ventilator, etc.
    brand TEXT,
    model TEXT,
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    status TEXT DEFAULT 'active', -- active, maintenance, broken, sold
    location TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des formations et cours
CREATE TABLE IF NOT EXISTS training_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    score INTEGER,
    completion_date DATETIME,
    time_spent_minutes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des discussions du forum
CREATE TABLE IF NOT EXISTS forum_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT 0,
    is_solved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des réponses du forum
CREATE TABLE IF NOT EXISTS forum_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des capteurs IoT (pour surveillance)
CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    sensor_type TEXT NOT NULL, -- temperature, humidity, air_quality, sound
    location TEXT NOT NULL,
    value DECIMAL(8,2) NOT NULL,
    unit TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertion de données de test
INSERT OR IGNORE INTO users (name, email, password, phone, location, farm_name, subscription_plan) VALUES
('Jean Mballa', 'jean@ecoloop.cm', 'password123', '+237677123456', 'Yaoundé', 'Ferme Mballa', 'free'),
('Marie Nguema', 'marie@ecoloop.cm', 'password123', '+237699234567', 'Douala', 'Élevage Nguema', 'pro'),
('Paul Biya', 'paul@ecoloop.cm', 'password123', '+237655345678', 'Bafoussam', 'Poulets des Hauts Plateaux', 'premium');

-- Insertion de lots de demonstration
INSERT OR IGNORE INTO flocks (user_id, name, breed, initial_count, current_count, hatch_date, expected_slaughter_date, status) VALUES
(1, 'Lot Mars 2024', 'Cobb 500', 500, 485, '2024-03-01', '2024-04-30', 'active'),
(1, 'Lot Février 2024', 'Ross 308', 300, 0, '2024-02-01', '2024-03-30', 'completed'),
(2, 'Lot Production A', 'Hubbard Classic', 1000, 970, '2024-03-15', '2024-05-15', 'active'),
(3, 'Lot Premium 1', 'Cobb 500', 2000, 1950, '2024-03-20', '2024-05-20', 'active');

-- Insertion de données de production
INSERT OR IGNORE INTO daily_production (flock_id, date, mortality, weight_sample_count, average_weight, feed_consumed_kg, water_consumed_liters, temperature_celsius, humidity_percent) VALUES
(1, '2024-04-01', 2, 50, 1.85, 950.5, 1200.0, 28.5, 65.0),
(1, '2024-04-02', 1, 50, 1.92, 965.2, 1180.0, 29.0, 62.0),
(3, '2024-04-01', 5, 100, 1.75, 1890.0, 2400.0, 27.8, 68.0),
(4, '2024-04-01', 3, 150, 1.95, 3750.0, 4800.0, 28.2, 64.0);

-- Insertion de transactions financières
INSERT OR IGNORE INTO financial_transactions (user_id, flock_id, type, category, description, amount, transaction_date, supplier_buyer) VALUES
(1, 1, 'expense', 'feed', 'Aliment starter 50 sacs', -750000, '2024-03-01', 'CAMVERT'),
(1, 1, 'expense', 'medication', 'Vaccins Newcastle + Gumboro', -45000, '2024-03-05', 'LANAVET'),
(1, 2, 'income', 'sales', 'Vente 280 poulets à 2500 FCFA', 700000, '2024-03-30', 'Marché Central Yaoundé'),
(2, 3, 'expense', 'feed', 'Aliment croissance 80 sacs', -1200000, '2024-03-15', 'CAMVERT'),
(3, 4, 'expense', 'equipment', 'Système de chauffage automatique', -450000, '2024-03-20', 'AgriTech Cameroun');

-- Insertion d'alertes
INSERT OR IGNORE INTO alerts (user_id, flock_id, type, severity, title, message) VALUES
(1, 1, 'health', 'medium', 'Mortalité légèrement élevée', 'Le taux de mortalité de 0.4% dépasse la normale de 0.2%'),
(2, 3, 'environment', 'high', 'Température élevée détectée', 'Température de 32°C mesurée dans le poulailler A'),
(3, 4, 'feed', 'low', 'Stock d aliment faible', 'Il reste 3 jours d aliment en stock');

-- Insertion de données de santé
INSERT OR IGNORE INTO health_records (flock_id, type, product_name, dosage, administration_date, cost, next_due_date) VALUES
(1, 'vaccination', 'Newcastle + Gumboro', '0.3ml par poussins', '2024-03-08', 25000, '2024-04-08'),
(1, 'vaccination', 'Rappel Newcastle', '0.5ml par poulet', '2024-03-22', 18000, NULL),
(3, 'vaccination', 'Newcastle + Gumboro', '0.3ml par poussins', '2024-03-22', 40000, '2024-04-22'),
(4, 'medication', 'Antibiotique préventif', '1g/L eau de boisson', '2024-03-25', 35000, NULL);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_flocks_user_id ON flocks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_production_flock_date ON daily_production(flock_id, date);
CREATE INDEX IF NOT EXISTS idx_financial_user_date ON financial_transactions(user_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_alerts_user_unread ON alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category, created_at);
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp);
