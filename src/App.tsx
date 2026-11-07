import React, { useEffect } from 'react'
import { useUserStore } from './stores/userStore'
import { useFlightStore } from './stores/flightStore'
import { initializeAuth } from './lib/firebase'
import ScannerScreen from './components/screens/ScannerScreen'
import HomeScreen from './components/screens/HomeScreen'
import LoftBuilderScreen from './components/screens/LoftBuilderScreen'
import PassengersScreen from './components/screens/PassengersScreen'
import ChatScreen from './components/screens/ChatScreen'
import VisitLoftScreen from './components/screens/VisitLoftScreen'
import Layout from './components/layout/Layout'
import Confetti from './components/common/Confetti'

export default function App() {
  const { currentPage, flightCode } = useUserStore()
  const { visitingLoftId } = useFlightStore()

  useEffect(() => {
    // Initialize Firebase auth
    const initAuth = async () => {
      try {
        await initializeAuth()
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      }
    }
    initAuth()
  }, [])

  // If not boarded yet, show scanner
  if (!flightCode) {
    return (
      <div className="w-full h-full bg-slate-900">
        <ScannerScreen />
      </div>
    )
  }

  // If visiting a loft, show visitor mode
  if (visitingLoftId) {
    return (
      <div className="w-full h-full bg-slate-900">
        <VisitLoftScreen />
        <Confetti />
      </div>
    )
  }

  // Otherwise show main layout with navigation
  return (
    <Layout>
      {currentPage === 'home' && <HomeScreen />}
      {currentPage === 'loft' && <LoftBuilderScreen />}
      {currentPage === 'passengers' && <PassengersScreen />}
      {currentPage === 'chat' && <ChatScreen />}
      <Confetti />
    </Layout>
  )
}
