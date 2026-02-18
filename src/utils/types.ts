export interface Concept {
  topic: string;
  area: string;
  criticality: 1 | 2 | 3;
}

export interface ComplexityDocument {
  projectName: string;
  concepts: Concept[];
}

export interface Stats {
  totalConcepts: number;
  totalAreas: number;
  criticalCount: number;
  importantCount: number;
  situationalCount: number;
}
