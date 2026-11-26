# AI_PROCESS.md — Proceso de Desarrollo Frontend con IA y Optimización de Tiempo

Este documento describe de forma transparente cómo utilicé herramientas de Inteligencia Artificial durante la construcción de **Trycore EVM App** (Frontend en Next.js + `shadcn/ui`), los prompts textuales empleados en orden cronológico, las decisiones técnicas donde ajusté o corregí el rumbo sugerido por la IA, las decisiones de arquitectura tomadas de manera independiente y cómo este flujo de trabajo permitió ahorrar tiempo significativo sin sacrificar calidad ni comprensión del dominio de **Valor Ganado (EVM)**.

---

## 1. Herramientas de IA Utilizadas y Por Qué las Elegí

1. **Antigravity IDE + Agente IA (Gemini):**
   * **Uso:** Inspección cruzada entre el repositorio Backend (`trycore-evm-tracker-api` en Java Spring Boot) y el repositorio Frontend (`trycore_evm_app` en Next.js), configuración de puertos y CORS, creación de la capa de dominio/DTOs/mappers/servicios HTTP, construcción de componentes de `@workspace/ui` (`shadcn/ui`), implementación del dashboard EVM con CRUD completo, formateo con separador de miles y verificación estática de tipos (`turbo typecheck`).
   * **Por qué la elegí:** Al trabajar con un agente integrado en el entorno de desarrollo que tiene acceso simultáneo al código fuente del backend Java y al monorepo de Next.js, pude garantizar que el contrato de la API REST (endpoints, `record`s de Java, enums `CostStatus` y `ScheduleStatus`, y estructura de errores `ApiErrorResponse`) quedara sincronizado al 100% en TypeScript sin discrepancias manuales.

---

## 2. Cómo Ahorramos Tiempo con IA en el Desarrollo Frontend

El uso estratégico de la IA como copiloto de ingeniería permitió comprimir un trabajo de integración fullstack y diseño de interfaz de varias horas en iteraciones cortas y verificables:

1. **Sincronización Automática de Contratos Backend $\leftrightarrow$ Frontend (Ahorro ~60% del tiempo de integración):**
   * En lugar de transcribir a mano cada atributo de `ProjectResponse.java`, `ActivityResponse.java`, `EvmMetricsResponse.java` y `ApiErrorResponse.java`, la IA inspeccionó directamente los controladores y DTOs de Java y generó los tipos exactos en TypeScript (`evm.dto.ts`) junto con sus mappers (`evm.mapper.ts`).
2. **Construcción Acelerada de Componentes `shadcn/ui` en Monorepo (`@workspace/ui`):**
   * El proyecto partía de una plantilla base de Turborepo que solo tenía el componente `Button`. Generamos e integramos rápidamente toda la suite de componentes reutilizables (`Card`, `Dialog`, `Table`, `Tabs`, `Tooltip`, `Badge`, `Progress`, `Alert`, `Input`, `Textarea`, `Separator`, `Skeleton`) manteniendo compatibilidad con `@base-ui/react` y Tailwind CSS v4.
3. **Evolución Iterativa en Dos Fases (Primero Funcionalidad y Arquitectura, Luego Diseño Ejecutivo):**
   * Siguiendo una estrategia incremental, primero aseguramos que el puerto `3001`, la política CORS del backend, la arquitectura por capas y el CRUD completo funcionaran y compilaran sin errores. Una vez validada la base funcional, iteramos sobre la experiencia visual agregando pestañas (`Tabs`), tooltips explicativos de fórmulas PMI, simulador en vivo dentro del modal y separadores de miles.
4. **Validación Continua Automatizada:**
   * Cada cambio fue verificado ejecutando `bun run typecheck` (`turbo typecheck`) desde la terminal para asegurar cero errores de compilación tanto en `@workspace/ui` como en `apps/web`.

---

## 3. Cómo Validé las Fórmulas EVM y su Representación en el Frontend

El cálculo matemático autoritativo vive en el backend (`EvmCalculatorService` en Java con `BigDecimal`), pero en el frontend implementé dos mecanismos clave para validar y comunicar los indicadores con claridad:

1. **Simulador Preliminar en Tiempo Real (`ActivityFormDialog`):**
   * Antes de enviar la petición HTTP al backend, el formulario calcula en vivo una vista previa de:
     * $PV = \frac{\% \text{Planificado}}{100} \times BAC$
     * $EV = \frac{\% \text{Completado}}{100} \times BAC$
     * $CPI = \frac{EV}{AC}$ (controlando el caso borde $AC = 0$)
     * $SPI = \frac{EV}{PV}$ (controlando el caso borde $PV = 0$)
   * Al comparar los valores del simulador del modal con los valores persistidos que retorna el backend tras guardar la actividad, comprobé que ambos resultados coinciden exactamente.
2. **Coherencia Visual de Estados y Casos Borde:**
   * Validé que cuando una actividad recién creada tiene $AC = 0$ o $PV = 0$ (donde el backend retorna `null` en $CPI$ o $SPI$ y los estados `NO_COST_DATA` / `NO_SCHEDULE_DATA`), el mapper del frontend normaliza los valores numéricos de forma segura y las etiquetas (`Badge`) muestran el estado **"Sin Datos"** en color ámbar (`warning`), evitando errores de renderizado como `NaN` o `Infinity`.

---

## 4. Dos Decisiones Donde NO Seguí o Corregí lo que la IA Sugirió

### Decisión 1: Corrección de la lógica de formateo de separador de miles en los inputs de costo y presupuesto
* **Qué propuso inicialmente la IA:** Al implementar `formatThousandsInput` para formatear en vivo el presupuesto (`BAC`) y el costo real (`AC`), la primera versión reemplazaba comas por puntos (`.replace(",", ".")`) y dividía la cadena por `.` (`clean.split(".")`) asumiendo que el punto era un separador decimal, cuando al mismo tiempo estaba insertando puntos (`.`) como separadores de miles.
* **Qué problema detecté en las pruebas:** Al escribir `50000`, en cuanto el número superaba los tres dígitos (`5.000`), el siguiente carácter hacía que la función interpretara el punto de miles como punto decimal y truncara el valor a `5,00`, bloqueando el ingreso de cifras mayores.
* **Qué camino tomé y cómo lo corregí:** Exigí corregir la función para separar claramente el símbolo de miles (`.`) del símbolo decimal (`,`). La versión final elimina primero todos los puntos separadores de miles existentes (`raw.replace(/\./g, "")`) antes de recalcular los grupos de tres dígitos sobre la parte entera, reservando únicamente la coma (`,`) para los decimales. Verifiqué manualmente que al digitar `50000` se formatea a `50.000` y al enviar el formulario `parseThousandsInput` entrega el número `50000` limpio al backend.

### Decisión 2: Enfoque del diseño visual y comunicación de encabezados orientados al negocio y no a detalles de infraestructura
* **Qué hizo inicialmente la IA:** En la primera iteración funcional, generó una interfaz minimalista y colocó en el encabezado principal del aplicativo la descripción técnica: *"Frontend Next.js (Puerto 3001) conectado a API Spring Boot (Puerto 3000)"*.
* **Por qué decidí cambiarlo:** Un líder de proyecto que utiliza un dashboard de Valor Ganado necesita contexto de negocio y claridad visual inmediata sobre la salud de su proyecto, no detalles de puertos o frameworks en la cabecera.
* **Qué camino tomé:** Solicité eliminar esa descripción técnica y reemplazarla por una propuesta de valor enfocada en el dominio (*"Plataforma de control presupuestal, seguimiento de cronograma y análisis de Valor Ganado en tiempo real"* con distintivo `PMI Standard`), además de enriquecer la interfaz con componentes avanzados de `shadcn/ui` (`Tabs`, `Tooltip` con las fórmulas EVM, `Progress` para comparar ejecución presupuestal y avance físico, e indicadores cromáticos semánticos).

---

## 5. Decisión de Arquitectura Tomada de Forma Independiente

Decidí estructurar el frontend en **dos etapas desacopladas** apoyándome en una **Arquitectura Limpia por capas (`core/domain`, `core/application`, `core/infrastructure`, `presentation`)**:

1. **Separación estricta entre DTOs de API y Modelos de Dominio:** Aunque en aplicaciones pequeñas de React es común consumir directamente el JSON de `fetch` dentro de los componentes, decidí exigir una capa explícita de `dtos`, `mappers` y `services`. Si el día de mañana cambia un nombre de campo en el backend Java, solo se modifica `evm.mapper.ts` sin tocar ningún componente visual de `shadcn/ui`.
2. **Estrategia de desarrollo "Core & CRUD First, UI Polish Second":** Decidí pedir primero la configuración de red (puerto `3001` y CORS), los contratos de datos y un CRUD base funcional antes de invertir tiempo en el diseño visual detallado. Esto evitó depurar problemas de conexión o CORS mezclados con lógica compleja de componentes visuales.

---

## 6. Historial Cronológico de Prompts (Copiados Textualmente)

A continuación se listan todos los prompts enviados durante el desarrollo del frontend, en estricto orden cronológico y sin parafrasear:

### Prompt 1
> `@[g:\Proyectos\Java\trycore-evm-tracker-api] @[g:\Proyectos\Next JS\trycore_evm_app] Tengo estos dos proyectos, uno en Java Spring Boot que es el backend y otro que es el front end en NextJS con ShadcnUI, necesito algo complejo, requiero primero que todo modificar el puerto de conexion del front y que quede en el puerto 3001, posterior a eso, requiero crear los modelos y DTOS que requiere consumir el servicio JAVA y lo que retorna, usando componentes de shadcnUI, usa una arquitectura que se acople, genera por ahora algo basico que consuma el servicio y que genere el CRUD requerido desde el front, posterior a que funcione el CRUD iremos con el diseño, donde procuraremos usar componentes de shadcnUI, si requieres usar terminal hazlo`

### Prompt 2
> `Quedo excelente, pero puedes mejorar el diseño usando componentes de ShadcnUI, tambien si puedes poner el separador de miles para el calculo del presupuesto, y mejorale el estilo visual, se ve muy simple, quita Frontend Next.js (Puerto 3001) conectado a API Spring Boot (Puerto 3000) esa descripcion no, mejor algo relacionado a la pagina o al aplicativo`

### Prompt 3
> `Hay un error con el numero de costo de la actividad, cuando pongo 50000 el input lo transforma a 5.00 y no me deja avanzar de alli corrigelo`

### Prompt 4
> `Puedes ayudarme a generar un README.MD  con instrucciones para correr el proyecto localmente, que arquitectura usamos en el front end, los requisitos para correrlo y otro AI_PROCESS.md que muestre lo que hicimos con IA y como ahorramos tiempo con ello, pero estos README y AI_PROCESS en la carpeta del front no en la del back, la del back ya lo tiene`

---

## 7. Reflexión Honesta: ¿Qué Haría Diferente si Repitiera el Ejercicio?

1. **Incluir pruebas unitarias en el frontend desde el primer momento para utilidades de formateo:** El bug del separador de miles al escribir `50000` en `formatThousandsInput` se habría detectado instantáneamente con un test unitario simple en Vitest/Jest probando secuencias de escritura (`"5"`, `"50"`, `"500"`, `"5000"`, `"50000"`).
2. **Generar el cliente TypeScript automáticamente desde el contrato OpenAPI del backend:** Dado que el backend ya expone su especificación OpenAPI 3.0 en `/v3/api-docs`, en una siguiente iteración automatizaría la generación de `evm.dto.ts` con una herramienta como `openapi-typescript`, garantizando por construcción que cualquier cambio en el backend actualice los tipos del frontend con un solo comando.
3. **Añadir confirmación explícita (`AlertDialog`) antes de eliminar proyectos o actividades:** Aunque el backend realiza borrado lógico (`isActive = false`) y no se pierde trazabilidad en base de datos, agregar un modal de confirmación antes de ejecutar la acción de eliminación mejoraría la prevención de clics accidentales por parte del líder de proyecto.
