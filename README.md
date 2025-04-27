# Besu Control Panel

Panel de administración para nodos Besu y gestión de cuentas en una red Ethereum privada.

## Características
- Login con roles: `admin` y `user`.
- Panel de administración para gestionar contenedores de nodos (crear, iniciar, detener, eliminar, ver logs, crear bootnode).
- Consulta de saldo de cualquier cuenta (admin).
- Panel de usuario para transferencias de ETH usando MetaMask.
- Interfaz moderna en modo oscuro con Tailwind CSS.

## Requisitos
- Node.js >= 18
- Yarn o npm
- Docker (para la gestión de contenedores)
- MetaMask instalado en el navegador
- Red Ethereum local corriendo en `http://localhost:8888` (o la que uses)

## Instalación

```bash
cd besu-control-panel
# Instala dependencias
npm install
# o
yarn install
```

## Comandos de desarrollo

```bash
# Inicia el servidor de desarrollo
npm run dev
# o
yarn dev
```

Accede a la app en [http://localhost:3000](http://localhost:3000)

## Comandos de producción

```bash
# Compila la app
npm run build
# o
yarn build

# Inicia en modo producción
npm start
# o
yarn start
```

## Notas de uso
- **Login:**
  - Usuario admin: `admin` / `admin`
  - Usuario normal: `user` / `user`
- **MetaMask:**
  - Debes conectar MetaMask a tu red local (por ejemplo, `http://localhost:8888`).
  - El usuario puede transferir ETH desde su cuenta conectada.
  - El admin puede consultar el saldo de cualquier dirección.
- **Contenedores:**
  - El panel permite crear, iniciar, detener y eliminar nodos.
  - El botón "Crear Bootnode" solo está habilitado si el contenedor `besu-network-bootnode` no existe.
  - Para crear el bootnode, debe existir un endpoint `/api/nodes/create-bootnode` que ejecute el script `nodo.sh` desde el mismo directorio que `nodo_create.sh`.

## Estructura principal
- `/src/app/admin` — Panel de administración
- `/src/app/dashboard` — Panel de usuario
- `/src/components` — Componentes reutilizables
- `/src/context` — Contexto de autenticación

---

¿Dudas o sugerencias? ¡Contribuciones y feedback son bienvenidos!
