import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const stats = [
    { label: 'Active Employees', value: '248', icon: 'Users', color: 'text-blue-600' },
    { label: 'Departments', value: '12', icon: 'Building2', color: 'text-green-600' },
    { label: 'Present Today', value: '198', icon: 'UserCheck', color: 'text-purple-600' },
    { label: 'Avg Hours/Week', value: '42.3', icon: 'Clock', color: 'text-orange-600' }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Users" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StaffHub
              </h1>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300"
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-surface-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="metric-card group cursor-pointer"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-surface-100 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <ApperIcon name={stat.icon} className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-surface-800">
                    {stat.value}
                  </div>
                </div>
              </div>
              <div className="text-sm text-surface-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Feature Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <MainFeature />
        </motion.div>
      </main>
    </div>
  )
}

export default Home