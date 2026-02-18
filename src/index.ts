#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { removeCommand } from './commands/remove';
import { updateCommand } from './commands/update';
import { listCommand } from './commands/list';
import { promptCommand } from './commands/prompt';

const program = new Command();

program
  .name('complexity')
  .description('A CLI tool for managing project complexity and knowledge maps')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a COMPLEXITY.md file in the current directory')
  .option('-n, --name <name>', 'Project name')
  .option('-f, --force', 'Overwrite existing file')
  .action(initCommand);

program
  .command('add <concept> [level] [area]')
  .description('Add a concept to the complexity map')
  .option('-l, --level <level>', 'Criticality level (1-3)')
  .action(addCommand);

program
  .command('remove <concept>')
  .description('Remove a concept from the complexity map')
  .option('-f, --force', 'Skip confirmation')
  .action(removeCommand);

program
  .command('update <concept>')
  .description('Update an existing concept')
  .option('-l, --level <level>', 'New criticality level (1-3)')
  .option('-a, --area <area>', 'New area')
  .option('-n, --name <name>', 'New concept name')
  .action(updateCommand);

program
  .command('list')
  .description('List all concepts in the complexity map')
  .action(listCommand);

program
  .command('prompt')
  .description('Display the AI prompt for complexity analysis')
  .action(promptCommand);

program.parse();
