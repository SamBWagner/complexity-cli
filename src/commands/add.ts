import * as fs from 'fs';
import chalk from 'chalk';
import { parseComplexityFile, findComplexityFile } from '../core/parser';
import { generateMarkdown } from '../core/generator';
import { isDuplicate, isValidLevel, isExistingArea } from '../core/validator';
import { confirmAction } from '../utils/prompts';
import { exitWithUsageError, exitWithError, exitCancelled } from '../utils/error-helpers';
import { Concept } from '../utils/types';

const BLANK_AREA = '___';

function getLevelInput(levelArg: string | undefined, options: { level?: string }): string {
  const levelInput = options.level || levelArg;
  
  if (!levelInput) {
    exitWithUsageError(
      'Criticality level is required.',
      'complexity add <concept> <level> [area]\n   or: complexity add <concept> --level <level> [area]'
    );
  }
  
  return levelInput;
}

function validateLevel(levelInput: string): number {
  if (!isValidLevel(levelInput)) {
    exitWithError('Level must be 1, 2, or 3.');
  }
  return parseInt(levelInput);
}

function requireComplexityFile(): string {
  const filePath = findComplexityFile();
  
  if (!filePath) {
    exitWithError('COMPLEXITY.md not found.', 'Run "complexity init" to create one.');
  }
  
  return filePath;
}

function validateConceptDoesNotExist(concept: string, existingConcepts: Concept[]): void {
  if (isDuplicate(concept, existingConcepts)) {
    exitWithError(`Concept "${concept}" already exists.`, 'Use "complexity update" to modify it.');
  }
}

async function confirmNewAreaIfNeeded(area: string, existingConcepts: Concept[]): Promise<void> {
  if (area === BLANK_AREA) {
    return;
  }

  if (isExistingArea(area, existingConcepts)) {
    return;
  }

  const confirmed = await confirmAction(
    `No pre-existing area "${area}" found. Would you still like to add it?`
  );

  if (!confirmed) {
    exitCancelled();
  }
}

function createConcept(concept: string, level: number, area: string): Concept {
  return {
    topic: concept,
    area,
    criticality: level as 1 | 2 | 3
  };
}

function saveComplexityFile(filePath: string, projectName: string, concepts: Concept[]): void {
  const markdown = generateMarkdown(projectName, concepts);
  fs.writeFileSync(filePath, markdown, 'utf-8');
}

export async function addCommand(
  concept: string,
  levelArg: string | undefined,
  areaArg: string | undefined,
  options: { level?: string }
) {
  const levelInput = getLevelInput(levelArg, options);
  const level = validateLevel(levelInput);
  const area = areaArg || BLANK_AREA;

  const filePath = requireComplexityFile();
  const doc = parseComplexityFile(filePath);

  validateConceptDoesNotExist(concept, doc.concepts);
  await confirmNewAreaIfNeeded(area, doc.concepts);

  const newConcept = createConcept(concept, level, area);
  const updatedConcepts = [...doc.concepts, newConcept];

  saveComplexityFile(filePath, doc.projectName, updatedConcepts);

  console.log(chalk.green(`✓ Added "${concept}" (Level ${level}, Area: ${area})`));
}
