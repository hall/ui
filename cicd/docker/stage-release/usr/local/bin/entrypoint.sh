#!/bin/sh

# check all args for the insecure flag
if [ "${*#*--insecure}" = "$*" ]; then
    HF_SERVER=https://$HF_SERVER
else
    HF_SERVER=http://$HF_SERVER
fi

envsub() {
    eval val="\$$(set | grep "^$1.*=" | cut -f 1 -d '=')"

    sed -i'' "s|#####${1}#####|${val}|g;" /usr/share/nginx/html/main*.js*
    echo "Configured with ${1}=${val}"
}

envsub HF_SERVER
envsub HF_SUPPORT

nginx -g 'daemon off;' # overriding nginx default startup
