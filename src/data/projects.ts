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
    id: 'mcp-cicd',
    name: 'MCP CI/CD Pipeline Server',
    description: 'A Model Context Protocol server that exposes CI/CD pipeline controls as AI-callable tools. Supports GitHub Actions and Jenkins adapters.',
    tech: ['TypeScript', 'MCP SDK', 'GitHub Actions', 'Docker'],
    github: 'https://github.com/yourusername/mcp-cicd-server',
    status: 'in-progress',
  },
  {
    id: 'portfolio',
    name: 'macOS Portfolio',
    description: 'This portfolio website — a macOS desktop simulator built with React + Vite. Features draggable windows, a working terminal, and live CI/CD status.',
    tech: ['React', 'TypeScript', 'Vite', 'Vercel'],
    link: 'https://amrit.dev',
    github: 'https://github.com/yourusername/portfolio-macos',
    status: 'live',
  },
  {
    id: 'hybris-tools',
    name: 'SAP Hybris Dev Toolkit',
    description: 'Collection of developer productivity tools for SAP Commerce Cloud. ImpEx generators, Solr config helpers, and deployment scripts.',
    tech: ['Java', 'Spring Boot', 'SAP Commerce', 'Groovy'],
    status: 'live',
  },
  {
    id: 'microservices-demo',
    name: 'Microservices Starter',
    description: 'A production-grade microservices template with service discovery, API gateway, circuit breakers, and distributed tracing.',
    tech: ['Java', 'Spring Cloud', 'Docker', 'Kubernetes'],
    github: 'https://github.com/yourusername/microservices-starter',
    status: 'live',
  },
  {
    id: 'rest-api-gen',
    name: 'REST API Generator',
    description: 'CLI tool that scaffolds RESTful API boilerplate from OpenAPI specs. Generates controllers, services, DTOs, and tests.',
    tech: ['Node.js', 'TypeScript', 'OpenAPI', 'Handlebars'],
    github: 'https://github.com/yourusername/rest-api-gen',
    status: 'archived',
  },
];

export const skills = {
  backend: ['Java', 'Spring Boot', 'Spring Cloud', 'SAP Hybris/Commerce', 'REST APIs', 'Microservices', 'Groovy'],
  frontend: ['React', 'TypeScript', 'Vite', 'HTML/CSS', 'Tailwind'],
  devops: ['Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins', 'CI/CD', 'Terraform'],
  data: ['PostgreSQL', 'MySQL', 'Solr', 'Redis', 'MongoDB'],
  tools: ['Git', 'MCP Protocol', 'IntelliJ', 'VS Code', 'Postman', 'Jira'],
};

export const experience = [
  {
    role: 'SAP Hybris Developer',
    company: 'Your Company',
    period: '2022 — Present',
    highlights: [
      'Built and maintained SAP Commerce Cloud storefronts serving 1M+ users',
      'Designed microservices architecture for order management system',
      'Implemented CI/CD pipelines reducing deployment time by 60%',
    ],
  },
];
