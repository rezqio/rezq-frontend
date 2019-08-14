import invert from 'lodash/invert';

export const { BACKEND_URI } = process.env;

export const { FRONTEND_URI } = process.env;

export const UWATERLOO_CAS = 'https://cas.uwaterloo.ca/cas/login?service=';

export const { FACEBOOK_APP_ID } = process.env;
export const FACEBOOK_APP_VERSION = '3.0';

export const GOOGLE_CLIENT_ID = '318458844815-pujstcn760q3b2fu9pm5m9dn14mj3c62.apps.googleusercontent.com';

export const CRITIQUE_TYPES = {
  MATCHED: 0,
  LINKED: 1,
  POOLED: 2,
};

export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESUMES: '/resumes',
  RESUME_OVERVIEW: '/resumes/:id',
  CRITIQUES: '/critiques',
  CRITIQUE_DETAIL: '/critiques/:id',
  SHARED_RESUME: '/shared-resume/:resumeToken',
  SHARED_CRITIQUE: '/shared-critique/:critiqueToken',
  PUBLIC_POOL: '/pool',
  PUBLIC_PROFILE: '/profile/:id',
  POOLED_RESUME: '/pooled-resume/:id',
  POOLED_CRITIQUE: '/pooled-critique/:id',
  SETTINGS: '/settings',
  VERIFY_EMAIL: '/verify-email',
  UNSUBSCRIBE_EMAIL: '/unsubscribe-email',
  RESOURCES: '/resources',
  NOT_FOUND: '/notfound',
  SERVER_ERROR: '/oops',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  FAQS: '/faqs',
  ABOUT: '/about',
  TERMS_AND_CONDITIONS: '/terms',
  PRIVACY_POLICY: '/privacy',
};

export const PUBLIC = 'bUbl1c623';
export const PRIVATE = 'PRIVATE';
export const UWATERLOO_DOMAIN = 'uwaterloo.ca';

export const MY_RESUME_LIMITS = {
  MAX_RESUMES: 5,
  MAX_UPLOAD_FILE_SIZE: 5242880,
};

export const TAGS = {
  ACC: 'Accounting',
  ADM: 'Administration',
  ANA: 'Analyst',
  ARCH: 'Architecture',
  BANK: 'Banking',
  BIO: 'Biology',
  BUS: 'Business',
  CHEM: 'Chemistry',
  COMM: 'Commerce',
  CONS: 'Consulting',
  DATA: 'Data Science',
  DES: 'Design',
  ENG: 'Engineering',
  ENV: 'Environment',
  FIN: 'Finance',
  FINT: 'Fin Tech',
  GEOL: 'Geology',
  GEOM: 'Geomatics',
  HARD: 'Hardware',
  HEAL: 'Health',
  LAW: 'Law',
  MATH: 'Math',
  MECH: 'Mechanical',
  MED: 'Medicine',
  MUSI: 'Music',
  PHYS: 'Physics',
  PROJ: 'Project Management',
  RES: 'Research',
  RET: 'Retail',
  ROBO: 'Robotics',
  SERV: 'Service',
  SOFT: 'Software',
  TEAC: 'Teaching',
  TECH: 'Tech',
  WRIT: 'Writing',
};

export const TAGS_INVERTED = invert(TAGS);

export const THIRD_PARTY_AUTH = {
  UWATERLOO: 'UWaterloo CAS',
  FACEBOOK: 'Facebook',
  GOOGLE: 'Google',
};

/* eslint-disable no-useless-escape */
export const VALID_EMAIL_REGEX = /^[a-zA-Z0-9_+-]+(?:\.[a-zA-Z0-9_+-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]{2,6}$/;

export const VALID_USERNAME_REGEX = /^[0-9a-zA-Z]+$/;

export const PUBLIC_POOL_ITEMS_PER_PAGE = 24;
