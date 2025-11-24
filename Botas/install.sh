#!/bin/bash

# Script de instalación de dependencias para Botas

echo "🚀 Instalando dependencias de Botas..."
echo "======================================"

# Verificar que estamos en Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ Este script está diseñado para Linux"
    exit 1
fi

# Actualizar repositorios
echo ""
echo "📦 Actualizando repositorios..."
sudo apt-get update

# Instalar dependencias del sistema
echo ""
echo "📦 Instalando paquetes del sistema..."
sudo apt-get install -y \
    libwww-perl \
    libjson-perl \
    perl-tk \
    libsox-fmt-all \
    sox \
    espeak \
    cpanminus

# Instalar módulos Perl
echo ""
echo "📦 Instalando módulos Perl..."
sudo cpanm --notest LWP::UserAgent
sudo cpanm --notest JSON
sudo cpanm --notest Tk
sudo cpanm --notest File::Path
sudo cpanm --notest File::Find::Rule
sudo cpanm --notest File::Slurp

# Verificar instalaciones
echo ""
echo "✅ Verificando instalaciones..."

# Verificar perl
if command -v perl &> /dev/null; then
    echo "  ✓ Perl: $(perl --version | grep -o 'v[0-9.]*' | head -1)"
else
    echo "  ❌ Perl no encontrado"
fi

# Verificar sox
if command -v sox &> /dev/null; then
    echo "  ✓ SoX: $(sox --version | head -1)"
else
    echo "  ❌ SoX no encontrado"
fi

# Verificar espeak
if command -v espeak &> /dev/null; then
    echo "  ✓ eSpeak: instalado"
else
    echo "  ❌ eSpeak no encontrado"
fi

# Crear archivo de configuración
echo ""
echo "⚙️  Configurando..."

if [ ! -f "config/config.json" ]; then
    cp config/config.json.example config/config.json
    echo "  ✓ Creado config/config.json (recuerda agregar tu API key)"
else
    echo "  ℹ️  config/config.json ya existe"
fi

# Crear directorio temporal
mkdir -p /tmp/botas_audio
echo "  ✓ Directorio temporal creado"

# Hacer ejecutables los scripts
chmod +x bin/botas.pl
chmod +x awk_scripts/*.awk
echo "  ✓ Scripts marcados como ejecutables"

echo ""
echo "✅ Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Edita config/config.json y agrega tu API key de OpenAI"
echo "  2. Ejecuta: perl bin/botas.pl"
echo ""
echo "🎤 ¡Disfruta de Botas!"
