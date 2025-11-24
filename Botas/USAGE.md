# Guía de Uso - Botas

## Instalación Rápida

```bash
cd /home/huesomx/Documentos/GitHub/Botas
./install.sh
```

Luego edita `config/config.json` y agrega tu API key de OpenAI.

## Configuración de API Key

1. Obtén tu API key en: https://platform.openai.com/api-keys
2. Edita el archivo `config/config.json`
3. Reemplaza `YOUR_OPENAI_API_KEY_HERE` con tu clave real

## Ejecución

```bash
perl bin/botas.pl
```

Se abrirá una ventana con la interfaz gráfica.

## Ejemplos de Comandos de Voz

### Gestión básica de archivos

**Crear:**
- "Crea una carpeta llamada proyectos en documentos"
- "Crea un archivo llamado notas.txt en el escritorio"

**Listar:**
- "Lista los archivos en la carpeta documentos"
- "Muestra todos los archivos en descargas de forma recursiva"

**Buscar:**
- "Busca archivos PDF en documentos"
- "Encuentra todos los archivos JPG modificados esta semana"
- "Busca archivos mayores a 10 megabytes"

**Mover/Renombrar:**
- "Mueve el archivo reporte.pdf a la carpeta documentos"
- "Renombra proyecto-viejo a proyecto-nuevo"

**Eliminar:**
- "Elimina el archivo temporal.txt"
- "Borra la carpeta cache" (pedirá confirmación)

**Información:**
- "Cuánto espacio ocupa la carpeta descargas"
- "Muestra información del archivo config.json"

### Creación de Proyectos

**Frontend de Punto de Venta:**
```
"Crea el frontend de un punto de venta que contemple login, inventario, ventas y reportes"
```

**Backend API:**
```
"Crea un backend con autenticación, productos y ventas"
```

**Fullstack:**
```
"Crea una aplicación fullstack con autenticación y dashboard"
```

## Uso de Scripts AWK

### Encontrar Archivos Duplicados

```bash
find ~/Documentos -type f | ./awk_scripts/find_duplicates.awk
```

### Analizar Logs

```bash
cat /var/log/syslog | ./awk_scripts/analyze_logs.awk
```

### Análisis de Uso de Disco

```bash
du -a ~/Documentos | ./awk_scripts/disk_usage.awk
```

## Personalización

### Agregar Nuevas Plantillas

1. Crea un archivo JSON en `templates/`
2. Define la estructura y features
3. Úsalo con: "Crea un [nombre-plantilla]..."

Ejemplo de plantilla (`templates/mi_plantilla.json`):

```json
{
  "name": "Mi Plantilla",
  "structure": [
    "src",
    "src/components",
    "tests"
  ],
  "features": {
    "auth": [
      "src/components/Login.jsx"
    ]
  }
}
```

### Modificar Directorios Permitidos

Edita `config/config.json` y modifica la sección `allowed_dirs`:

```json
{
  "paths": {
    "allowed_dirs": [
      "$HOME/Documentos",
      "$HOME/Proyectos",
      "$HOME/tu_directorio"
    ]
  }
}
```

## Seguridad

- Solo puede acceder a directorios en `allowed_dirs`
- Comandos destructivos (eliminar, mover múltiples archivos) requieren confirmación
- Límite de operaciones masivas (100 archivos por defecto)

## Solución de Problemas

### Error: "Motor TTS no encontrado"

```bash
sudo apt-get install espeak
```

### Error: "No se pudo grabar audio"

Verifica que sox esté instalado:
```bash
sudo apt-get install sox libsox-fmt-all
```

Verifica tu micrófono:
```bash
arecord -l
```

### Error: "Módulo Perl no encontrado"

Reinstala dependencias:
```bash
./install.sh
```

### La GUI no se abre

Verifica que Tk esté instalado:
```bash
sudo apt-get install perl-tk
```

## Atajos de Teclado

- **Escuchar**: Click en botón "🎤 Escuchar"
- **Confirmar**: Click en "✓ Confirmar"
- **Cancelar**: Click en "✗ Cancelar"

## Estructura del Código

```
lib/
├── VoiceRecognition.pm  # Grabación y transcripción (Whisper)
├── CommandParser.pm     # Interpretación con GPT
├── FileManager.pm       # Operaciones de archivos
├── TTS.pm              # Síntesis de voz
└── GUI.pm              # Interfaz Tk
```

## Contribuir

Para agregar nuevas funcionalidades:

1. Módulos Perl: Crear en `lib/`
2. Plantillas: Agregar JSON en `templates/`
3. Scripts AWK: Crear en `awk_scripts/`
4. Acciones nuevas: Modificar `CommandParser.pm` y `FileManager.pm`

## Licencia

MIT - Libre uso y modificación
