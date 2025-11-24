package CommandParser;

use strict;
use warnings;
use utf8;
use POSIX qw(locale_h);
use Encode qw(decode encode);
use LWP::UserAgent;
use JSON;

sub new {
    my ($class, $config) = @_;
    
    my $provider = $config->{nlp}->{provider} // 'openai';
    
    my $self = {
        provider => $provider,
        api_key => $config->{openai}->{api_key},
        api_base => $provider eq 'lmstudio' 
            ? $config->{nlp}->{lmstudio}->{api_base}
            : $config->{openai}->{api_base},
        model => $provider eq 'lmstudio'
            ? $config->{nlp}->{lmstudio}->{model}
            : $config->{openai}->{gpt_model},
        temperature => $provider eq 'lmstudio'
            ? $config->{nlp}->{lmstudio}->{temperature}
            : 0.3,
    };
    
    bless $self, $class;
    return $self;
}

# Analiza el comando de voz y retorna estructura JSON con la intención
sub parse {
    my ($self, $text) = @_;
    
    print "🧠 Analizando comando: \"$text\"\n";
    
    my $system_prompt = $self->_get_system_prompt();
    
    my $ua = LWP::UserAgent->new();
    
    # Asegurar que los números usen punto decimal (no coma)
    use POSIX qw(locale_h);
    my $old_locale = setlocale(LC_NUMERIC);
    setlocale(LC_NUMERIC, "C");
    
    my $request_data = {
        model => $self->{model},
        messages => [
            {
                role => "system",
                content => $system_prompt
            },
            {
                role => "user",
                content => $text
            }
        ],
        temperature => $self->{temperature},
    };
    
    # Solo agregar response_format si el modelo lo soporta (OpenAI)
    if ($self->{provider} eq 'openai' && $self->{model} =~ /gpt-4o|gpt-4-turbo|gpt-3.5-turbo-1106/) {
        $request_data->{response_format} = { type => "json_object" };
    }
    
    my $request_body = encode_json($request_data);
    
    # Restaurar locale
    setlocale(LC_NUMERIC, $old_locale);
    
    my $provider_name = $self->{provider} eq 'lmstudio' ? 'LM-Studio' : 'OpenAI';
    print "📤 Enviando a $provider_name ($self->{model}): " . substr($request_body, 0, 150) . "...\n";
    print "📊 Tamaño del request: " . length($request_body) . " bytes\n";
    
    my $response;
    if ($self->{provider} eq 'lmstudio') {
        # LM-Studio no requiere Authorization header
        $response = $ua->post(
            $self->{api_base} . '/chat/completions',
            Content_Type => 'application/json',
            Content => $request_body
        );
    } else {
        # OpenAI requiere Bearer token
        $response = $ua->post(
            $self->{api_base} . '/chat/completions',
            Content_Type => 'application/json',
            Authorization => "Bearer " . $self->{api_key},
            Content => $request_body
        );
    }
    
    unless ($response->is_success) {
        my $error_msg = "Error en GPT API: " . $response->status_line;
        print "❌ $error_msg\n";
        print "📤 Request enviado:\n";
        print substr($request_body, 0, 500) . "\n";
        print "📥 Response recibido:\n";
        print $response->content . "\n";
        die "$error_msg\n" . $response->content;
    }
    
    print "✅ Respuesta recibida de API\n";
    
    my $result = decode_json($response->content);
    my $content = $result->{choices}->[0]->{message}->{content};
    
    # Asegurar UTF-8 correcto
    $content = decode('UTF-8', $content) unless utf8::is_utf8($content);
    
    print "📄 Contenido: $content\n";
    
    # Limpiar el contenido por si viene con texto extra
    $content =~ s/^[^{]*//;  # Eliminar texto antes del primer {
    $content =~ s/[^}]*$//;  # Eliminar texto después del último }
    
    # Decodificar JSON con UTF-8
    my $json = JSON->new->utf8(0);
    my $parsed = $json->decode($content);
    
    print "✓ Intención detectada: " . $parsed->{action} . "\n";
    
    return $parsed;
}

sub _get_system_prompt {
    return <<'PROMPT';
Eres un asistente que interpreta comandos de voz para gestionar archivos y carpetas.

Tu tarea es convertir el texto del usuario en un objeto JSON estructurado. DEBES responder ÚNICAMENTE con JSON válido, sin texto adicional antes o después.

Estructura del JSON:

{
  "action": "string",        // Acción principal: create, list, search, move, rename, delete, info, create_project
  "target_type": "string",   // Tipo: file, directory, files (múltiples)
  "target_path": "string",   // Ruta destino o patrón de búsqueda
  "source_path": "string",   // Ruta origen (para move/rename)
  "parameters": {},          // Parámetros adicionales según la acción
  "requires_confirmation": bool,  // true si es operación destructiva
  "tts_response": "string"   // Mensaje corto para síntesis de voz
}

Acciones soportadas:
- create: Crear archivos o directorios
- list: Listar contenido de directorios
- search: Buscar archivos por nombre, extensión, fecha, etc.
- move: Mover archivos/carpetas
- rename: Renombrar archivos/carpetas
- delete: Eliminar archivos/carpetas
- info: Obtener información (tamaño, permisos, etc.)
- create_project: Crear estructura de proyecto desde plantilla

Para create_project, el campo "parameters" debe incluir:
{
  "template": "frontend_pos|backend_api|fullstack",
  "project_name": "nombre_proyecto",
  "features": ["login", "inventario", "ventas", ...]
}

Ejemplos:

Usuario: "Lista los archivos en la carpeta documentos"
Respuesta (solo JSON):
{
  "action": "list",
  "target_type": "directory",
  "target_path": "~/Documentos",
  "parameters": {"recursive": false},
  "requires_confirmation": false,
  "tts_response": "Listando archivos en Documentos"
}

Usuario: "Crea el frontend de un punto de venta con login, inventario y ventas"
Respuesta (solo JSON):
{
  "action": "create_project",
  "target_type": "directory",
  "target_path": "~/Proyectos/punto-venta-frontend",
  "parameters": {
    "template": "frontend_pos",
    "project_name": "punto-venta-frontend",
    "features": ["login", "inventario", "ventas"]
  },
  "requires_confirmation": false,
  "tts_response": "Creando estructura de frontend para punto de venta con login, inventario y ventas"
}

Usuario: "Elimina todos los archivos temporales"
Respuesta (solo JSON):
{
  "action": "delete",
  "target_type": "files",
  "target_path": "~/",
  "parameters": {"pattern": "*tmp*", "recursive": true},
  "requires_confirmation": true,
  "tts_response": "Esta operación eliminará archivos. ¿Confirmas?"
}

Usuario: "Puedes crear las carpetas para mis tres materias que son Matemáticas, Español e Historia"
Respuesta (solo JSON):
{
  "action": "create",
  "target_type": "directory",
  "target_path": "~/Documentos/Materias",
  "parameters": {
    "subdirs": ["Matemáticas", "Español", "Historia"]
  },
  "requires_confirmation": false,
  "tts_response": "Creando carpetas para Matemáticas, Español e Historia"
}

REGLAS CRÍTICAS:
1. Responde SOLO con JSON válido (sin texto antes o después)
2. Usa UTF-8 para acentos (Matemáticas, Español)
3. Si piden crear múltiples carpetas, usa "parameters.subdirs"
4. Rutas relativas: usa ~/Documentos, ~/Descargas, ~/Proyectos
5. Marca requires_confirmation=true SOLO para delete
6. Mensajes TTS breves (máximo 15 palabras)
PROMPT
}

1;
