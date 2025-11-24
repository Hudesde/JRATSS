#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';
use FindBin qw($RealBin);
use lib "$RealBin/../lib";
use JSON;
use File::Slurp qw(read_file);

use VoiceRecognition;
use CommandParser;
use FileManager;
use TTS;
use GUI;

# Cargar configuración
my $config_file = "$RealBin/../config/config.json";
unless (-f $config_file) {
    die "❌ Archivo de configuración no encontrado: $config_file\n" .
        "   Copia config.json.example a config.json y configura tu API key.\n";
}

my $config_json = read_file($config_file);
my $config = decode_json($config_json);

# Validar API key
if ($config->{openai}->{api_key} eq 'YOUR_OPENAI_API_KEY_HERE') {
    die "❌ Debes configurar tu API key de OpenAI en config/config.json\n";
}

# Actualizar rutas en config
$config->{paths}->{templates_dir} = "$RealBin/../templates";

# Inicializar módulos
my $voice = VoiceRecognition->new($config);
my $parser = CommandParser->new($config);
my $file_manager = FileManager->new($config);
my $tts = TTS->new($config);

# Variable para almacenar el comando pendiente
my $pending_command;

# Callbacks para la GUI
my $callbacks = {
    on_listen => \&on_listen,
    on_confirm => \&on_confirm,
    on_cancel => \&on_cancel,
};

# Crear GUI
my $gui = GUI->new($config, $callbacks);

# Función: Escuchar comando de voz
sub on_listen {
    $gui->log("🎤 Escuchando...");
    $gui->set_mic_state(1);
    
    eval {
        # Grabar y transcribir
        my $text = $voice->listen();
        
        $gui->set_mic_state(0);
        $gui->set_transcript($text);
        $gui->log("📝 Transcrito: \"$text\"");
        
        # Parsear comando
        my $command = $parser->parse($text);
        $gui->set_command($command);
        
        # Reproducir respuesta TTS
        $tts->speak_async($command->{tts_response});
        
        # Si requiere confirmación, habilitar botones
        if ($command->{requires_confirmation}) {
            $pending_command = $command;
            $gui->enable_confirmation(1);
            $gui->log("⚠️  Operación requiere confirmación. Presiona 'Confirmar' para continuar.");
        } else {
            # Ejecutar directamente
            execute_command($command);
        }
    };
    
    if ($@) {
        $gui->log("❌ Error: $@");
        $tts->speak_async("Error al procesar comando");
        $gui->set_mic_state(0);
    }
}

# Función: Confirmar comando pendiente
sub on_confirm {
    return unless $pending_command;
    
    $gui->log("✓ Comando confirmado, ejecutando...");
    execute_command($pending_command);
    
    $pending_command = undef;
    $gui->enable_confirmation(0);
}

# Función: Cancelar comando pendiente
sub on_cancel {
    $gui->log("✗ Comando cancelado");
    $tts->speak_async("Comando cancelado");
    
    $pending_command = undef;
    $gui->enable_confirmation(0);
}

# Función: Ejecutar comando
sub execute_command {
    my ($command) = @_;
    
    eval {
        my $action = $command->{action};
        my $result;
        
        if ($action eq 'create') {
            $result = $file_manager->create($command);
        } elsif ($action eq 'list') {
            $result = $file_manager->list($command);
        } elsif ($action eq 'search') {
            $result = $file_manager->search($command);
        } elsif ($action eq 'move') {
            $result = $file_manager->move($command);
        } elsif ($action eq 'rename') {
            $result = $file_manager->rename($command);
        } elsif ($action eq 'delete') {
            $result = $file_manager->delete($command);
        } elsif ($action eq 'info') {
            $result = $file_manager->info($command);
        } elsif ($action eq 'create_project') {
            $result = $file_manager->create_project($command);
        } else {
            die "Acción no soportada: $action";
        }
        
        $gui->show_result($result);
        $tts->speak_async($result->{message});
    };
    
    if ($@) {
        my $error = $@;
        $gui->log("❌ Error al ejecutar: $error");
        $tts->speak_async("Error al ejecutar comando");
    }
}

# Iniciar GUI
$gui->run();
