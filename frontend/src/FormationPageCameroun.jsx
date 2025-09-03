import React, { useState } from 'react'

function FormationPageCameroun({ user, onBack, darkMode = false, language = 'FR' }) {
  const [currentCourse, setCurrentCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [quizMode, setQuizMode] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState({})
  const [showRating, setShowRating] = useState(false)
  const [courseRatings, setCourseRatings] = useState({})

  // Palette de couleurs camerounaise
  const colors = {
    lightBlue: '#A8D5E2',
    orangeWeb: '#F9A620',
    mustard: '#FFD449',
    forestGreen: '#548C2F',
    pakistanGreen: '#104911',
    softBeige: '#F2EFE5'
  }

  const theme = {
    background: colors.softBeige,
    cardBg: '#ffffff',
    primaryGreen: colors.forestGreen,
    darkGreen: colors.pakistanGreen,
    accent: colors.orangeWeb,
    secondary: colors.lightBlue,
    highlight: colors.orangeWeb,
    textPrimary: colors.pakistanGreen,
    textSecondary: '#555555'
  }

  // Traductions
  const translations = {
    FR: {
      backToDashboard: 'Retour au tableau de bord',
      formationTitle: 'Formation Élevage Poulet de Chair - Cameroun',
      searchPlaceholder: 'Rechercher dans les cours...',
      startQuiz: 'Commencer le Quiz',
      submitQuiz: 'Soumettre le Quiz',
      rateCourse: 'Noter ce cours',
      downloadSheet: 'Télécharger la fiche',
      free: 'Gratuit',
      duration: 'Durée',
      level: 'Niveau',
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé'
    },
    EN: {
      backToDashboard: 'Back to Dashboard',
      formationTitle: 'Broiler Farming Training - Cameroon',
      searchPlaceholder: 'Search in courses...',
      startQuiz: 'Start Quiz',
      submitQuiz: 'Submit Quiz',
      rateCourse: 'Rate this course',
      downloadSheet: 'Download sheet',
      free: 'Free',
      duration: 'Duration',
      level: 'Level',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    }
  }

  const t = translations[language]

  // Cours détaillés pour le Cameroun
  const courses = [
    {
      id: 1,
      title: 'Les Phases d\'Exploitation du Poulet de Chair',
      description: 'Guide complet des phases d\'élevage des poulets de chair au Cameroun',
      duration: '45 min',
      level: 'beginner',
      icon: '🐣',
      content: {
        introduction: 'L\'élevage de poulet de chair au Cameroun suit des phases bien définies pour optimiser la production.',
        phases: [
          {
            name: 'Phase de Démarrage (0-10 jours)',
            description: 'Période critique nécessitant une attention particulière',
            details: [
              'Température: 32-35°C (diminuer de 2-3°C par semaine)',
              'Densité: 25-30 poussins/m²',
              'Éclairage: 23h de lumière, 1h d\'obscurité',
              'Vaccination: Vaccin Newcastle + Gumboro au 1er jour'
            ],
            souchesRecommandees: [
              {
                nom: 'Cobb 500',
                caracteristiques: 'Croissance rapide, bon indice de consommation',
                prix: '450-500 FCFA/poussin',
                fournisseur: 'SODEPA, MAISCAM'
              },
              {
                nom: 'Ross 308',
                caracteristiques: 'Résistant, adapté au climat tropical',
                prix: '400-450 FCFA/poussin',
                fournisseur: 'SOSUCAM, CICAM'
              },
              {
                nom: 'Arbor Acres',
                caracteristiques: 'Très bonne conversion alimentaire',
                prix: '480-520 FCFA/poussin',
                fournisseur: 'UNVDA, Fermes du Cameroun'
              }
            ]
          },
          {
            name: 'Phase de Croissance (11-24 jours)',
            description: 'Développement rapide des organes et du squelette',
            details: [
              'Température: 27-30°C',
              'Densité: 20-25 poulets/m²',
              'Éclairage: Réduire progressivement à 18h',
              'Contrôle sanitaire renforcé'
            ]
          },
          {
            name: 'Phase de Finition (25-42 jours)',
            description: 'Développement musculaire et préparation à l\'abattage',
            details: [
              'Température: 24-27°C',
              'Densité: 15-20 poulets/m²',
              'Arrêt de l\'alimentation 12h avant abattage',
              'Poids moyen attendu: 2-2.5 kg'
            ]
          }
        ]
      },
      quiz: [
        {
          question: 'Quelle est la température idéale pour la phase de démarrage ?',
          options: ['25-28°C', '32-35°C', '38-40°C', '20-25°C'],
          correct: 1
        },
        {
          question: 'Combien de poussins par m² recommande-t-on en démarrage ?',
          options: ['15-20', '25-30', '35-40', '10-15'],
          correct: 1
        },
        {
          question: 'Quelle souche est réputée pour sa résistance au climat tropical ?',
          options: ['Cobb 500', 'Ross 308', 'Arbor Acres', 'Hubbard'],
          correct: 1
        }
      ]
    },
    {
      id: 2,
      title: 'Équipements Nécessaires pour l\'Élevage',
      description: 'Matériel et équipements indispensables pour un élevage moderne',
      duration: '35 min',
      level: 'intermediate',
      icon: '🔧',
      content: {
        introduction: 'Un élevage moderne nécessite des équipements adaptés au climat camerounais.',
        equipements: [
          {
            categorie: 'Abreuvement',
            items: [
              {
                nom: 'Abreuvoirs linéaires',
                description: 'Pour les poussins de 0-10 jours',
                prix: '15,000-25,000 FCFA/unité',
                image: '/images/abreuvoir-lineaire.jpg',
                fournisseur: 'AGRO-EQUIPEMENTS Yaoundé'
              },
              {
                nom: 'Abreuvoirs nipples',
                description: 'Système automatique pour adultes',
                prix: '2,500-3,500 FCFA/nipple',
                image: '/images/nipple.jpg',
                fournisseur: 'TECNAVI Douala'
              }
            ]
          },
          {
            categorie: 'Alimentation',
            items: [
              {
                nom: 'Mangeoires circulaires',
                description: 'Réglables en hauteur',
                prix: '12,000-18,000 FCFA/unité',
                image: '/images/mangeoire-circulaire.jpg',
                fournisseur: 'SODEPA'
              },
              {
                nom: 'Chaîne d\'alimentation',
                description: 'Système automatisé',
                prix: '250,000-350,000 FCFA/100m',
                image: '/images/chaine-alimentation.jpg',
                fournisseur: 'AGRO-TECH Bafoussam'
              }
            ]
          },
          {
            categorie: 'Chauffage',
            items: [
              {
                nom: 'Radiant à gaz',
                description: 'Chauffage localisé pour poussins',
                prix: '45,000-65,000 FCFA/unité',
                image: '/images/radiant-gaz.jpg',
                fournisseur: 'CLIMACAM'
              },
              {
                nom: 'Éleveuse électrique',
                description: 'Alternative économique',
                prix: '35,000-50,000 FCFA/unité',
                image: '/images/eleveuse-electrique.jpg',
                fournisseur: 'ELECTRO-AGRI'
              }
            ]
          }
        ]
      },
      quiz: [
        {
          question: 'Quel type d\'abreuvoir est recommandé pour les poussins ?',
          options: ['Nipples', 'Abreuvoirs linéaires', 'Bacs', 'Fontaines'],
          correct: 1
        },
        {
          question: 'Quel est le prix moyen d\'un radiant à gaz ?',
          options: ['25,000-35,000 FCFA', '45,000-65,000 FCFA', '80,000-100,000 FCFA', '15,000-25,000 FCFA'],
          correct: 1
        }
      ]
    },
    {
      id: 3,
      title: 'Alimentation par Phase',
      description: 'Programmes alimentaires adaptés à chaque phase de croissance',
      duration: '50 min',
      level: 'intermediate',
      icon: '🌾',
      content: {
        introduction: 'Une alimentation équilibrée est cruciale pour la performance des poulets de chair.',
        phases: [
          {
            nom: 'Aliment Pré-démarrage (0-7 jours)',
            composition: {
              protéines: '23-24%',
              énergie: '3000-3100 Kcal/kg',
              lysine: '1.4%',
              methionine: '0.5%',
              calcium: '1%',
              phosphore: '0.7%'
            },
            ingredients: [
              'Maïs: 55-60%',
              'Tourteau de soja: 25-30%',
              'Concentré protéique de poisson: 5%',
              'Huile de palme: 3-4%',
              'Prémix vitamines-minéraux: 0.5%',
              'Lysine: 0.2%',
              'Méthionine: 0.1%'
            ],
            prix: '280-320 FCFA/kg',
            fabricants: ['PROVENDERIES DU CAMEROUN', 'SOCACAM', 'AGROCAM']
          },
          {
            nom: 'Aliment Démarrage (8-21 jours)',
            composition: {
              protéines: '21-22%',
              énergie: '3100-3150 Kcal/kg',
              lysine: '1.2%',
              methionine: '0.45%',
              calcium: '0.9%',
              phosphore: '0.65%'
            },
            ingredients: [
              'Maïs: 58-62%',
              'Tourteau de soja: 22-27%',
              'Farine de poisson: 3%',
              'Huile de palme: 4-5%',
              'Prémix: 0.5%'
            ],
            prix: '260-300 FCFA/kg'
          },
          {
            nom: 'Aliment Croissance (22-35 jours)',
            composition: {
              protéines: '19-20%',
              énergie: '3150-3200 Kcal/kg',
              lysine: '1.1%',
              methionine: '0.4%',
              calcium: '0.85%',
              phosphore: '0.6%'
            },
            prix: '240-280 FCFA/kg'
          },
          {
            nom: 'Aliment Finition (36-42 jours)',
            composition: {
              protéines: '18-19%',
              énergie: '3200-3250 Kcal/kg',
              lysine: '1.0%',
              methionine: '0.38%',
              calcium: '0.8%',
              phosphore: '0.55%'
            },
            prix: '230-270 FCFA/kg'
          }
        ]
      },
      quiz: [
        {
          question: 'Quel taux de protéines pour l\'aliment pré-démarrage ?',
          options: ['18-19%', '21-22%', '23-24%', '25-26%'],
          correct: 2
        },
        {
          question: 'Quel est l\'ingrédient principal dans tous les aliments ?',
          options: ['Tourteau de soja', 'Maïs', 'Farine de poisson', 'Huile de palme'],
          correct: 1
        }
      ]
    },
    {
      id: 4,
      title: 'Programme Vaccinal Détaillé',
      description: 'Vaccinations obligatoires et recommandées au Cameroun',
      duration: '40 min',
      level: 'intermediate',
      icon: '💉',
      content: {
        introduction: 'La vaccination est obligatoire au Cameroun selon les directives du MINEPIA.',
        calendrier: [
          {
            age: 'J1 (écloserie)',
            vaccins: [
              {
                nom: 'Newcastle + Gumboro',
                type: 'Vivant atténué',
                voie: 'Oculaire/nasale',
                prix: '25-35 FCFA/dose',
                image: '/images/vaccin-newcastle.jpg',
                importance: 'Protection contre les maladies virales mortelles',
                fournisseur: 'LABOREX, VETOCAM'
              }
            ]
          },
          {
            age: 'J7-10',
            vaccins: [
              {
                nom: 'Gumboro (IBD)',
                type: 'Vivant atténué',
                voie: 'Eau de boisson',
                prix: '30-40 FCFA/dose',
                image: '/images/vaccin-gumboro.jpg',
                importance: 'Renforcement immunité contre Gumboro'
              }
            ]
          },
          {
            age: 'J14-16',
            vaccins: [
              {
                nom: 'Newcastle La Sota',
                type: 'Vivant atténué',
                voie: 'Eau de boisson/spray',
                prix: '20-30 FCFA/dose',
                image: '/images/lasota.jpg',
                importance: 'Rappel Newcastle obligatoire'
              }
            ]
          },
          {
            age: 'J21-24',
            vaccins: [
              {
                nom: 'Gumboro intermédiaire',
                type: 'Vivant atténué',
                voie: 'Eau de boisson',
                prix: '35-45 FCFA/dose',
                importance: 'Protection finale contre Gumboro'
              }
            ]
          },
          {
            age: 'J28-30',
            vaccins: [
              {
                nom: 'Newcastle inactivé',
                type: 'Inactivé',
                voie: 'Injection sous-cutanée',
                prix: '50-70 FCFA/dose',
                importance: 'Immunité prolongée (facultatif pour chair)'
              }
            ]
          }
        ],
        bonnesPratiques: [
          'Respecter la chaîne du froid (2-8°C)',
          'Utiliser de l\'eau pure sans chlore',
          'Vacciner tôt le matin ou tard le soir',
          'Tenir un registre de vaccination',
          'Faire appel à un vétérinaire agréé'
        ]
      },
      quiz: [
        {
          question: 'À quel âge donne-t-on le premier vaccin Newcastle ?',
          options: ['J7', 'J1', 'J14', 'J21'],
          correct: 1
        },
        {
          question: 'Quelle voie pour le vaccin Gumboro ?',
          options: ['Injection', 'Eau de boisson', 'Spray', 'Cutanée'],
          correct: 1
        }
      ]
    },
    {
      id: 5,
      title: 'Maladies et Traitements',
      description: 'Principales pathologies et leurs traitements au Cameroun',
      duration: '60 min',
      level: 'advanced',
      icon: '🏥',
      content: {
        introduction: 'Identification et traitement des principales maladies aviaires au Cameroun.',
        maladies: [
          {
            nom: 'Maladie de Newcastle',
            symptomes: [
              'Troubles respiratoires (éternuements, râles)',
              'Troubles nerveux (torticolis, paralysie)',
              'Diarrhée verdâtre',
              'Chute brutale de ponte',
              'Mortalité élevée (jusqu\'à 100%)'
            ],
            traitement: {
              curatif: 'Aucun traitement curatif efficace',
              preventif: 'Vaccination obligatoire',
              mesures: [
                'Isolement immédiat des malades',
                'Désinfection complète',
                'Déclaration obligatoire aux services vétérinaires',
                'Abattage sanitaire si nécessaire'
              ]
            },
            medicaments: [],
            cout: 'Perte totale du cheptel'
          },
          {
            nom: 'Coccidiose',
            symptomes: [
              'Diarrhée sanguinolente',
              'Abattement généralisé',
              'Plumes ébouriffées',
              'Retard de croissance',
              'Mortalité modérée (5-20%)'
            ],
            traitement: {
              curatif: 'Anticoccidiens',
              preventif: 'Anticoccidiens préventifs dans l\'aliment',
              medicaments: [
                {
                  nom: 'Amprolium',
                  dosage: '1g/L d\'eau pendant 5 jours',
                  prix: '2,500-3,500 FCFA/100g',
                  fournisseur: 'PHARMAVETO'
                },
                {
                  nom: 'Sulfamides',
                  dosage: '0.5g/L d\'eau pendant 3 jours',
                  prix: '4,000-5,500 FCFA/250g',
                  fournisseur: 'VETOCAM'
                }
              ]
            }
          },
          {
            nom: 'Colibacillose',
            symptomes: [
              'Diarrhée jaunâtre',
              'Déshydratation',
              'Perte d\'appétit',
              'Retard de croissance',
              'Inflammation du sac vitellin chez poussins'
            ],
            traitement: {
              curatif: 'Antibiotiques après antibiogramme',
              medicaments: [
                {
                  nom: 'Enrofloxacine',
                  dosage: '10mg/kg pendant 5 jours',
                  prix: '8,000-12,000 FCFA/100ml',
                  fournisseur: 'LABOREX'
                },
                {
                  nom: 'Colistine',
                  dosage: '100,000 UI/L d\'eau',
                  prix: '6,500-8,500 FCFA/100g',
                  fournisseur: 'PHARMAVETO'
                }
              ]
            }
          }
        ]
      },
      quiz: [
        {
          question: 'Quel est le principal symptôme de la maladie de Newcastle ?',
          options: ['Diarrhée rouge', 'Troubles nerveux', 'Perte de plumes', 'Boiterie'],
          correct: 1
        },
        {
          question: 'Quel médicament pour traiter la coccidiose ?',
          options: ['Enrofloxacine', 'Amprolium', 'Colistine', 'Pénicilline'],
          correct: 1
        }
      ]
    },
    {
      id: 6,
      title: 'Systèmes de Chauffage',
      description: 'Solutions de chauffage adaptées au climat camerounais',
      duration: '30 min',
      level: 'intermediate',
      icon: '🔥',
      content: {
        introduction: 'Le chauffage est essentiel les premières semaines, même en climat tropical.',
        systemes: [
          {
            type: 'Chauffage au gaz',
            description: 'Solution la plus répandue au Cameroun',
            avantages: [
              'Chaleur homogène',
              'Facile à régler',
              'Fiable',
              'Économique à l\'usage'
            ],
            inconvenients: [
              'Coût d\'installation élevé',
              'Nécessite du gaz',
              'Entretien régulier'
            ],
            equipements: [
              {
                nom: 'Radiant à gaz infrarouge',
                capacite: '500-1000 poussins',
                prix: '65,000-85,000 FCFA',
                consommation: '0.8-1.2 kg gaz/jour'
              }
            ]
          },
          {
            type: 'Chauffage électrique',
            description: 'Alternative en cas de coupures fréquentes',
            equipements: [
              {
                nom: 'Éleveuse électrique',
                capacite: '200-500 poussins',
                prix: '45,000-65,000 FCFA',
                consommation: '1.5-2.5 kW/h'
              }
            ]
          },
          {
            type: 'Chauffage à biomasse',
            description: 'Solution écologique et économique',
            combustibles: [
              'Coques de cacao',
              'Sciure de bois',
              'Balles de riz'
            ],
            prix: '35,000-55,000 FCFA'
          }
        ]
      },
      quiz: [
        {
          question: 'Quel type de chauffage est le plus répandu ?',
          options: ['Électrique', 'Gaz', 'Biomasse', 'Solaire'],
          correct: 1
        }
      ]
    },
    {
      id: 7,
      title: 'Litière et Aménagement du Sol',
      description: 'Choix et gestion de la litière pour un environnement sain',
      duration: '35 min',
      level: 'beginner',
      icon: '🏠',
      content: {
        introduction: 'Une bonne litière est essentielle pour la santé et le confort des volailles.',
        types: [
          {
            nom: 'Copeaux de bois',
            avantages: [
              'Très absorbant',
              'Disponible localement',
              'Bon isolant thermique',
              'Facile à manipuler'
            ],
            inconvenients: [
              'Plus coûteux',
              'Risque de moisissures'
            ],
            prix: '1,500-2,500 FCFA/sac de 50kg',
            epaisseur: '8-10 cm',
            fournisseurs: ['Scieries de Yaoundé', 'SCIERIE FORESTIERE']
          },
          {
            nom: 'Balles de riz',
            avantages: [
              'Très économique',
              'Excellent drainage',
              'Disponible en zone rizicole',
              'Biodégradable'
            ],
            prix: '800-1,200 FCFA/sac de 50kg',
            epaisseur: '10-12 cm',
            zones: 'Nord Cameroun, Yagoua, Maga'
          },
          {
            nom: 'Rafles de maïs broyées',
            avantages: [
              'Économique',
              'Bonne absorption',
              'Disponible partout'
            ],
            prix: '600-1,000 FCFA/sac de 50kg',
            epaisseur: '8-10 cm'
          }
        ],
        gestion: [
          'Retourner quotidiennement',
          'Éliminer les zones humides',
          'Ajouter de la litière fraîche si nécessaire',
          'Changement complet entre bandes',
          'Compostage pour réutilisation agricole'
        ]
      },
      quiz: [
        {
          question: 'Quelle épaisseur pour les copeaux de bois ?',
          options: ['5-6 cm', '8-10 cm', '12-15 cm', '15-20 cm'],
          correct: 1
        }
      ]
    },
    {
      id: 8,
      title: 'Fournisseurs Agréés de Poussins',
      description: 'Liste des fournisseurs officiels au Cameroun',
      duration: '25 min',
      level: 'beginner',
      icon: '🏢',
      content: {
        introduction: 'Fournisseurs agréés par le MINEPIA pour la commercialisation de poussins.',
        fournisseurs: [
          {
            nom: 'SODEPA (Société de Développement de l\'Aviculture)',
            localisation: 'Yaoundé - Nkolbisson',
            contact: '+237 222 23 45 67',
            souches: ['Cobb 500', 'Ross 308'],
            prix: '450-500 FCFA/poussin',
            capacite: '50,000 poussins/semaine',
            agrement: 'MINEPIA N°001/2020'
          },
          {
            nom: 'MAISCAM',
            localisation: 'Douala - Bonabéri',
            contact: '+237 233 42 15 89',
            souches: ['Cobb 500', 'Arbor Acres'],
            prix: '480-520 FCFA/poussin',
            capacite: '30,000 poussins/semaine',
            agrement: 'MINEPIA N°003/2021'
          },
          {
            nom: 'FERMES DU CAMEROUN',
            localisation: 'Bafoussam',
            contact: '+237 233 44 32 10',
            souches: ['Ross 308', 'Hubbard'],
            prix: '420-470 FCFA/poussin',
            capacite: '25,000 poussins/semaine',
            agrement: 'MINEPIA N°005/2021'
          },
          {
            nom: 'UNVDA (Union Nationale des Volaillers)',
            localisation: 'Garoua',
            contact: '+237 222 27 15 43',
            souches: ['Arbor Acres', 'Cobb 500'],
            prix: '400-450 FCFA/poussin',
            capacite: '20,000 poussins/semaine',
            zone: 'Grand Nord'
          }
        ]
      },
      quiz: [
        {
          question: 'Quel fournisseur est basé à Bafoussam ?',
          options: ['SODEPA', 'MAISCAM', 'FERMES DU CAMEROUN', 'UNVDA'],
          correct: 2
        }
      ]
    },
    {
      id: 9,
      title: 'Fiche de Prophylaxie Complète',
      description: 'Programme sanitaire détaillé selon les normes camerounaises',
      duration: '45 min',
      level: 'advanced',
      icon: '📋',
      content: {
        introduction: 'Fiche prophylaxique conforme aux exigences du MINEPIA.',
        programme: {
          'Pre-mise en place': [
            'Nettoyage et désinfection des bâtiments',
            'Vide sanitaire de 15 jours minimum',
            'Contrôle des équipements',
            'Test d\'étanchéité des abreuvoirs',
            'Vérification du système de chauffage'
          ],
          'J-1': [
            'Mise en température (32-35°C)',
            'Préparation de l\'eau de boisson',
            'Distribution de l\'aliment pré-démarrage',
            'Éclairage 24h/24'
          ],
          'J0': [
            'Réception des poussins',
            'Contrôle qualité (vivacité, nombril cicatrisé)',
            'Vaccination Newcastle + Gumboro',
            'Mise en éleveuse'
          ],
          'J1-J7': [
            'Surveillance température (32°C)',
            'Distribution eau + glucose (50g/L) 1er jour',
            'Aliment à volonté',
            'Élimination des morts',
            'Pesée échantillon (J7)'
          ],
          'J8-J14': [
            'Réduction température (29°C)',
            'Vaccination Gumboro (J10)',
            'Changement vers aliment démarrage',
            'Nettoyage des abreuvoirs'
          ],
          'J15-J21': [
            'Température 27°C',
            'Vaccination Newcastle La Sota (J16)',
            'Changement mangeoires',
            'Pesée contrôle (J21)'
          ],
          'J22-J35': [
            'Température 24°C',
            'Aliment croissance',
            'Vaccination Gumboro intermédiaire (J24)',
            'Surveillance sanitaire renforcée'
          ],
          'J36-J42': [
            'Aliment finition',
            'Arrêt des traitements 5 jours avant abattage',
            'Pesée finale (J42)',
            'Préparation à l\'enlèvement'
          ]
        },
        registres: [
          'Registre de mortalité quotidienne',
          'Registre de vaccination',
          'Registre de pesée',
          'Registre de consommation aliment/eau',
          'Registre de température'
        ]
      },
      quiz: [
        {
          question: 'Durée minimum du vide sanitaire ?',
          options: ['7 jours', '10 jours', '15 jours', '21 jours'],
          correct: 2
        }
      ]
    }
  ]

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex
    })
  }

  const submitQuiz = () => {
    const quiz = currentQuiz
    let score = 0
    quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        score++
      }
    })
    const percentage = Math.round((score / quiz.length) * 100)
    setQuizResults({
      ...quizResults,
      [currentCourse.id]: { score, total: quiz.length, percentage }
    })
    setQuizMode(false)
    setShowRating(true)
  }

  const rateCourse = (courseId, rating) => {
    setCourseRatings({
      ...courseRatings,
      [courseId]: rating
    })
    setShowRating(false)
    alert('Merci pour votre évaluation !')
  }

  const downloadProphylaxieSheet = () => {
    // Simuler le téléchargement de la fiche
    const element = document.createElement('a')
    const file = new Blob(['FICHE DE PROPHYLAXIE - ÉLEVAGE POULET DE CHAIR CAMEROUN\n\nDocument conforme aux normes MINEPIA...'], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = 'fiche-prophylaxie-cameroun.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (quizMode && currentQuiz) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={() => setQuizMode(false)}
            style={{
              backgroundColor: theme.primaryGreen,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            ← Retour au cours
          </button>

          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: theme.textPrimary, marginBottom: '30px' }}>
              Quiz: {currentCourse.title}
            </h2>

            {currentQuiz.map((question, qIndex) => (
              <div key={qIndex} style={{ marginBottom: '25px' }}>
                <h4 style={{ color: theme.textPrimary, marginBottom: '15px' }}>
                  {qIndex + 1}. {question.question}
                </h4>
                {question.options.map((option, oIndex) => (
                  <label key={oIndex} style={{
                    display: 'block',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: quizAnswers[qIndex] === oIndex ? theme.secondary : '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}>
                    <input
                      type="radio"
                      name={`question_${qIndex}`}
                      value={oIndex}
                      onChange={() => handleQuizAnswer(qIndex, oIndex)}
                      style={{ marginRight: '10px' }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}

            <button
              onClick={submitQuiz}
              style={{
                backgroundColor: theme.accent,
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {t.submitQuiz}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentCourse) {
    const course = currentCourse
    const quizResult = quizResults[course.id]

    return (
      <div style={{ minHeight: '100vh', backgroundColor: theme.background, padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button
            onClick={() => setCurrentCourse(null)}
            style={{
              backgroundColor: theme.primaryGreen,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            ← Retour aux cours
          </button>

          <div style={{
            backgroundColor: theme.cardBg,
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '48px', marginRight: '20px' }}>{course.icon}</span>
              <div>
                <h1 style={{ color: theme.textPrimary, margin: 0, fontSize: '28px' }}>
                  {course.title}
                </h1>
                <p style={{ color: theme.textSecondary, margin: '5px 0' }}>
                  {course.description}
                </p>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <span style={{
                    backgroundColor: theme.secondary,
                    color: theme.darkGreen,
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px'
                  }}>
                    {t.duration}: {course.duration}
                  </span>
                  <span style={{
                    backgroundColor: theme.highlight,
                    color: theme.darkGreen,
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px'
                  }}>
                    {t.level}: {t[course.level]}
                  </span>
                  <span style={{
                    backgroundColor: theme.primaryGreen,
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px'
                  }}>
                    {t.free}
                  </span>
                </div>
              </div>
            </div>

            {/* Contenu du cours */}
            <div style={{
              backgroundColor: theme.background,
              padding: '25px',
              borderRadius: '10px',
              marginBottom: '25px'
            }}>
              <p style={{ color: theme.textSecondary, lineHeight: '1.6' }}>
                {course.content.introduction}
              </p>

              {course.content.phases && course.content.phases.map((phase, index) => (
                <div key={index} style={{ marginTop: '25px' }}>
                  <h3 style={{ color: theme.primaryGreen, marginBottom: '15px' }}>
                    {phase.name || phase.nom}
                  </h3>
                  <p style={{ color: theme.textSecondary, marginBottom: '15px' }}>
                    {phase.description}
                  </p>
                  {phase.details && (
                    <ul style={{ color: theme.textSecondary, marginLeft: '20px' }}>
                      {phase.details.map((detail, i) => (
                        <li key={i} style={{ marginBottom: '5px' }}>{detail}</li>
                      ))}
                    </ul>
                  )}
                  {phase.souchesRecommandees && (
                    <div style={{ marginTop: '15px' }}>
                      <h4 style={{ color: theme.darkGreen }}>Souches recommandées:</h4>
                      {phase.souchesRecommandees.map((souche, i) => (
                        <div key={i} style={{
                          backgroundColor: theme.cardBg,
                          padding: '15px',
                          borderRadius: '8px',
                          margin: '10px 0',
                          border: `2px solid ${theme.secondary}`
                        }}>
                          <h5 style={{ color: theme.primaryGreen, margin: '0 0 5px 0' }}>{souche.nom}</h5>
                          <p style={{ margin: '5px 0', fontSize: '14px' }}>{souche.caracteristiques}</p>
                          <p style={{ margin: '5px 0', fontWeight: 'bold', color: theme.accent }}>
                            Prix: {souche.prix}
                          </p>
                          <p style={{ margin: '0', fontSize: '12px', color: theme.textSecondary }}>
                            Fournisseur: {souche.fournisseur}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Contenu spécifique selon le type de cours */}
              {course.content.equipements && course.content.equipements.map((cat, index) => (
                <div key={index} style={{ marginTop: '25px' }}>
                  <h3 style={{ color: theme.primaryGreen }}>{cat.categorie}</h3>
                  {cat.items.map((item, i) => (
                    <div key={i} style={{
                      backgroundColor: theme.cardBg,
                      padding: '15px',
                      borderRadius: '8px',
                      margin: '10px 0',
                      border: `2px solid ${theme.highlight}`
                    }}>
                      <h4 style={{ color: theme.darkGreen }}>{item.nom}</h4>
                      <p>{item.description}</p>
                      <p style={{ fontWeight: 'bold', color: theme.accent }}>Prix: {item.prix}</p>
                      <p style={{ fontSize: '12px' }}>Fournisseur: {item.fournisseur}</p>
                    </div>
                  ))}
                </div>
              ))}

              {course.content.maladies && course.content.maladies.map((maladie, index) => (
                <div key={index} style={{ marginTop: '25px' }}>
                  <h3 style={{ color: '#dc2626' }}>{maladie.nom}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h4 style={{ color: theme.primaryGreen }}>Symptômes:</h4>
                      <ul>
                        {maladie.symptomes.map((symptome, i) => (
                          <li key={i}>{symptome}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ color: theme.primaryGreen }}>Traitement:</h4>
                      <p><strong>Curatif:</strong> {maladie.traitement.curatif}</p>
                      {maladie.traitement.medicaments && maladie.traitement.medicaments.map((med, i) => (
                        <div key={i} style={{
                          backgroundColor: theme.background,
                          padding: '10px',
                          borderRadius: '5px',
                          margin: '5px 0'
                        }}>
                          <strong>{med.nom}</strong><br/>
                          Dosage: {med.dosage}<br/>
                          Prix: {med.prix}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {!quizResult && (
                <button
                  onClick={() => {
                    setCurrentQuiz(course.quiz)
                    setQuizMode(true)
                    setQuizAnswers({})
                  }}
                  style={{
                    backgroundColor: theme.accent,
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🧠 {t.startQuiz}
                </button>
              )}

              {course.id === 9 && (
                <button
                  onClick={downloadProphylaxieSheet}
                  style={{
                    backgroundColor: theme.primaryGreen,
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  📥 {t.downloadSheet}
                </button>
              )}

              {quizResult && (
                <div style={{
                  backgroundColor: quizResult.percentage >= 70 ? '#059669' : '#dc2626',
                  color: 'white',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  fontWeight: 'bold'
                }}>
                  Quiz terminé: {quizResult.score}/{quizResult.total} ({quizResult.percentage}%)
                </div>
              )}
            </div>
          </div>

          {/* Système de notation */}
          {showRating && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: theme.cardBg,
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: theme.textPrimary, marginBottom: '20px' }}>
                  {t.rateCourse}
                </h3>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      onClick={() => rateCourse(currentCourse.id, star)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '30px',
                        cursor: 'pointer'
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background }}>
      {/* Header */}
      <header style={{
        backgroundColor: theme.cardBg,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={onBack}
              style={{
                backgroundColor: theme.primaryGreen,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← {t.backToDashboard}
            </button>
            
            <h1 style={{
              color: theme.textPrimary,
              margin: 0,
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              📚 {t.formationTitle}
            </h1>
            
            <div style={{ width: '120px' }}></div>
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '15px 20px',
            fontSize: '16px',
            border: `2px solid ${theme.secondary}`,
            borderRadius: '25px',
            backgroundColor: theme.cardBg,
            color: theme.textPrimary
          }}
        />
      </div>

      {/* Courses grid */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              style={{
                backgroundColor: theme.cardBg,
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: `3px solid ${theme.secondary}`,
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onClick={() => setCurrentCourse(course)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontSize: '28px'
              }}>
                {course.icon}
              </div>
              
              <h3 style={{
                color: theme.textPrimary,
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {course.title}
              </h3>
              
              <p style={{
                color: theme.textSecondary,
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                {course.description}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{
                  backgroundColor: theme.secondary,
                  color: theme.darkGreen,
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px'
                }}>
                  {t.duration}: {course.duration}
                </span>
                <span style={{
                  backgroundColor: theme.primaryGreen,
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px'
                }}>
                  {t.free}
                </span>
              </div>

              {quizResults[course.id] && (
                <div style={{
                  backgroundColor: quizResults[course.id].percentage >= 70 ? '#059669' : '#dc2626',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  Quiz: {quizResults[course.id].percentage}%
                </div>
              )}

              {courseRatings[course.id] && (
                <div style={{ marginTop: '10px' }}>
                  {'⭐'.repeat(courseRatings[course.id])}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default FormationPageCameroun
