package VoiceRecognition;

use strict;
use warnings;
use utf8;
use LWP::UserAgent;
use JSON;
use File::Temp qw/tempfile/;

sub new {
    my ($class, $config) = @_;
    my $self = {
        api_key => $config->{openai}->{api_key},
        api_base => $config->{openai}->{api_base},
        model => $config->{openai}->{whisper_model},
        temp_dir => $config->{paths}->{temp_audio},
        audio_config => $config->{audio},
    };
    
    bless $self, $class;
    $self->_init();
    return $self;
}

sub _init {
    my ($self) = @_;
    
    # Crear directorio temporal si no existe
    unless (-d $self->{temp_dir}) {
        mkdir $self->{temp_dir} or die "No se pudo crear $self->{temp_dir}: $!";
    }
}

# Graba audio desde el micrófono usando sox
sub record_audio {
    my ($self, $duration) = @_;
    $duration //= $self->{audio_config}->{max_duration};
    
    my ($fh, $filename) = tempfile(
        DIR => $self->{temp_dir},
        SUFFIX => '.' . $self->{audio_config}->{format},
        UNLINK => 0
    );
    close $fh;
    
    my $sample_rate = $self->{audio_config}->{sample_rate};
    my $channels = $self->{audio_config}->{channels};
    
    # Grabar con sox (rec es un alias de sox)
    my $cmd = "rec -q -c $channels -r $sample_rate $filename trim 0 $duration";
    
    print "🎤 Grabando audio (máximo $duration segundos)...\n";
    print "   Presiona Ctrl+C para detener antes.\n";
    
    system($cmd);
    
    if ($? != 0) {
        unlink $filename;
        die "Error al grabar audio: $!";
    }
    
    print "✓ Audio grabado: $filename\n";
    return $filename;
}

# Envía audio a Whisper API y retorna el texto transcrito
sub transcribe {
    my ($self, $audio_file) = @_;
    
    unless (-f $audio_file) {
        die "Archivo de audio no encontrado: $audio_file";
    }
    
    print "🔄 Enviando audio a Whisper API...\n";
    print "📂 Archivo: $audio_file (" . (-s $audio_file) . " bytes)\n";
    
    my $ua = LWP::UserAgent->new();
    
    my $response = $ua->post(
        $self->{api_base} . '/audio/transcriptions',
        'Authorization' => "Bearer " . $self->{api_key},
        Content_Type => 'form-data',
        Content => [
            file => [$audio_file],
            model => $self->{model},
            language => 'es',
        ]
    );
    
    print "📥 Respuesta HTTP: " . $response->status_line . "\n";
    
    unless ($response->is_success) {
        print "❌ Error en Whisper API: " . $response->status_line . "\n";
        print "📥 Respuesta completa:\n";
        print $response->content . "\n";
        
        # No eliminar el archivo en caso de error para debug
        die "Error en Whisper API. Audio guardado en: $audio_file\n";
    }
    
    # Limpiar archivo temporal solo si fue exitoso
    unlink $audio_file;
    
    my $result = decode_json($response->content);
    my $text = $result->{text} // '';
    
    print "📝 Transcripción: \"$text\"\n";
    return $text;
}

# Método combinado: graba y transcribe
sub listen {
    my ($self, $duration) = @_;
    
    my $audio_file = $self->record_audio($duration);
    my $text = $self->transcribe($audio_file);
    
    return $text;
}

1;
