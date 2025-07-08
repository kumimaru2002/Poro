# Poro

CLIで動作するポモドーロタイマーとストップウォッチのツールです。

## 概要

Poroは、コマンドラインで使えるシンプルな時間管理ツールです。ポモドーロテクニックを使った作業時間の管理と、ストップウォッチ機能を提供します。

### 主な機能

- **ポモドーロタイマー**: 作業時間と休憩時間を管理
  - カスタマイズ可能な作業時間と休憩時間
  - 一時停止/再開機能
  - 大きなASCIIアートでの時間表示
- **ストップウォッチ**: 経過時間を計測
  - 一時停止/再開機能
  - 時:分:秒形式での表示

## インストール

### npmからインストール（推奨）
```bash
# グローバルインストール
npm install -g poro-cli

# または、npxで直接実行
npx poro-cli
```

### ソースコードからインストール
```bash
# リポジトリをクローン
git clone https://github.com/kumimaru2002/Poro.git
cd Poro

# パッケージのインストール
npm install

# ビルド
npm run build

# グローバルインストール（オプション）
npm link
```

## 使い方

### 開発モード
```bash
npm run dev
```

### 本番実行
```bash
npm start
# または、グローバルインストール後
poro
```

### メニュー操作

1. アプリケーション起動後、モードを選択
   - ポモドーロタイマー
   - ストップウォッチ
   - 終了

2. ポモドーロタイマー
   - **Start**: タイマーを開始
   - **Config**: 作業時間と休憩時間を設定
   - **戻る**: メインメニューに戻る

3. ストップウォッチ
   - **スタート**: 計測を開始
   - **戻る**: メインメニューに戻る

### キーボードショートカット

タイマー/ストップウォッチ実行中:
- `Ctrl+X`: 一時停止/再開
- `Esc`: メニューに戻る
- `Ctrl+C`: アプリケーション終了
- `Enter`: (ストップウォッチのみ) 計測を停止

## 開発

### スクリプト
```bash
# TypeScriptのコンパイル
npm run build

# 開発モードで実行
npm run dev

# ESLintの実行
npm run lint

# ESLintの自動修正
npm run lintfix

# テストの実行
npm test
```

### 技術スタック
- TypeScript
- Node.js
- Inquirer.js (対話型CLI)
- Chalk (カラー出力)
- Figlet (ASCIIアート)
- node-persist (設定の永続化)

## ライセンス

MIT License