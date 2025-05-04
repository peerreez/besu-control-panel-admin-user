# Besu Control Panel

Administration panel for Besu nodes and account management on a private Ethereum network.

## Features
- Login with roles: `admin` and `user`.
- Administration panel for managing node containers (create, start, stop, delete, view logs, create bootnode).
- Check the balance of any account (admin).
- User panel for ETH transfers using MetaMask.
- Modern dark-mode interface with Tailwind CSS.

## Requirements
- Node.js >= 18
- Yarn or npm
- Docker (for container management)
- MetaMask installed in the browser
- Local Ethereum network running at `http://localhost:8888` (or whatever you use)

## Installation

```bash
cd besu-control-panel
# Install dependencies
npm install
# or
yarn install
```

## Development Commands

```bash
# Start the development server
npm run dev
# or
yarn dev
```

Access the app at [http://localhost:3000](http://localhost:3000)

## Production Commands

```bash
# Build the app
npm run build
# or
yarn build

# Start in production mode
npm start
# or
yarn start
```

## Notes Usage
- **Login:**
- Admin user: `admin` / `admin`
- Regular user: `user` / `user`
- **MetaMask:**
- You must connect MetaMask to your local network (e.g., `http://localhost:8888`).
- The user can transfer ETH from their connected account.
- The admin can check the balance of any address.
- **Containers:**
- The panel allows you to create, start, stop, and delete nodes.
- The "Create Bootnode" button is only enabled if the `besu-network-bootnode` container does not exist.
- To create the bootnode, a `/api/nodes/create-bootnode` endpoint must exist that runs the `nodo.sh` script from the same directory as `nodo_create.sh`.

## Main Structure
- `/src/app/admin` — Administration Panel
- `/src/app/dashboard` — User Panel
- `/src/components` — Reusable Components
- `/src/context` — Authentication Context

---