import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import readline from 'readline';

enum StopwatchMenuOption {
  START = 'スタート',
  BACK = '戻る'
}

enum StopwatchState {
  RUNNING = 'running',
  STOPPED = 'stopped',
  PAUSED = 'paused'
}

interface StopwatchDisplay {
  hours: number;
  minutes: number;
  seconds: number;
  state: StopwatchState;
}

function formatStopwatchTime(hours: number, minutes: number, seconds: number): string {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function displayStopwatch(display: StopwatchDisplay): void {
  console.clear();
  
  const timeString = formatStopwatchTime(display.hours, display.minutes, display.seconds);
  const color = display.state === StopwatchState.PAUSED ? chalk.yellow : 
    display.state === StopwatchState.STOPPED ? chalk.red : chalk.cyan;
  
  const title = display.state === StopwatchState.RUNNING ? 'ストップウォッチ - 計測中' : 
    display.state === StopwatchState.PAUSED ? 'ストップウォッチ - 一時停止中' :
      'ストップウォッチ - 停止中';
  console.log(chalk.bold(title));
  console.log();
  
  try {
    const bigText = figlet.textSync(timeString, {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });
    console.log(color(bigText));
  } catch (err) {
    console.log(color.bold(timeString));
  }
  
  console.log();
  if (display.state === StopwatchState.RUNNING) {
    console.log('Ctrl+X: 一時停止 | Enter: 停止 | Esc: メニューに戻る');
  } else if (display.state === StopwatchState.PAUSED) {
    console.log('Ctrl+X: 再開 | Enter: 停止 | Esc: メニューに戻る');
  } else {
    console.log('Enter: メニューに戻る');
  }
}

async function runStopwatch(): Promise<void> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Raw modeを有効にしてキー入力を取得
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const startTime = Date.now();
    let elapsedTime = 0;
    let isPaused = false;
    let isStopped = false;
    let currentState = StopwatchState.RUNNING;
    let pausedTime = 0;

    const interval = setInterval(() => {
      if (!isPaused && !isStopped) {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime - pausedTime;
        
        const totalMilliseconds = elapsedTime;
        const hours = Math.floor(totalMilliseconds / 3600000);
        const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
        
        displayStopwatch({
          hours,
          minutes,
          seconds,
          state: currentState
        });
      }
    }, 1000);

    // キー入力のリスナー
    const keyListener = (key: string) => {
      // Ctrl+X (ASCII 24)
      if (key === '\u0018') {
        if (!isStopped) {
          if (isPaused) {
            // 再開
            const pauseEndTime = Date.now();
            pausedTime += pauseEndTime - pauseStartTime;
            isPaused = false;
            currentState = StopwatchState.RUNNING;
          } else {
            // 一時停止
            pauseStartTime = Date.now();
            isPaused = true;
            currentState = StopwatchState.PAUSED;
          }
          
          const totalMilliseconds = elapsedTime;
          const hours = Math.floor(totalMilliseconds / 3600000);
          const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
          const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
          
          displayStopwatch({
            hours,
            minutes,
            seconds,
            state: currentState
          });
        }
      }
      // Enter (ASCII 13)
      if (key === '\r') {
        if (!isStopped) {
          // 停止
          isStopped = true;
          currentState = StopwatchState.STOPPED;
          
          const totalMilliseconds = elapsedTime;
          const hours = Math.floor(totalMilliseconds / 3600000);
          const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
          const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
          
          displayStopwatch({
            hours,
            minutes,
            seconds,
            state: currentState
          });
        } else {
          // 停止中にEnterで終了
          clearInterval(interval);
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.stdin.removeListener('data', keyListener);
          rl.close();
          console.clear();
          resolve();
        }
      }
      // Escキー (ASCII 27)
      if (key === '\u001b') {
        clearInterval(interval);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener('data', keyListener);
        rl.close();
        console.clear();
        resolve();
      }
      // Ctrl+C
      if (key === '\u0003') {
        clearInterval(interval);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener('data', keyListener);
        rl.close();
        console.clear();
        process.exit(0);
      }
    };

    let pauseStartTime = 0;
    process.stdin.on('data', keyListener);
  });
}

export async function showStopwatchMenu(): Promise<void> {
  console.clear();
  console.log(chalk.bold('=== ストップウォッチ ==='));
  console.log();
  
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'メニュー',
      choices: [StopwatchMenuOption.START, StopwatchMenuOption.BACK]
    }
  ]);

  switch (choice) {
  case StopwatchMenuOption.START:
    await runStopwatch();
    await showStopwatchMenu();
    break;
  case StopwatchMenuOption.BACK:
    return;
  }
}