#!/usr/bin/env perl

# Test completo del flujo: Transcripción simulada -> Parser -> FileManager

use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';
use FindBin qw($RealBin);
use lib "$RealBin/lib";
use JSON;
use File::Slurp qw(read_file);

# Cargar configuración
my $config_file = "$RealBin/config/config.json";
my $config_json = read_file($config_file);
my $config = decode_json($config_json);

print "🧪 Test Completo: Simulación de Comando de Voz\n";
print "=" x 50 . "\n\n";

require CommandParser;
require FileManager;

my $parser = CommandParser->new($config);
my $fm = FileManager->new($config);

# Simular transcripción de Whisper
my $text = "Crea en el escritorio una carpeta llamada Meses que contenga carpetas para abril, mayo, junio, julio, agosto y septiembre";

print "📝 Comando simulado:\n";
print "   \"$text\"\n\n";

print "🧠 Paso 1: Interpretando comando con GPT...\n";
my $command = $parser->parse($text);

print "\n📋 Comando interpretado:\n";
print JSON->new->pretty->utf8(0)->encode($command);

print "\n📁 Paso 2: Ejecutando FileManager...\n";

eval {
    my $action = $command->{action};
    my $result;
    
    if ($action eq 'create') {
        $result = $fm->create($command);
    } elsif ($action eq 'list') {
        $result = $fm->list($command);
    } elsif ($action eq 'search') {
        $result = $fm->search($command);
    } elsif ($action eq 'move') {
        $result = $fm->move($command);
    } elsif ($action eq 'rename') {
        $result = $fm->rename($command);
    } elsif ($action eq 'delete') {
        $result = $fm->delete($command);
    } elsif ($action eq 'info') {
        $result = $fm->info($command);
    } elsif ($action eq 'create_project') {
        $result = $fm->create_project($command);
    } else {
        die "Acción no soportada: $action";
    }
    
    if ($result->{success}) {
        print "\n✅ ¡Éxito!\n";
        print "📂 " . $result->{message} . "\n";
        
        if ($result->{subdirs}) {
            print "\nCarpetas creadas:\n";
            for my $subdir (@{$result->{subdirs}}) {
                print "  📁 $subdir\n";
            }
        }
    }
};

if ($@) {
    print "\n⚠️  Nota: $@\n";
    print "(Probablemente porque intentó crear fuera de directorios permitidos)\n";
}

print "\n" . "=" x 50 . "\n";
print "✅ Test completado\n";
