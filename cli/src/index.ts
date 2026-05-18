#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { prompt } from './prompt';
import { downloadTemplates } from './download';
import { generateFiles } from './generate';

const program = new Command();

program
  .name('ai-conventions')
  .description('Generate convention files from ai-conventions templates')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize convention files in current project')
  .action(async () => {
    console.log(chalk.bold.blue('\nAI Conventions CLI\n'));

    try {
      const answers = await prompt();
      const templateDir = await downloadTemplates();
      await generateFiles(answers, templateDir, process.cwd());
      console.log(chalk.bold.green('\nConvention files generated successfully!\n'));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`\nError: ${error.message}\n`));
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
