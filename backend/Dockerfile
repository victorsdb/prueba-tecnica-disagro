# Etapa 1: compilar el proyecto
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Prisma necesita OpenSSL
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY tsconfig.json ./
COPY src ./src

# Generar Prisma Client
RUN npx prisma generate --schema=prisma/schema.prisma

# Compilar TypeScript
RUN npm run build


# Etapa 2: ejecutar el backend
FROM node:22-bookworm-slim AS runner

WORKDIR /app

# Prisma también se ejecutará aquí durante el pre-deploy
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Dejamos devDependencies porque Railway ejecutará
# prisma migrate y prisma db seed dentro de esta imagen
RUN npm ci

# Aplicación compilada
COPY --from=builder /app/dist ./dist

# Archivos requeridos por Prisma y el seed
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma7.config.ts ./prisma7.config.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/generated ./generated

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]