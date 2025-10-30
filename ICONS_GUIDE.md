# 🎨 Icons Guide - Lucide React Native

This project uses **[lucide-react-native](https://www.npmjs.com/package/lucide-react-native)** for all icons.

Lucide provides **1400+ beautiful, consistent icons** that are optimized for React Native.

---

## 📦 Installation

Already installed! ✅

```bash
yarn add lucide-react-native
```

**Note:** Requires `react-native-svg` (already in dependencies)

---

## 🚀 Basic Usage

```tsx
import { Home, User, Settings, Bell } from 'lucide-react-native';

function MyComponent() {
  return (
    <>
      <Home color="#000" size={24} />
      <User color="#666" size={32} />
      <Settings color="red" size={20} />
      <Bell color="#3498db" size={28} />
    </>
  );
}
```

---

## 📖 Common Props

All Lucide icons accept these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `24` | Icon size (width & height) |
| `color` | `string` | `"currentColor"` | Icon color |
| `strokeWidth` | `number` | `2` | Stroke width |
| `fill` | `string` | `"none"` | Fill color |
| `style` | `ViewStyle` | - | Additional styles |

---

## 🎯 Real-World Examples

### Example 1: Login Screen Icons

```tsx
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <View style={styles.inputContainer}>
        <Mail color="#7f8c8d" size={20} />
        <TextInput placeholder="Email" />
      </View>

      <View style={styles.inputContainer}>
        <Lock color="#7f8c8d" size={20} />
        <TextInput 
          placeholder="Password" 
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff color="#7f8c8d" size={20} />
          ) : (
            <Eye color="#7f8c8d" size={20} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

### Example 2: Tab Navigation

```tsx
import { Home, Search, Heart, User } from 'lucide-react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons = {
    Home: Home,
    Search: Search,
    Favorites: Heart,
    Profile: User,
  };

  const IconComponent = icons[name];
  
  return (
    <IconComponent 
      color={focused ? '#3498db' : '#95a5a6'} 
      size={24}
      strokeWidth={focused ? 2.5 : 2}
    />
  );
}
```

### Example 3: Action Buttons

```tsx
import { Plus, Trash2, Edit, Share2 } from 'lucide-react-native';

function ActionButtons() {
  return (
    <View style={styles.actions}>
      <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
        <Plus color="white" size={20} />
        <Text style={styles.btnText}>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.btnDanger]}>
        <Trash2 color="white" size={18} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Edit color="#3498db" size={18} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Share2 color="#3498db" size={18} />
      </TouchableOpacity>
    </View>
  );
}
```

### Example 4: Status Indicators

```tsx
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';

function StatusMessage({ type, message }: { type: string; message: string }) {
  const config = {
    success: { Icon: CheckCircle, color: '#27ae60' },
    error: { Icon: XCircle, color: '#e74c3c' },
    warning: { Icon: AlertCircle, color: '#f39c12' },
    info: { Icon: Info, color: '#3498db' },
  };

  const { Icon, color } = config[type];

  return (
    <View style={styles.statusContainer}>
      <Icon color={color} size={20} />
      <Text style={styles.statusText}>{message}</Text>
    </View>
  );
}
```

---

## 🔍 Finding Icons

### Option 1: Browse Online
👉 **[lucide.dev/icons](https://lucide.dev/icons)**

Search and preview all 1400+ icons visually

### Option 2: Search in Code
All icons use PascalCase names:

```tsx
// Common patterns:
import { 
  // Actions
  Plus, Minus, Edit, Trash2, Save, Download, Upload,
  
  // Navigation
  Home, Search, Settings, Menu, ArrowLeft, ChevronRight,
  
  // Communication
  Mail, Phone, MessageCircle, Bell, Send,
  
  // Media
  Image, Video, Music, Play, Pause, VolumeX,
  
  // Files
  File, FileText, Folder, FolderOpen, Download,
  
  // UI
  Check, X, AlertCircle, Info, Eye, EyeOff,
  
  // Social
  Heart, Star, Share2, ThumbsUp, Bookmark,
} from 'lucide-react-native';
```

---

## 💡 Pro Tips

### 1. Create Reusable Icon Wrapper

```tsx
// src/components/Icon/Icon.tsx
import * as Icons from 'lucide-react-native';
import { colors } from '@/theme';

type IconName = keyof typeof Icons;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ 
  name, 
  size = 24, 
  color = colors.text.primary,
  strokeWidth = 2 
}: IconProps) {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth} 
    />
  );
}

// Usage:
<Icon name="Home" size={24} color="#000" />
<Icon name="User" size={32} />
```

### 2. Animated Icons

```tsx
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';

const AnimatedHeart = Animated.createAnimatedComponent(Heart);

function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <TouchableOpacity onPress={() => setLiked(!liked)}>
      <Heart 
        color={liked ? '#e74c3c' : '#95a5a6'}
        fill={liked ? '#e74c3c' : 'none'}
        size={28}
      />
    </TouchableOpacity>
  );
}
```

### 3. Theme Integration

```tsx
// src/theme/colors.ts
export const colors = {
  icon: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    accent: '#3498db',
    danger: '#e74c3c',
    success: '#27ae60',
  },
};

// Usage:
import { colors } from '@/theme';
import { Home } from 'lucide-react-native';

<Home color={colors.icon.primary} size={24} />
```

---

## 📚 Resources

- **Official Docs:** [lucide.dev/guide](https://lucide.dev/guide)
- **Icon Search:** [lucide.dev/icons](https://lucide.dev/icons)
- **GitHub:** [github.com/lucide-icons/lucide](https://github.com/lucide-icons/lucide)
- **React Native Package:** [npmjs.com/package/lucide-react-native](https://www.npmjs.com/package/lucide-react-native)

---

## ❓ FAQ

**Q: How many icons are available?**  
A: 1400+ icons and growing!

**Q: Can I customize colors?**  
A: Yes! Use the `color` prop on any icon.

**Q: Are icons tree-shakeable?**  
A: Yes! Import only what you need, unused icons won't be bundled.

**Q: Do icons work on both iOS and Android?**  
A: Yes! Fully cross-platform.

**Q: Can I use custom SVGs?**  
A: Yes, but use `react-native-svg` directly. Lucide has most common icons.

---

## 🎉 Summary

✅ **1400+ beautiful icons**  
✅ **Tree-shakeable (small bundle)**  
✅ **Fully customizable**  
✅ **Cross-platform**  
✅ **TypeScript support**  
✅ **No manual SVG conversion needed!**

**Just import and use! 🚀**

