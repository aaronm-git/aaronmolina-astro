// Utility exports
export { cn, createVariants } from './cn';
export { formatDate, formatDateRange, calculateDuration, getRelativeTime, toISODateString } from './date-format';
export { getNavIcon, getSocialIcon, getCategoryIcon, getUIIcon, getIcon } from './icons';
export { createTechMap, getTechName, getTechNames, techMapToObject, objectToTechMap } from './tech-lookup';
export type { TechMap } from './tech-lookup';

// Re-export commonly used icons
export {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaAward,
  FaBriefcase,
  FaImage,
  FaSun,
  FaMoon,
  FaDesktop,
  FaBars,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaUpRightFromSquare,
  FaChevronRight,
  FaChevronDown,
  FaXmark,
  FaCalendar,
} from './icons';

export type { IconType } from 'react-icons';
