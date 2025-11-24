package FileManager;

use strict;
use warnings;
use File::Path qw(make_path remove_tree);
use File::Find::Rule;
use File::Copy;  # No importar move/copy directamente
use File::Basename;
use Cwd 'abs_path';
use JSON;

sub new {
    my ($class, $config) = @_;
    my $self = {
        home => $ENV{HOME},
        allowed_dirs => $config->{paths}->{allowed_dirs},
        max_operations => $config->{security}->{max_file_operations},
        templates_dir => $config->{paths}->{templates_dir} // './templates',
    };
    
    bless $self, $class;
    return $self;
}

# Valida que la ruta esté dentro de directorios permitidos
sub _validate_path {
    my ($self, $path) = @_;
    
    # Expandir ~ y variables
    $path =~ s/^~/$self->{home}/;
    $path =~ s/\$HOME/$self->{home}/;
    
    my $abs_path = abs_path($path) // $path;
    
    # Verificar que esté en directorios permitidos
    for my $allowed (@{$self->{allowed_dirs}}) {
        $allowed =~ s/^~/$self->{home}/;
        $allowed =~ s/\$HOME/$self->{home}/;
        
        if ($abs_path =~ /^\Q$allowed\E/) {
            return $abs_path;
        }
    }
    
    die "❌ Acceso denegado: la ruta '$path' no está en directorios permitidos\n";
}

# Crear archivo o directorio
sub create {
    my ($self, $command) = @_;
    
    my $path = $self->_validate_path($command->{target_path});
    my $type = $command->{target_type};
    
    if ($type eq 'directory') {
        # Verificar si hay subdirectorios a crear
        if ($command->{parameters}->{subdirs}) {
            my @created;
            for my $subdir (@{$command->{parameters}->{subdirs}}) {
                my $subdir_path = "$path/$subdir";
                make_path($subdir_path, {verbose => 1});
                push @created, $subdir;
            }
            return {
                success => 1,
                message => "✓ Directorios creados: " . join(", ", @created),
                path => $path,
                subdirs => \@created
            };
        } else {
            # Un solo directorio
            make_path($path, {verbose => 1});
            return {
                success => 1,
                message => "✓ Directorio creado: $path",
                path => $path
            };
        }
    } elsif ($type eq 'file') {
        my $dir = dirname($path);
        make_path($dir) unless -d $dir;
        
        open my $fh, '>', $path or die "No se pudo crear $path: $!";
        
        if ($command->{parameters}->{content}) {
            print $fh $command->{parameters}->{content};
        }
        
        close $fh;
        
        return {
            success => 1,
            message => "✓ Archivo creado: $path",
            path => $path
        };
    }
}

# Listar archivos y directorios
sub list {
    my ($self, $command) = @_;
    
    my $path = $self->_validate_path($command->{target_path});
    my $recursive = $command->{parameters}->{recursive} // 0;
    
    unless (-d $path) {
        die "❌ No es un directorio: $path\n";
    }
    
    my @items;
    
    if ($recursive) {
        @items = File::Find::Rule->in($path);
    } else {
        opendir(my $dh, $path) or die "No se pudo abrir $path: $!";
        @items = map { "$path/$_" } grep { !/^\.\.?$/ } readdir($dh);
        closedir($dh);
    }
    
    # Obtener información de cada item
    my @results;
    for my $item (@items) {
        my @stat = stat($item);
        push @results, {
            path => $item,
            name => basename($item),
            type => -d $item ? 'directory' : 'file',
            size => $stat[7],
            modified => $stat[9],
            permissions => sprintf("%04o", $stat[2] & 07777)
        };
    }
    
    return {
        success => 1,
        message => "✓ Encontrados " . scalar(@results) . " elementos",
        items => \@results
    };
}

# Buscar archivos
sub search {
    my ($self, $command) = @_;
    
    my $base_path = $self->_validate_path($command->{target_path});
    my $params = $command->{parameters};
    
    my $rule = File::Find::Rule->new();
    
    # Aplicar filtros
    if ($params->{pattern}) {
        $rule->name($params->{pattern});
    }
    
    if ($params->{extension}) {
        $rule->name("*.$params->{extension}");
    }
    
    if ($params->{type}) {
        if ($params->{type} eq 'file') {
            $rule->file();
        } elsif ($params->{type} eq 'directory') {
            $rule->directory();
        }
    }
    
    if ($params->{min_size}) {
        $rule->size(">$params->{min_size}");
    }
    
    if ($params->{max_size}) {
        $rule->size("<$params->{max_size}");
    }
    
    my @found = $rule->in($base_path);
    
    # Limitar resultados
    if (@found > $self->{max_operations}) {
        @found = @found[0 .. $self->{max_operations} - 1];
    }
    
    my @results = map {
        { path => $_, name => basename($_) }
    } @found;
    
    return {
        success => 1,
        message => "✓ Encontrados " . scalar(@results) . " elementos",
        items => \@results
    };
}

# Mover archivo/directorio
sub move {
    my ($self, $command) = @_;
    
    my $source = $self->_validate_path($command->{source_path});
    my $target = $self->_validate_path($command->{target_path});
    
    unless (-e $source) {
        die "❌ No existe: $source\n";
    }
    
    File::Copy::move($source, $target) or die "Error al mover: $!";
    
    return {
        success => 1,
        message => "✓ Movido: $source → $target",
        source => $source,
        target => $target
    };
}

# Renombrar
sub rename {
    my ($self, $command) = @_;
    
    return $self->move($command);
}

# Eliminar archivo/directorio
sub delete {
    my ($self, $command) = @_;
    
    my $path = $self->_validate_path($command->{target_path});
    
    unless (-e $path) {
        die "❌ No existe: $path\n";
    }
    
    if (-d $path) {
        remove_tree($path, {verbose => 1});
    } else {
        unlink($path) or die "Error al eliminar: $!";
    }
    
    return {
        success => 1,
        message => "✓ Eliminado: $path",
        path => $path
    };
}

# Obtener información
sub info {
    my ($self, $command) = @_;
    
    my $path = $self->_validate_path($command->{target_path});
    
    unless (-e $path) {
        die "❌ No existe: $path\n";
    }
    
    my @stat = stat($path);
    my $size = $stat[7];
    
    # Si es directorio, calcular tamaño total con awk
    if (-d $path) {
        my $du_output = `du -sb "$path" 2>/dev/null | awk '{print \$1}'`;
        chomp $du_output;
        $size = $du_output if $du_output;
    }
    
    return {
        success => 1,
        message => "✓ Información de: $path",
        info => {
            path => $path,
            type => -d $path ? 'directory' : 'file',
            size => $size,
            size_human => $self->_human_size($size),
            modified => scalar(localtime($stat[9])),
            permissions => sprintf("%04o", $stat[2] & 07777),
            owner => getpwuid($stat[4]),
        }
    };
}

# Crear proyecto desde plantilla
sub create_project {
    my ($self, $command) = @_;
    
    my $template_name = $command->{parameters}->{template};
    my $template_file = "$self->{templates_dir}/${template_name}.json";
    
    unless (-f $template_file) {
        die "❌ Plantilla no encontrada: $template_name\n";
    }
    
    # Leer plantilla
    open my $fh, '<', $template_file or die "Error leyendo plantilla: $!";
    my $template_json = do { local $/; <$fh> };
    close $fh;
    
    my $template = decode_json($template_json);
    
    my $base_path = $self->_validate_path($command->{target_path});
    my $features = $command->{parameters}->{features} // [];
    
    # Crear estructura base
    for my $dir (@{$template->{structure}}) {
        my $dir_path = "$base_path/$dir";
        make_path($dir_path, {verbose => 1});
    }
    
    # Crear archivos según features
    for my $feature (@$features) {
        if ($template->{features}->{$feature}) {
            for my $file (@{$template->{features}->{$feature}}) {
                my $file_path = "$base_path/$file";
                my $dir = dirname($file_path);
                make_path($dir) unless -d $dir;
                
                open my $fh, '>', $file_path or die "Error creando $file_path: $!";
                print $fh "// Archivo generado por Botas: $file\n";
                close $fh;
            }
        }
    }
    
    return {
        success => 1,
        message => "✓ Proyecto creado: $base_path",
        path => $base_path,
        template => $template_name,
        features => $features
    };
}

sub _human_size {
    my ($self, $size) = @_;
    my @units = qw(B KB MB GB TB);
    my $unit = 0;
    
    while ($size >= 1024 && $unit < $#units) {
        $size /= 1024;
        $unit++;
    }
    
    return sprintf("%.2f %s", $size, $units[$unit]);
}

1;
