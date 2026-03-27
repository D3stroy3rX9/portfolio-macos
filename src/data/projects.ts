export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  image?: string;
  status: 'live' | 'in-progress' | 'archived';
}

export const projects: Project[] = [
  {
    id: 'eomm-ccv2',
    name: 'EoMM – CCv2 Migration & Upgrade',
    description: 'Orchestrated on-premise to CCv2 migration (v1905 → v2211) with 40% performance gain and zero data loss. Executed Media and DB migration along with full version upgrade.',
    tech: ['SAP Commerce Cloud', 'CCv2', 'Java', 'ImpEx', 'HANA DB', 'Jenkins'],
    status: 'live',
  },
  {
    id: 'shane-co',
    name: 'Shane Co. – B2C Commerce Platform',
    description: 'Developed PLP Pagination, Solr Customization, and Third-Party vendor integrations for a large-scale B2C jewellery e-commerce platform supporting 500K+ monthly active users.',
    tech: ['SAP Commerce Cloud', 'Spartacus', 'Solr', 'Spring Boot', 'REST APIs'],
    status: 'live',
  },
  {
    id: 'caterpillar-one',
    name: 'Caterpillar ONE – B2B Commerce',
    description: 'Directed feature development, managed sprint cycles, developed critical features and customisations, resolved defect triage, and led Production deployments for a global B2B platform.',
    tech: ['SAP Commerce Cloud', 'Java', 'Spring Boot', 'CCv2', 'CI/CD', 'Docker'],
    status: 'live',
  },
  {
    id: 'audio-translator',
    name: 'Audio Auto-Translator',
    description: 'Real-time voice translation app supporting 100+ languages using OpenAI Whisper for speech recognition and LibreTranslate for translation. Features one-click recording, conversation mode, text-to-speech, translation history, PWA support, and zero API cost.',
    tech: ['Next.js 14', 'FastAPI', 'OpenAI Whisper', 'LibreTranslate', 'WebSocket', 'PostgreSQL', 'TypeScript'],
    github: 'https://github.com/D3stroy3rX9/AI-Projects/tree/claude/ai-portfolio-projects-011CUtyujqLRprJcKWjRe7eW/audio-translator',
    status: 'live',
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis Dashboard',
    description: 'Production-grade sentiment analysis using classical ML (TF-IDF + Naive Bayes via scikit-learn). Achieves F1 >0.75 — competitive with BERT — at 10,000+ predictions/second with zero API cost. Features a real-time dashboard, explainable predictions, and custom model training.',
    tech: ['Next.js 14', 'FastAPI', 'scikit-learn', 'PostgreSQL', 'TimescaleDB', 'Redis', 'Celery', 'TypeScript'],
    github: 'https://github.com/D3stroy3rX9/AI-Projects/tree/claude/ai-portfolio-projects-011CUtyujqLRprJcKWjRe7eW/sentiment-analysis',
    status: 'live',
  },
  {
    id: 'stoic-penguin',
    name: 'Stoic Penguin Path Tracker',
    description: 'A lone penguin in Antarctica charting its own path — away from the pack, towards the mountain. A visual metaphor for stoic independence, rendered as an interactive path tracker.',
    tech: ['Python', 'Visualisation'],
    status: 'live',
  },
  {
    id: 'portfolio',
    name: 'macOS Portfolio',
    description: 'This portfolio — a macOS desktop simulator built with React + Vite. Features draggable windows, live weather widget, and Spline 3D integration.',
    tech: ['React', 'TypeScript', 'Vite', 'Spline', 'Vercel'],
    link: 'https://portfolio-macos.vercel.app',
    github: 'https://github.com/D3stroy3rX9/portfolio-macos',
    status: 'live',
  },
];

export const skills = {
  backend: ['Java 8/11', 'Spring Boot', 'Spring MVC', 'Spring Security', 'REST APIs', 'gRPC', 'FastAPI', 'OAuth2', 'Microservices'],
  ecommerce: ['SAP Commerce Cloud (Hybris)', 'CCv2', 'Spartacus', 'Backoffice', 'ImpEx', 'FlexibleSearch', 'Solr'],
  devops: ['Jenkins', 'Docker', 'Git', 'CI/CD Pipelines', 'Commerce Cloud v2', 'Cloud Deployment'],
  data: ['MySQL', 'SQL Server', 'HANA DB', 'Solr'],
  tools: ['Postman', 'SonarQube', 'Jira', 'Confluence', 'IntelliJ IDEA'],
  architecture: ['Microservices', 'RESTful APIs', 'SOA', 'Design Patterns'],
};

export const experience = [
  {
    role: 'DC Consultant – Senior Backend Engineer',
    company: 'Deloitte',
    period: 'June 2024 — Present',
    highlights: [
      'Delivered 50+ REST APIs on SAP Commerce Cloud (CCv2 v2211) processing 100K+ daily transactions with 99.9% uptime; reduced response times by 35% via query & caching optimisation',
      'Spearheaded technical design and feature ownership, cutting delivery cycles by 25% and achieving 95% SLA compliance with 30% faster incident resolution',
      'Mentored 4 developers through code reviews, improving code quality by 40% (SonarQube metrics)',
      'Driving project-wide AI adoption — created guardrails and rulesets for LLM models for standardised code generation and issue resolution',
    ],
  },
  {
    role: 'DC Analyst – Backend Engineer',
    company: 'Deloitte',
    period: 'September 2021 — June 2024',
    highlights: [
      'Migrated SAP Commerce from On-Premise (v1905) to CCv2 and upgraded to v2211 with zero downtime for 50K+ SKU catalog; SQL optimisation improved data processing by 45%',
      'Built 20+ backend services using Java Spring Boot for B2C platform supporting 500K+ monthly active users',
      'Developed Solr, Promotions, and Order Management modules increasing conversion rate by 18%; delivered 10+ features with 98% defect-free rate',
    ],
  },
];
