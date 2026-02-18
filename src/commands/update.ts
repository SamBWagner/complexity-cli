import * as fs from 'fs';
import chalk from 'chalk';
import { parseComplexityFile, findComplexityFile } from '../core/parser';
import { generateMarkdown } from '../core/generator';
import { findConcept, isValidLevel, isExistingArea } from '../core/validator';
import { confirmAction } from '../utils/prompts';
import { exitWithUsageError, exitWithError, exitCancelled } from '../utils/error-helpers';
import { Concept } from '../utils/types';

const BLANK_AREA = '___';

function validateAtLeastOneOptionProvided(options: { level?: string; area?: string; name?: string }): void {
  if (!options.level && !options.area && !options.name) {
    exitWithUsageError(
      'At least one option (--level, --area, or --name) is required.',
      'complexity update <concept> [--level <level>] [--area <area>] [--name <new-name>]'
    );
  }
}

function requireComplexityFile(): string {
  const filePath = findComplexityFile();
  
  if (!filePath) {
    exitWithError('COMPLEXITY.md not found.', 'Run "complexity init" to create one.');
  }
  
  return filePath;
}

function requireConceptExists(conceptName: string, concepts: Concept[]): Concept {
  const existing = findConcept(conceptName, concepts);
  
  if (!existing) {
    exitWithError(`Concept "${conceptName}" not found.`);
  }
  
  return existing;
}

function validateLevelIfProvided(level: string | undefined): void {
  if (!level) {
    return;
  }

  if (!isValidLevel(level)) {
    exitWithError('Level must be 1, 2, or 3.');
  }
}

async function confirmNewAreaIfNeeded(area: string | undefined, existingConcepts: Concept[]): Promise<void> {
  if (!area || area === BLANK_AREA) {
    return;
  }

  if (isExistingArea(area, existingConcepts)) {
    return;
  }

  const confirmed = await confirmAction(
    `No pre-existing area "${area}" found. Would you still like to use it?`
  );

  if (!confirmed) {
    exitCancelled();
  }
}

function createUpdatedConcept(
  existing: Concept,
  options: { level?: string; area?: string; name?: string }
): Concept {
  return {
    topic: options.name || existing.topic,
    area: options.area !== undefined ? options.area : existing.area,
    criticality: (options.level ? parseInt(options.level) : existing.criticality) as 1 | 2 | 3,
  };
}

function replaceConceptInList(
  conceptName: string,
  updatedConcept: Concept,
  concepts: Concept[]
): Concept[] {
  return concepts.map(c =>
    c.topic.toLowerCase() === conceptName.toLowerCase() ? updatedConcept : c
  );
}

function saveComplexityFile(filePath: string, projectName: string, concepts: Concept[]): void {
  const markdown = generateMarkdown(projectName, concepts);
  fs.writeFileSync(filePath, markdown, 'utf-8');
}

function displayUpdateSummary(
  conceptName: string,
  updatedConcept: Concept,
  options: { level?: string; area?: string; name?: string }
): void {
  console.log(chalk.green(`✓ Updated "${conceptName}"`));
  
  if (options.name) {
    console.log(chalk.gray(`  → Name: ${updatedConcept.topic}`));
  }
  
  if (options.level) {
    console.log(chalk.gray(`  → Level: ${updatedConcept.criticality}`));
  }
  
  if (options.area !== undefined) {
    console.log(chalk.gray(`  → Area: ${updatedConcept.area}`));
  }
}

export async function updateCommand(
  concept: string,
  options: { level?: string; area?: string; name?: string }
) {
  validateAtLeastOneOptionProvided(options);
  validateLevelIfProvided(options.level);

  const filePath = requireComplexityFile();
  const doc = parseComplexityFile(filePath);
  const existing = requireConceptExists(concept, doc.concepts);

  await confirmNewAreaIfNeeded(options.area, doc.concepts);

  const updatedConcept = createUpdatedConcept(existing, options);
  const updatedConcepts = replaceConceptInList(concept, updatedConcept, doc.concepts);

  saveComplexityFile(filePath, doc.projectName, updatedConcepts);
  displayUpdateSummary(concept, updatedConcept, options);
}
