#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use lib 'lib';
use JSON;
use File::Slurp;
use CommandParser;

binmode(STDOUT, ':encoding(UTF-8)');

print "🧪 TEST DE COMPARACIÓN: OpenAI GPT-4o vs LM-Studio DeepSeek-R1\n";
print "=" x 80 . "\n\n";

# Leer configuración
my $config_text = read_file('config/config.json');
my $config = decode_json($config_text);

# Comandos de prueba
my @test_commands = (
    "Crea una carpeta llamada Proyectos2024 en el escritorio",
    "Lista todos los archivos de la carpeta Documentos",
    "Busca archivos PDF en Descargas",
    "Crea un proyecto fullstack llamado MiTienda en Proyectos",
    "Elimina la carpeta temporal de pruebas",
);

print "📋 Comandos de prueba:\n";
for my $i (0 .. $#test_commands) {
    print "  " . ($i+1) . ". $test_commands[$i]\n";
}
print "\n";

# Probar con OpenAI
print "🔵 PROBANDO CON OPENAI GPT-4o\n";
print "-" x 80 . "\n";

$config->{nlp}->{provider} = 'openai';
my $parser_openai = CommandParser->new($config);

my @results_openai;
for my $cmd (@test_commands) {
    print "\n📝 Comando: \"$cmd\"\n";
    eval {
        my $result = $parser_openai->parse($cmd);
        push @results_openai, {
            command => $cmd,
            result => $result,
            success => 1,
        };
        print "✅ Acción interpretada: $result->{action}\n";
        print "📍 Ruta objetivo: " . ($result->{target_path} // 'N/A') . "\n";
    };
    if ($@) {
        push @results_openai, {
            command => $cmd,
            error => $@,
            success => 0,
        };
        print "❌ Error: $@\n";
    }
    sleep 2; # Evitar rate limiting
}

print "\n\n";
print "🟢 PROBANDO CON LM-STUDIO DeepSeek-R1\n";
print "-" x 80 . "\n";
print "⚠️  NOTA: Asegúrate de tener LM-Studio ejecutándose en http://localhost:1234\n";
print "⚠️  Modelo cargado: deepseek-r1-distill-qwen-7b (o similar)\n";
print "\n";

# Verificar si LM-Studio está corriendo
use LWP::UserAgent;
my $ua = LWP::UserAgent->new(timeout => 5);
my $test_response = $ua->get($config->{nlp}->{lmstudio}->{api_base} . '/models');

unless ($test_response->is_success) {
    print "❌ ERROR: LM-Studio no está corriendo o no responde\n";
    print "   Endpoint: " . $config->{nlp}->{lmstudio}->{api_base} . "\n";
    print "   Inicia LM-Studio y carga el modelo DeepSeek-R1\n";
    exit 1;
}

print "✅ LM-Studio detectado y funcionando\n\n";

$config->{nlp}->{provider} = 'lmstudio';
my $parser_lmstudio = CommandParser->new($config);

my @results_lmstudio;
for my $cmd (@test_commands) {
    print "\n📝 Comando: \"$cmd\"\n";
    eval {
        my $result = $parser_lmstudio->parse($cmd);
        push @results_lmstudio, {
            command => $cmd,
            result => $result,
            success => 1,
        };
        print "✅ Acción interpretada: $result->{action}\n";
        print "📍 Ruta objetivo: " . ($result->{target_path} // 'N/A') . "\n";
    };
    if ($@) {
        push @results_lmstudio, {
            command => $cmd,
            error => $@,
            success => 0,
        };
        print "❌ Error: $@\n";
    }
    sleep 1;
}

# Resumen comparativo
print "\n\n";
print "=" x 80 . "\n";
print "📊 RESUMEN COMPARATIVO\n";
print "=" x 80 . "\n\n";

print "🔵 OpenAI GPT-4o:\n";
my $success_openai = grep { $_->{success} } @results_openai;
print "   ✅ Exitosos: $success_openai/" . scalar(@test_commands) . "\n";
print "   ❌ Fallidos: " . (scalar(@test_commands) - $success_openai) . "\n";
print "   💰 Costo aproximado: ~\$" . sprintf("%.4f", scalar(@test_commands) * 0.015) . " USD\n";

print "\n🟢 LM-Studio DeepSeek-R1:\n";
my $success_lmstudio = grep { $_->{success} } @results_lmstudio;
print "   ✅ Exitosos: $success_lmstudio/" . scalar(@test_commands) . "\n";
print "   ❌ Fallidos: " . (scalar(@test_commands) - $success_lmstudio) . "\n";
print "   💰 Costo: \$0.00 USD (local)\n";

print "\n📈 CONCLUSIONES:\n";
if ($success_openai > $success_lmstudio) {
    print "   🏆 OpenAI GPT-4o tiene mejor precisión\n";
} elsif ($success_lmstudio > $success_openai) {
    print "   🏆 LM-Studio DeepSeek-R1 tiene mejor precisión\n";
} else {
    print "   🤝 Ambos modelos tuvieron desempeño similar\n";
}

print "\n💡 RECOMENDACIONES:\n";
print "   • Usa OpenAI para máxima precisión en comandos complejos\n";
print "   • Usa LM-Studio para uso intensivo sin costos\n";
print "   • LM-Studio es 100% privado (datos no salen de tu PC)\n";
print "   • OpenAI requiere conexión a internet\n";

print "\n\n✅ Test completado\n";
