export function promptCommand() {
  const prompt = `
I'd like you to analyze this project and create a comprehensive complexity map. This map should list everything someone needs to know to take full ownership of this software project.

For each technology, concept, or skill:
- Rate its criticality from 1-3:
  * 3 = Can't do meaningful work without it
  * 2 = Will encounter regularly; gaps will slow you down  
  * 1 = Comes up occasionally or is abstracted away

- Categorize it by area (e.g., backend, frontend, infrastructure, devops, etc.)

Use the following CLI commands to maintain the COMPLEXITY.md file:
- \`complexity add <concept> <level> [area]\` - Add a new technology
- \`complexity update <concept> --level <level> --area <area>\` - Update existing entry
- \`complexity remove <concept>\` - Remove an entry
- \`complexity list\` - View current entries

Be thorough and accurate. Consider:
- Programming languages and frameworks
- Databases and data stores
- DevOps and infrastructure tools
- Testing frameworks and methodologies
- Build tools and package managers
- Domain-specific knowledge
- Architectural patterns and design principles
- Third-party services and APIs

Start by reviewing the existing entries with \`complexity list\`, then add, update, or remove entries as needed to ensure completeness and accuracy.

Do not update the COMPLEXITY.md file manually.
`.trim();

  console.log(prompt);
}
