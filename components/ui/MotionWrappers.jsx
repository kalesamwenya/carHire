'use client';

import { motion } from 'framer-motion';

// Standard Fade In Up animation for blocks of content
export const FadeInUp = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

// Container to stagger its children elements
export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => (
    <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: staggerDelay
                }
            }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

// An individual child item for the StaggerContainer
export const StaggerItem = ({ children, className = '' }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

// A slowly moving background blob for visual interest
export const AnimatedBlob = ({ className }) => (
    <motion.div
        animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 50% 50% / 50% 50% 50% 50%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute blur-3xl opacity-20 mix-blend-multiply ${className}`}
    ></motion.div>
)