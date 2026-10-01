import { Category, ImageItem, User, ModerationLog } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Elena Vance',
    firstName: 'Elena',
    lastName: 'Vance',
    username: 'elenavance',
    email: 'admin@freeimagepro.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Lead Curator & Senior Platform Moderator at FreeImage Pro. Focused on high-fidelity architecture and landscape photography.',
    location: 'Berlin, Germany',
    openToUsageEmail: true,
    status: 'active',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Sterling',
    firstName: 'Marcus',
    lastName: 'Sterling',
    username: 'marcus_sterling',
    email: 'user@freeimagepro.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Landscape photographer and outdoor enthusiast capturing alpine peaks and remote wilderness.',
    location: 'San Francisco, CA',
    website: 'https://marcussterling.photography',
    donationPlatform: 'PayPal',
    donationLink: 'paypal.me/marcus',
    openToUsageEmail: true,
    status: 'active',
    createdAt: '2025-02-10T14:30:00Z',
  },
  {
    id: 'user-sophia',
    name: 'Sophia Chen',
    username: 'chen_studio',
    email: 'sophia@freeimagepro.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    bio: 'Urban architecture documentarian and interior designer based in Tokyo and Berlin.',
    status: 'active',
    createdAt: '2025-02-18T11:20:00Z',
  },
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-nature',
    name: 'Nature & Landscapes',
    slug: 'nature',
    description: 'Breathtaking mountains, mist-shrouded forests, oceans, and dramatic wilderness.',
    coverUrl: '',
  },
  {
    id: 'cat-arch',
    name: 'Architecture & Spaces',
    slug: 'architecture',
    description: 'Clean modern lines, brutalist geometry, urban facades, and minimalist interior spaces.',
    coverUrl: '',
  },
  {
    id: 'cat-travel',
    name: 'Travel & Destinations',
    slug: 'travel',
    description: 'Iconic global destinations, coastal paths, remote cabins, and cultural landmarks.',
    coverUrl: '',
  },
  {
    id: 'cat-people',
    name: 'People & Lifestyle',
    slug: 'people',
    description: 'Authentic human emotions, creative workspaces, candid moments, and modern lifestyles.',
    coverUrl: '',
  },
  {
    id: 'cat-tech',
    name: 'Technology & Innovation',
    slug: 'technology',
    description: 'Modern gadgets, clean developer workspaces, digital hardware, and futuristic setups.',
    coverUrl: '',
  },
  {
    id: 'cat-minimal',
    name: 'Minimalist & Textures',
    slug: 'minimalist',
    description: 'Subtle light play, organic textures, monochromatic abstracts, and quiet simplicity.',
    coverUrl: '',
  },
];

// Zero dummy images - platform starts completely clean for user uploads
export const SEED_IMAGES: ImageItem[] = [];

export const SEED_MODERATION_LOGS: ModerationLog[] = [];
