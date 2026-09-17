# Etapa 1: compilar el proyecto
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Generar Prisma Client
RUN npx prisma generate --schema=prisma/schema.prisma

# Compilar TypeScript
RUN npm run build


# Etapa 2: ejecutar el backend
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]