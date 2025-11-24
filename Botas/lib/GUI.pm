package GUI;

use strict;
use warnings;
use Tk;
use Tk::Text;
use Tk::ROText;

sub new {
    my ($class, $config, $callbacks) = @_;
    
    my $mw = MainWindow->new();
    $mw->title("Botas - Asistente de Voz");
    $mw->geometry($config->{gui}->{width} . "x" . $config->{gui}->{height});
    
    my $self = {
        main_window => $mw,
        callbacks => $callbacks,
        config => $config,
    };
    
    bless $self, $class;
    $self->_build_ui();
    return $self;
}

sub _build_ui {
    my ($self) = @_;
    my $mw = $self->{main_window};
    
    # Frame superior: Controles
    my $top_frame = $mw->Frame()->pack(-side => 'top', -fill => 'x', -padx => 5, -pady => 5);
    
    # Botón de micrófono (grande)
    my $mic_button = $top_frame->Button(
        -text => "🎤 Escuchar",
        -font => ['Arial', 16, 'bold'],
        -bg => '#4CAF50',
        -fg => 'white',
        -width => 15,
        -height => 2,
        -command => sub { $self->{callbacks}->{on_listen}->() }
    )->pack(-side => 'left', -padx => 5);
    
    $self->{mic_button} = $mic_button;
    
    # Botones de acción
    my $confirm_button = $top_frame->Button(
        -text => "✓ Confirmar",
        -bg => '#2196F3',
        -fg => 'white',
        -width => 10,
        -state => 'disabled',
        -command => sub { $self->{callbacks}->{on_confirm}->() }
    )->pack(-side => 'left', -padx => 5);
    
    $self->{confirm_button} = $confirm_button;
    
    my $cancel_button = $top_frame->Button(
        -text => "✗ Cancelar",
        -bg => '#f44336',
        -fg => 'white',
        -width => 10,
        -state => 'disabled',
        -command => sub { $self->{callbacks}->{on_cancel}->() }
    )->pack(-side => 'left', -padx => 5);
    
    $self->{cancel_button} = $cancel_button;
    
    # Frame central: Área de transcripción
    my $transcript_frame = $mw->Frame()->pack(-side => 'top', -fill => 'both', -expand => 1, -padx => 5, -pady => 5);
    
    $transcript_frame->Label(
        -text => "Comando reconocido:",
        -font => ['Arial', 10, 'bold']
    )->pack(-anchor => 'w');
    
    my $transcript_text = $transcript_frame->Text(
        -height => 3,
        -wrap => 'word',
        -font => ['Arial', 12],
        -bg => '#f0f0f0'
    )->pack(-fill => 'both', -expand => 1);
    
    $self->{transcript_text} = $transcript_text;
    
    # Frame central-bajo: Interpretación del comando
    my $command_frame = $mw->Frame()->pack(-side => 'top', -fill => 'both', -expand => 1, -padx => 5, -pady => 5);
    
    $command_frame->Label(
        -text => "Interpretación:",
        -font => ['Arial', 10, 'bold']
    )->pack(-anchor => 'w');
    
    my $command_text = $command_frame->ROText(
        -height => 8,
        -wrap => 'word',
        -font => ['Courier', 10],
        -bg => '#fffef0'
    )->pack(-fill => 'both', -expand => 1);
    
    $self->{command_text} = $command_text;
    
    # Frame inferior: Log de actividad
    my $log_frame = $mw->Frame()->pack(-side => 'top', -fill => 'both', -expand => 1, -padx => 5, -pady => 5);
    
    $log_frame->Label(
        -text => "Log de actividad:",
        -font => ['Arial', 10, 'bold']
    )->pack(-anchor => 'w');
    
    my $log_text = $log_frame->ROText(
        -height => 10,
        -wrap => 'word',
        -font => ['Courier', 9],
        -bg => '#2b2b2b',
        -fg => '#00ff00'
    )->pack(-fill => 'both', -expand => 1);
    
    $self->{log_text} = $log_text;
    
    # Scrollbar para el log
    my $scrollbar = $log_frame->Scrollbar(-command => ['yview', $log_text]);
    $log_text->configure(-yscrollcommand => ['set', $scrollbar]);
}

sub log {
    my ($self, $message) = @_;
    my $timestamp = localtime();
    my $log_entry = "[$timestamp] $message\n";
    
    $self->{log_text}->insert('end', $log_entry);
    $self->{log_text}->see('end');
    print $log_entry;  # También imprimir en consola
}

sub set_transcript {
    my ($self, $text) = @_;
    $self->{transcript_text}->delete('1.0', 'end');
    $self->{transcript_text}->insert('1.0', $text);
}

sub set_command {
    my ($self, $command_json) = @_;
    $self->{command_text}->delete('1.0', 'end');
    
    use JSON;
    my $pretty = JSON->new->pretty->encode($command_json);
    $self->{command_text}->insert('1.0', $pretty);
}

sub enable_confirmation {
    my ($self, $enable) = @_;
    my $state = $enable ? 'normal' : 'disabled';
    $self->{confirm_button}->configure(-state => $state);
    $self->{cancel_button}->configure(-state => $state);
}

sub set_mic_state {
    my ($self, $listening) = @_;
    if ($listening) {
        $self->{mic_button}->configure(
            -text => "⏹ Detener",
            -bg => '#f44336'
        );
    } else {
        $self->{mic_button}->configure(
            -text => "🎤 Escuchar",
            -bg => '#4CAF50'
        );
    }
}

sub show_result {
    my ($self, $result) = @_;
    
    if ($result->{success}) {
        $self->log("✓ " . $result->{message});
        
        # Mostrar subdirectorios creados
        if ($result->{subdirs}) {
            for my $subdir (@{$result->{subdirs}}) {
                $self->log("  📁 $subdir");
            }
        }
        
        # Mostrar items listados
        if ($result->{items}) {
            my $count = scalar(@{$result->{items}});
            $self->log("  Total: $count elementos");
            
            # Mostrar primeros 20
            my $max = $count > 20 ? 20 : $count;
            for my $i (0 .. $max - 1) {
                my $item = $result->{items}->[$i];
                my $icon = $item->{type} eq 'directory' ? '📁' : '📄';
                $self->log("  $icon " . $item->{name});
            }
            
            if ($count > 20) {
                $self->log("  ... y " . ($count - 20) . " elementos más");
            }
        }
    } else {
        $self->log("❌ Error: " . $result->{message});
    }
}

sub run {
    my ($self) = @_;
    $self->log("🚀 Botas iniciado. Presiona 'Escuchar' para comenzar.");
    MainLoop();
}

1;
