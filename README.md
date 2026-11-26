# Trycore EVM App — Frontend (Next.js + shadcn/ui)

Aplicación web frontend desarrollada en **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4** y **shadcn/ui** dentro de una estructura de **Monorepo con Turborepo**. Permite a los líderes de proyecto gestionar su portafolio de proyectos, registrar actividades y visualizar en tiempo real el análisis de **Valor Ganado (Earned Value Management - EVM)** según el estándar del PMI, consumiendo la API REST de **Trycore EVM Tracker API** (Java Spring Boot).

---

## Prerrequisitos

Antes de levantar la aplicación en tu entorno local, asegúrate de contar con las siguientes herramientas instaladas:

* **Bun v1.4+** *(gestor de paquetes y runtime principal del monorepo)* o **Node.js v20.9+**.
* **Git** para clonar el repositorio.
* **Backend en ejecución:** El servicio **Trycore EVM Tracker API** (Java 21 + Spring Boot + PostgreSQL) debe estar ejecutándose en el puerto **`3000`** (`http://localhost:3000`).

---

## Guía Rápida: Cómo correr el proyecto localmente

El frontend está configurado para ejecutarse en el puerto **`3001`** (`http://localhost:3001`), evitando colisiones con el backend de Spring Boot que corre en el puerto `3000`.

### Paso 1: Clonar el repositorio e ingresar al directorio
```bash
git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd trycore_evm_app
```

### Paso 2: Instalar las dependencias del monorepo
Ejecuta la instalación desde la raíz del proyecto usando **Bun**:
```bash
bun install
```

### Paso 3: Configurar variables de entorno (Opcional)
Por defecto, el cliente HTTP apunta automáticamente a `http://localhost:3000/api/v1`. Si tu backend corre en otra ruta o puerto, puedes crear un archivo `.env.local` dentro de `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Paso 4: Iniciar el servidor de desarrollo
Desde la raíz del monorepo, ejecuta:

```bash
bun run dev
```

La aplicación se levantará automáticamente en:
* **Dashboard Web:** [http://localhost:3001](http://localhost:3001)

---

## Comandos Disponibles en el Monorepo

| Comando | Descripción |
| :--- | :--- |
| `bun run dev` | Levanta el servidor de desarrollo de Next.js en `http://localhost:3001` vía Turborepo |
| `bun run build` | Genera el build optimizado de producción para todos los paquetes y aplicaciones |
| `bun run typecheck` | Ejecuta la validación estricta de tipos de TypeScript (`tsc --noEmit`) en `@workspace/ui` y `web` |
| `bun run lint` | Ejecuta ESLint sobre el código fuente del monorepo |
| `bun run format` | Formatea los archivos `.ts` y `.tsx` con Prettier y `prettier-plugin-tailwindcss` |

---

## Arquitectura del Frontend

El proyecto combina una arquitectura de **Monorepo con Turborepo** (para desacoplar el sistema de diseño `shadcn/ui` de la aplicación consumidora) con **Arquitectura Limpia / Hexagonal (Ports & Adapters)** dentro de `apps/web/src`, alineándose directamente con la arquitectura hexagonal del backend en Java.

### 1. Estructura general del Monorepo

```text
trycore_evm_app/
├── apps/
│   └── web/                        # Aplicación principal Next.js (Puerto 3001)
├── packages/
│   ├── ui/                         # Sistema de diseño compartido (@workspace/ui - shadcn/ui)
│   ├── eslint-config/              # Reglas compartidas de ESLint
│   └── typescript-config/          # Configuraciones base de TypeScript
├── package.json
└── turbo.json
```

### 2. Arquitectura por Capas en `apps/web/src`

```text
apps/web/src/
├── core/
│   ├── domain/
│   │   ├── models/
│   │   │   └── evm.model.ts            # Modelos puros del dominio (Project, Activity, EvmMetrics, CostStatus, ScheduleStatus)
│   │   └── ports/
│   │       └── evm.port.ts             # Contratos/Interfaces de entrada y salida (ProjectServicePort, ActivityServicePort)
│   ├── application/
│   │   ├── dtos/
│   │   │   └── evm.dto.ts              # Contratos exactos de Request y Response de la API Java Spring Boot
│   │   └── mappers/
│   │       └── evm.mapper.ts           # Transformadores de DTOs (serialización de BigDecimal/UUID) a modelos de dominio
│   └── infrastructure/
│       ├── http/
│       │   └── http-client.ts          # Cliente HTTP centralizado y manejo tipado de errores (ApiClientError)
│       └── services/
│           └── evm-api.service.ts      # Implementación concreta de los puertos consumiendo /api/v1/projects y /activities
├── lib/
│   └── formatters.ts                   # Formateadores financieros con separadores de miles y mapeo semántico de estados EVM
└── presentation/
    ├── hooks/
    │   └── use-evm-tracker.ts          # Custom Hook orquestador del estado de UI, llamadas asíncronas y errores de validación
    └── components/
        ├── evm-dashboard.tsx           # Layout principal, selector de portafolio, cambio de tema y pestañas de navegación
        ├── consolidated-metrics-cards.tsx # Tarjetas de desempeño CPI/SPI, barras de progreso y KPIs consolidados con Tooltips
        ├── activities-table.tsx        # Tabla detallada de actividades con indicadores calculados y acciones CRUD
        ├── evm-comparison-chart.tsx    # Gráfica comparativa visual de PV vs EV vs AC por actividad
        ├── project-form-dialog.tsx     # Modal de creación y edición de proyectos
        └── activity-form-dialog.tsx    # Modal de actividades con separador de miles en vivo y simulador preliminar EVM
```

### ¿Por qué se eligió esta arquitectura?
1. **Alineación 1:1 con el Backend Hexagonal:** Los DTOs (`ProjectRequestDto`, `ActivityRequestDto`, `ProjectResponseDto`, `ActivityResponseDto`, `EvmMetricsResponseDto` y `ApiErrorResponseDto`) reflejan exactamente los `record`s de Java.
2. **Aislamiento de la Capa de Presentación:** Los componentes de React (`presentation/components`) no conocen `fetch`, URLs ni códigos de estado HTTP; únicamente consumen modelos limpios a través del hook `useEvmTracker`.
3. **Resiliencia en Serialización Financiera:** La capa `evm.mapper.ts` garantiza que cualquier `BigDecimal` o valor nulo (`null` en casos borde cuando $AC = 0$ o $PV = 0$) proveniente de Java se normalice de forma segura en TypeScript antes de llegar a la interfaz gráfica.
4. **Sistema de Diseño Desacoplado (`@workspace/ui`):** Todos los componentes base de `shadcn/ui` (`Button`, `Card`, `Dialog`, `Table`, `Tabs`, `Tooltip`, `Badge`, `Progress`, `Alert`, `Input`, `Textarea`, `Skeleton`) viven en un paquete independiente y reutilizable.

---

## Funcionalidades Principales del Dashboard

* **CRUD Completo de Proyectos y Actividades:** Creación, edición, listado y eliminación lógica conectada en tiempo real con el backend.
* **Indicadores Consolidados e Interpretación Visual:** Tarjetas ejecutivas para **CPI** y **SPI** con estados semánticos (`Bajo Presupuesto`, `En Presupuesto`, `Sobre Presupuesto`, `Adelantado`, `En Cronograma`, `Atrasado`, `Sin Datos`) e indicadores monetarios consolidados (**BAC**, **PV**, **EV**, **AC**, **EAC**, **VAC**) con `Tooltips` explicativos de cada fórmula.
* **Tabla Detallada de Actividades:** Visualización de todas las métricas individuales por actividad junto con barras de progreso comparativas (`% Real` vs `% Planificado`).
* **Gráfica Comparativa por Actividad:** Comparación visual de barras proporcionales entre **PV (Planned Value)**, **EV (Earned Value)** y **AC (Actual Cost)** por cada actividad del proyecto.
* **Formateo de Presupuesto con Separador de Miles y Simulador en Vivo:** Los inputs monetarios (`BAC` y `AC`) formatean automáticamente los separadores de miles mientras el usuario escribe e incluyen una vista previa instantánea del cálculo EVM antes de guardar.
* **Soporte de Tema Claro / Oscuro:** Conmutador visual integrado en la barra superior (también accesible con el atajo de teclado `d`).
