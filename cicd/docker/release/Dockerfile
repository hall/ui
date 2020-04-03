ARG GIT_COMMIT_SHORT_HASH
FROM hobbyfarm/ui-sdk:${GIT_COMMIT_SHORT_HASH} AS sdk

RUN $(npm bin)/ng build --prod --aot


FROM nginx:stable-alpine

COPY --from=sdk /app/dist/* /usr/share/nginx/html
COPY cicd/docker/stage-release/ /

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
