import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAppTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useAppTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center
        bg-[var(--bg-glass)] border border-[var(--border-glass)]
        hover:border-indigo-500/30 transition-all duration-300
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Moon size={18} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Sun size={18} />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
