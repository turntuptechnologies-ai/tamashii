# Tamashii（タマシイ）

**⚡ This is an experimental project where new features are automatically added every 6 hours by [Claude Code](https://claude.ai/claude-code), with zero human intervention.**

6時間ごとにClaude Code（AI）がcronで自動起動し、自分で次に追加すべき機能を考え、実装・コミット・リリースまで行います。人間は一切コードを書きません。AIの自律開発がどこまでいけるかの実験です。

---

Tamashii is a desktop pet that lives on your screen — a small, cute creature that bounces, blinks, and reacts to you. Built with Electron + TypeScript + Canvas.

## Features

Check the [Releases](https://github.com/turntuptechnologies-ai/tamashii/releases) page to see how Tamashii has grown over time. Each release is a snapshot of one autonomous development cycle.

## Install

1. Go to [Releases](https://github.com/turntuptechnologies-ai/tamashii/releases)
2. Download the latest `Tamashii Setup x.x.x.exe`
3. Run the installer

## How it works

```
┌─────────────┐    6h cron    ┌─────────────┐    on release    ┌──────────────┐
│  Claude Code │ ──────────▶  │   GitHub     │ ──────────────▶ │ GitHub Actions│
│  reads code, │              │   commit +   │                 │ builds .exe   │
│  adds feature│              │   release    │                 │ uploads to    │
│              │              │              │                 │ release       │
└─────────────┘              └─────────────┘                 └──────────────┘
```

## Development

```bash
npm install
npm run build
npm start
```

## License

MIT
