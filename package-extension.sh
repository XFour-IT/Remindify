#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2024 ChatGPT
# SPDX-License-Identifier: AGPL-3.0-or-later

set -euo pipefail

MODE="${1:-debug}"
OUTDIR="dist"

TMP_DIR=$(mktemp -d)
ROOT_DIR="$PWD"
trap 'rm -rf "$TMP_DIR"' EXIT

cp -r src/* "$TMP_DIR/"
MANIFEST="$TMP_DIR/manifest.json"

case "$MODE" in
  debug)
    jq '.name += " Debug"' "$MANIFEST" > "$TMP_DIR/manifest.tmp" && mv "$TMP_DIR/manifest.tmp" "$MANIFEST"
    ZIP_NAME="remindify-debug.zip"
    ;;
  beta)
    jq '.name += " Beta"' "$MANIFEST" > "$TMP_DIR/manifest.tmp" && mv "$TMP_DIR/manifest.tmp" "$MANIFEST"
    ZIP_NAME="remindify-beta.zip"
    ;;
  production)
    ZIP_NAME="remindify.zip"
    ;;
  *)
    echo "Unknown mode: $MODE" >&2
    exit 1
    ;;
esac

mkdir -p "$OUTDIR"
(
  cd "$TMP_DIR"
  zip -r "$ROOT_DIR/$OUTDIR/$ZIP_NAME" .
)

echo "Created $OUTDIR/$ZIP_NAME"
