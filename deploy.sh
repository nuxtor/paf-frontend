#!/usr/bin/env bash
# Build static site and publish to /var/www/premiumabrahamicfoods.co.uk
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Generating static build…"
npm run generate

echo "==> Publishing to /var/www/premiumabrahamicfoods.co.uk/"
rsync -a --delete static_output/public/ /var/www/premiumabrahamicfoods.co.uk/
chown -R www-data:www-data /var/www/premiumabrahamicfoods.co.uk

echo "==> Done. https://premiumabrahamicfoods.co.uk"
