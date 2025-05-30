import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-6xl font-bold text-surface-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-700 mb-4">Page Not Found</h2>
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 custom-button bg-primary text-white hover:bg-primary-dark"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound