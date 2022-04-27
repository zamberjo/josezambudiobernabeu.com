#!/bin/bash

set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
    echo "This script must not be run as root." 1>&2
    exit 1
fi

PATH="$(pwd)/node_modules/.bin:${PATH}"
export PATH


if [ ${#} -eq 0 ]; then
    echo "Resolving Node dependencies..."
    npm install

    if [[ "${NODE_ENV}" == "development" ]]; then
        echo "Starting development server..."
        exec npm run dev
    else
        echo "Starting production server..."
        exec npm run start
    fi
fi

echo "[DEBUG] user: $(id -u) | group: $(id -g)"
echo "[DEBUG] pwd: $(pwd)"
echo "[DEBUG] exec: ${@}"
exec "${@}"
