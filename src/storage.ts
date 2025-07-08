import storage from 'node-persist';
import { Config } from './types';

const CONFIG_KEY = 'pomodoro-config';

const DEFAULT_CONFIG: Config = {
  workMinutes: 25,
  breakMinutes: 5
};

let initialized = false;

async function initStorage() {
  if (!initialized) {
    await storage.init({
      dir: '.poro-config',
      ttl: false
    });
    initialized = true;
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await initStorage();
  await storage.setItem(CONFIG_KEY, config);
}

export async function loadConfig(): Promise<Config> {
  await initStorage();
  const config = await storage.getItem(CONFIG_KEY);
  return config || DEFAULT_CONFIG;
}