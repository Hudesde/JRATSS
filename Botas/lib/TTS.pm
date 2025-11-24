package TTS;

use strict;
use warnings;
use LWP::UserAgent;
use JSON;
use File::Temp qw(tempfile);

sub new {
    my ($class, $config) = @_;
    my $self = {
        engine => $config->{tts}->{engine} // 'espeak',
        language => $config->{tts}->{language} // 'es',
        speed => $config->{tts}->{speed} // 120,
        voice => $config->{tts}->{voice} // 'spanish',
        pitch => $config->{tts}->{pitch} // 50,
        gap => $config->{tts}->{gap} // 10,
        openai_voice => $config->{tts}->{openai_voice} // 'nova',
        openai_model => $config->{tts}->{openai_model} // 'tts-1',
        api_key => $config->{openai}->{api_key},
    };
    
    bless $self, $class;
    $self->_check_engine();
    return $self;
}

sub _check_engine {
    my ($self) = @_;
    
    my $check = `which $self->{engine} 2>/dev/null`;
    unless ($check) {
        warn "⚠️  Motor TTS '$self->{engine}' no encontrado. Instalando...\n";
        warn "   Ejecuta: sudo apt-get install espeak\n";
        $self->{enabled} = 0;
    } else {
        $self->{enabled} = 1;
    }
}

sub speak {
    my ($self, $text) = @_;
    
    unless ($self->{enabled}) {
        print "🔇 TTS deshabilitado: $text\n";
        return;
    }
    
    print "🔊 Reproduciendo: $text\n";
    
    if ($self->{engine} eq 'espeak') {
        my $speed = $self->{speed};
        my $lang = $self->{language};
        my $pitch = $self->{pitch};
        my $gap = $self->{gap};
        
        # Escapar comillas en el texto
        $text =~ s/"/\\"/g;
        
        # Parámetros mejorados para mejor claridad:
        # -s: velocidad (120 = más lento y claro)
        # -p: pitch/tono (50 = medio, más natural)
        # -g: gap entre palabras (10ms = mejor comprensión)
        # -a: amplitud (volumen)
        system(qq{espeak -v $lang -s $speed -p $pitch -g $gap -a 100 "$text" 2>/dev/null &});
    }
    elsif ($self->{engine} eq 'openai') {
        $self->_speak_openai($text);
    }
}

sub _speak_openai {
    my ($self, $text) = @_;
    
    unless ($self->{api_key}) {
        warn "⚠️  OpenAI API key no configurada\n";
        return;
    }
    
    my $ua = LWP::UserAgent->new(timeout => 30);
    
    my $json_data = encode_json({
        model => $self->{openai_model},
        voice => $self->{openai_voice},
        input => $text,
        response_format => 'mp3',
        speed => 1.0,
    });
    
    my $response = $ua->post(
        'https://api.openai.com/v1/audio/speech',
        'Authorization' => "Bearer $self->{api_key}",
        'Content-Type' => 'application/json',
        Content => $json_data,
    );
    
    if ($response->is_success) {
        # Guardar audio y reproducir
        my ($fh, $filename) = tempfile(SUFFIX => '.mp3', UNLINK => 1);
        binmode($fh);
        print $fh $response->content;
        close($fh);
        
        # Reproducir con mpg123, ffplay o cualquier reproductor
        system(qq{mpg123 -q "$filename" 2>/dev/null &});
    } else {
        warn "❌ Error en OpenAI TTS: " . $response->status_line . "\n";
        # Fallback a eSpeak
        $self->{engine} = 'espeak';
        $self->speak($text);
    }
}

sub speak_async {
    my ($self, $text) = @_;
    
    # Fork para no bloquear
    my $pid = fork();
    
    if ($pid == 0) {
        # Proceso hijo
        $self->speak($text);
        exit 0;
    }
    
    # Proceso padre continúa
    return $pid;
}

1;
