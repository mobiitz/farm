# Maga Bitcoin LP Farm

Vite + React frontend for the Maga Bitcoin (`MBTC`) LP farm. The app preserves the existing single-file farm behavior while splitting it into a clean repo structure that is easier to edit, deploy, and publish on GitHub.

The frontend includes:

- Injected wallet connect
- Live reads for wallet MBTC, wallet USDC, LP balance, staked balance, earned `MBTC`, reward rate, and program end
- Direct MBTC/USDC liquidity adds through a configurable V2 router
- LP approval
- LP staking
- LP withdrawal
- Reward claiming
- Farm exit
- On-page `Add Liquidity` flow for the configured MBTC/USDC V2 pool

## Assumptions

- The original single-file app did not include a real rewards contract address, LP token address, router address, pair address, or confirmed USDC address, so those remain configurable through environment variables.
- The provided Maga Bitcoin token contract address is included as the default `VITE_TOKEN_ADDRESS`.
- The minimal ABIs are preserved from the original file. If your deployed farm contract differs, update `src/lib/abis.ts`.
- The frontend assumes `18` decimals for both rewards and LP unless you override them in `.env`.

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── main.tsx
    ├── components
    │   ├── FarmDashboard.tsx
    │   ├── MetricCard.tsx
    │   ├── ProgramInfoCard.tsx
    │   ├── StakePanel.tsx
    │   ├── StatusAlert.tsx
    │   ├── WalletActions.tsx
    │   └── ui
    │       ├── alert.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       └── input.tsx
    ├── hooks
    │   └── useFarm.ts
    ├── lib
    │   ├── abis.ts
    │   ├── config.ts
    │   ├── contracts.ts
    │   ├── format.ts
    │   └── utils.ts
    └── styles
        └── index.css
```

## Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in the values that were placeholders in the original app:

- `VITE_REWARDS_CONTRACT_ADDRESS`
- `VITE_LP_TOKEN_ADDRESS`
- `VITE_QUOTE_TOKEN_ADDRESS`
- `VITE_V2_ROUTER_ADDRESS`
- `VITE_V2_POOL_ADDRESS`
- Decimal values if your deployment does not use `18`

## Install

```bash
npm install
```

## Run In Dev

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## GitHub Pages

This repo is configured for GitHub Pages at:

```text
https://mobiitz.github.io/farm/
```

To deploy it:

1. Push the repo to the `main` branch on GitHub.
2. In GitHub, go to `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. In `Settings -> Secrets and variables -> Actions -> Variables`, create one repository variable named `env`.
5. Paste your full Vite env block into that `env` variable exactly as key/value lines.
6. Push again or run the `Deploy to GitHub Pages` workflow manually from the `Actions` tab.

## Environment Variables

All runtime configuration is read from Vite env vars:

- `VITE_CHAIN_ID`
- `VITE_CHAIN_NAME`
- `VITE_PROJECT_NAME`
- `VITE_PROJECT_TICKER`
- `VITE_WALLETCONNECT_PROJECT_ID`
- `VITE_TOKEN_SYMBOL`
- `VITE_TOKEN_ADDRESS`
- `VITE_QUOTE_TOKEN_SYMBOL`
- `VITE_QUOTE_TOKEN_ADDRESS`
- `VITE_QUOTE_TOKEN_DECIMALS`
- `VITE_LP_SYMBOL`
- `VITE_REWARDS_CONTRACT_ADDRESS`
- `VITE_LP_TOKEN_ADDRESS`
- `VITE_V2_ROUTER_ADDRESS`
- `VITE_V2_POOL_ADDRESS`
- `VITE_LIQUIDITY_SLIPPAGE_BPS`
- `VITE_LIQUIDITY_DEADLINE_MINUTES`
- `VITE_TOKEN_DECIMALS`
- `VITE_LP_DECIMALS`

## Notes For Deployment

- Wallet integration uses the injected `window.ethereum` provider and `ethers` v6, matching the original app approach.
- Contract reads refresh after wallet connect and every 10 seconds while connected.
- Direct liquidity uses the configured V2 router in `src/lib/config.ts` and calls `addLiquidity` for the MBTC/USDC pair.
- If your farm ABI differs from the minimal interface in this repo, replace the entries in `src/lib/abis.ts` with your compiled ABI.
