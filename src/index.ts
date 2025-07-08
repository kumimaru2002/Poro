#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { startTimer } from './timer';
import { showConfig } from './config';
import { loadConfig } from './storage';
import { showStopwatchMenu } from './stopwatch';

enum AppMode {
  POMODORO = 'ポロモードタイマー',
  STOPWATCH = 'ストップウォッチ',
  EXIT = '終了'
}

enum PomodoroMenuOption {
  START = 'Start',
  CONFIG = 'Config',
  BACK = '戻る'
}

async function showAppModeMenu(): Promise<void> {
  console.clear();
  console.log(chalk.bold('=== Poro ==='));
  console.log();
  
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: '使用するモードを選択してください',
      choices: [AppMode.POMODORO, AppMode.STOPWATCH, AppMode.EXIT]
    }
  ]);

  switch (mode) {
  case AppMode.POMODORO:
    await showPomodoroMenu();
    break;
  case AppMode.STOPWATCH:
    await showStopwatchMenu();
    await showAppModeMenu();
    break;
  case AppMode.EXIT:
    console.log('さようなら！');
    process.exit(0);
  }
}

async function showPomodoroMenu(): Promise<void> {
  let continueMenu = true;
  
  while (continueMenu) {
    console.clear();
    console.log(chalk.bold('=== ポロモードタイマー ==='));
    console.log();
    
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'メニュー',
        choices: [PomodoroMenuOption.START, PomodoroMenuOption.CONFIG, PomodoroMenuOption.BACK]
      }
    ]);

    switch (choice) {
    case PomodoroMenuOption.START: {
      const config = await loadConfig();
      await startTimer(config);
      break;
    }
    case PomodoroMenuOption.CONFIG:
      await showConfig();
      break;
    case PomodoroMenuOption.BACK:
      continueMenu = false;
      await showAppModeMenu();
      break;
    }
  }
}

async function main() {
  await showAppModeMenu();
}

main().catch(console.error);