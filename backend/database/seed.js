import { getDatabase } from './init.js'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  const db = await getDatabase()

  try {
    console.log('🌱 Ajout des données de démonstration...')

    // Hash passwords
    const userPasswordHash = await bcrypt.hash('demo123', 12)
    const adminPasswordHash = await bcrypt.hash('admin123', 12)

    // Create demo users
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO users 
        (id, first_name, last_name, email, password_hash, city, role, subscription)
        VALUES 
        (1, 'Jean', 'Dupont', 'user@demo.com', ?, 'yaounde', 'user', 'pro'),
        (2, 'Admin', 'Ecoloop', 'admin@demo.com', ?, 'douala', 'admin', 'premium')
      `, [userPasswordHash, adminPasswordHash], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Training content
    const trainingContent = [
      {
        category: 'breeding',
        title_fr: 'Introduction à l\'élevage de volaille',
        title_en: 'Introduction to Poultry Farming',
        summary_fr: 'Les bases essentielles pour commencer l\'élevage de poulets de chair',
        summary_en: 'Essential basics for starting broiler chicken farming',
        content_fr: 'L\'élevage de volaille est une activité agricole rentable qui nécessite des connaissances techniques précises. Ce guide vous accompagne dans les premiers pas.',
        content_en: 'Poultry farming is a profitable agricultural activity that requires precise technical knowledge. This guide accompanies you in the first steps.',
        is_premium: false
      },
      {
        category: 'housing',
        title_fr: 'Construction du poulailler',
        title_en: 'Building the Chicken Coop',
        summary_fr: 'Guide complet pour construire un poulailler adapté au climat camerounais',
        summary_en: 'Complete guide to building a chicken coop adapted to the Cameroonian climate',
        content_fr: 'Un bon poulailler doit être bien ventilé, protégé des prédateurs et adapté à la taille de votre cheptel.',
        content_en: 'A good chicken coop must be well ventilated, protected from predators and adapted to the size of your flock.',
        is_premium: false
      },
      {
        category: 'feeding',
        title_fr: 'Alimentation des poulets de chair',
        title_en: 'Feeding Broiler Chickens',
        summary_fr: 'Programme alimentaire optimal pour maximiser la croissance',
        summary_en: 'Optimal feeding program to maximize growth',
        content_fr: 'L\'alimentation représente 65-70% des coûts de production. Une ration équilibrée est cruciale.',
        content_en: 'Feed represents 65-70% of production costs. A balanced ration is crucial.',
        is_premium: true
      }
    ]

    for (const content of trainingContent) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO training_content 
          (category, title_fr, title_en, summary_fr, summary_en, content_fr, content_en, is_premium)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          content.category, content.title_fr, content.title_en,
          content.summary_fr, content.summary_en,
          content.content_fr, content.content_en, content.is_premium
        ], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    // Diseases data
    const diseases = [
      {
        name_fr: 'Maladie de Newcastle',
        name_en: 'Newcastle Disease',
        category: 'virale',
        symptoms_early_fr: 'Diminution de l\'appétit, abattement général, respiration difficile',
        symptoms_early_en: 'Decreased appetite, general depression, difficult breathing',
        symptoms_advanced_fr: 'Diarrhée verdâtre, paralysie, torticolis, convulsions',
        symptoms_advanced_en: 'Greenish diarrhea, paralysis, torticollis, convulsions',
        treatment_fr: 'Aucun traitement curatif - Vaccination préventive obligatoire',
        treatment_en: 'No curative treatment - Preventive vaccination mandatory',
        prevention_fr: 'Vaccination NDV à J1, J7, J21',
        prevention_en: 'NDV vaccination at D1, D7, D21',
        cost_fcfa: 50,
        phases_at_risk: 'démarrage,croissance',
        severity: 'high'
      },
      {
        name_fr: 'Coccidiose',
        name_en: 'Coccidiosis',
        category: 'parasitaire',
        symptoms_early_fr: 'Diarrhée légère, plumes ébouriffées, croissance ralentie',
        symptoms_early_en: 'Mild diarrhea, ruffled feathers, stunted growth',
        symptoms_advanced_fr: 'Diarrhée sanglante, anémie, déshydratation sévère',
        symptoms_advanced_en: 'Bloody diarrhea, anemia, severe dehydration',
        treatment_fr: 'Sulfamides, Amprolium 20% - 1g/L d\'eau pendant 5-7 jours',
        treatment_en: 'Sulfonamides, Amprolium 20% - 1g/L water for 5-7 days',
        prevention_fr: 'Coccidiostatiques dans l\'aliment, hygiène rigoureuse',
        prevention_en: 'Coccidiostats in feed, strict hygiene',
        cost_fcfa: 2500,
        phases_at_risk: 'démarrage,croissance',
        severity: 'medium'
      }
    ]

    for (const disease of diseases) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO diseases 
          (name_fr, name_en, category, symptoms_early_fr, symptoms_early_en,
           symptoms_advanced_fr, symptoms_advanced_en, treatment_fr, treatment_en,
           prevention_fr, prevention_en, cost_fcfa, phases_at_risk, severity)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          disease.name_fr, disease.name_en, disease.category,
          disease.symptoms_early_fr, disease.symptoms_early_en,
          disease.symptoms_advanced_fr, disease.symptoms_advanced_en,
          disease.treatment_fr, disease.treatment_en,
          disease.prevention_fr, disease.prevention_en,
          disease.cost_fcfa, disease.phases_at_risk, disease.severity
        ], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    // Vaccination schedule
    const vaccinations = [
      {
        day: 1,
        vaccine_name: 'NDV (Newcastle)',
        disease_target: 'Maladie de Newcastle',
        administration_method: 'Gouttes oculaires',
        dosage: '1 goutte/poussin',
        cost_fcfa: 50,
        notes_fr: 'Vaccination obligatoire dès l\'arrivée des poussins',
        notes_en: 'Mandatory vaccination upon arrival of chicks',
        is_mandatory: true
      },
      {
        day: 7,
        vaccine_name: 'Gumboro',
        disease_target: 'Bursite infectieuse',
        administration_method: 'Eau de boisson',
        dosage: '1 dose/1000 poussins',
        cost_fcfa: 75,
        notes_fr: 'Vaccination critique pour l\'immunité',
        notes_en: 'Critical vaccination for immunity',
        is_mandatory: true
      },
      {
        day: 14,
        vaccine_name: 'IBD (Gumboro rappel)',
        disease_target: 'Bursite infectieuse',
        administration_method: 'Eau de boisson',
        dosage: '1 dose/1000 poussins',
        cost_fcfa: 75,
        notes_fr: 'Rappel pour renforcer l\'immunité',
        notes_en: 'Booster to strengthen immunity',
        is_mandatory: true
      },
      {
        day: 21,
        vaccine_name: 'NDV (Rappel)',
        disease_target: 'Maladie de Newcastle',
        administration_method: 'Eau de boisson',
        dosage: '1 dose/1000 poussins',
        cost_fcfa: 50,
        notes_fr: 'Rappel recommandé selon la situation',
        notes_en: 'Booster recommended depending on situation',
        is_mandatory: false
      }
    ]

    for (const vaccination of vaccinations) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO vaccination_schedule 
          (day, vaccine_name, disease_target, administration_method, dosage,
           cost_fcfa, notes_fr, notes_en, is_mandatory)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          vaccination.day, vaccination.vaccine_name, vaccination.disease_target,
          vaccination.administration_method, vaccination.dosage, vaccination.cost_fcfa,
          vaccination.notes_fr, vaccination.notes_en, vaccination.is_mandatory
        ], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    // Forum categories
    const forumCategories = [
      {
        name_fr: 'Questions Générales',
        name_en: 'General Questions',
        description_fr: 'Questions générales sur l\'élevage de volaille',
        description_en: 'General questions about poultry farming',
        color: '#548C2F'
      },
      {
        name_fr: 'Problèmes Sanitaires',
        name_en: 'Health Issues',
        description_fr: 'Discussions sur les maladies et traitements',
        description_en: 'Discussions about diseases and treatments',
        color: '#F9A620'
      },
      {
        name_fr: 'Business & Ventes',
        name_en: 'Business & Sales',
        description_fr: 'Conseils business et commercialisation',
        description_en: 'Business advice and marketing',
        color: '#FFD449'
      }
    ]

    for (const category of forumCategories) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO forum_categories 
          (name_fr, name_en, description_fr, description_en, color)
          VALUES (?, ?, ?, ?, ?)
        `, [
          category.name_fr, category.name_en,
          category.description_fr, category.description_en, category.color
        ], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    console.log('✅ Données de démonstration ajoutées avec succès')
  } finally {
    db.close()
  }
}

// Run seed if called directly
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().catch(console.error)
}
