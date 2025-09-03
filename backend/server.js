import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Import routes
import authRoutes from './routes/auth.js'
import trainingRoutes from './routes/training.js'
import trackingRoutes from './routes/tracking.js'
import monitoringRoutes from './routes/monitoring.js'
import forumRoutes from './routes/forum.js'
import chatbotRoutes from './routes/chatbot.js'
import adminRoutes from './routes/admin.js'
import subscriptionRoutes from './routes/subscription.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

// Import database initialization
import { initializeDatabase } from './database/init.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Ecoloop',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      documentation: '/api/docs'
    }
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/training', trainingRoutes)
app.use('/api/tracking', trackingRoutes)
app.use('/api/monitoring', monitoringRoutes)
app.use('/api/forum', forumRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/subscription', subscriptionRoutes)

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Initialisation de la base de données...')
    await initializeDatabase()
    console.log('✅ Base de données initialisée avec succès')

    app.listen(PORT, () => {
      console.log(`
🚀 Serveur Ecoloop démarré avec succès !
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🗄️  Base de données: SQLite
🔗 API: http://localhost:${PORT}/api
🏥 Health check: http://localhost:${PORT}/health
      `)
    })
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du serveur...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 Arrêt du serveur...')
  process.exit(0)
})

startServer()
