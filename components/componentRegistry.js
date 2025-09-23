// Maps component_key from DB to actual React components
import dynamic from 'next/dynamic';

// Direct imports for commonly used ones
import AboutSection from '@/components/AboutSection';
import Offerings from '@/components/Offerings';
import RecentDocs from '@/components/RecentDocs';
import PromoSection from '@/components/PromoSection';
import SocialMediaFeed from '@/components/SocialMediaFeed';

// Add more mappings as you expose them in the catalog
export const componentRegistry = {
  AboutSection,
  Offerings,
  RecentDocs,
  PromoSection,
  SocialMediaFeed,
};

export function getComponentByKey(key) {
  return componentRegistry[key] || null;
}
