#!/usr/bin/env perl

# Test de Whisper API (solo transcripción, sin grabar)

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

print "🧪 Testing Whisper API (Transcripción)\n";
print "=" x 50 . "\n\n";

# Crear un archivo de audio de prueba (silencio de 1 segundo)
print "📁 Creando archivo de audio de prueba...\n";
my $test_audio = "/tmp/botas_test_whisper.wav";
system("sox -n -r 16000 -c 1 $test_audio trim 0 1 2>/dev/null");

unless (-f $test_audio) {
    die "❌ No se pudo crear archivo de prueba. ¿Está sox instalado?\n";
}

print "✓ Archivo creado: $test_audio (" . (-s $test_audio) . " bytes)\n\n";

require VoiceRecognition;
my $voice = VoiceRecognition->new($config);

print "🔄 Enviando a Whisper API...\n";
print "(Esto puede tomar unos segundos)\n\n";

eval {
    my $text = $voice->transcribe($test_audio);
    
    print "\n✅ ¡Whisper API funciona correctamente!\n";
    print "📝 Transcripción: \"$text\"\n";
    print "(Nota: Puede estar vacío porque el audio es silencio)\n";
};

if ($@) {
    print "\n❌ ERROR:\n";
    print "$@\n";
    print "\n💡 Sugerencias:\n";
    print "1. Verifica tu API key en config/config.json\n";
    print "2. Verifica que tengas créditos en OpenAI\n";
    print "3. Revisa el error detallado arriba\n";
}

# Limpiar
unlink $test_audio if -f $test_audio;
