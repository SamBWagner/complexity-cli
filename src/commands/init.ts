import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { promptForInput } from '../utils/prompts';
import { exitWithError } from '../utils/error-helpers';
const TEMPLATE_FILE = path.join(__dirname, '../Complexity.template.md');
const OUTPUT_FILE = 'COMPLEXITY.md';

function getOutputPath(): string {
  return path.join(process.cwd(), OUTPUT_FILE);
}

function validateFileDoesNotExist(outputPath: string, force: boolean): void {
  if (fs.existsSync(outputPath) && !force) {
    exitWithError(`${OUTPUT_FILE} already exists in this directory.`, 'Use --force to overwrite it.');
  }
}

async function getProjectName(providedName: string | undefined): Promise<string> {
  if (providedName) {
    return providedName;
  }
  return promptForInput('Enter project name:', path.basename(process.cwd()));
}

function readTemplateFile(): string {
  if (!fs.existsSync(TEMPLATE_FILE)) {
    exitWithError(`Template file not found at ${TEMPLATE_FILE}`);
  }
  return fs.readFileSync(TEMPLATE_FILE, 'utf-8');
}

function initializeTemplateContent(template: string, projectName: string): string {
  return template
    .replace(/\{Project Name\}/g, projectName)
    .replace(/\{X\}/g, '0')
    .replace(/\{Y\}/g, '0')
    .replace(/\{A\}/g, '0')
    .replace(/\{B\}/g, '0')
    .replace(/\{C\}/g, '0');
}

export async function initCommand(options: { name?: string; force?: boolean }) {
  const outputPath = getOutputPath();
  validateFileDoesNotExist(outputPath, options.force ?? false);

  const projectName = await getProjectName(options.name);
  const template = readTemplateFile();
  const content = initializeTemplateContent(template, projectName);

  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(chalk.green(`✓ Created ${OUTPUT_FILE} for project: ${projectName}`));
}
