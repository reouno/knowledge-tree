FROM node:14.17.0-alpine as frontend

ENV HOST=0.0.0.0
ENV NUXT_ENV_BASE_URL=http://localhost

WORKDIR /src

ADD . ./
RUN rm -rf .nuxt && rm -rf node_modules && yarn install
RUN NUXT_ENV_BASE_URL=${NUXT_ENV_BASE_URL} yarn build

ENTRYPOINT ["yarn", "start"]
EXPOSE 3000
