#!/usr/bin/env bash
# Build static site and publish to /var/www/premiumabrahamicfoods.co.uk
set -euo pipefail

cd "$(dirname "$0")"

# Tells the admin the storefront is up to date, so the "needs a redeploy"
# banner clears itself instead of waiting for someone to remember. Read from
# deploy.env (untracked) — it is the same secret as the API's
# FRONTEND_DEPLOY_CALLBACK_SECRET.
if [[ -f deploy.env ]]; then
  # shellcheck disable=SC1091
  source deploy.env
fi

API_URL="${PAF_API_URL:-https://api.premiumabrahamicfoods.co.uk}"

notify_api() {
  local status="$1" message="${2:-}"

  if [[ -z "${PAF_DEPLOY_CALLBACK_SECRET:-}" ]]; then
    return 0
  fi

  # Never fail the deploy over the notification: the site is already published
  # by this point, and the banner has a manual "Mark as deployed" fallback.
  curl -fsS -m 15 -X POST "${API_URL}/api/v1/webhooks/frontend-deployed" \
    -H "X-Deploy-Secret: ${PAF_DEPLOY_CALLBACK_SECRET}" \
    -H 'Content-Type: application/json' \
    -d "{\"status\":\"${status}\",\"message\":\"${message}\"}" \
    >/dev/null 2>&1 || echo "==> Warning: could not tell the API the deploy ${status}."
}

# A build that dies half way leaves the banner up rather than silently
# claiming the edits are live.
trap 'notify_api failed "The storefront build failed on the server."' ERR

# The build reads node_modules, not package.json, so a commit that adds a
# dependency builds green here and silently omits whatever that dependency
# supplied — a missing Tailwind plugin costs no error, just unstyled pages.
# `npm ci` is skipped in favour of `install`: it is far slower and would throw
# away a working tree over a lockfile nit mid-deploy.
echo "==> Syncing dependencies…"
npm install --no-audit --no-fund

echo "==> Generating static build…"
npm run generate

echo "==> Publishing to /var/www/premiumabrahamicfoods.co.uk/"
rsync -a --delete static_output/public/ /var/www/premiumabrahamicfoods.co.uk/
chown -R www-data:www-data /var/www/premiumabrahamicfoods.co.uk

trap - ERR
notify_api success

echo "==> Done. https://premiumabrahamicfoods.co.uk"
