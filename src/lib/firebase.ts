import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth'

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKey123456789',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'skyloft-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'skyloft-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Sign in anonymously
export const initializeAuth = async () => {
  try {
    const result = await signInAnonymously(auth)
    return result.user
  } catch (error) {
    console.error('Auth error:', error)
    throw error
  }
}

// Helper functions
export const getFlightCode = (flightNumber: string): string => {
  return flightNumber.toUpperCase().replace(/\s/g, '')
}

export const generateLoftId = (userId: string, flightCode: string): string => {
  return `${userId}-${flightCode}`
}

export const generateChatId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const generatePassengerId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
