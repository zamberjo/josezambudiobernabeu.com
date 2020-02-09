#!/bin/bash
set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
    echo "This script must not be run as root." 1>&2
    exit 1
fi

echo "$(pwd)"
yarn config --silent set cache-folder "$(pwd)/.npm"

PATH="$(pwd)/node_modules/.bin:${PATH}"
export PATH

if [ ${#} -eq 0 ]; then
    echo "Resolving Node dependencies..."
    yarn install

    echo "Starting server..."
    exec npm start
fi

exec "${@}"
