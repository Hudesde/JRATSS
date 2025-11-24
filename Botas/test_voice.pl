#!/usr/bin/env perl

use strict;
use warnings;
use utf8;

binmode(STDOUT, ':encoding(UTF-8)');

print "🔊 TEST DE VOZ MEJORADA - eSpeak\n";
print "=" x 60 . "\n\n";

my @frases = (
    "Hola, soy Botas, tu asistente de voz.",
    "He sido mejorado con una velocidad de ciento veinte palabras por minuto.",
    "Ahora puedes entenderme mucho mejor que antes.",
    "Matemáticas, Español, Historia, Física y Química.",
    "Crear carpetas en el escritorio es muy fácil.",
);

print "📝 Frases de prueba:\n";
for my $i (0 .. $#frases) {
    print "  " . ($i+1) . ". $frases[$i]\n";
}
print "\n";

print "🔊 Reproduciendo con CONFIGURACIÓN ANTIGUA (150 wpm):\n";
print "-" x 60 . "\n";
for my $frase (@frases) {
    print "🗣️  \"$frase\"\n";
    my $escaped = $frase;
    $escaped =~ s/"/\\"/g;
    system(qq{espeak -v es -s 150 "$escaped" 2>/dev/null});
    sleep 1;
}

print "\n\n";
print "🔊 Reproduciendo con CONFIGURACIÓN NUEVA (120 wpm + pitch + gap):\n";
print "-" x 60 . "\n";
for my $frase (@frases) {
    print "🗣️  \"$frase\"\n";
    my $escaped = $frase;
    $escaped =~ s/"/\\"/g;
    # Nueva configuración: -s 120 -p 50 -g 10 -a 100
    system(qq{espeak -v es -s 120 -p 50 -g 10 -a 100 "$escaped" 2>/dev/null});
    sleep 1;
}

print "\n\n";
print "=" x 60 . "\n";
print "✅ Test completado\n\n";
print "💬 ¿Notaste la diferencia?\n";
print "   • Velocidad más lenta (120 vs 150 wpm)\n";
print "   • Mejor pronunciación\n";
print "   • Más fácil de entender\n";
print "   • Pausas entre palabras (10ms gap)\n";
print "\n";
print "🎯 Esta es la configuración que usa Botas v1.1\n";
