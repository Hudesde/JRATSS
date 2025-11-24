# 🥾 Botas - Asistente de Voz para Gestión de Archivos

**Botas** es un asistente de voz inteligente desarrollado en **Perl** que te permite gestionar archivos y carpetas de tu PC usando comandos naturales en español. Integra directamente con tu sistema de archivos y puede crear estructuras completas de proyectos mediante plantillas.

> *"Crea el frontend de un punto de venta con login, inventario y ventas"* → Y Botas lo hace por ti.

## ✨ Características Principales

- 🎤 **Reconocimiento de voz** mediante OpenAI Whisper API
- 🧠 **Interpretación inteligente** de comandos naturales con GPT-4o **O LM-Studio local**
- 🤖 **Soporte para modelos locales** (DeepSeek-R1, Llama, Mistral) - ¡100% privado y gratis!
- 🖥️ **Interfaz gráfica** con Perl/Tk (intuitiva y fácil de usar)
- 🔊 **Síntesis de voz mejorada** con eSpeak (más clara) o OpenAI TTS (premium)
- 📁 **Gestión completa**: crear, mover, renombrar, buscar, listar, eliminar
- 🏗️ **Plantillas de proyectos** (Frontend, Backend, Fullstack)
- 🔧 **Scripts AWK** para análisis avanzado de archivos y logs
- 🔒 **Operación segura** con confirmación de comandos destructivos
- 📊 **Estadísticas**: 1,500+ líneas de código, 5 módulos Perl, 3 scripts AWK

## 📁 Estructura del Proyecto

```
Botas/
├── bin/                    # Ejecutables principales
│   └── botas.pl           # Script principal
├── lib/                    # Módulos Perl
│   ├── VoiceRecognition.pm # Reconocimiento de voz (Whisper API)
│   ├── CommandParser.pm    # Parser de intenciones
│   ├── FileManager.pm      # Gestor de archivos
│   ├── GUI.pm             # Interfaz Perl/Tk
│   └── TTS.pm             # Text-to-Speech
├── config/                 # Configuración
│   └── config.json        # API keys, rutas, etc.
├── templates/              # Plantillas de proyectos
│   ├── frontend_pos.json
│   ├── backend_api.json
│   └── fullstack.json
└── awk_scripts/           # Scripts AWK auxiliares
    ├── find_duplicates.awk
    └── analyze_logs.awk
```

## 🚀 Instalación Rápida (5 minutos)

### Opción 1: Instalación Automática (Recomendada)

```bash
cd /home/huesomx/Documentos/GitHub/Botas
./install.sh
```

### Opción 2: Instalación Manual

```bash
# 1. Instalar dependencias del sistema
sudo apt-get update
sudo apt-get install libwww-perl libjson-perl perl-tk libsox-fmt-all sox espeak cpanminus

# 2. Instalar módulos Perl
sudo cpanm LWP::UserAgent JSON Tk File::Path File::Find::Rule File::Slurp

# 3. Configurar API key de OpenAI
cp config/config.json.example config/config.json
nano config/config.json  # Agregar tu API key
```

### Obtener API Key de OpenAI

1. Visita: https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Cópiala en `config/config.json`

## 💬 Ejemplos de Comandos de Voz

- "Lista los archivos en la carpeta Documentos"
- "Crea una carpeta llamada proyectos"
- "Busca archivos PDF modificados esta semana"
- "Crea el frontend de un punto de venta con login, inventario y ventas"
- "Mueve todos los archivos JPG a la carpeta fotos"
- "¿Cuánto espacio ocupa la carpeta descargas?"

## 🏃 Ejecución

### Modo Completo (con voz)

```bash
perl bin/botas.pl
```

Se abrirá la interfaz gráfica. Presiona **🎤 Escuchar** y habla tu comando.

### Modo con LM-Studio (IA Local - Gratis)

1. **Descarga LM-Studio**: https://lmstudio.ai/
2. **Carga el modelo DeepSeek-R1**: `deepseek-r1-distill-qwen-7b`
3. **Inicia el servidor local** en LM-Studio
4. **Configura Botas**:
   ```json
   // En config/config.json
   "nlp": {
     "provider": "lmstudio"
   }
   ```
5. **Ejecuta**: `perl bin/botas.pl`

📖 **Guía completa**: Ver `LMSTUDIO_GUIDE.md`

### Modo Testing (sin API / offline)

```bash
# Probar gestión de archivos
./test_filemanager.pl

# Probar scripts AWK
./test_awk.pl

# Comparar OpenAI vs LM-Studio
./test_lmstudio.pl

# Demo completa
./demo.sh

# Ver información del proyecto
./info.sh
```

## 🔒 Seguridad

- Operaciones limitadas al directorio $HOME del usuario
- Confirmación obligatoria para comandos destructivos (eliminar, sobrescribir)
- Validación de rutas para prevenir path traversal
- Modo dry-run disponible para previsualizar cambios

## 📝 Licencia

MIT
