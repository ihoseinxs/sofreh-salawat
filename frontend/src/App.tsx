import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import Prayers from './pages/Prayers'
import PrayerDetail from './pages/PrayerDetail'
import CreatePrayer from './pages/CreatePrayer'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Content from './pages/Content'
import NotFound from './pages/NotFound'

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50"
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prayers" element={<Prayers />} />
          <Route path="prayers/:id" element={<PrayerDetail />} />
          <Route path="create-prayer" element={<CreatePrayer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="content" element={<Content />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </motion.div>
  )
}

export default App 