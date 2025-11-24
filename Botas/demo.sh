#!/bin/bash

# Script de demostración de Botas
# Muestra cómo usar los scripts AWK y crear proyectos

echo "🎯 Demostración de Botas - Scripts AWK"
echo "======================================"
echo ""

# Crear directorio de prueba
TEST_DIR="/tmp/botas_demo"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "📁 Creando archivos de prueba..."
echo "Contenido de prueba" > archivo1.txt
echo "Más contenido" > archivo2.txt
echo "ERROR: Algo salió mal" > test.log
echo "INFO: Todo bien" >> test.log
echo "WARNING: Advertencia" >> test.log
echo "ERROR: Otro error" >> test.log
mkdir -p subdir
echo "Archivo duplicado" > subdir/archivo1.txt

echo "✓ Archivos creados en $TEST_DIR"
echo ""

# Demo 1: Encontrar duplicados
echo "🔍 Demo 1: Buscando archivos duplicados..."
echo "----------------------------------------"
find "$TEST_DIR" -type f | /home/huesomx/Documentos/GitHub/Botas/awk_scripts/find_duplicates.awk
echo ""

# Demo 2: Analizar logs
echo "📊 Demo 2: Analizando logs..."
echo "----------------------------"
cat test.log | /home/huesomx/Documentos/GitHub/Botas/awk_scripts/analyze_logs.awk
echo ""

# Demo 3: Uso de disco
echo "💾 Demo 3: Análisis de uso de disco..."
echo "-------------------------------------"
du -a "$TEST_DIR" | /home/huesomx/Documentos/GitHub/Botas/awk_scripts/disk_usage.awk
echo ""

# Limpiar
echo "🧹 Limpiando archivos de prueba..."
rm -rf "$TEST_DIR"
echo "✓ Demo completada"
echo ""
echo "💡 Para usar Botas con voz, ejecuta: perl bin/botas.pl"
