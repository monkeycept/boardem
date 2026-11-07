import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/userStore'
import { useFlightStore } from './stores/flightStore'
import { useLoftStore } from './stores/loftStore'
import { useAudioStore } from './stores/audioStore'
import { setCabinHum } from './lib/audio'
import ScannerScreen from './components/screens/ScannerScreen'
import HomeScreen from './components/screens/HomeScreen'
import LoftBuilderScreen from './components/screens/LoftBuilderScreen'
import PassengersScreen from './components/screens/PassengersScreen'
import ChatScreen from './components/screens/ChatScreen'
import VisitLoftScreen from './components/screens/VisitLoftScreen'
import Layout from './components/layout/Layout'

export default function App() {
  const page = useUserStore(s => s.page)
  const flight = useFlightStore(s => s.flight)
  const visitingLoftId = useFlightStore(s => s.visitingLoftId)

  // Coming back to an existing flight: reconnect, then restore sound on the first tap
  // (browsers only allow audio after a user gesture).
  useEffect(() => {
    if (!useFlightStore.getState().flight) return
    void useFlightStore.getState().resume()
    const onFirstTap = () => {
      if (useUserStore.getState().cabinHum) setCabinHum(true)
      const np = useLoftStore.getState().nowPlaying
      const audio = useAudioStore.getState()
      if (np && !audio.playing && !useFlightStore.getState().visitingLoftId) {
        if (np.trackId.startsWith('upload')) useLoftStore.getState().setNowPlaying(null)
        else audio.play(np.trackId)
      }
    }
    window.addEventListener('pointerdown', onFirstTap, { once: true })
    return () => window.removeEventListener('pointerdown', onFirstTap)
  }, [])

  let screen: JSX.Element
  if (!flight) screen = <ScannerScreen />
  else if (visitingLoftId) screen = <VisitLoftScreen />
  else
    screen = (
      <Layout>
        {page === 'home' && <HomeScreen />}
        {page === 'loft' && <LoftBuilderScreen />}
        {page === 'passengers' && <PassengersScreen />}
        {page === 'chat' && <ChatScreen />}
      </Layout>
    )

  return (
    <>
      {screen}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2200,
          style: {
            background: 'rgba(5, 18, 48, 0.94)', // Deep Indigo
            color: '#f3f7fe',
            border: '1px solid rgba(0, 151, 141, 0.45)', // Benzol Green
            backdropFilter: 'blur(12px)',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}
