import {
  FaHouse,
  FaBriefcase,
  FaUser,
  FaBookOpen,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaSun,
  FaMoon,
  FaDesktop,
  FaBars,
  FaImage,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaAward,
  FaBolt,
  FaUsers,
  FaShieldCat,
  FaClock,
  FaCalendar,
  FaGlobe,
  FaCode,
  FaStar,
  FaHeart,
  FaRocket,
  FaLightbulb,
  FaGraduationCap,
  FaCertificate,
  FaQuoteLeft,
  FaChevronRight,
  FaChevronDown,
  FaUpRightFromSquare,
  FaXmark,
  FaPlay,
  FaCircleInfo,
  FaTriangleExclamation,
  FaCircleCheck,
  FaCircleXmark,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';

// Navigation icon mapping
const navIcons: Record<string, IconType> = {
  home: FaHouse,
  projects: FaBriefcase,
  experience: FaUser,
  blog: FaBookOpen,
  contact: FaEnvelope,
};

// Social platform icon mapping
const socialIcons: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

// Category/feature icon mapping
const categoryIcons: Record<string, IconType> = {
  briefcase: FaBriefcase,
  bolt: FaBolt,
  users: FaUsers,
  shield: FaShieldCat,
  clock: FaClock,
  calendar: FaCalendar,
  globe: FaGlobe,
  code: FaCode,
  star: FaStar,
  heart: FaHeart,
  rocket: FaRocket,
  lightbulb: FaLightbulb,
  graduation: FaGraduationCap,
  certificate: FaCertificate,
  quote: FaQuoteLeft,
  check: FaCheck,
  award: FaAward,
  user: FaUser,
  image: FaImage,
  info: FaCircleInfo,
  warning: FaTriangleExclamation,
  success: FaCircleCheck,
  error: FaCircleXmark,
};

// UI/action icon mapping
const uiIcons: Record<string, IconType> = {
  arrowRight: FaArrowRight,
  arrowLeft: FaArrowLeft,
  chevronRight: FaChevronRight,
  chevronDown: FaChevronDown,
  externalLink: FaUpRightFromSquare,
  close: FaXmark,
  menu: FaBars,
  play: FaPlay,
  sun: FaSun,
  moon: FaMoon,
  desktop: FaDesktop,
};

/**
 * Get navigation icon by key
 */
export function getNavIcon(iconKey: string): IconType | null {
  return navIcons[iconKey.toLowerCase()] || null;
}

/**
 * Get social platform icon by platform name
 */
export function getSocialIcon(platform: string): IconType | null {
  return socialIcons[platform.toLowerCase()] || null;
}

/**
 * Get category/feature icon by name
 */
export function getCategoryIcon(category: string): IconType | null {
  return categoryIcons[category.toLowerCase()] || null;
}

/**
 * Get UI/action icon by name
 */
export function getUIIcon(name: string): IconType | null {
  return uiIcons[name] || null;
}

/**
 * Get any icon by name (searches all categories)
 */
export function getIcon(name: string): IconType | null {
  const lowerName = name.toLowerCase();
  return (
    navIcons[lowerName] ||
    socialIcons[lowerName] ||
    categoryIcons[lowerName] ||
    uiIcons[name] || // UI icons use camelCase
    null
  );
}

// Re-export commonly used icons for direct import when needed
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
  FaHouse,
  FaClock,
  FaQuoteLeft,
  FaStar,
};

// Export icon type for type safety
export type { IconType };
