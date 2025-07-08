import chalk from 'chalk';
import figlet from 'figlet';
import readline from 'readline';
import { Config } from './types';

enum TimerState {
  WORK = 'work',
  BREAK = 'break',
  PAUSED = 'paused',
}

interface TimerDisplay {
  minutes: number;
  seconds: number;
  state: TimerState;
}

function formatTime(minutes: number, seconds: number): string {
  const min = String(minutes).padStart(2, '0');
  const sec = String(seconds).padStart(2, '0');
  return `${min}:${sec}`;
}

function displayTimer(display: TimerDisplay): void {
  console.clear();

  const timeString = formatTime(display.minutes, display.seconds);
  const color =
    display.state === TimerState.BREAK
      ? chalk.yellow
      : display.state === TimerState.PAUSED
        ? chalk.red
        : chalk.green;

  const title =
    display.state === TimerState.WORK
      ? 'ポロモードタイマー - 作業中'
      : display.state === TimerState.BREAK
        ? 'ポロモードタイマー - 休憩中'
        : 'ポロモードタイマー - 一時停止中';
  console.log(chalk.bold(title));
  console.log();

  try {
    const bigText = figlet.textSync(timeString, {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });
    console.log(color(bigText));
  } catch (err) {
    console.log(color.bold(timeString));
  }

  console.log();
  if (display.state === TimerState.PAUSED) {
    console.log('Ctrl+X: 再開 | Esc: メニューに戻る | Ctrl+C: 終了');
  } else {
    console.log('Ctrl+X: 一時停止 | Esc: メニューに戻る | Ctrl+C: 終了');
  }
}

async function countdown(minutes: number, state: TimerState): Promise<boolean> {
  let remainingSeconds = minutes * 60;
  let isPaused = false;
  let currentState = state;

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Raw modeを有効にしてキー入力を取得
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    let interval: NodeJS.Timeout;

    const startTimer = () => {
      interval = setInterval(() => {
        if (!isPaused) {
          const mins = Math.floor(remainingSeconds / 60);
          const secs = remainingSeconds % 60;

          displayTimer({
            minutes: mins,
            seconds: secs,
            state: currentState,
          });

          remainingSeconds--;

          if (remainingSeconds < 0) {
            clearInterval(interval);
            if (process.stdin.isTTY) {
              process.stdin.setRawMode(false);
            }
            process.stdin.removeListener('data', keyListener);
            rl.close();
            resolve(true);
          }
        }
      }, 1000);
    };

    // 初回表示
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    displayTimer({
      minutes: mins,
      seconds: secs,
      state: currentState,
    });

    startTimer();

    // キー入力のリスナー
    const keyListener = (key: string) => {
      // Ctrl+X (ASCII 24)
      if (key === '\u0018') {
        isPaused = !isPaused;
        currentState = isPaused ? TimerState.PAUSED : state;
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        displayTimer({
          minutes: mins,
          seconds: secs,
          state: currentState,
        });
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
        resolve(false);
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

    process.stdin.on('data', keyListener);
  });
}

async function showBreakEndScreen(): Promise<boolean> {
  return new Promise((resolve) => {
    console.clear();
    console.log(chalk.green.bold('休憩時間が終了しました！'));
    console.log();
    console.log('Enter: 次の作業を開始 | Esc: メニューに戻る');

    // Raw modeを有効にしてキー入力を取得
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const keyListener = (key: string) => {
      // Enter (ASCII 13)
      if (key === '\r') {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener('data', keyListener);
        resolve(true);
      }
      // Escキー (ASCII 27)
      if (key === '\u001b') {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener('data', keyListener);
        resolve(false);
      }
      // Ctrl+C
      if (key === '\u0003') {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener('data', keyListener);
        console.clear();
        process.exit(0);
      }
    };

    process.stdin.on('data', keyListener);
  });
}

export async function startTimer(config: Config): Promise<void> {
  let continueSession = true;

  while (continueSession) {
    const workCompleted = await countdown(config.workMinutes, TimerState.WORK);

    // Escキーで中断された場合
    if (!workCompleted) {
      return;
    }

    console.clear();
    console.log(
      chalk.yellow.bold('作業時間が終了しました！休憩を開始します。')
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const breakCompleted = await countdown(
      config.breakMinutes,
      TimerState.BREAK
    );

    // Escキーで中断された場合
    if (!breakCompleted) {
      return;
    }

    continueSession = await showBreakEndScreen();
  }
}
