import { AnimatePresence, motion } from 'framer-motion'
import Header from './Header'
import BottomNav from './BottomNav'
import NowPlayingBar from '../common/NowPlayingBar'
import { useUserStore } from '../../stores/userStore'

export default function Layout({ children }: { children: React.ReactNode }) {
  const page = useUserStore(s => s.page)
  const scrolls = page === 'home' || page === 'passengers'

  return (
    <div className="w-full h-full flex flex-col bg-sky-night">
      <Header />
      <main className={`relative flex-1 min-h-0 ${scrolls ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={scrolls ? 'min-h-full' : 'h-full'}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <NowPlayingBar />
      <BottomNav />
    </div>
  )
}
