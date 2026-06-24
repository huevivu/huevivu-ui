const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'huevivu_dev_secret_do_not_use_in_prod';

function generateToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '30d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Cần đăng nhập' });
  }
  const payload = verifyToken(auth.slice(7));
  if (!payload) return res.status(401).json({ error: 'Token không hợp lệ' });
  req.userId = payload.userId;
  next();
}

// Không yêu cầu auth nhưng inject userId nếu có token
function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const payload = verifyToken(auth.slice(7));
    if (payload) req.userId = payload.userId;
  }
  next();
}

module.exports = { generateToken, verifyToken, authMiddleware, optionalAuth };
