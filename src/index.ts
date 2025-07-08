#!/usr/bin/env node

import inquirer from 'inquirer';
import { startTimer } from './timer';
import { showConfig } from './config';
import { loadConfig } from './storage';

enum MenuOption {
  START = 'Start',
  CONFIG = 'Config',
  EXIT = 'Exit'
}

async function showMainMenu(): Promise<void> {
  console.clear();
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'ポロモードタイマー',
      choices: [MenuOption.START, MenuOption.CONFIG, MenuOption.EXIT]
    }
  ]);

  switch (choice) {
  case MenuOption.START: {
    const config = await loadConfig();
    await startTimer(config);
    await showMainMenu();
    break;
  }
  case MenuOption.CONFIG:
    await showConfig();
    await showMainMenu();
    break;
  case MenuOption.EXIT:
    console.log('さようなら！');
    process.exit(0);
  }
}

async function main() {
  console.clear();
  await showMainMenu();
}

main().catch(console.error);