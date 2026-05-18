#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const prompt_1 = require("./prompt");
const download_1 = require("./download");
const generate_1 = require("./generate");
const program = new commander_1.Command();
program
    .name('ai-conventions')
    .description('Generate convention files from ai-conventions templates')
    .version('1.0.0');
program
    .command('init')
    .description('Initialize convention files in current project')
    .action(async () => {
    console.log(chalk_1.default.bold.blue('\nAI Conventions CLI\n'));
    try {
        const answers = await (0, prompt_1.prompt)();
        const templateDir = await (0, download_1.downloadTemplates)();
        await (0, generate_1.generateFiles)(answers, templateDir, process.cwd());
        console.log(chalk_1.default.bold.green('\nConvention files generated successfully!\n'));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(chalk_1.default.red(`\nError: ${error.message}\n`));
        }
        process.exit(1);
    }
});
program.parse(process.argv);
