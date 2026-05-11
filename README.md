# github-front

Template frontend en Next.js con App Router y una estructura basada en `src/`.

## Inicio rapido

### Requisitos

- Node.js 20+
- npm 10+

### Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` para ver la aplicacion.

## Estructura clave

```text
src/app/               # Rutas, layouts y UI principal
src/components/        # UI global compartida
src/lib/               # Servicios y logica compartida
src/hooks/             # Hooks reutilizables
src/types/             # Tipos globales
src/utils/             # Helpers genericos
public/                # Archivos estaticos
docs/                  # Buenas practicas, estructura y contribucion
CONTRIBUTING.md        # Resumen rapido para contribuir
```

## Documentacion del equipo

- [Buenas prácticas](./docs/best-practices.md)
- [Estructura del proyecto](./docs/project-structure.md)
- [Generación de código con IA](./docs/code-rules.md)
- [Contribución](./docs/contribution.md)


## Ejemplo implementado

- Ruta real: `/dashboard`
- Layout y pagina principal: `src/app/layout.tsx` y `src/app/page.tsx`
- Componentes compartidos: `src/components/common` y `src/components/ui`
- Servicios y helpers: `src/lib`, `src/utils`, `src/types`, `src/hooks`

## Scripts disponibles

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Variables de entorno

Para desarrollo local, el frontend usa proxies internos de Next.js para evitar problemas de CORS:

```bash
NEXT_PUBLIC_API_URL=/api/files
NEXT_PUBLIC_REPOSITORY_API_URL=/api/repository
```

Si quieres apuntar directo a los servicios, puedes sobrescribir esos valores con URLs absolutas.

### Local backend example

If you run the backend services locally (recommended ports used by the repo project):

```
NEXT_PUBLIC_API_URL=http://localhost:8081/api
NEXT_PUBLIC_REPOSITORY_API_URL=http://localhost:8090
NEXT_PUBLIC_ISSUES_API_URL=http://localhost:8090
```

With these absolute URLs the app will call backends directly. Alternatively keep the defaults and use Next.js rewrites (recommended) to proxy requests to the backends.
