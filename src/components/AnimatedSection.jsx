"use client"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AnimatedSection({ children, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="mb-8"
    >
      {children}
    </motion.div>
  )
}
