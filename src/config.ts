import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadConfig, saveConfig } from './storage';

export async function showConfig(): Promise<void> {
  let continueConfig = true;

  while (continueConfig) {
    const currentConfig = await loadConfig();

    console.clear();
    console.log(chalk.bold('=== 設定画面 ==='));
    console.log();

    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: '設定項目を選択してください',
        choices: [
          {
            name: `作業時間: ${chalk.green(currentConfig.workMinutes + '分')}`,
            value: 'work',
          },
          {
            name: `休憩時間: ${chalk.yellow(
              currentConfig.breakMinutes + '分'
            )}`,
            value: 'break',
          },
          {
            name: 'メインメニューに戻る',
            value: 'back',
          },
        ],
      },
    ]);

    if (choice === 'back') {
      continueConfig = false;
      continue;
    }

    if (choice === 'work') {
      console.clear();
      console.log(chalk.bold('作業時間の変更'));
      console.log(`現在: ${chalk.green(currentConfig.workMinutes + '分')}`);
      console.log();
      const { workMinutes } = await inquirer.prompt([
        {
          type: 'number',
          name: 'workMinutes',
          message: '新しい作業時間（分）',
          default: currentConfig.workMinutes,
          validate: (value) => value > 0 || '1分以上を入力してください',
        },
      ]);

      await saveConfig({ ...currentConfig, workMinutes });
      console.log(chalk.green('作業時間を更新しました！'));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (choice === 'break') {
      console.clear();
      console.log(chalk.bold('休憩時間の変更'));
      console.log(`現在: ${chalk.yellow(currentConfig.breakMinutes + '分')}`);
      console.log();
      const { breakMinutes } = await inquirer.prompt([
        {
          type: 'number',
          name: 'breakMinutes',
          message: '新しい休憩時間（分）',
          default: currentConfig.breakMinutes,
          validate: (value) => value > 0 || '1分以上を入力してください',
        },
      ]);

      await saveConfig({ ...currentConfig, breakMinutes });
      console.log(chalk.yellow('休憩時間を更新しました！'));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
