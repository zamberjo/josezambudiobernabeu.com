#!/bin/sh
# Runs a command with the local Supabase stack's URL and publishable key in
# the environment, under the names the adapters read.
#   sh scripts/with-local-supabase.sh pnpm build
set -e
eval "$(supabase status -o env 2>/dev/null)"
if [ -z "$API_URL" ]; then
	echo "The local Supabase stack is not running: supabase start" >&2
	exit 1
fi
export SUPABASE_URL="$API_URL"
export SUPABASE_PUBLISHABLE_KEY="$PUBLISHABLE_KEY"
exec "$@"
