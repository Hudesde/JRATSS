#!/usr/bin/env perl

# Test rápido del CommandParser

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
unless (-f $config_file) {
    die "❌ No se encuentra config.json en: $config_file\n";
}

my $config_json = read_file($config_file);
my $config = decode_json($config_json);

print "🧪 Testing CommandParser\n";
print "=" x 50 . "\n\n";

require CommandParser;
my $parser = CommandParser->new($config);

# Texto de prueba (simula lo que vendría de Whisper)
my $test_text = "Puedes crear las carpetas para mis tres materias que son Matemáticas, Español e Historia";

print "📝 Texto a interpretar:\n";
print "   \"$test_text\"\n\n";

print "🔄 Enviando a GPT API...\n\n";

eval {
    my $result = $parser->parse($test_text);
    
    print "\n✅ Comando interpretado correctamente!\n\n";
    print "📋 Resultado:\n";
    print JSON->new->pretty->utf8(0)->encode($result);
};

if ($@) {
    print "\n❌ ERROR:\n";
    print "$@\n";
}
