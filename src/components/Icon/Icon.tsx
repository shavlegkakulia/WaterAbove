import React from 'react';
import * as Icons from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';

/**
 * Reusable Icon Component
 * 
 * Wraps lucide-react-native icons for consistent usage across the app
 * 
 * @example
 * import { Icon } from '@/components/Icon';
 * 
 * <Icon name="Home" size={24} color="#000" />
 * <Icon name="User" size={32} strokeWidth={2.5} />
 */

export type IconName = keyof typeof Icons;

export interface IconProps extends Omit<LucideProps, 'ref'> {
  /** Name of the Lucide icon */
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = Icons[name] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    if (__DEV__) {
      console.warn(`[Icon] Icon "${name}" not found in lucide-react-native`);
    }
    return null;
  }

  return <IconComponent {...props} />;
}

// Export commonly used icons for convenience
export {
  // Navigation
  Home,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,

  // Actions
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Share2,
  Copy,
  Check,

  // User
  User,
  Users,
  UserPlus,
  LogIn,
  LogOut,

  // Communication
  Mail,
  Phone,
  MessageCircle,
  Bell,
  Send,

  // Media
  Image,
  Video,
  Music,
  Play,
  Pause,
  VolumeX,
  Volume2,

  // UI
  Eye,
  EyeOff,
  Search,
  Settings,
  Heart,
  Star,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,

  // Files
  File,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react-native';

