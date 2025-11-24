# 🤖 Guía de Uso: LM-Studio con Botas

## ¿Qué es LM-Studio?

LM-Studio es una aplicación que te permite ejecutar modelos de lenguaje (LLMs) de forma local en tu computadora, sin necesidad de internet ni APIs externas. Es como tener tu propio ChatGPT privado.

## 🎯 Ventajas de Usar LM-Studio

✅ **Gratis**: Sin costos por uso  
✅ **Privado**: Tus datos nunca salen de tu PC  
✅ **Sin Internet**: Funciona completamente offline  
✅ **Rápido**: Sin latencia de red  
✅ **Sin límites**: Usa cuanto quieras  

❌ **Desventajas**:
- Requiere una GPU decente (o mucha RAM)
- Los modelos ocupan espacio (5-20GB cada uno)
- Puede ser más lento que la API de OpenAI

---

## 📥 Instalación de LM-Studio

### 1. Descargar LM-Studio

Ve a: **https://lmstudio.ai/**

Descarga la versión para Linux (.AppImage)

```bash
cd ~/Descargas
chmod +x LM_Studio-*.AppImage
./LM_Studio-*.AppImage
```

### 2. Descargar el Modelo DeepSeek-R1

Una vez en LM-Studio:

1. Ve a la pestaña **"Search"**
2. Busca: `deepseek-r1-distill-qwen`
3. Descarga una de estas versiones (según tu hardware):

   - **8GB RAM**: `deepseek-r1-distill-qwen-1.5b-Q4_K_M.gguf` (1.5B)
   - **16GB RAM**: `deepseek-r1-distill-qwen-7b-Q4_K_M.gguf` (7B)
   - **32GB RAM + GPU**: `deepseek-r1-distill-qwen-14b-Q4_K_M.gguf` (14B)

**Recomendado para la mayoría**: `deepseek-r1-distill-qwen-7b-Q4_K_M.gguf`

---

## 🚀 Configurar el Servidor Local

### 1. Cargar el Modelo

1. En LM-Studio, ve a **"Local Server"**
2. Selecciona el modelo descargado
3. Haz clic en **"Start Server"**
4. El servidor se iniciará en: `http://localhost:1234`

### 2. Verificar que Funciona

Abre una terminal y ejecuta:

```bash
curl http://localhost:1234/v1/models
```

Deberías ver algo como:

```json
{
  "data": [
    {
      "id": "deepseek-r1-distill-qwen-7b",
      "object": "model",
      ...
    }
  ]
}
```

---

## ⚙️ Configurar Botas para Usar LM-Studio

Edita `config/config.json`:

```json
{
  "nlp": {
    "provider": "lmstudio",
    "lmstudio": {
      "api_base": "http://localhost:1234/v1",
      "model": "deepseek-r1-distill-qwen-7b",
      "temperature": 0.3
    }
  }
}
```

**Cambiar entre OpenAI y LM-Studio**:

- Para usar **OpenAI**: `"provider": "openai"`
- Para usar **LM-Studio**: `"provider": "lmstudio"`

---

## 🧪 Probar la Integración

Ejecuta el script de comparación:

```bash
perl test_lmstudio.pl
```

Este script probará 5 comandos con ambos modelos y te mostrará:
- ✅ Cuál tiene mejor precisión
- 💰 Diferencia de costos
- 🏆 Recomendaciones de uso

---

## 📊 Comparación OpenAI vs LM-Studio

| Aspecto | OpenAI GPT-4o | LM-Studio DeepSeek-R1 |
|---------|---------------|------------------------|
| **Precisión** | ⭐⭐⭐⭐⭐ (Excelente) | ⭐⭐⭐⭐☆ (Muy buena) |
| **Velocidad** | ⚡ Rápido (red dependiente) | ⚡⚡ Muy rápido (local) |
| **Costo** | 💰 ~$0.01-0.02 por comando | 🆓 Gratis |
| **Privacidad** | ☁️ Nube (OpenAI) | 🔒 100% Local |
| **Internet** | ✅ Requerido | ❌ No necesario |
| **Configuración** | ✅ Simple (solo API key) | ⚙️ Requiere instalación |

---

## 🎯 Casos de Uso Recomendados

### Usa OpenAI cuando:
- ✅ Necesites máxima precisión
- ✅ Comandos muy complejos o ambiguos
- ✅ No tengas hardware potente
- ✅ Estés en un proyecto importante

### Usa LM-Studio cuando:
- ✅ Quieras privacidad total
- ✅ No tengas internet
- ✅ Vayas a usar el bot intensivamente
- ✅ Estés haciendo pruebas/desarrollo
- ✅ Quieras ahorrar dinero

---

## 🔧 Solución de Problemas

### LM-Studio no inicia

```bash
# Asegúrate de tener las librerías necesarias
sudo apt-get install libfuse2
```

### El modelo es muy lento

1. En LM-Studio, reduce el **"Context Length"** a 2048
2. Activa **"GPU Acceleration"** si tienes GPU
3. Prueba un modelo más pequeño (1.5B en lugar de 7B)

### Error "Connection refused"

1. Verifica que LM-Studio esté corriendo
2. Asegúrate de que el servidor esté iniciado
3. Verifica el puerto (debe ser 1234)

### El modelo da respuestas raras

1. Aumenta el **"Temperature"** en config.json a 0.5
2. En LM-Studio, ajusta **"Repeat Penalty"** a 1.1
3. Prueba con otro modelo de la familia DeepSeek

---

## 📝 Ejemplo de Uso

```bash
# 1. Inicia LM-Studio y el servidor local
./LM_Studio.AppImage

# 2. Configura Botas para usar LM-Studio
# Edita config/config.json → "provider": "lmstudio"

# 3. Ejecuta Botas
perl bin/botas.pl

# 4. Di un comando
# "Crea una carpeta llamada Proyectos en mi escritorio"

# El flujo será:
# Micrófono → Whisper (OpenAI) → DeepSeek (Local) → File::Path → eSpeak
```

---

## 🎓 Modelos Alternativos

Si DeepSeek-R1 no te funciona bien, prueba estos:

1. **Llama 3.1 8B** - Muy bueno en español
2. **Mistral 7B Instruct** - Rápido y preciso
3. **Phi-3 Mini** - Ligero (3.8B) para PCs modestas
4. **Qwen 2.5 7B** - Excelente en tareas generales

Para descargarlos, búscalos en LM-Studio → Search

---

## 💡 Tips y Trucos

### Optimizar Rendimiento

```json
// En LM-Studio, ajusta estos parámetros:
{
  "n_ctx": 2048,          // Contexto más corto = más rápido
  "n_gpu_layers": 35,     // Usa GPU si tienes (0 = solo CPU)
  "n_threads": 8,         // Núcleos de CPU a usar
  "repeat_penalty": 1.1   // Evita repeticiones
}
```

### Modo Híbrido

Puedes usar ambos modelos según el comando:

```perl
# En botas.pl, detecta el tipo de comando
if ($text =~ /complejo|proyecto|análisis/) {
    $config->{nlp}->{provider} = 'openai';  # Usa OpenAI
} else {
    $config->{nlp}->{provider} = 'lmstudio'; # Usa local
}
```

---

## 🆘 Soporte

- **LM-Studio**: https://lmstudio.ai/docs
- **DeepSeek**: https://github.com/deepseek-ai
- **Botas**: Consulta README.md del proyecto

---

**¡Disfruta de tu asistente de voz con IA local!** 🎉
