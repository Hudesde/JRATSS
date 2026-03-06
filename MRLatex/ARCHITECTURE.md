# Arquitectura de Botas

## Visión General

Botas es un asistente de voz que permite gestionar archivos mediante comandos en lenguaje natural. La arquitectura sigue un patrón modular con separación clara de responsabilidades.

```
┌─────────────────────────────────────────────────────────┐
│                    Usuario (Voz)                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   GUI (Perl/Tk)                         │
│  - Botón de grabación                                   │
│  - Área de transcripción                                │
│  - Visualización de comandos                            │
│  - Log de actividad                                     │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Voice     │ │  Command    │ │    TTS      │
│ Recognition │ │   Parser    │ │  (eSpeak)   │
│  (Whisper)  │ │   (GPT-4)   │ │             │
└──────┬──────┘ └──────┬──────┘ └─────────────┘
       │               │
       │               ▼
       │        ┌─────────────┐
       │        │   Command   │
       │        │  Structure  │
       │        │   (JSON)    │
       │        └──────┬──────┘
       │               │
       └───────────────┼───────────────┐
                       │               │
                       ▼               ▼
              ┌─────────────┐  ┌─────────────┐
              │    File     │  │  AWK Helper │
              │   Manager   │  │   Scripts   │
              └──────┬──────┘  └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │  File       │
              │  System     │
              └─────────────┘
```

## Componentes Principales

### 1. GUI.pm - Interfaz Gráfica
**Responsabilidad**: Presentación y manejo de eventos

- Renderiza la interfaz con Perl/Tk
- Captura eventos de usuario (clicks, teclas)
- Muestra transcripciones y logs
- Controla el flujo de confirmaciones

**Tecnologías**: Perl/Tk

### 2. VoiceRecognition.pm - Reconocimiento de Voz
**Responsabilidad**: Captura y transcripción de audio

**Flujo**:
1. Graba audio desde micrófono usando SoX
2. Guarda en archivo temporal WAV
3. Envía a OpenAI Whisper API
4. Retorna texto transcrito

**Tecnologías**: SoX, OpenAI Whisper API, LWP::UserAgent

### 3. CommandParser.pm - Interpretación de Comandos
**Responsabilidad**: Convertir lenguaje natural a estructura ejecutable

**Flujo**:
1. Recibe texto transcrito
2. Envía a GPT-4 con prompt especializado
3. GPT retorna JSON con estructura de comando
4. Valida y retorna estructura

**Estructura del Comando**:
```json
{
  "action": "create|list|search|move|rename|delete|info|create_project",
  "target_type": "file|directory|files",
  "target_path": "/ruta/destino",
  "source_path": "/ruta/origen",
  "parameters": { /* params específicos */ },
  "requires_confirmation": boolean,
  "tts_response": "Mensaje para voz"
}
```

**Tecnologías**: OpenAI GPT-4 API, JSON

### 4. FileManager.pm - Gestor de Archivos
**Responsabilidad**: Ejecutar operaciones en el filesystem

**Métodos principales**:
- `create()`: Crear archivos/directorios
- `list()`: Listar contenido
- `search()`: Buscar con filtros
- `move()`: Mover archivos
- `rename()`: Renombrar
- `delete()`: Eliminar con validación
- `info()`: Obtener metadatos
- `create_project()`: Crear desde plantilla

**Seguridad**:
- Validación de rutas permitidas
- Prevención de path traversal
- Límite de operaciones masivas
- Confirmación obligatoria para operaciones destructivas

**Tecnologías**: File::Path, File::Find::Rule, File::Copy

### 5. TTS.pm - Síntesis de Voz
**Responsabilidad**: Convertir texto a voz

**Flujo**:
1. Recibe mensaje de texto
2. Llama a eSpeak (o motor configurado)
3. Reproduce audio de forma asíncrona

**Tecnologías**: eSpeak

### 6. Scripts AWK
**Responsabilidad**: Análisis avanzado de archivos

**Scripts**:
- `find_duplicates.awk`: Detecta archivos con mismo nombre
- `analyze_logs.awk`: Extrae estadísticas de logs
- `disk_usage.awk`: Analiza espacio por tipo de archivo

**Integración**: Llamados desde FileManager mediante pipes

## Flujo de Datos

### Flujo Típico: Comando de Voz a Ejecución

```
1. Usuario presiona "🎤 Escuchar"
   │
   ▼
2. VoiceRecognition.record_audio()
   - Graba con SoX
   - Guarda WAV temporal
   │
   ▼
3. VoiceRecognition.transcribe()
   - Envía a Whisper API
   - Retorna texto: "Crea una carpeta llamada proyectos"
   │
   ▼
4. CommandParser.parse()
   - Envía texto a GPT-4
   - Retorna: {action: "create", target_type: "directory", ...}
   │
   ▼
5. GUI muestra comando parseado
   - Si requires_confirmation: habilita botones
   - Si no: ejecuta directamente
   │
   ▼
6. FileManager.create()
   - Valida ruta con _validate_path()
   - Ejecuta File::Path::make_path()
   - Retorna resultado
   │
   ▼
7. TTS.speak()
   - Reproduce "Directorio creado: /home/user/proyectos"
   │
   ▼
8. GUI muestra resultado en log
```

## Seguridad

### Capas de Seguridad

1. **Validación de Rutas**
   - Solo directorios en `allowed_dirs`
   - Expansión segura de `~` y `$HOME`
   - Prevención de `../` traversal

2. **Confirmación de Operaciones**
   - Delete siempre requiere confirmación
   - Move masivo requiere confirmación
   - Operaciones limitadas a 100 archivos

3. **Aislamiento de Procesos**
   - TTS en proceso fork separado
   - Timeouts en llamadas API
   - Archivos temporales con permisos restrictivos

## Extensibilidad

### Agregar Nueva Acción

1. **CommandParser.pm**: Actualizar prompt del sistema
2. **FileManager.pm**: Implementar método `nueva_accion()`
3. **bin/botas.pl**: Agregar case en `execute_command()`

### Agregar Nueva Plantilla

1. Crear `templates/mi_plantilla.json`:
```json
{
  "structure": ["dir1", "dir2"],
  "features": {
    "feature1": ["file1.js", "file2.js"]
  }
}
```

2. Usar con: "Crea mi plantilla con feature1"

### Agregar Script AWK

1. Crear en `awk_scripts/mi_script.awk`
2. Hacer ejecutable: `chmod +x`
3. Integrar desde FileManager con pipes

## Dependencias Externas

### APIs
- **OpenAI Whisper**: Transcripción de voz
- **OpenAI GPT-4**: Interpretación de comandos

### Sistema
- **SoX**: Grabación de audio
- **eSpeak**: Síntesis de voz

### Perl
- LWP::UserAgent: Llamadas HTTP
- JSON: Parsing/encoding
- Tk: GUI
- File::Path: Manipulación directorios
- File::Find::Rule: Búsqueda de archivos

## Configuración

Todo centralizado en `config/config.json`:

```json
{
  "openai": { "api_key": "..." },
  "paths": { "allowed_dirs": [...] },
  "security": { "max_file_operations": 100 },
  "tts": { "engine": "espeak" }
}
```

## Testing

Ejecutar demos:
```bash
./demo.sh          # Scripts AWK
perl bin/botas.pl  # Sistema completo
```

## Performance

- **Transcripción**: ~2-5 segundos (depende de API)
- **Parsing**: ~1-3 segundos (GPT-4)
- **Operaciones filesystem**: <1 segundo
- **Total por comando**: ~5-10 segundos

## Limitaciones Conocidas

1. Requiere conexión a internet (APIs OpenAI)
2. Costos de API por uso
3. Latencia de red afecta respuesta
4. Solo Linux (dependencia SoX/eSpeak)
5. Grabación limitada a micrófono por defecto

## Roadmap

- [ ] Soporte offline con Whisper local
- [ ] Cache de comandos frecuentes
- [ ] Modo batch para múltiples operaciones
- [ ] Integración con servicios cloud (Dropbox, GDrive)
- [ ] Soporte para Windows/macOS
