#!/usr/bin/env bash
set -euo pipefail

APPIMAGE_SOURCE="${1:-$HOME/Downloads/LM-Studio-0.3.31-7-x64.AppImage}"
INSTALL_DIR="/opt/lmstudio"
APPIMAGE_TARGET="${INSTALL_DIR}/LM-Studio.AppImage"
ICON_TARGET="/usr/share/pixmaps/lmstudio.png"
DESKTOP_TARGET="/usr/share/applications/lmstudio.desktop"
EXEC_ARGS="--nosandbox %U"

if [[ ! -f "$APPIMAGE_SOURCE" ]]; then
  echo "No se encontró el AppImage en '$APPIMAGE_SOURCE'." >&2
  echo "Pasa la ruta como primer parámetro si está en otra ubicación." >&2
  exit 1
fi

if ! command -v sudo >/dev/null 2>&1; then
  echo "Este script requiere 'sudo' para instalar archivos en /opt y /usr/share." >&2
  exit 1
fi

TMPDIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMPDIR"
}
trap cleanup EXIT

chmod +x "$APPIMAGE_SOURCE"

sudo install -d -m 755 "$INSTALL_DIR"
sudo install -m 755 "$APPIMAGE_SOURCE" "$APPIMAGE_TARGET"

echo "AppImage copiado a $APPIMAGE_TARGET"

pushd "$TMPDIR" >/dev/null
"$APPIMAGE_TARGET" --appimage-extract >/dev/null 2>&1 || true
ICON_PATH="$(find squashfs-root -type f \( -iname '*256x256*.png' -o -iname '*128x128*.png' -o -iname '*64x64*.png' -o -iname '*lm*studio*.png' \) | head -n1 || true)"
popd >/dev/null

if [[ -n "$ICON_PATH" && -f "$ICON_PATH" ]]; then
  sudo install -m 644 "$ICON_PATH" "$ICON_TARGET"
  echo "Icono instalado en $ICON_TARGET"
else
  echo "No se encontró icono dentro del AppImage; puedes copiar uno manualmente a $ICON_TARGET"
fi

sudo tee "$DESKTOP_TARGET" >/dev/null <<EOF
[Desktop Entry]
Name=LM Studio
Comment=LM Studio (AppImage)
Exec=$APPIMAGE_TARGET $EXEC_ARGS
Terminal=false
Type=Application
Icon=$ICON_TARGET
Categories=Development;Utility;
StartupWMClass=LM Studio
EOF
sudo chmod 644 "$DESKTOP_TARGET"
echo "Archivo desktop creado en $DESKTOP_TARGET"

if command -v update-desktop-database >/dev/null 2>&1; then
  sudo update-desktop-database /usr/share/applications >/dev/null 2>&1 || true
fi

echo "Listo. Busca 'LM Studio' en el menú de aplicaciones."
