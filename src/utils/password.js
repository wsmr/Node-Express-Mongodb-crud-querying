/**
 * Password Utilities
 * 
 * This file contains utility functions for password hashing and validation.
 */

const bcrypt = require('bcryptjs');

/**
 * Hash password using bcrypt
 */
async function hashPassword(password, saltRounds = 12) {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
}

/**
 * Compare password with hash
 */
async function comparePassword(password, hash) {
  try {
    if (!password || !hash) {
      return false;
    }
    
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  // Minimum length
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  // Maximum length
  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common and easily guessable');
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * Calculate password strength score
 */
function calculatePasswordStrength(password) {
  if (!password) return 0;
  
  let score = 0;
  
  // Length bonus
  score += Math.min(password.length * 2, 20);
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 5;
  if (/[A-Z]/.test(password)) score += 5;
  if (/\d/.test(password)) score += 5;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
  
  // Complexity bonus
  if (password.length >= 8) score += 5;
  if (password.length >= 12) score += 5;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) score += 10;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) score += 15;
  
  // Penalty for common patterns
  if (/123|abc|qwe/i.test(password)) score -= 10;
  if (/(.)\1{2,}/.test(password)) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Get password strength level
 */
function getPasswordStrengthLevel(password) {
  const score = calculatePasswordStrength(password);
  
  if (score < 30) return 'Very Weak';
  if (score < 50) return 'Weak';
  if (score < 70) return 'Fair';
  if (score < 85) return 'Good';
  return 'Strong';
}

/**
 * Generate secure random password
 */
function generateSecurePassword(length = 12) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Check if password needs rehashing
 */
function needsRehashing(hash, saltRounds = 12) {
  try {
    // Extract salt rounds from hash
    const hashSaltRounds = parseInt(hash.split('$')[2]);
    return hashSaltRounds < saltRounds;
  } catch (error) {
    return true; // If we can't parse the hash, assume it needs rehashing
  }
}

/**
 * Validate password against user info to prevent common mistakes
 */
function validatePasswordAgainstUserInfo(password, userInfo = {}) {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  const lowerPassword = password.toLowerCase();
  
  // Check against username
  if (userInfo.username && lowerPassword.includes(userInfo.username.toLowerCase())) {
    errors.push('Password should not contain your username');
  }
  
  // Check against email
  if (userInfo.email) {
    const emailParts = userInfo.email.toLowerCase().split('@');
    if (emailParts[0] && lowerPassword.includes(emailParts[0])) {
      errors.push('Password should not contain your email address');
    }
  }
  
  // Check against name
  if (userInfo.name) {
    const nameParts = userInfo.name.toLowerCase().split(' ');
    for (const part of nameParts) {
      if (part.length > 2 && lowerPassword.includes(part)) {
        errors.push('Password should not contain your name');
        break;
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  calculatePasswordStrength,
  getPasswordStrengthLevel,
  generateSecurePassword,
  needsRehashing,
  validatePasswordAgainstUserInfo
};

