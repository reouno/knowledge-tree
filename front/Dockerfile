FROM node:16.19.1-alpine as frontend

WORKDIR /src

ADD . ./
RUN rm -rf .nuxt && rm -rf node_modules && yarn install

ENV HOST=${HOST}
ENV PORT=${PORT}
ENV NUXT_ENV_BASE_URL=${NUXT_ENV_BASE_URL}

RUN NUXT_ENV_BASE_URL=${NUXT_ENV_BASE_URL} yarn build

ENTRYPOINT ["yarn", "start"]
EXPOSE ${PORT}
