import { Concept, Stats } from '../utils/types';

export function calculateStats(concepts: Concept[]): Stats {
  const uniqueAreas = new Set(
    concepts
      .map(c => c.area)
      .filter(a => a && a !== '___')
  );

  return {
    totalConcepts: concepts.length,
    totalAreas: uniqueAreas.size,
    criticalCount: concepts.filter(c => c.criticality === 3).length,
    importantCount: concepts.filter(c => c.criticality === 2).length,
    situationalCount: concepts.filter(c => c.criticality === 1).length,
  };
}

export function sortConcepts(concepts: Concept[]): Concept[] {
  return [...concepts].sort((a, b) => {
    if (a.criticality !== b.criticality) {
      return b.criticality - a.criticality;
    }
    return a.topic.localeCompare(b.topic);
  });
}

export function generateMarkdown(projectName: string, concepts: Concept[]): string {
  const stats = calculateStats(concepts);
  const sorted = sortConcepts(concepts);

  const critical = sorted.filter(c => c.criticality === 3);
  const important = sorted.filter(c => c.criticality === 2);
  const situational = sorted.filter(c => c.criticality === 1);

  const lines: string[] = [];

  lines.push('# Project Complexity & Knowledge Map');
  lines.push('');
  lines.push(`<!-- Replace {Project Name} with your project name -->`);
  lines.push(`A guide to what you need to know to work on ${projectName}, broken into three tiers.`);
  lines.push('');

  lines.push(`> **${stats.totalConcepts} technologies/concepts** across ${stats.totalAreas} areas`);
  lines.push(`> **${stats.criticalCount} critical**`);
  lines.push(`> **${stats.importantCount} important**`);
  lines.push(`> **${stats.situationalCount} situational**`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## **What you NEED to know to do any meaningful work**');
  lines.push('');
  if (critical.length > 0) {
    critical.forEach(c => lines.push(`- ${c.topic}`));
  } else {
    lines.push('<!-- Criticality 3 items from the table below -->');
  }
  lines.push('');

  lines.push('## **What you SHOULD know to be very helpful**');
  lines.push('');
  if (important.length > 0) {
    important.forEach(c => lines.push(`- ${c.topic}`));
  } else {
    lines.push('<!-- Everything above, plus Criticality 2 items -->');
  }
  lines.push('');

  lines.push('## **What you should EVENTUALLY learn for specific areas**');
  lines.push('');
  if (situational.length > 0) {
    situational.forEach(c => lines.push(`- ${c.topic}`));
  } else {
    lines.push('<!-- Criticality 1 items -->');
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Full Reference');
  lines.push('');
  lines.push('<!--');
  lines.push('  Criticality scale:');
  lines.push('    3 = Can\'t do meaningful work without it');
  lines.push('    2 = Will encounter regularly; gaps will slow you down');
  lines.push('    1 = Comes up occasionally or is abstracted away enough to learn on the job');
  lines.push('-->');
  lines.push('');
  lines.push('| Topic | Area | Criticality (1-3) |');
  lines.push('|---|---|---|');

  if (sorted.length > 0) {
    sorted.forEach(c => {
      lines.push(`| ${c.topic} | ${c.area} | ${c.criticality} |`);
    });
  } else {
    lines.push('| | | |');
  }

  lines.push('');

  return lines.join('\n');
}
