FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --production

FROM oven/bun:distroless AS runtime

COPY src /app/src
COPY --from=build --chown=nonroot:nonroot /app/node_modules /app/node_modules

USER nonroot
EXPOSE 3000

CMD ["run", "--hot", "/app/src/index.ts"]
