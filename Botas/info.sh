#!/bin/bash

# Script para mostrar resumen del proyecto Botas

cat << 'EOF'
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗  ██████╗ ████████╗ █████╗ ███████╗             ║
║   ██╔══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔════╝             ║
║   ██████╔╝██║   ██║   ██║   ███████║███████╗             ║
║   ██╔══██╗██║   ██║   ██║   ██╔══██║╚════██║             ║
║   ██████╔╝╚██████╔╝   ██║   ██║  ██║███████║             ║
║   ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝             ║
║                                                           ║
║        Asistente de Voz para Gestión de Archivos         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

EOF

echo "📊 Estadísticas del Proyecto"
echo "═══════════════════════════════════════════════════════"
echo ""

# Contar archivos
total_files=$(find . -type f | wc -l)
perl_files=$(find . -type f -name "*.pm" -o -name "*.pl" | wc -l)
awk_files=$(find . -type f -name "*.awk" | wc -l)
templates=$(find ./templates -type f -name "*.json" 2>/dev/null | wc -l)

echo "📁 Archivos totales:        $total_files"
echo "🔧 Módulos Perl (.pm, .pl): $perl_files"
echo "📜 Scripts AWK (.awk):      $awk_files"
echo "📋 Plantillas (.json):      $templates"
echo ""

# Contar líneas de código
total_lines=$(wc -l $(find . -type f \( -name "*.pl" -o -name "*.pm" -o -name "*.awk" \) 2>/dev/null) 2>/dev/null | tail -1 | awk '{print $1}')
echo "📝 Líneas de código:        $total_lines"
echo ""

echo "🎯 Componentes Principales"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "✅ VoiceRecognition.pm     - Whisper API (grabación + transcripción)"
echo "✅ CommandParser.pm        - GPT-4 (interpretación de comandos)"
echo "✅ FileManager.pm          - Gestión de archivos y proyectos"
echo "✅ GUI.pm                  - Interfaz gráfica Perl/Tk"
echo "✅ TTS.pm                  - Síntesis de voz (eSpeak)"
echo ""

echo "🛠️  Scripts AWK"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "✅ find_duplicates.awk     - Detectar archivos duplicados"
echo "✅ analyze_logs.awk        - Análisis de logs con estadísticas"
echo "✅ disk_usage.awk          - Uso de disco por tipo de archivo"
echo ""

echo "📋 Plantillas de Proyectos"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "✅ frontend_pos.json       - Frontend React para Punto de Venta"
echo "✅ backend_api.json        - Backend Node.js/Express API REST"
echo "✅ fullstack.json          - Aplicación completa Frontend + Backend"
echo ""

echo "🧪 Scripts de Testing"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "• test_filemanager.pl      - Prueba gestión de archivos sin API"
echo "• test_awk.pl              - Prueba scripts AWK"
echo "• demo.sh                  - Demostración completa"
echo ""

echo "📖 Documentación"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "• README.md                - Visión general del proyecto"
echo "• QUICKSTART.md            - Guía de inicio rápido"
echo "• USAGE.md                 - Manual de usuario completo"
echo "• ARCHITECTURE.md          - Arquitectura técnica detallada"
echo "• CHANGELOG.md             - Historial de versiones"
echo ""

echo "🚀 Inicio Rápido"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "1. Instalar dependencias:"
echo "   ./install.sh"
echo ""
echo "2. Configurar API key:"
echo "   cp config/config.json.example config/config.json"
echo "   # Editar config.json y agregar tu OpenAI API key"
echo ""
echo "3. Ejecutar:"
echo "   perl bin/botas.pl"
echo ""
echo "4. Probar sin API (offline):"
echo "   ./test_filemanager.pl"
echo "   ./test_awk.pl"
echo ""

echo "💬 Ejemplos de Comandos de Voz"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "• \"Lista los archivos en documentos\""
echo "• \"Crea una carpeta llamada proyectos\""
echo "• \"Busca archivos PDF modificados hoy\""
echo "• \"Crea el frontend de un punto de venta con login e inventario\""
echo "• \"Cuánto espacio ocupa la carpeta descargas\""
echo ""

echo "🔧 Tecnologías Utilizadas"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "• Perl 5.x                 - Lenguaje principal"
echo "• Perl/Tk                  - Interfaz gráfica"
echo "• AWK                      - Procesamiento de texto"
echo "• OpenAI Whisper API       - Reconocimiento de voz"
echo "• OpenAI GPT-4 API         - Interpretación de comandos"
echo "• SoX                      - Grabación de audio"
echo "• eSpeak                   - Síntesis de voz"
echo ""

echo "📊 Características"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "✅ Reconocimiento de voz natural en español"
echo "✅ Gestión completa de archivos (crear, mover, buscar, eliminar)"
echo "✅ Creación de proyectos desde plantillas"
echo "✅ Scripts AWK para análisis avanzado"
echo "✅ Interfaz gráfica intuitiva"
echo "✅ Síntesis de voz para feedback"
echo "✅ Sistema de confirmación para operaciones destructivas"
echo "✅ Control de acceso a directorios permitidos"
echo "✅ Extensible mediante plantillas y módulos"
echo ""

echo "🔒 Seguridad"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "• Validación de rutas contra path traversal"
echo "• Solo acceso a directorios permitidos (configurables)"
echo "• Confirmación obligatoria para operaciones destructivas"
echo "• Límite de operaciones masivas (100 archivos)"
echo ""

echo "📝 Licencia"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "MIT License - Uso y modificación libre"
echo ""

echo "════════════════════════════════════════════════════════"
echo "   🥾 ¡Botas está listo para usar!"
echo "════════════════════════════════════════════════════════"
echo ""
