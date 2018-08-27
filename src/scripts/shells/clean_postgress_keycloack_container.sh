set -x
    docker kill postgres || true && docker rm postgres || true
    docker kill keycloak || true && docker rm keycloak || true