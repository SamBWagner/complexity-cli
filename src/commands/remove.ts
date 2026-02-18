import * as fs from 'fs';
import chalk from 'chalk';
import { parseComplexityFile, findComplexityFile } from '../core/parser';
import { generateMarkdown } from '../core/generator';
import { findConcept } from '../core/validator';
import { confirmAction } from '../utils/prompts';
import { exitWithError, exitCancelled } from '../utils/error-helpers';
import { Concept } from '../utils/types';

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

async function confirmRemovalIfNeeded(concept: Concept, force: boolean): Promise<void> {
  if (force) {
    return;
  }

  const confirmed = await confirmAction(
    `Remove "${concept.topic}" (Level ${concept.criticality}, Area: ${concept.area})?`
  );

  if (!confirmed) {
    exitCancelled();
  }
}

function removeConcept(conceptName: string, concepts: Concept[]): Concept[] {
  return concepts.filter(c => c.topic.toLowerCase() !== conceptName.toLowerCase());
}

function saveComplexityFile(filePath: string, projectName: string, concepts: Concept[]): void {
  const markdown = generateMarkdown(projectName, concepts);
  fs.writeFileSync(filePath, markdown, 'utf-8');
}

export async function removeCommand(concept: string, options: { force?: boolean }) {
  const filePath = requireComplexityFile();
  const doc = parseComplexityFile(filePath);
  const existing = requireConceptExists(concept, doc.concepts);

  await confirmRemovalIfNeeded(existing, options.force ?? false);

  const updatedConcepts = removeConcept(concept, doc.concepts);
  saveComplexityFile(filePath, doc.projectName, updatedConcepts);

  console.log(chalk.green(`✓ Removed "${existing.topic}"`));
}
