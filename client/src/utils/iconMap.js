/**
 * src/utils/iconMap.js
 * Centralized icon mapping for better tree-shaking and optimization
 * Reduces icon library bloat by only importing needed icons
 */

import {
  FiHome,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiArrowLeft,
  FiHeart,
  FiEye,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiFilter,
  FiStar,
  FiCheckCircle,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiGift,
  FiPackage,
  FiTag,
  FiTrendingDown,
  FiRefreshCw,
  FiZap,
  FiShoppingBag,
  FiBox,
  FiSmartphone,
  FiLogOut,
  FiEdit2,
  FiLock,
  FiTrendingUp,
  FiAlertTriangle,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
} from 'react-icons/fi';

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaApple,
  FaGooglePlay,
  FaPalette,
  FaFootballBall,
} from 'react-icons/fa';

/**
 * Icon map for Feather icons
 * Use this instead of importing directly for better tree-shaking
 */
export const featherIcons = {
  home: FiHome,
  shoppingCart: FiShoppingCart,
  user: FiUser,
  search: FiSearch,
  menu: FiMenu,
  close: FiX,
  chevronDown: FiChevronDown,
  chevronUp: FiChevronUp,
  chevronLeft: FiChevronLeft,
  chevronRight: FiChevronRight,
  arrowRight: FiArrowRight,
  arrowLeft: FiArrowLeft,
  heart: FiHeart,
  eye: FiEye,
  trash: FiTrash2,
  plus: FiPlus,
  minus: FiMinus,
  filter: FiFilter,
  star: FiStar,
  checkCircle: FiCheckCircle,
  alertCircle: FiAlertCircle,
  mail: FiMail,
  phone: FiPhone,
  mapPin: FiMapPin,
  send: FiSend,
  gift: FiGift,
  package: FiPackage,
  tag: FiTag,
  trendingDown: FiTrendingDown,
  refresh: FiRefreshCw,
  zap: FiZap,
  shoppingBag: FiShoppingBag,
  box: FiBox,
  smartphone: FiSmartphone,
  logout: FiLogOut,
  edit: FiEdit2,
  lock: FiLock,
  trendingUp: FiTrendingUp,
  alert: FiAlertTriangle,
  instagram: FiInstagram,
  twitter: FiTwitter,
  facebook: FiFacebook,
  linkedin: FiLinkedin,
};

/**
 * Icon map for Font Awesome icons
 * Use this for Font Awesome icons only
 */
export const fontAwesomeIcons = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  apple: FaApple,
  googlePlay: FaGooglePlay,
  palette: FaPalette,
  football: FaFootballBall,
};

/**
 * Get icon component by ID
 * @param {string} iconId - Icon identifier
 * @param {string} library - 'fi' for Feather, 'fa' for Font Awesome
 * @returns {Component|null} Icon component or null if not found
 */
export function getIcon(iconId, library = 'fi') {
  const iconMap = library === 'fa' ? fontAwesomeIcons : featherIcons;
  return iconMap[iconId] || null;
}

/**
 * Get icon from config object that uses iconId
 * @param {Object} config - Config object with iconId property
 * @param {string} library - 'fi' for Feather, 'fa' for Font Awesome
 * @returns {Component|null}
 */
export function resolveIcon(config, library = 'fi') {
  if (!config || !config.iconId) return null;
  return getIcon(config.iconId, library);
}
