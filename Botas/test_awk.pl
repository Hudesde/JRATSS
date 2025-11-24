#!/usr/bin/env perl

# Script de prueba para los scripts AWK

use strict;
use warnings;
use File::Temp qw/tempdir/;

print "🧪 Testing Scripts AWK - Botas\n";
print "=" x 50 . "\n\n";

my $test_dir = tempdir(CLEANUP => 1);
chdir $test_dir;

# Crear estructura de prueba
print "📁 Creando archivos de prueba en: $test_dir\n\n";

# Archivos con nombres duplicados
mkdir 'dir1';
mkdir 'dir2';
open my $fh, '>', 'archivo.txt';
print $fh "Contenido original\n";
close $fh;

open $fh, '>', 'dir1/archivo.txt';
print $fh "Contenido en dir1\n";
close $fh;

open $fh, '>', 'dir2/archivo.txt';
print $fh "Contenido en dir2\n";
close $fh;

# Archivo de log de prueba
open $fh, '>', 'test.log';
print $fh "[2024-10-27 10:30:45] INFO: Sistema iniciado\n";
print $fh "[2024-10-27 10:31:12] ERROR: Falló conexión a DB\n";
print $fh "[2024-10-27 10:31:45] WARNING: Memoria baja\n";
print $fh "[2024-10-27 10:32:00] INFO: Conectado exitosamente\n";
print $fh "[2024-10-27 10:32:30] ERROR: Timeout en API\n";
print $fh "[2024-10-27 10:33:00] INFO: Procesando datos\n";
print $fh "[2024-10-28 09:15:20] ERROR: Archivo no encontrado\n";
print $fh "[2024-10-28 09:16:00] WARNING: Reiniciando servicio\n";
close $fh;

# Archivos de diferentes tamaños
open $fh, '>', 'small.txt';
print $fh "x" x 100;
close $fh;

open $fh, '>', 'medium.dat';
print $fh "x" x 10000;
close $fh;

open $fh, '>', 'large.bin';
print $fh "x" x 100000;
close $fh;

print "✓ Archivos de prueba creados\n\n";

# Test 1: find_duplicates.awk
print "=" x 50 . "\n";
print "Test 1: Buscando archivos duplicados\n";
print "=" x 50 . "\n";
system("find . -type f | awk -f /home/huesomx/Documentos/GitHub/Botas/awk_scripts/find_duplicates.awk");
print "\n";

# Test 2: analyze_logs.awk
print "=" x 50 . "\n";
print "Test 2: Analizando logs\n";
print "=" x 50 . "\n";
system("cat test.log | awk -f /home/huesomx/Documentos/GitHub/Botas/awk_scripts/analyze_logs.awk");
print "\n";

# Test 3: disk_usage.awk
print "=" x 50 . "\n";
print "Test 3: Análisis de uso de disco\n";
print "=" x 50 . "\n";
system("du -a . | awk -f /home/huesomx/Documentos/GitHub/Botas/awk_scripts/disk_usage.awk");
print "\n";

print "✅ Tests AWK completados!\n";
print "📂 Directorio temporal: $test_dir (se eliminará automáticamente)\n";



