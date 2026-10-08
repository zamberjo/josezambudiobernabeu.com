#!/bin/sh
# Serves the site in dev mode, reading content from the database the
# backoffice edits (apps/backoffice/.env), local or remote. In dev the page's
# server load runs on every request, so a reload shows what was just saved,
# before anything is published.
set -e
env_file="$(dirname "$0")/../apps/backoffice/.env"
if [ ! -f "$env_file" ]; then
	echo "Missing apps/backoffice/.env (see apps/backoffice/.env.example)" >&2
	exit 1
fi
set -a
. "$env_file"
set +a
export CONTENT_SOURCE=supabase
exec pnpm --filter web dev "$@"
