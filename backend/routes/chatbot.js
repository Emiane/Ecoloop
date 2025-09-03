import express from 'express'
import { getDatabase } from '../database/init.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Base de connaissances pour le chatbot
const knowledgeBase = {
  fr: {
    greetings: [
      "Bonjour ! Je suis EcoBot, votre assistant virtuel spécialisé en élevage de volaille au Cameroun. Comment puis-je vous aider aujourd'hui ?",
      "Salut ! Je suis là pour répondre à vos questions sur l'élevage de poulets. Que souhaitez-vous savoir ?",
      "Bonsoir ! Je suis EcoBot, expert en aviculture. Posez-moi vos questions !"
    ],
    diseases: {
      "newcastle": {
        symptoms: "Les symptômes de la maladie de Newcastle incluent : diminution de l'appétit, difficultés respiratoires, diarrhée verdâtre, paralysie, convulsions.",
        treatment: "Il n'existe pas de traitement curatif. La prévention par vaccination est essentielle (NDV à J1, J7, J21).",
        prevention: "Vaccination obligatoire, désinfection régulière, quarantaine des nouveaux oiseaux."
      },
      "coccidiose": {
        symptoms: "La coccidiose se manifeste par : diarrhée (parfois sanglante), plumes ébouriffées, croissance ralentie, anémie.",
        treatment: "Sulfamides ou Amprolium 20% - 1g/L d'eau pendant 5-7 jours. Consulter un vétérinaire.",
        prevention: "Coccidiostatiques dans l'aliment, hygiène rigoureuse, éviter l'humidité excessive."
      },
      "gumboro": {
        symptoms: "Bursite infectieuse : abattement, diarrhée blanchâtre, mortalité soudaine chez les jeunes.",
        treatment: "Pas de traitement curatif. Vaccination préventive indispensable.",
        prevention: "Vaccination Gumboro à J7 et J14, désinfection, éviter le stress."
      }
    },
    feeding: {
      "starter": "Aliment démarrage (0-3 semaines) : 23% protéines, 3000 kcal/kg. Distribution ad libitum.",
      "grower": "Aliment croissance (4-6 semaines) : 20% protéines, 3100 kcal/kg.",
      "finisher": "Aliment finition (7+ semaines) : 18% protéines, 3200 kcal/kg.",
      "consumption": "Consommation approximative : 40-50g/jour à 3 semaines, 120-150g/jour à 6 semaines."
    },
    housing: {
      "space": "Densité recommandée : 10-12 poussins/m² en démarrage, 8-10 poulets/m² en finition.",
      "ventilation": "Ventilation cruciale au Cameroun. Minimum 4 air changes/heure. Éviter les courants d'air directs.",
      "temperature": "Température sous éleveuse : 35°C première semaine, puis -3°C/semaine jusqu'à 21°C.",
      "humidity": "Humidité relative idéale : 60-70%. Surveiller pendant la saison des pluies."
    },
    market: {
      "prices": "Prix moyens au Cameroun : Poussin 350-500 FCFA, Poulet vif 2500-3500 FCFA/kg selon la région.",
      "selling": "Âge d'abattage optimal : 6-8 semaines pour poulets de chair (1.8-2.5 kg).",
      "profit": "Marge bénéficiaire : 20-30% avec une bonne gestion. L'alimentation représente 65-70% des coûts."
    }
  },
  en: {
    greetings: [
      "Hello! I'm EcoBot, your virtual assistant specialized in poultry farming in Cameroon. How can I help you today?",
      "Hi! I'm here to answer your chicken farming questions. What would you like to know?",
      "Good evening! I'm EcoBot, poultry expert. Ask me your questions!"
    ],
    diseases: {
      "newcastle": {
        symptoms: "Newcastle disease symptoms include: decreased appetite, breathing difficulties, greenish diarrhea, paralysis, convulsions.",
        treatment: "No curative treatment exists. Prevention through vaccination is essential (NDV at D1, D7, D21).",
        prevention: "Mandatory vaccination, regular disinfection, quarantine new birds."
      },
      "coccidiosis": {
        symptoms: "Coccidiosis manifests as: diarrhea (sometimes bloody), ruffled feathers, stunted growth, anemia.",
        treatment: "Sulfonamides or Amprolium 20% - 1g/L water for 5-7 days. Consult a veterinarian.",
        prevention: "Coccidiostats in feed, strict hygiene, avoid excessive humidity."
      }
    },
    feeding: {
      "starter": "Starter feed (0-3 weeks): 23% protein, 3000 kcal/kg. Ad libitum distribution.",
      "grower": "Grower feed (4-6 weeks): 20% protein, 3100 kcal/kg.",
      "finisher": "Finisher feed (7+ weeks): 18% protein, 3200 kcal/kg."
    }
  }
}

// Fonction pour analyser l'intention de l'utilisateur
function analyzeIntent(message, lang = 'fr') {
  const lowerMessage = message.toLowerCase()
  
  // Salutations
  const greetingPatterns = lang === 'fr' 
    ? ['bonjour', 'salut', 'bonsoir', 'hello', 'hi']
    : ['hello', 'hi', 'good morning', 'good evening']
  
  if (greetingPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return { intent: 'greeting', confidence: 0.9 }
  }

  // Maladies
  const diseasePatterns = lang === 'fr'
    ? ['maladie', 'malade', 'symptôme', 'traitement', 'newcastle', 'coccidiose', 'gumboro', 'vaccination', 'vaccin']
    : ['disease', 'sick', 'symptom', 'treatment', 'newcastle', 'coccidiosis', 'gumboro', 'vaccination', 'vaccine']
  
  if (diseasePatterns.some(pattern => lowerMessage.includes(pattern))) {
    return { intent: 'health', confidence: 0.8 }
  }

  // Alimentation
  const feedingPatterns = lang === 'fr'
    ? ['alimentation', 'aliment', 'nourrir', 'manger', 'consommation', 'protéine']
    : ['feeding', 'feed', 'nutrition', 'eat', 'consumption', 'protein']
  
  if (feedingPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return { intent: 'feeding', confidence: 0.8 }
  }

  // Logement
  const housingPatterns = lang === 'fr'
    ? ['poulailler', 'bâtiment', 'logement', 'espace', 'ventilation', 'température']
    : ['housing', 'building', 'coop', 'space', 'ventilation', 'temperature']
  
  if (housingPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return { intent: 'housing', confidence: 0.8 }
  }

  // Marché/Prix
  const marketPatterns = lang === 'fr'
    ? ['prix', 'vendre', 'marché', 'profit', 'bénéfice', 'coût']
    : ['price', 'sell', 'market', 'profit', 'cost']
  
  if (marketPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return { intent: 'market', confidence: 0.8 }
  }

  return { intent: 'general', confidence: 0.5 }
}

// Fonction pour générer une réponse
function generateResponse(intent, message, lang = 'fr') {
  const kb = knowledgeBase[lang] || knowledgeBase.fr
  const lowerMessage = message.toLowerCase()

  switch (intent) {
    case 'greeting':
      return kb.greetings[Math.floor(Math.random() * kb.greetings.length)]

    case 'health':
      // Détecter la maladie spécifique
      if (lowerMessage.includes('newcastle')) {
        return `🦠 **Maladie de Newcastle**\n\n**Symptômes:** ${kb.diseases.newcastle.symptoms}\n\n**Traitement:** ${kb.diseases.newcastle.treatment}\n\n**Prévention:** ${kb.diseases.newcastle.prevention}`
      }
      if (lowerMessage.includes('coccidiose') || lowerMessage.includes('coccidiosis')) {
        return `🦠 **Coccidiose**\n\n**Symptômes:** ${kb.diseases.coccidiose.symptoms}\n\n**Traitement:** ${kb.diseases.coccidiose.treatment}\n\n**Prévention:** ${kb.diseases.coccidiose.prevention}`
      }
      if (lowerMessage.includes('gumboro')) {
        return `🦠 **Maladie de Gumboro**\n\n**Symptômes:** ${kb.diseases.gumboro.symptoms}\n\n**Traitement:** ${kb.diseases.gumboro.treatment}\n\n**Prévention:** ${kb.diseases.gumboro.prevention}`
      }
      return lang === 'fr' 
        ? "Je peux vous aider avec les maladies courantes comme Newcastle, la coccidiose, ou Gumboro. Pouvez-vous préciser de quelle maladie vous parlez ?"
        : "I can help with common diseases like Newcastle, coccidiosis, or Gumboro. Can you specify which disease you're asking about?"

    case 'feeding':
      if (lowerMessage.includes('démarrage') || lowerMessage.includes('starter')) {
        return `🍽️ **Alimentation Démarrage**\n\n${kb.feeding.starter}`
      }
      if (lowerMessage.includes('croissance') || lowerMessage.includes('grower')) {
        return `🍽️ **Alimentation Croissance**\n\n${kb.feeding.grower}`
      }
      if (lowerMessage.includes('finition') || lowerMessage.includes('finisher')) {
        return `🍽️ **Alimentation Finition**\n\n${kb.feeding.finisher}`
      }
      return lang === 'fr'
        ? `🍽️ **Alimentation des Poulets**\n\n${kb.feeding.starter}\n\n${kb.feeding.grower}\n\n${kb.feeding.finisher}\n\n${kb.feeding.consumption}`
        : `🍽️ **Chicken Feeding**\n\n${kb.feeding.starter}\n\n${kb.feeding.grower}\n\n${kb.feeding.finisher}`

    case 'housing':
      return lang === 'fr'
        ? `🏠 **Logement des Volailles**\n\n**Espace:** ${kb.housing.space}\n\n**Ventilation:** ${kb.housing.ventilation}\n\n**Température:** ${kb.housing.temperature}\n\n**Humidité:** ${kb.housing.humidity}`
        : `🏠 **Poultry Housing**\n\n**Space:** ${kb.housing.space}\n\n**Ventilation:** ${kb.housing.ventilation}\n\n**Temperature:** ${kb.housing.temperature}`

    case 'market':
      return lang === 'fr'
        ? `💰 **Marché et Prix**\n\n**Prix:** ${kb.market.prices}\n\n**Vente:** ${kb.market.selling}\n\n**Rentabilité:** ${kb.market.profit}`
        : `💰 **Market and Prices**\n\nI can provide information about market prices and profitability in Cameroon.`

    default:
      return lang === 'fr'
        ? "Je suis spécialisé en élevage de volaille. Je peux vous aider avec :\n\n🦠 **Santé** - Maladies, traitements, vaccination\n🍽️ **Alimentation** - Rations, consommation\n🏠 **Logement** - Construction, ventilation\n💰 **Marché** - Prix, rentabilité\n\nQue souhaitez-vous savoir ?"
        : "I specialize in poultry farming. I can help you with:\n\n🦠 **Health** - Diseases, treatments, vaccination\n🍽️ **Feeding** - Rations, consumption\n🏠 **Housing** - Construction, ventilation\n💰 **Market** - Prices, profitability\n\nWhat would you like to know?"
  }
}

// POST /api/chatbot/message - Envoyer un message au chatbot
router.post('/message', authenticate, async (req, res) => {
  try {
    const { message, conversation_id } = req.body
    const { lang = 'fr' } = req.query

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: lang === 'fr' ? 'Message requis' : 'Message required'
      })
    }

    // Analyser l'intention
    const { intent, confidence } = analyzeIntent(message, lang)
    
    // Générer la réponse
    const botResponse = generateResponse(intent, message, lang)

    const db = await getDatabase()

    // Enregistrer la conversation
    let conversationId = conversation_id
    if (!conversationId) {
      // Créer une nouvelle conversation
      const result = await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO chatbot_conversations (user_id, title, language)
          VALUES (?, ?, ?)
        `, [
          req.user.id, 
          message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          lang
        ], function(err) {
          if (err) reject(err)
          else resolve({ id: this.lastID })
        })
      })
      conversationId = result.id
    }

    // Enregistrer le message de l'utilisateur
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO chatbot_messages 
        (conversation_id, sender_type, message, intent, confidence)
        VALUES (?, 'user', ?, ?, ?)
      `, [conversationId, message, intent, confidence], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Enregistrer la réponse du bot
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO chatbot_messages 
        (conversation_id, sender_type, message, intent, confidence)
        VALUES (?, 'bot', ?, ?, ?)
      `, [conversationId, botResponse, intent, 1.0], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    res.json({
      success: true,
      data: {
        conversation_id: conversationId,
        user_message: message,
        bot_response: botResponse,
        intent,
        confidence,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur chatbot:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors du traitement du message' : 
        'Error processing message'
    })
  }
})

// GET /api/chatbot/conversations - Récupérer les conversations de l'utilisateur
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { lang = 'fr', limit = 20 } = req.query
    const db = await getDatabase()

    const conversations = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          cc.*,
          COUNT(cm.id) as message_count,
          MAX(cm.created_at) as last_activity
        FROM chatbot_conversations cc
        LEFT JOIN chatbot_messages cm ON cc.id = cm.conversation_id
        WHERE cc.user_id = ?
        GROUP BY cc.id
        ORDER BY last_activity DESC
        LIMIT ?
      `, [req.user.id, limit], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json({
      success: true,
      data: conversations
    })
  } catch (error) {
    console.error('Erreur récupération conversations:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des conversations' : 
        'Error retrieving conversations'
    })
  }
})

// GET /api/chatbot/conversations/:id - Récupérer une conversation spécifique
router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await new Promise((resolve, reject) => {
      db.get(`
        SELECT * FROM chatbot_conversations
        WHERE id = ? AND user_id = ?
      `, [id, req.user.id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Conversation non trouvée' : 'Conversation not found'
      })
    }

    // Récupérer les messages
    const messages = await new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM chatbot_messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
      `, [id], (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })

    res.json({
      success: true,
      data: {
        conversation,
        messages
      }
    })
  } catch (error) {
    console.error('Erreur récupération conversation:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération de la conversation' : 
        'Error retrieving conversation'
    })
  }
})

// DELETE /api/chatbot/conversations/:id - Supprimer une conversation
router.delete('/conversations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { lang = 'fr' } = req.query
    const db = await getDatabase()

    const result = await new Promise((resolve, reject) => {
      db.run(`
        DELETE FROM chatbot_conversations 
        WHERE id = ? AND user_id = ?
      `, [id, req.user.id], function(err) {
        if (err) reject(err)
        else resolve({ changes: this.changes })
      })
    })

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: lang === 'fr' ? 'Conversation non trouvée' : 'Conversation not found'
      })
    }

    res.json({
      success: true,
      message: lang === 'fr' ? 'Conversation supprimée' : 'Conversation deleted'
    })
  } catch (error) {
    console.error('Erreur suppression conversation:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la suppression' : 
        'Error deleting conversation'
    })
  }
})

// GET /api/chatbot/quick-responses - Récupérer les réponses rapides
router.get('/quick-responses', async (req, res) => {
  try {
    const { lang = 'fr' } = req.query

    const quickResponses = lang === 'fr' ? [
      { id: 1, text: "Comment prévenir la maladie de Newcastle ?", category: "health" },
      { id: 2, text: "Quelle alimentation pour poussins ?", category: "feeding" },
      { id: 3, text: "Comment construire un poulailler ?", category: "housing" },
      { id: 4, text: "Quel est le prix du poulet au Cameroun ?", category: "market" },
      { id: 5, text: "Symptômes de la coccidiose", category: "health" },
      { id: 6, text: "Calendrier de vaccination", category: "health" },
      { id: 7, text: "Calcul de rentabilité", category: "market" },
      { id: 8, text: "Ventilation du poulailler", category: "housing" }
    ] : [
      { id: 1, text: "How to prevent Newcastle disease?", category: "health" },
      { id: 2, text: "What feed for chicks?", category: "feeding" },
      { id: 3, text: "How to build a chicken coop?", category: "housing" },
      { id: 4, text: "What is chicken price in Cameroon?", category: "market" },
      { id: 5, text: "Coccidiosis symptoms", category: "health" },
      { id: 6, text: "Vaccination schedule", category: "health" },
      { id: 7, text: "Profitability calculation", category: "market" },
      { id: 8, text: "Coop ventilation", category: "housing" }
    ]

    res.json({
      success: true,
      data: quickResponses
    })
  } catch (error) {
    console.error('Erreur réponses rapides:', error)
    res.status(500).json({
      success: false,
      message: req.query.lang === 'fr' ? 
        'Erreur lors de la récupération des réponses rapides' : 
        'Error retrieving quick responses'
    })
  }
})

export default router
