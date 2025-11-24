# 🎤 Botas - Quick Start Guide

## ¿Qué es Botas?

**Botas** es un asistente de voz inteligente que te permite gestionar archivos y carpetas usando comandos naturales en español. 

Puedes decir cosas como:
- *"Crea una carpeta llamada proyectos"*
- *"Busca todos los PDFs en documentos"*
- *"Crea el frontend de un punto de venta con login, inventario y ventas"*

## 🚀 Instalación Rápida (5 minutos)

### 1. Instalar dependencias

```bash
cd /home/huesomx/Documentos/GitHub/Botas
./install.sh
```

Esto instalará:
- Perl y módulos necesarios
- SoX (grabación de audio)
- eSpeak (síntesis de voz)

### 2. Configurar API Key de OpenAI

```bash
cp config/config.json.example config/config.json
nano config/config.json  # o usa tu editor favorito
```

Edita la línea:
```json
"api_key": "YOUR_OPENAI_API_KEY_HERE"
```

Reemplaza con tu API key de https://platform.openai.com/api-keys

### 3. ¡Ejecutar!

```bash
perl bin/botas.pl
```

Se abrirá una ventana. Presiona **"🎤 Escuchar"** y habla tu comando.

## 🧪 Testing Sin API (Offline)

Si quieres probar sin gastar créditos de API:

### Probar gestión de archivos:
```bash
./test_filemanager.pl
```

### Probar scripts AWK:
```bash
./test_awk.pl
```

### Demo completa:
```bash
./demo.sh
```

## 📖 Ejemplos de Comandos

### Básicos
```
"Lista los archivos en documentos"
"Crea una carpeta llamada backup"
"Busca archivos PDF modificados hoy"
"Cuánto espacio ocupa la carpeta descargas"
```

### Avanzados
```
"Crea el frontend de un punto de venta que contemple login, inventario, ventas y reportes"

"Crea un backend API con autenticación, productos y usuarios"

"Busca todos los archivos JPG mayores a 5 megabytes en mis documentos"
```

## 🛠️ Scripts AWK Útiles

### Encontrar archivos duplicados:
```bash
find ~/Documentos -type f | ./awk_scripts/find_duplicates.awk
```

### Analizar logs:
```bash
cat /var/log/syslog | ./awk_scripts/analyze_logs.awk
```

### Ver uso de disco por tipo:
```bash
du -a ~/Documentos | ./awk_scripts/disk_usage.awk
```

## 📁 Estructura del Proyecto

```
Botas/
├── bin/botas.pl              # 🎯 Ejecutable principal
├── lib/                      # 📚 Módulos Perl
│   ├── VoiceRecognition.pm   # Whisper API
│   ├── CommandParser.pm      # GPT-4 parsing
│   ├── FileManager.pm        # Gestión de archivos
│   ├── GUI.pm               # Interfaz Tk
│   └── TTS.pm               # Text-to-Speech
├── templates/               # 📋 Plantillas de proyectos
│   ├── frontend_pos.json
│   ├── backend_api.json
│   └── fullstack.json
├── awk_scripts/            # 🔧 Scripts AWK
│   ├── find_duplicates.awk
│   ├── analyze_logs.awk
│   └── disk_usage.awk
├── config/                 # ⚙️ Configuración
│   └── config.json.example
├── test_*.pl              # 🧪 Scripts de testing
├── install.sh             # 📦 Instalador
└── README.md              # 📖 Este archivo
```

## 📚 Documentación Completa

- **[README.md](README.md)** - Visión general y características
- **[USAGE.md](USAGE.md)** - Guía de uso detallada
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura técnica
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios

## ⚠️ Troubleshooting

### No graba audio
```bash
# Verificar micrófono
arecord -l

# Reinstalar SoX
sudo apt-get install --reinstall sox libsox-fmt-all
```

### No abre la GUI
```bash
# Instalar Perl/Tk
sudo apt-get install perl-tk
```

### Error en módulos Perl
```bash
# Reinstalar dependencias
./install.sh
```

### API muy lenta
- Verifica tu conexión a internet
- Revisa el estado de OpenAI: https://status.openai.com

## 💰 Costos de API

Botas usa APIs de OpenAI:
- **Whisper**: ~$0.006 por minuto de audio
- **GPT-4**: ~$0.03 por 1K tokens

Comando promedio: ~$0.01-0.02 USD

## 🔒 Seguridad

- Solo accede a directorios permitidos (configurable)
- Confirmación obligatoria para eliminar archivos
- Sin ejecución de comandos arbitrarios
- Validación de rutas contra path traversal

## 🤝 Contribuir

Mejoras bienvenidas:
1. Fork del proyecto
2. Crea rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📝 Licencia

MIT License - Uso libre y modificación permitida

## 🎯 Próximos Pasos

Después de la instalación:

1. **Prueba básica**: `./test_filemanager.pl`
2. **Prueba AWK**: `./test_awk.pl`
3. **Configura API**: Edita `config/config.json`
4. **Ejecuta**: `perl bin/botas.pl`
5. **Di un comando**: "Lista los archivos en documentos"

## 💬 Soporte

¿Problemas o preguntas?
- Revisa [USAGE.md](USAGE.md)
- Lee [ARCHITECTURE.md](ARCHITECTURE.md) para detalles técnicos
- Abre un issue en GitHub

---

**¡Disfruta de Botas!** 🥾✨
