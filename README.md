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

- `docs/README.md`
- `docs/buenas-practicas.md`
- `docs/estructura-del-proyecto.md`
- `docs/generacion-ia.md`
- `docs/contribucion.md`

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
