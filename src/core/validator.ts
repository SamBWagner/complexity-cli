import { Concept } from '../utils/types';

export function isDuplicate(concept: string, existingConcepts: Concept[]): boolean {
  return existingConcepts.some(
    c => c.topic.toLowerCase() === concept.toLowerCase()
  );
}

export function isValidLevel(level: unknown): level is 1 | 2 | 3 {
  const num = parseInt(level as string);
  return !isNaN(num) && num >= 1 && num <= 3;
}

export function isExistingArea(area: string, existingConcepts: Concept[]): boolean {
  if (!area || area === '___') return true;
  return existingConcepts.some(c => c.area.toLowerCase() === area.toLowerCase());
}

export function findConcept(conceptName: string, concepts: Concept[]): Concept | undefined {
  return concepts.find(
    c => c.topic.toLowerCase() === conceptName.toLowerCase()
  );
}
