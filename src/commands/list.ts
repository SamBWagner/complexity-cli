import chalk from 'chalk';
import { parseComplexityFile, findComplexityFile } from '../core/parser';
import { sortConcepts } from '../core/generator';
import { exitWithError } from '../utils/error-helpers';
import { Concept } from '../utils/types';

function requireComplexityFile(): string {
  const filePath = findComplexityFile();
  
  if (!filePath) {
    exitWithError('COMPLEXITY.md not found.', 'Run "complexity init" to create one.');
  }
  
  return filePath;
}

function displayEmptyState(filePath: string): void {
  console.log(chalk.yellow('No concepts found in COMPLEXITY.md'));
  console.log(chalk.gray(`File location: ${filePath}`));
}

function displayHeader(projectName: string, filePath: string, totalConcepts: number): void {
  console.log(chalk.bold(`\nProject: ${projectName}`));
  console.log(chalk.gray(`File: ${filePath}`));
  console.log(chalk.gray(`Total concepts: ${totalConcepts}\n`));
}

type ChalkColor = typeof chalk.red.bold;

function displayConceptGroup(
  title: string,
  concepts: Concept[],
  color: ChalkColor
): void {
  if (concepts.length === 0) {
    return;
  }

  console.log(color(title));
  
  concepts.forEach(concept => {
    console.log(`  ${chalk.bold(concept.topic)} ${chalk.gray(`[${concept.area}]`)}`);
  });
  
  console.log('');
}

function groupConceptsByCriticality(concepts: Concept[]) {
  return {
    critical: concepts.filter(c => c.criticality === 3),
    important: concepts.filter(c => c.criticality === 2),
    situational: concepts.filter(c => c.criticality === 1),
  };
}

export function listCommand() {
  const filePath = requireComplexityFile();
  const doc = parseComplexityFile(filePath);
  const sorted = sortConcepts(doc.concepts);

  if (sorted.length === 0) {
    displayEmptyState(filePath);
    return;
  }

  displayHeader(doc.projectName, filePath, sorted.length);

  const groups = groupConceptsByCriticality(sorted);
  
  displayConceptGroup('Critical (Level 3):', groups.critical, chalk.red.bold);
  displayConceptGroup('Important (Level 2):', groups.important, chalk.yellow.bold);
  displayConceptGroup('Situational (Level 1):', groups.situational, chalk.green.bold);
}
