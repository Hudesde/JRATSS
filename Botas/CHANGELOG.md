# Changelog

## [1.1.0] - 2025-11-21

### 🆕 Nuevas Características

- ✅ **Soporte para LM-Studio**: Ahora puedes usar modelos locales (DeepSeek-R1, Llama, Mistral)
- ✅ **IA 100% privada**: Los comandos pueden procesarse localmente sin enviar datos a la nube
- ✅ **Voz mejorada**: eSpeak configurado a 120 wpm (más claro y comprensible)
- ✅ **OpenAI TTS opcional**: Soporte para voces premium de OpenAI (nova, alloy)
- ✅ **Selector de proveedor**: Cambia entre OpenAI y LM-Studio en config.json
- ✅ **Test comparativo**: Script `test_lmstudio.pl` para comparar ambos modelos

### 🔧 Mejoras Técnicas

- Parámetros adicionales de eSpeak: pitch (50), gap (10ms), amplitud (100)
- CommandParser ahora soporta múltiples backends (OpenAI/LM-Studio)
- TTS.pm con método `_speak_openai()` para voces premium
- Configuración unificada en `nlp.provider`

### 📚 Documentación

- Nueva guía: `LMSTUDIO_GUIDE.md` con instrucciones completas
- README actualizado con ejemplos de uso local
- Comparación de costos: OpenAI vs LM-Studio

### 💰 Ahorro de Costos

- Uso local = $0.00 USD por comando
- Ideal para desarrollo y uso intensivo
- Privacidad total (datos no salen de tu PC)

---

## [1.0.0] - 2025-10-27

### Características Principales

- ✅ Reconocimiento de voz con OpenAI Whisper API
- ✅ Interpretación de comandos naturales con GPT-4
- ✅ Interfaz gráfica con Perl/Tk
- ✅ Síntesis de voz con eSpeak
- ✅ Gestión completa de archivos y directorios
- ✅ Plantillas de proyectos (Frontend POS, Backend API, Fullstack)
- ✅ Scripts AWK para análisis avanzado
- ✅ Sistema de confirmación para operaciones destructivas
- ✅ Control de acceso a directorios permitidos

### Acciones Soportadas

- `create`: Crear archivos y directorios
- `list`: Listar contenido
- `search`: Buscar archivos con filtros
- `move`: Mover archivos/carpetas
- `rename`: Renombrar
- `delete`: Eliminar (con confirmación)
- `info`: Obtener información de archivos
- `create_project`: Crear proyectos desde plantillas

### Scripts AWK Incluidos

- `find_duplicates.awk`: Detectar archivos duplicados
- `analyze_logs.awk`: Analizar logs y extraer estadísticas
- `disk_usage.awk`: Análisis de uso de disco por tipo de archivo

### Plantillas de Proyectos

- `frontend_pos.json`: Frontend React para Punto de Venta
- `backend_api.json`: Backend Node.js/Express
- `fullstack.json`: Aplicación completa frontend + backend

### Dependencias

- Perl 5.x
- Módulos: LWP::UserAgent, JSON, Tk, File::Path, File::Find::Rule, File::Slurp
- SoX (para grabación de audio)
- eSpeak (para síntesis de voz)
- OpenAI API key

### Notas

Primera versión estable del asistente de voz Botas.
