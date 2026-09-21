# Prueba Técnica Disagro

Aplicación Full Stack desarrollada como solución a la prueba técnica de Disagro para la gestión de confirmaciones de asistencia a una feria de promociones.

La plataforma permite que los clientes registren su información, indiquen los productos y/o servicios de su interés y obtengan automáticamente los descuentos correspondientes según las reglas definidas para el evento.

Adicionalmente, se implementaron funcionalidades complementarias como persistencia de sesión y envío de correo de confirmación.

## Demo en producción

La aplicación se encuentra desplegada en Railway y puede ser utilizada desde el siguiente enlace:

**Frontend:** https://frontend-production-985f.up.railway.app

> El backend se encuentra desplegado como un servicio privado dentro de Railway y es consumido por el frontend a través de Nginx como reverse proxy.

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- Nodemailer
- express-session
- connect-pg-simple

### Base de datos

- PostgreSQL 16

### Infraestructura

- Docker
- Docker Compose
- Nginx
- Railway
- Git
- GitHub

## Funcionalidades principales

La aplicación incluye las siguientes funcionalidades:

- Registro de información del cliente.
- Selección de fecha de asistencia.
- Búsqueda y selección de productos y servicios.
- Confirmación explícita si el usuario desea continuar sin seleccionar intereses.
- Cálculo automático de descuentos según las reglas definidas.
- Cálculo de subtotales y total general.
- Pantalla de confirmación de asistencia.
- Envío de correo de confirmación con el resumen del registro.
- Persistencia temporal del formulario mediante manejo de sesión.
- Recuperación automática del progreso después de recargar la página.
- Eliminación de la sesión después de completar correctamente una inscripción.
- Persistencia de registros en PostgreSQL.
- Despliegue dockerizado en Railway.

## Reglas de descuentos

Las reglas de negocio definidas para la prueba fueron implementadas en el backend, de manera que los cálculos finales no dependan únicamente del frontend.

### Servicios

| Condición | Descuento |
|---|---:|
| Menos de 2 servicios | 0% |
| 2 o más servicios y subtotal hasta Q1,500 | 3% |
| 2 o más servicios y subtotal mayor a Q1,500 | 5% |

### Productos

| Condición | Descuento |
|---|---:|
| Menos de 3 productos | 0% |
| 3 o más productos | 3% |
| 5 o más productos | 5% |

Los precios, subtotales, descuentos y totales son recalculados por el backend al momento de confirmar la inscripción antes de almacenar la información en la base de datos.

## Arquitectura de la solución

La aplicación se encuentra separada en frontend, backend y base de datos.

```mermaid
flowchart LR
    User[Usuario / Navegador]
    SMTP[Gmail SMTP]

    subgraph Railway["Railway"]

        subgraph Public["Acceso público"]
            Proxy[Railway HTTPS Proxy]
            Frontend[Frontend<br/>React + Nginx]
        end

        subgraph Private["Red privada"]
            Backend[Backend<br/>Node.js + Express + Prisma]
            Database[(PostgreSQL<br/>Datos + sesiones)]
        end

    end

    User -->|HTTPS| Proxy
    Proxy --> Frontend

    Frontend -->|/api/*| Backend

    Backend -->|Consultas y transacciones| Database

    Backend -.->|SMTP<br/>Correo de confirmación| SMTP
```

En producción, el navegador accede únicamente al dominio público del frontend.

Las solicitudes realizadas a `/api/*` son interceptadas por Nginx y enviadas al backend mediante la red privada de Railway.

De esta forma, el backend y la base de datos permanecen como servicios internos y no requieren exposición pública directa.

## Manejo de sesión

Como funcionalidad adicional, se implementó persistencia temporal del formulario mediante sesiones.

El objetivo es evitar que el usuario pierda la información ingresada si recarga accidentalmente la página antes de completar su registro.

La sesión almacena temporalmente:

- Paso actual del formulario.
- Información del cliente.
- Fecha de asistencia.
- Productos seleccionados.
- Servicios seleccionados.

La sesión se gestiona en el backend utilizando `express-session` y se persiste en PostgreSQL mediante `connect-pg-simple`.

```mermaid
flowchart TD
    subgraph Cliente
        A[Navegador]
    end

    subgraph Servidor
        B[Backend Express]
        C[(PostgreSQL)]
    end

    A -->|Cookie HttpOnly| B
    B -->|Sesiones / datos| C
```

Características principales:

- Cookie `HttpOnly`.
- Persistencia de sesión en PostgreSQL.
- Tiempo de expiración de 2 horas.
- Recuperación automática del progreso al recargar la página.
- Eliminación de la sesión después de completar correctamente una inscripción.
- Cookie segura habilitada en producción.

## Correo de confirmación

Después de registrar correctamente la asistencia, el sistema envía un correo electrónico con el resumen de la inscripción.

El correo incluye:

- Nombre del cliente.
- Fecha de asistencia.
- Servicios seleccionados.
- Productos seleccionados.
- Subtotales.
- Descuentos aplicados.
- Total general.

El envío se realiza utilizando `Nodemailer` mediante SMTP.

El correo se procesa de forma no bloqueante respecto al registro principal:

```text
Guardar inscripción
        │
        ├────► Responder al frontend
        │
        └────► Enviar correo de confirmación
```

De esta forma, una demora o error temporal en el servicio de correo no invalida una inscripción que ya fue almacenada correctamente en la base de datos.

## Estructura del proyecto

El repositorio se encuentra organizado como un monorepo con frontend, backend y configuración de infraestructura en un mismo proyecto.

```text
prueba-tecnica-disagro/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── server.ts
│   │
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma7.config.ts
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

## Variables de entorno

La aplicación utiliza variables de entorno para separar la configuración del código fuente y permitir su ejecución en distintos entornos.

> Los archivos `.env` que contienen credenciales reales no deben incluirse en el repositorio.

### Backend

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `PORT` | Puerto utilizado por el servidor Express |
| `FRONTEND_URL` | Origen permitido para las solicitudes del frontend |
| `SESSION_SECRET` | Clave utilizada para firmar la sesión |
| `SESSION_COOKIE_SECURE` | Indica si la cookie debe enviarse únicamente mediante HTTPS |
| `SMTP_HOST` | Servidor SMTP utilizado para el envío de correos |
| `SMTP_PORT` | Puerto del servidor SMTP |
| `SMTP_USER` | Usuario de autenticación SMTP |
| `SMTP_PASSWORD` | Contraseña o clave de aplicación SMTP |
| `SMTP_FROM` | Remitente mostrado en los correos de confirmación |

Ejemplo:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/disagro_db
PORT=3000

FRONTEND_URL=http://localhost:5173

SESSION_SECRET=change-this-secret
SESSION_COOKIE_SECURE=false

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=your-password
SMTP_FROM="Disagro Feria de Promociones <user@example.com>"
```

### Frontend

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base utilizada por el frontend para consumir la API |

Para desarrollo local:

```env
VITE_API_URL=http://localhost:3000/api
```

En el contenedor de producción se utiliza:

```env
VITE_API_URL=/api
```

Esto permite que las solicitudes sean enviadas a Nginx y posteriormente redirigidas al backend.

### Nginx

| Variable | Descripción |
|---|---|
| `BACKEND_URL` | Dirección interna del backend utilizada por el reverse proxy |
| `NGINX_RESOLVER` | Servidor DNS utilizado por Nginx para resolver dinámicamente el backend |

En producción, `BACKEND_URL` utiliza el dominio privado proporcionado por Railway.

## Ejecución local

### Requisitos

Antes de iniciar se requiere tener instalado:

- Git.
- Node.js 22 o superior.
- npm.
- Docker.
- Docker Compose.

### Consideraciones para Windows

En Windows se recomienda utilizar:

- WSL2.
- Docker Desktop con integración WSL2 habilitada.
- Visual Studio Code con la extensión WSL.

El proyecto fue desarrollado utilizando Windows con WSL2 (Ubuntu), permitiendo trabajar en un entorno Linux mientras Docker Desktop administra los contenedores.

> En Linux o macOS no es necesario utilizar WSL2.

### 1. Clonar el repositorio

```bash
git clone https://github.com/victorsdb/prueba-tecnica-disagro.git
cd prueba-tecnica-disagro
```

### 2. Configurar variables de entorno

Antes de iniciar los servicios deben configurarse las variables de entorno descritas en la sección anterior.

Para desarrollo local se requiere la configuración correspondiente tanto para el backend como para el frontend.

### 3. Crear e iniciar PostgreSQL con Docker

La base de datos PostgreSQL se encuentra definida en el archivo `docker-compose.yml`, por lo que no es necesario crear manualmente el contenedor.

Desde la raíz del proyecto ejecutar:

```bash
docker compose up -d postgres
```

En la primera ejecución, Docker creará automáticamente:

- El contenedor de PostgreSQL.
- La red necesaria para los servicios.
- El volumen persistente utilizado por la base de datos.

Para verificar que PostgreSQL se encuentra en ejecución:

```bash
docker compose ps
```

La base de datos estará disponible localmente en:

```text
localhost:5432
```

> El volumen de Docker permite conservar la información aunque el contenedor sea detenido o reiniciado.

### 4. Preparar e iniciar el backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

El estado del servicio puede comprobarse mediante:

```text
http://localhost:3000/api/health
```

### 5. Iniciar el frontend

En una terminal diferente:

```bash
cd frontend
npm install
npm run dev
```

Por defecto, Vite ejecutará la aplicación en:

```text
http://localhost:5173
```

La variable `FRONTEND_URL` configurada en el backend debe coincidir con la dirección desde la cual se ejecuta el frontend.

## Ejecución completa con Docker Compose

Además del modo de desarrollo, la aplicación puede ejecutarse completamente mediante Docker Compose.

Desde la raíz del proyecto ejecutar:

```bash
docker compose up -d --build
```

Este comando construye e inicia los siguientes servicios:

- PostgreSQL.
- Backend Node.js / Express.
- Frontend React servido mediante Nginx.

En la primera ejecución se deben aplicar las migraciones y cargar los datos iniciales:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

Para verificar el estado de los contenedores:

```bash
docker compose ps
```

Una vez iniciados los servicios, la aplicación estará disponible en:

```text
Frontend:
http://localhost:8080
```

El backend también puede verificarse directamente mediante:

```text
http://localhost:3000/api/health
```

En este entorno, el frontend utiliza Nginx como reverse proxy.

Las solicitudes realizadas desde el navegador a:

```text
/api/*
```

son redirigidas internamente hacia el contenedor del backend:

```text
http://backend:3000
```

De esta forma, el flujo local dockerizado reproduce una arquitectura similar a la utilizada en producción.

### Ver logs

Para consultar los logs de todos los servicios:

```bash
docker compose logs -f
```

También es posible consultar un servicio específico:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Detener los servicios

Para detener los contenedores:

```bash
docker compose down
```

Los datos de PostgreSQL permanecen almacenados en el volumen persistente definido en `docker-compose.yml`.

> No se recomienda utilizar `docker compose down -v` salvo que se desee eliminar intencionalmente la información almacenada en la base de datos.

## Base de datos, migraciones y datos iniciales

La aplicación utiliza PostgreSQL como base de datos relacional y Prisma como ORM para gestionar el modelo de datos, las migraciones y el acceso desde el backend.

### Modelo de datos

Las entidades principales son:

- `Customer`: almacena la información del cliente.
- `Product`: catálogo de productos disponibles.
- `Service`: catálogo de servicios disponibles.
- `Registration`: representa la inscripción del cliente a la feria.
- `RegistrationProduct`: relación entre una inscripción y los productos seleccionados.
- `RegistrationService`: relación entre una inscripción y los servicios seleccionados.

La inscripción almacena también los subtotales, descuentos y totales calculados al momento de confirmar el registro.

### Migraciones

Las migraciones de Prisma se encuentran en:

```text
backend/prisma/migrations/
```

Para aplicar las migraciones pendientes:

```bash
npx prisma migrate deploy
```

Este comando crea o actualiza la estructura de la base de datos utilizando las migraciones versionadas dentro del repositorio.

### Generación del cliente Prisma

Después de instalar las dependencias o realizar cambios en el esquema de Prisma se puede generar el cliente mediante:

```bash
npx prisma generate
```

### Datos iniciales

El proyecto incluye un proceso de `seed` para cargar el catálogo inicial de productos y servicios.

Para ejecutarlo:

```bash
npx prisma db seed
```

Actualmente se cargan los siguientes datos iniciales:

#### Productos

| Producto | Precio |
|---|---:|
| Fertilizante Premium | Q350.00 |
| Semillas Mejoradas | Q450.00 |
| Control de Plagas | Q275.00 |
| Fertilizante Foliar | Q225.00 |
| Bioestimulante | Q300.00 |

#### Servicios

| Servicio | Precio |
|---|---:|
| Análisis de Suelo | Q850.00 |
| Asesoría Técnica | Q750.00 |
| Agricultura de Precisión | Q1,200.00 |
| Monitoreo de Cultivo | Q500.00 |

El proceso de `seed` está diseñado para evitar la creación de registros duplicados al ejecutarse nuevamente.

## Endpoints de la API

La API REST se encuentra disponible bajo el prefijo:

```text
/api
```

### Salud del servicio

#### `GET /api/health`

Permite verificar que el backend se encuentra disponible.

Ejemplo:

```text
GET /api/health
```

### Productos

#### `GET /api/products`

Obtiene el catálogo de productos activos disponibles para la feria.

### Servicios

#### `GET /api/services`

Obtiene el catálogo de servicios activos disponibles para la feria.

### Inscripciones

#### `POST /api/registrations`

Registra una nueva confirmación de asistencia.

El backend valida la información recibida, consulta los productos y servicios seleccionados, calcula los descuentos correspondientes y almacena la inscripción en PostgreSQL.

Ejemplo de estructura de solicitud:

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "55555555",
  "attendanceAt": "2026-09-25",
  "productIds": [1, 2, 3],
  "serviceIds": [1, 2]
}
```

El backend no recibe subtotales ni descuentos calculados por el frontend.

Estos valores se determinan nuevamente del lado del servidor antes de almacenar la inscripción.

### Sesión

#### `GET /api/session`

Obtiene el borrador almacenado en la sesión actual.

#### `PUT /api/session`

Guarda o actualiza temporalmente el progreso del formulario.

#### `DELETE /api/session`

Elimina la sesión actual después de completar correctamente el registro.

La sesión se identifica mediante una cookie `HttpOnly` y su información se almacena en PostgreSQL.

## Despliegue en Railway

La aplicación se encuentra desplegada en Railway utilizando servicios independientes para frontend, backend y PostgreSQL.

### Servicios desplegados

La arquitectura en producción se distribuye de la siguiente manera:

- **Frontend:** servicio público accesible desde Internet.
- **Backend:** servicio privado dentro de la red interna de Railway.
- **PostgreSQL:** base de datos privada.
- **SMTP:** servicio externo utilizado para el envío de correos.

El frontend es el único servicio expuesto públicamente.

Las solicitudes realizadas desde el navegador a rutas `/api/*` son atendidas por Nginx y redirigidas hacia el backend utilizando la red privada de Railway.

### Frontend

El frontend se construye con Vite y posteriormente se sirve mediante Nginx.

En producción se utiliza:

```text
VITE_API_URL=/api
```

De esta forma, el navegador realiza las solicitudes contra el mismo dominio del frontend y Nginx se encarga de enviarlas al backend.

### Backend

El backend se ejecuta como un servicio Node.js dentro de Railway.

Antes de iniciar la aplicación se ejecutan las migraciones y el proceso de carga de datos iniciales:

```bash
npx prisma migrate deploy
npx prisma db seed
```

El backend utiliza la red privada de Railway para comunicarse con PostgreSQL y no necesita estar expuesto directamente a Internet.

### Resolución dinámica del backend

Los servicios de Railway pueden cambiar su dirección IP privada después de un nuevo despliegue.

Para evitar que Nginx conserve una dirección anterior del backend, se configuró resolución DNS dinámica.

Nginx resuelve el dominio interno del backend:

```text
backend.railway.internal
```

utilizando el DNS interno proporcionado por Railway.

Esto permite que el frontend continúe comunicándose correctamente con el backend después de nuevos despliegues sin necesidad de modificar manualmente direcciones IP.

### Base de datos

PostgreSQL se ejecuta como un servicio privado dentro del mismo proyecto de Railway.

La conexión desde el backend se realiza mediante la variable:

```text
DATABASE_URL
```

Las migraciones de Prisma permiten mantener versionada la estructura de la base de datos entre los diferentes despliegues.

## Decisiones técnicas relevantes

Durante la implementación se tomaron varias decisiones con el objetivo de mantener una arquitectura simple, reproducible y adecuada para el alcance de la prueba.

### PostgreSQL + Prisma

Se eligió PostgreSQL como base de datos relacional debido a que el modelo requiere relaciones claras entre clientes, inscripciones, productos y servicios.

Prisma se utiliza como ORM para:

- Definir el modelo de datos.
- Gestionar migraciones.
- Generar un cliente tipado para TypeScript.
- Simplificar las consultas y transacciones desde el backend.

### Cálculos de negocio en el backend

Las reglas de descuentos se calculan nuevamente en el backend.

El frontend únicamente envía los identificadores de los productos y servicios seleccionados.

Esto evita depender de valores calculados por el cliente y asegura que los precios, descuentos y totales almacenados sean determinados por la lógica del servidor.

### Nginx como reverse proxy

En producción, Nginx sirve los archivos estáticos generados por React y también funciona como reverse proxy para las solicitudes realizadas a `/api/*`.

Esto permite utilizar un único dominio público y mantener el backend dentro de la red privada de Railway.

### Backend privado

El backend no necesita exposición pública directa.

El acceso se realiza desde Nginx utilizando la red privada de Railway, reduciendo la superficie pública de la aplicación.

### Sesiones persistentes

El manejo de sesión fue implementado utilizando `express-session` y `connect-pg-simple`.

En lugar de almacenar el estado completo únicamente en el navegador, la información temporal del formulario se guarda en PostgreSQL y el cliente mantiene una cookie de sesión `HttpOnly`.

Esto permite recuperar el progreso después de una recarga de página.

### Envío de correo no bloqueante

El registro principal no espera a que finalice el envío del correo de confirmación.

Una vez que la inscripción ha sido almacenada correctamente, el backend puede responder al frontend mientras el correo continúa procesándose.

De esta forma, un retraso temporal del servidor SMTP no aumenta innecesariamente el tiempo de respuesta del registro.

### Dockerización

Frontend, backend y PostgreSQL pueden ejecutarse mediante Docker Compose.

Esto permite reproducir el entorno con una configuración consistente y facilita el despliegue en infraestructura basada en contenedores.

### Resolución DNS dinámica en Nginx

Nginx fue configurado para resolver dinámicamente la dirección privada del backend.

Esto evita depender de una dirección IP específica y permite que la comunicación continúe funcionando cuando Railway reemplaza una instancia durante un redeploy.

## Pruebas realizadas

Durante el desarrollo se realizaron pruebas manuales en entorno local, Docker y producción para validar los principales flujos de la aplicación.

### Registro de asistencia

Se verificaron los siguientes escenarios:

- Registro con productos y servicios seleccionados.
- Registro únicamente con productos.
- Registro únicamente con servicios.
- Registro sin productos ni servicios, mostrando previamente una confirmación al usuario.
- Persistencia correcta de la información del cliente y de la inscripción.
- Creación de las relaciones correspondientes entre inscripciones, productos y servicios.

### Reglas de descuentos

Se validaron diferentes combinaciones para comprobar las reglas definidas.

#### Productos

- Menos de 3 productos: sin descuento.
- 3 o más productos: 3% de descuento.
- 5 o más productos: 5% de descuento.

#### Servicios

- Menos de 2 servicios: sin descuento.
- 2 o más servicios con subtotal de hasta Q1,500: 3% de descuento.
- 2 o más servicios con subtotal mayor a Q1,500: 5% de descuento.

También se verificó que los cálculos almacenados en la base de datos correspondieran con los valores retornados por el backend.

### Manejo de sesión

Se verificó que:

- El progreso del formulario se conserve al recargar la página.
- Los datos del cliente sean recuperados correctamente.
- Los productos y servicios seleccionados sean restaurados.
- La sesión se almacene en PostgreSQL.
- La sesión sea eliminada después de completar correctamente una inscripción.

### Correo de confirmación

Se realizaron pruebas de envío desde el entorno desplegado en Railway.

Se verificó que el correo incluya:

- Información del cliente.
- Fecha de asistencia.
- Productos y servicios seleccionados.
- Descuentos aplicados.
- Total general.

También se comprobó el escenario en el que no se seleccionan productos o servicios.

### Docker

Se verificó la ejecución coordinada de:

```text
PostgreSQL
Backend
Frontend / Nginx
```

mediante Docker Compose.

### Producción

La solución fue probada después de su despliegue en Railway, verificando:

- Acceso al frontend mediante HTTPS.
- Comunicación del frontend con el backend mediante Nginx.
- Comunicación privada entre backend y PostgreSQL.
- Persistencia de sesiones.
- Registro de inscripciones.
- Envío de correo de confirmación.
- Continuidad de la comunicación con el backend después de nuevos despliegues mediante resolución DNS dinámica.

## Mejoras futuras

La solución cumple con el alcance definido para la prueba técnica. Como posibles extensiones futuras podrían considerarse:

- Incorporar pruebas automatizadas unitarias y de integración.
- Agregar documentación interactiva de la API mediante OpenAPI / Swagger.
- Implementar un sistema de autenticación si en el futuro se requiere acceso administrativo.
- Incorporar una interfaz administrativa para consultar inscripciones y estadísticas del evento.
- Utilizar una cola de procesamiento para el envío de correos en escenarios de mayor volumen.
- Agregar monitoreo y métricas de aplicación e infraestructura.
- Incorporar paginación y filtros si los catálogos de productos y servicios aumentan considerablemente.
- Automatizar adicionalmente procesos de CI/CD para validación y despliegue.

## Autor

**Victor Alfonso López Morales**  
Ingeniero en Ciencias y Sistemas