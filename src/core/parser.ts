import * as fs from 'fs';
import * as path from 'path';
import { Concept, ComplexityDocument } from '../utils/types';

const COMPLEXITY_FILE = 'COMPLEXITY.md';
const BLANK_AREA = '___';
const DEFAULT_PROJECT_NAME = 'Project Name';

function extractProjectName(lines: string[]): string {
  const projectNameLine = lines[3];
  
  if (!projectNameLine) {
    return DEFAULT_PROJECT_NAME;
  }

  const match = projectNameLine.match(/A guide to what you need to know to work on (.+?), broken/);
  return match ? match[1] : DEFAULT_PROJECT_NAME;
}

function findTableStartIndex(lines: string[]): number {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('| Topic | Area | Criticality')) {
      return i + 2;
    }
  }
  return -1;
}

function isValidCriticality(criticality: number): criticality is 1 | 2 | 3 {
  return !isNaN(criticality) && criticality >= 1 && criticality <= 3;
}

function parseTableRow(line: string): Concept | null {
  const parts = line.split('|').map(p => p.trim()).filter(p => p);

  if (parts.length !== 3) {
    return null;
  }

  const [topic, area, criticalityStr] = parts;

  if (!topic || topic === 'Topic') {
    return null;
  }

  const criticality = parseInt(criticalityStr);

  if (!isValidCriticality(criticality)) {
    return null;
  }

  return {
    topic,
    area: area || BLANK_AREA,
    criticality
  };
}

function parseTableRows(lines: string[], startIndex: number): Concept[] {
  if (startIndex === -1) {
    return [];
  }

  const concepts: Concept[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line.startsWith('|')) {
      break;
    }

    const concept = parseTableRow(line);
    
    if (concept) {
      concepts.push(concept);
    }
  }

  return concepts;
}

export function parseComplexityFile(filePath: string): ComplexityDocument {
  if (!fs.existsSync(filePath)) {
    throw new Error(`COMPLEXITY.md not found at: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  return {
    projectName: extractProjectName(lines),
    concepts: parseTableRows(lines, findTableStartIndex(lines))
  };
}

function findGitRoot(startDir: string): string | null {
  let searchDir = startDir;
  const filesystemRoot = path.parse(searchDir).root;

  while (searchDir !== filesystemRoot) {
    if (fs.existsSync(path.join(searchDir, '.git'))) {
      return searchDir;
    }
    searchDir = path.dirname(searchDir);
  }

  return null;
}

function searchUpwardForFile(startDir: string, filename: string, stopAtDir: string): string | null {
  let currentDir = startDir;

  while (true) {
    const filePath = path.join(currentDir, filename);
    
    if (fs.existsSync(filePath)) {
      return filePath;
    }

    if (currentDir === stopAtDir) {
      break;
    }

    const parentDir = path.dirname(currentDir);
    
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return null;
}

export function findComplexityFile(startDir: string = process.cwd()): string | null {
  const resolvedStartDir = path.resolve(startDir);
  const gitRoot = findGitRoot(resolvedStartDir);
  const searchLimit = gitRoot || path.parse(resolvedStartDir).root;

  return searchUpwardForFile(resolvedStartDir, COMPLEXITY_FILE, searchLimit);
}
