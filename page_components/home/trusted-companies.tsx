// components/trusted-companies.tsx
'use client'

import { motion } from 'framer-motion'

const companies = [
  'TechCorp', 'InnovateLabs', 'FutureScale', 'DataFlow',
  'CloudNine', 'StartupHub', 'DevStudio', 'AIVentures'
]

export function TrustedCompanies() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="mt-16"
    >
      <p className="text-sm text-gray-500 text-center mb-6">
        Trusted by 5,000+ innovative companies worldwide
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {companies.map((company, index) => (
          <motion.div
            key={company}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
            className="text-gray-600 hover:text-gray-400 transition-colors font-semibold text-lg"
          >
            {company}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}