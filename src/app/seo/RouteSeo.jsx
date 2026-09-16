import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://ataraxiatimer.app';
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const routeMetadata = {
  '/': {
    title: 'Ataraxia Timer | Pomodoro Focus Timer & Task Manager',
    description: 'Ataraxia Timer is a clean Pomodoro focus app for deep work, task planning, focus sessions, short breaks, long breaks, offline use and distraction-free productivity.',
    canonical: `${SITE_URL}/`,
    robots: DEFAULT_ROBOTS,
  },
  '/privacy': {
    title: 'Privacy Policy | Ataraxia Timer',
    description: 'Read the Ataraxia Timer privacy policy and learn how account, application and locally stored productivity data are handled.',
    canonical: `${SITE_URL}/privacy`,
    robots: DEFAULT_ROBOTS,
  },
  '/terms': {
    title: 'Terms & Conditions | Ataraxia Timer',
    description: 'Read the terms and conditions that apply to using Ataraxia Timer, its productivity features and related online services.',
    canonical: `${SITE_URL}/terms`,
    robots: DEFAULT_ROBOTS,
  },
  '/reset-password': {
    title: 'Reset Password | Ataraxia Timer',
    description: 'Reset the password for your Ataraxia Timer account.',
    canonical: `${SITE_URL}/reset-password`,
    robots: 'noindex, nofollow',
  },
};

const setMetaContent = (selector, attributeName, attributeValue, content) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const setCanonical = (href) => {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', href);
};

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = routeMetadata[pathname] || routeMetadata['/'];

    document.title = metadata.title;
    setCanonical(metadata.canonical);

    setMetaContent('meta[name="title"]', 'name', 'title', metadata.title);
    setMetaContent('meta[name="description"]', 'name', 'description', metadata.description);
    setMetaContent('meta[name="robots"]', 'name', 'robots', metadata.robots);
    setMetaContent('meta[name="googlebot"]', 'name', 'googlebot', metadata.robots);

    setMetaContent('meta[property="og:title"]', 'property', 'og:title', metadata.title);
    setMetaContent('meta[property="og:description"]', 'property', 'og:description', metadata.description);
    setMetaContent('meta[property="og:url"]', 'property', 'og:url', metadata.canonical);

    setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title);
    setMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', metadata.description);
  }, [pathname]);

  return null;
}
