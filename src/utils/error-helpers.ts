import chalk from 'chalk';

export function exitWithError(message: string, hint?: string): never {
  console.error(chalk.red(`Error: ${message}`));
  if (hint) {
    console.error(chalk.yellow(hint));
  }
  process.exit(1);
}

export function exitWithUsageError(message: string, usageExample: string): never {
  console.error(chalk.red(`Error: ${message}`));
  console.error(chalk.yellow(`Usage: ${usageExample}`));
  process.exit(1);
}

export function exitCancelled(): never {
  console.log(chalk.yellow('Cancelled.'));
  process.exit(0);
}
