// config/profile.ts — dados pessoais exibidos no portfólio (fonte: currículo).
// Textos que mudam por idioma ficam em i18n/locales.
export const profile = {
  displayName: "Dário Jr",
  fullName: "Ronisdário Alves Bezerra Jr.",
  handle: "BirdRa1n",
  location: "São Paulo, SP",
  email: "ronisdario@icloud.com",
  linkedin: "https://www.linkedin.com/in/ronisdario",
  github: "https://github.com/birdra1n",
  portrait: "/images/portrait.png",
  /** Primeiro emprego como dev — usado para calcular "anos de experiência". */
  careerStart: "2022-01-01",
  openToWork: true,
};

/** Grupos de habilidades — mesmos do currículo, na ordem de relevância. */
export const skillGroups: { key: "languages" | "frontend" | "backend" | "data" | "practices"; items: string[] }[] = [
  {
    key: "languages",
    items: ["TypeScript", "JavaScript", "Go", "PHP", "Swift", "Python", "SQL"],
  },
  {
    key: "frontend",
    items: ["React", "Next.js", "React Native", "Expo", "Vue.js", "Electron", "Tauri", "Tailwind CSS", "SCSS"],
  },
  {
    key: "backend",
    items: ["Node.js", "Express", "Laravel", "AWS (EC2, S3, SQS, SES, Lambda)", "Supabase", "Edge Functions"],
  },
  {
    key: "data",
    items: ["PostgreSQL", "MongoDB", "Firebase", "React Query", "React Hook Form", "Zod"],
  },
  {
    key: "practices",
    items: ["CI/CD (GitHub Actions)", "Testes (Jest, Pest, Maestro)", "Code review", "Scrum / Kanban", "Git"],
  },
];

export function yearsOfExperience(now = new Date()) {
  const start = new Date(profile.careerStart);
  const years = (now.getTime() - start.getTime()) / (365.25 * 24 * 3600 * 1000);

  return Math.max(1, Math.floor(years));
}
