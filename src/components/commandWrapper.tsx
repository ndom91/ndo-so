import { motion } from 'framer-motion'

export default function CommandWrapper(props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        height: 475,
        width: 500,
        position: 'absolute',
        zIndex: '9999',
        top: 'calc(50% - 250px)',
        left: 'calc(50% - 250px)',
      }}
      {...props}
    />
  )
}
