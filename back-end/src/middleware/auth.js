import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' })
    }

    req.user = user
    next()
  })
}

export function authenticateAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (!req.user.admin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' })
    }
    next()
  })
}

export function authenticateGarcom(req, res, next) {
  authenticateToken(req, res, () => {
    if (!req.user.garcom && !req.user.admin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas garçons ou administradores.' })
    }
    next()
  })
}