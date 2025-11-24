#!/usr/bin/env perl

# Script de prueba para FileManager sin necesidad de APIs
# Demuestra las capacidades de gestión de archivos

use strict;
use warnings;
use FindBin qw($RealBin);
use lib "$RealBin/../lib";
use JSON;
use Data::Dumper;

# Crear configuración minimal para testing
my $config = {
    paths => {
        allowed_dirs => [
            $ENV{HOME} . '/tmp',
            $ENV{HOME} . '/Documentos',
            '/tmp'
        ],
        templates_dir => "$RealBin/../templates"
    },
    security => {
        max_file_operations => 100
    }
};

# Cargar FileManager
require FileManager;
my $fm = FileManager->new($config);

print "🧪 Testing FileManager - Botas\n";
print "=" x 50 . "\n\n";

# Crear directorio de prueba
my $test_dir = "/tmp/botas_test_" . time();
print "📁 Creando directorio de prueba: $test_dir\n";

# Test 1: Crear directorio
print "\n--- Test 1: Crear directorio ---\n";
my $result = $fm->create({
    target_path => $test_dir,
    target_type => 'directory'
});
print Dumper($result);

# Test 2: Crear archivo
print "\n--- Test 2: Crear archivo ---\n";
$result = $fm->create({
    target_path => "$test_dir/test.txt",
    target_type => 'file',
    parameters => {
        content => "Hola desde Botas!\n"
    }
});
print Dumper($result);

# Test 3: Listar directorio
print "\n--- Test 3: Listar directorio ---\n";
$result = $fm->list({
    target_path => $test_dir,
    parameters => { recursive => 0 }
});
print "Elementos encontrados: " . scalar(@{$result->{items}}) . "\n";
for my $item (@{$result->{items}}) {
    print "  - $item->{name} ($item->{type})\n";
}

# Test 4: Info del archivo
print "\n--- Test 4: Información del archivo ---\n";
$result = $fm->info({
    target_path => "$test_dir/test.txt"
});
print Dumper($result->{info});

# Test 5: Buscar archivos
print "\n--- Test 5: Buscar archivos .txt ---\n";
$result = $fm->search({
    target_path => $test_dir,
    parameters => {
        extension => 'txt'
    }
});
print "Encontrados: " . scalar(@{$result->{items}}) . " archivos\n";

# Test 6: Crear más archivos para testing
print "\n--- Test 6: Crear múltiples archivos ---\n";
for my $i (1..3) {
    $fm->create({
        target_path => "$test_dir/archivo$i.txt",
        target_type => 'file',
        parameters => { content => "Contenido $i\n" }
    });
    print "  ✓ Creado archivo$i.txt\n";
}

# Test 7: Listar recursivo
print "\n--- Test 7: Listar recursivo ---\n";
mkdir "$test_dir/subdir";
$fm->create({
    target_path => "$test_dir/subdir/nested.txt",
    target_type => 'file',
    parameters => { content => "Archivo anidado\n" }
});

$result = $fm->list({
    target_path => $test_dir,
    parameters => { recursive => 1 }
});
print "Total elementos (recursivo): " . scalar(@{$result->{items}}) . "\n";

# Test 8: Renombrar
print "\n--- Test 8: Renombrar archivo ---\n";
$result = $fm->rename({
    source_path => "$test_dir/archivo1.txt",
    target_path => "$test_dir/archivo_renombrado.txt"
});
print Dumper($result);

# Test 9: Mover archivo
print "\n--- Test 9: Mover archivo ---\n";
$result = $fm->move({
    source_path => "$test_dir/archivo2.txt",
    target_path => "$test_dir/subdir/archivo2.txt"
});
print Dumper($result);

# Test 10: Crear proyecto desde plantilla
print "\n--- Test 10: Crear proyecto desde plantilla ---\n";
my $project_dir = "$test_dir/mi_proyecto_pos";
$result = $fm->create_project({
    target_path => $project_dir,
    parameters => {
        template => 'frontend_pos',
        project_name => 'mi_proyecto_pos',
        features => ['login', 'inventario', 'ventas']
    }
});
print Dumper($result);

print "\n--- Verificando estructura del proyecto ---\n";
system("find $project_dir -type f -o -type d | head -20");

# Limpiar (comentar para inspeccionar manualmente)
print "\n🧹 Limpiando archivos de prueba...\n";
$result = $fm->delete({
    target_path => $test_dir
});
print "✓ " . $result->{message} . "\n";

print "\n✅ Tests completados!\n";
print "\n💡 Para testing completo con voz, ejecuta: perl bin/botas.pl\n";
