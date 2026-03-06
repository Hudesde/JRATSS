# 🔴 IMÁGENES PENDIENTES - Marco Referencial IA

**Última actualización:** 21 de noviembre de 2025  
**Imágenes completadas:** Ver archivo `IMAGENES_COMPLETADAS.md`

## 📋 RESUMEN
- **Total de imágenes originales:** 19 (expandido a 31 con capturas adicionales)
- **Imágenes YA AGREGADAS:** 30 ✅
  - 16 imágenes previas
  - 2 diagramas IA (MoE, métodos aprendizaje)
  - 3 diagramas técnicos (secuencia, backend-MySQL, flujo voz)
  - 3 capturas proyecto chatbot
  - 5 capturas comparativas Cap 4 (LMS + OpenAI)
  - 3 capturas sistema Botas (interfaz + terminal + explorador)
- **Imágenes PENDIENTES:** 1
  - 📸 Captura: comparativa Ollama vs LM Studio
- **Carpeta destino:** `imgs/` (subcarpetas organizadas)

---

## ⚠️ NOTA IMPORTANTE
Las imágenes ya agregadas al documento (16 en total) están documentadas en el archivo **`IMAGENES_COMPLETADAS.md`**.
Este archivo contiene **ÚNICAMENTE las imágenes que aún faltan por crear o capturar**.

---

## 📚 CAPÍTULO 2: MARCO TEÓRICO

### ✅ Imagen T2: Arquitectura MoE de DeepSeek - **COMPLETADA**
- **Archivo:** `imgs/infografias/arquitectura_moe_deepseek.png`
- **Ubicación en LaTeX:** Línea 341 - Sección 2.4.1 DeepSeek
- **Tamaño:** 44 KB
- **Estado:** ✅ **INTEGRADA EN LATEX** - PlantUML generado el 21/nov/2025

### ✅ Imagen T3: Métodos de Aprendizaje en IA - **COMPLETADA**
- **Archivo:** `imgs/infografias/metodos_aprendizaje_ia.png`
- **Ubicación en LaTeX:** Línea 250 - Sección 2.2 Métodos de aprendizaje
- **Tamaño:** 54 KB
- **Descripción:** Diagrama vertical con 5 métodos (Supervisado, No Supervisado, Refuerzo, Semi-supervisado, Auto-supervisado) con ejemplos y algoritmos
- **Estado:** ✅ **INTEGRADA EN LATEX** - PlantUML generado el 21/nov/2025

---

## 💻 CAPÍTULO 3: DESARROLLO DE APLICACIONES

### PROYECTO 1: CHATBOT TERAPÉUTICO

#### 📐 Imagen 6: Flujo de Comunicación Detallado
- **Archivo:** `imgs/cap3_arquitectura_completa.png`
- **Ubicación:** Sección 3.2.1 - Chatbot DeepSeek Local
- **Descripción completa:** Diagrama arquitectónico detallado mostrando:
  - **Capa 1 - Frontend Angular:** Componente ChatbotComponent, servicios, routing
  - **Capa 2 - Backend Express:** Controladores, modelos, rutas API REST
  - **Capa 3 - LM Studio:** DeepSeek-R1 con endpoint OpenAI-compatible
  - **Capa 4 - MySQL:** Tablas (usuarios, sesiones, bigfive, citas)
  - Flechas indicando flujo de datos bidireccional
  - Anotaciones de tecnologías (HTTP, JSON, SQL)
- **Dimensiones sugeridas:** 1400x1000 px
- **Formato:** PNG o SVG (preferible para diagramas)
- **Estado:** ⏳ PENDIENTE DE CREAR (diagrama)

#### Imagen 5: Diagrama de Capas del Sistema
- **Archivo:** `imgs/cap3_diagrama_capas.png`
- **Ubicación:** Sección 3.2.1.1 - Arquitectura general
- **Descripción completa:** Diagrama en tres capas horizontales:
  - **Capa Superior:** Motor DeepSeek-R1 en LM Studio (icono de cerebro/IA)
  - **Capa Media:** Backend Express.js con controladores y servicios
  - **Capa Inferior:** Frontend Angular con componentes standalone
  - Indicadores de comunicación entre capas
  - Tecnologías clave anotadas en cada capa
- **Dimensiones sugeridas:** 1200x600 px
- **Formato:** PNG
- **Estado:** 🟡 OPCIONAL (complementa arquitectura completa)

#### 📐 Imagen 6: Flujo de Comunicación Detallado
- **Archivo:** `imgs/diagramas_tecnicos/cap3_flujo_comunicacion.png`
- **Ubicación en LaTeX:** Línea 1101 - Sección 3.2.1.2 Desarrollo e integración
- **Descripción completa:** Diagrama de secuencia mostrando:
  1. Usuario ingresa mensaje → ChatbotComponent
  2. ChatbotComponent → OpenAIService.getClient()
  3. OpenAIService → HTTP POST a localhost:1234/v1
  4. LM Studio procesa con DeepSeek-R1
  5. Respuesta JSON ← LM Studio
  6. Animación palabra por palabra en UI
  7. Persistencia en MySQL
  - Incluir timestamps estimados en cada paso
- **Dimensiones sugeridas:** 1000x800 px (vertical)
- **Formato:** PNG o SVG
- **Carpeta destino:** `imgs/diagramas_tecnicos/`
- **Herramientas sugeridas:** PlantUML, Mermaid, Lucidchart
- **Estado:** ⏳ PENDIENTE - Diagrama técnico

#### 📐 Imagen 7: Código Backend y MySQL
- **Archivo:** `imgs/diagramas_tecnicos/cap3_backend_mysql.png`
- **Ubicación en LaTeX:** Línea 1122 - Sección 3.2.1.3 Estructura del backend
- **Descripción completa:** Diagrama mostrando:
  - Controladores: sesionChatController.ts (CRUD operations)
  - Modelos de datos: interfaces TypeScript
  - Pool de conexiones MySQL con mysql2/promise
  - Endpoints REST expuestos (/api/sesiones, /api/chat)
  - Flujo de una consulta típica desde HTTP hasta SQL
- **Dimensiones sugeridas:** 1200x700 px
- **Formato:** PNG o SVG
- **Carpeta destino:** `imgs/diagramas_tecnicos/`
- **Herramientas sugeridas:** Draw.io, Lucidchart
- **Estado:** ⏳ PENDIENTE - Diagrama técnico

#### 📸 Imagen 8: Código Backend en Acción
- **Archivo:** `imgs/capturas_vscode/cap3_codigo_backend.png`
- **Ubicación en LaTeX:** Línea 1160 - Sección 3.2.1.3 Estructura del backend
- **Descripción completa:** Captura de código TypeScript mostrando:
  - Archivo `sesionChatController.ts` visible
  - Función `actualizarSesion()` resaltada
  - Consulta SQL parametrizada visible
  - Terminal mostrando logs del backend procesando solicitud
  - Respuesta JSON en formato legible
- **Dimensiones:** Captura de VS Code 1920x1080 px
- **Formato:** PNG
- **Carpeta destino:** `imgs/capturas_vscode/`
- **Estado:** ⏳ PENDIENTE - Captura de pantalla

#### 📸 Imagen 10: Comparativa Visual Herramientas
- **Archivo:** `imgs/capturas_comparativas/comparativa_ollama_lmstudio.png`
- **Ubicación en LaTeX:** Línea 498 - Sección 3.1.2 Comparativa Ollama vs LM Studio
- **Descripción completa:** Imagen dividida en dos:
  - **Lado izquierdo:** Terminal con Ollama ejecutando comando `ollama run deepseek-r1`
  - **Lado derecho:** Interfaz gráfica de LM Studio con modelo cargado
  - Anotaciones resaltando diferencias (CLI vs GUI)
- **Dimensiones sugeridas:** 1600x800 px
- **Formato:** PNG
- **Carpeta destino:** `imgs/capturas_comparativas/`
- **Estado:** ⏳ PENDIENTE - Captura de pantalla

---

### PROYECTO 2: SISTEMA DE VOZ A TERMINAL

#### 📐 Imagen 12: Diagrama de Flujo Voz
- **Archivo:** `imgs/diagramas_tecnicos/cap3_diagrama_flujo_voz.png`
- **Ubicación en LaTeX:** Línea 2150 - Sección 3.3.2 Arquitectura general (Sistema de Voz)
- **Descripción completa:** Diagrama de flujo vertical mostrando las 4 capas:
  1. **Capa STT:** Micrófono → Whisper API → Texto transcrito
  2. **Capa NLP:** Texto → GPT Chat Completions → Plan de acción
  3. **Capa Ejecución:** Plan → Bash/Python → Resultado
  4. **Capa TTS:** Resultado → Síntesis de voz → Audio
  - Flechas indicando flujo unidireccional
  - Iconos representativos para cada capa
- **Dimensiones sugeridas:** 800x1200 px (vertical)
- **Formato:** PNG o SVG
- **Carpeta destino:** `imgs/diagramas_tecnicos/`
- **Herramientas sugeridas:** Draw.io, Lucidchart, o generación con IA
- **Estado:** ⏳ PENDIENTE - Diagrama técnico

#### 📸 Imagen 13: Interfaz Tkinter (Sistema de Voz)
- **Archivo:** `imgs/capturas_vscode/cap3_interfaz_tkinter.png`
- **Ubicación en LaTeX:** Línea 2240 - Sección 3.3.5 Interfaz gráfica (Sistema de Voz)
- **Descripción completa:** Captura de la interfaz Tkinter mostrando:
  1. **Botón de micrófono grande:** Estado visual (verde=activo, gris=inactivo)
  2. **Panel de logs:** 5-6 líneas de comandos ejecutados con timestamps
  3. **Área de respuesta:** Texto de confirmación del sistema
  4. **Indicador de TTS:** "🔊 Reproduciendo audio..." o similar
  5. Opcional: botón de "Cancelar acción"
- **Dimensiones:** Captura de ventana Tkinter
- **Formato:** PNG
- **Carpeta destino:** `imgs/capturas_vscode/` (o nueva carpeta `capturas_python/`)
- **Estado:** ⏳ PENDIENTE - Captura de pantalla

---

## 📊 CAPÍTULO 4: ANÁLISIS Y COMPARATIVA

#### 📸 Imagen 14: Comparación de Respuestas
- **Archivo:** `imgs/capturas_comparativas/cap4_comparacion_respuestas.png`
- **Ubicación en LaTeX:** Línea 2338 - Sección 4.1.2 Discusión general
- **Descripción completa:** Imagen dividida verticalmente en dos:
  - **Lado izquierdo:** Respuesta de DeepSeek-R1 a prompt terapéutico
    - Ejemplo: "Me siento ansioso, ¿qué hago?"
    - Mostrar respuesta completa del modelo local
  - **Lado derecho:** Respuesta de GPT-4 al mismo prompt
    - Misma pregunta
    - Respuesta del modelo cloud
  - Resaltar diferencias de:
    - Longitud de respuesta
    - Tono y estilo
    - Profundidad del análisis
- **Dimensiones sugeridas:** 1600x900 px
- **Formato:** PNG
- **Carpeta destino:** `imgs/capturas_comparativas/`
- **Estado:** ⏳ PENDIENTE - Captura de pantalla

---

## 📝 RESUMEN DE IMÁGENES PENDIENTES

### � PRIORIDAD MEDIA (complementan conceptos técnicos)
1. ⏳ `imgs/diagramas_tecnicos/cap3_flujo_comunicacion.png` - � **DIAGRAMA** (PlantUML/Mermaid)
2. ⏳ `imgs/diagramas_tecnicos/cap3_backend_mysql.png` - 📐 **DIAGRAMA** (Draw.io)
3. ⏳ `imgs/diagramas_tecnicos/cap3_diagrama_flujo_voz.png` - 📐 **DIAGRAMA** (Draw.io)
4. ⏳ `imgs/capturas_vscode/cap3_codigo_backend.png` - � **CAPTURA** (VS Code)
5. ⏳ `imgs/capturas_comparativas/comparativa_ollama_lmstudio.png` - 📸 **CAPTURA** (Terminal + LM Studio)
6. ⏳ `imgs/capturas_vscode/cap3_interfaz_tkinter.png` - 📸 **CAPTURA** (App Python Tkinter)

### 🟢 CAPTURAS RESTANTES
7. ⏳ `imgs/capturas_comparativas/cap4_comparacion_respuestas.png` - 📸 **CAPTURA** (DeepSeek vs GPT-4)

### ✅ DIAGRAMAS IA COMPLETADOS
8. ✅ `imgs/infografias/arquitectura_moe_deepseek.png` - 🤖 **COMPLETADO** (44 KB)
9. ✅ `imgs/infografias/metodos_aprendizaje_ia.png` - 🤖 **COMPLETADO** (54 KB)

---

## 🎯 GUÍA DE CAPTURA

### Para capturas de pantalla:
- **Resolución:** Mínimo 1920x1080 px
- **Formato:** PNG (sin compresión JPG para texto legible)
- **Limpieza:** Cerrar notificaciones, ocultar información sensible
- **Claridad:** Asegurar que el texto sea legible al 100%

### Para diagramas:
- **Herramientas sugeridas:** Draw.io, Lucidchart, Figma, o incluso PowerPoint
- **Formato preferido:** SVG (escalable) o PNG de alta resolución
- **Estilo:** Profesional, colores sobrios, fuentes legibles (Arial, Roboto)
- **Elementos:** Incluir leyenda cuando sea necesario

### Nomenclatura de archivos:
- Usar nombres descriptivos en minúsculas
- Separar palabras con guion bajo `_`
- Incluir prefijo del capítulo `cap3_`, `cap4_`, etc.
- No usar espacios ni caracteres especiales

---

## 🎨 CLASIFICACIÓN POR TIPO DE IMAGEN

### 📸 CAPTURAS DE PANTALLA (8 imágenes)
Requieren tener los proyectos corriendo localmente:

**Del Proyecto Chatbot Terapéutico:**
1. `cap3_entorno_desarrollo.png` - VS Code con proyecto abierto
2. `cap3_lmstudio_servidor.png` - LM Studio con DeepSeek-R1 activo
3. `cap3_chatbot_interfaz_prueba.png` - Navegador con interfaz chatbot
4. `cap3_interfaz_completa.png` - Vista completa de la aplicación web
5. `cap3_codigo_backend.png` - Código TypeScript en editor

**Del Proyecto Sistema de Voz:**
6. `cap3_interfaz_tkinter.png` - Interfaz gráfica de la aplicación Python

**Comparativas:**
7. `comparativa_visual_herramientas.png` - Ollama CLI vs LM Studio GUI
8. `cap4_comparacion_respuestas.png` - Respuestas DeepSeek vs GPT-4

**Requerimiento:** Tener los proyectos instalados y funcionando para capturar pantallas reales.

---

### 📐 DIAGRAMAS TÉCNICOS (5 imágenes)
Pueden crearse con herramientas especializadas o IA:

**Herramientas recomendadas:**
- **Draw.io** (gratis, online): https://app.diagrams.net/
- **Lucidchart** (requiere cuenta)
- **Excalidraw** (minimalista): https://excalidraw.com/
- **MySQL Workbench** (para diagrama ER específicamente)

**Diagramas arquitectónicos:**
1. `cap3_arquitectura_completa.png` - Arquitectura del sistema completo
   - 🤖 Alternativa IA: Describir arquitectura detalladamente a ChatGPT/Claude y pedirle código Mermaid o PlantUML

2. `cap3_diagrama_er.png` - Diagrama Entidad-Relación de MySQL
   - 📐 Mejor opción: MySQL Workbench (genera automáticamente desde BD)
   - 📐 Alternativa: Draw.io con plantillas de ER

3. `cap3_diagrama_flujo_voz.png` - Flujo del sistema de voz (4 capas)
   - 🤖 Alternativa IA: Pedir código Mermaid flowchart y renderizar

**Diagramas complementarios:**
4. `cap3_diagrama_capas.png` - Tres capas del sistema
   - 🤖 Generable con IA: Diagrama simple de capas

5. `cap3_flujo_comunicacion.png` - Diagrama de secuencia
   - 📐 Mejor opción: PlantUML o Mermaid sequence diagram

---

### 🤖 GENERABLES CON IA (3 imágenes)
Infografías y visualizaciones conceptuales:

**Herramientas de IA recomendadas:**
- **DALL-E 3** (ChatGPT Plus/OpenAI API)
- **Midjourney** (requiere Discord)
- **Leonardo.ai** (gratis con límite)
- **Ideogram** (excelente para infografías con texto)

**Prompts sugeridos:**

1. **`evolucion_llms.png`** - Timeline de evolución de LLMs
   ```
   Prompt: "Create a professional horizontal timeline infographic showing 
   the evolution of Large Language Models from 2018 to 2025. Include: 
   BERT (2018), GPT-2 (2019), GPT-3 (2020, 175B parameters), PaLM and 
   LLaMA (2022), GPT-4, Claude, Gemini (2023), DeepSeek-R1 and GPT-4-turbo 
   (2024-2025). Use clean design, academic style, blue and purple gradient, 
   with model names and key milestones clearly labeled."
   ```

2. **`arquitectura_moe_deepseek.png`** - Arquitectura Mixture of Experts
   ```
   Prompt: "Create a technical diagram showing Mixture of Experts (MoE) 
   architecture. Show: input tokens at bottom, router mechanism in middle 
   selecting from multiple expert neural networks (highlight 2-3 as active), 
   and combined output at top. Use clean technical style with arrows, 
   blue and orange colors, annotations about computational efficiency."
   ```

3. **`metodos_aprendizaje_ia.png`** - Taxonomía de métodos de aprendizaje
   ```
   Prompt: "Create an educational infographic showing AI learning methods 
   taxonomy. Include 5 categories with icons: Supervised Learning (labeled 
   data icon), Unsupervised Learning (clustering icon), Reinforcement 
   Learning (agent-environment icon), Semi-supervised Learning, and 
   Self-supervised Learning. Use clean academic design, color-coded sections, 
   simple visual examples for each type."
   ```

**Nota:** Si usas IA generativa, puede que necesites 2-3 intentos ajustando el prompt para obtener el resultado deseado.

---

## ✅ CHECKLIST DE VALIDACIÓN

Antes de considerar una imagen completa, verificar:
- [ ] Nombre de archivo coincide con el especificado
- [ ] Ubicada en carpeta `imgs/`
- [ ] Formato correcto (PNG preferentemente)
- [ ] Dimensiones adecuadas (legible al compilar)
- [ ] Sin información sensible visible (contraseñas, tokens, datos personales)
- [ ] Corresponde exactamente con la descripción del listado
- [ ] Comentario en LaTeX actualizado (descomentar `\includegraphics`)

---

**Fecha de creación:** 3 de noviembre de 2025  
**Última actualización:** 3 de noviembre de 2025  
**Autor:** Marco Referencial - IA's
---

## 📊 TABLA RESUMEN DE IMÁGENES PENDIENTES

| # | Archivo | Tipo | Carpeta Destino | Línea LaTeX | Estado |
|---|---------|------|-----------------|-------------|---------|
| 1 | `cap3_flujo_comunicacion.png` | 📐 Diagrama | `imgs/diagramas_tecnicos/` | 1101 | ⏳ Pendiente |
| 2 | `cap3_backend_mysql.png` | 📐 Diagrama | `imgs/diagramas_tecnicos/` | 1122 | ⏳ Pendiente |
| 3 | `cap3_diagrama_flujo_voz.png` | 📐 Diagrama | `imgs/diagramas_tecnicos/` | 2150 | ⏳ Pendiente |
| 4 | `cap3_codigo_backend.png` | 📸 Captura | `imgs/capturas_vscode/` | 1160 | ⏳ Pendiente |
| 5 | `comparativa_ollama_lmstudio.png` | 📸 Captura | `imgs/capturas_comparativas/` | 498 | ⏳ Pendiente |
| 6 | `cap3_interfaz_tkinter.png` | 📸 Captura | `imgs/capturas_vscode/` | 2240 | ⏳ Pendiente |
| ~~7~~ | ~~`cap4_comparacion_respuestas`~~ (5 imgs) | ~~📸 Captura~~ | ~~`imgs/capturas_comparativas/`~~ | ~~2338~~ | ✅ **COMPLETADAS** |
| ~~8~~ | ~~`arquitectura_moe_deepseek.png`~~ | ~~🤖 IA~~ | ~~`imgs/infografias/`~~ | ~~341~~ | ✅ **COMPLETADA** |
| ~~9~~ | ~~`metodos_aprendizaje_ia.png`~~ | ~~🤖 IA~~ | ~~`imgs/infografias/`~~ | ~~250~~ | ✅ **COMPLETADA** |

**NOTA:** La entrada #7 incluye 5 capturas comparativas integradas en el Capítulo 4:
- `RESPUESTA_LMS.png` (respuesta normal de LM Studio)
- `RESPUESTA_LMSErrorYRecuperacion.png` (error de concurrencia)
- `RESPUESTA_LMSErrorYRecuperacion2.png` (recuperación del sistema)
- `RESPUESTA_OAI_1.png` (primera respuesta de GPT-4)
- `RESPUESTA_OAI_2.png` (manejo de múltiples mensajes)

---

## 🎯 INSTRUCCIONES PARA COMPLETAR

### Para 📸 Capturas de Pantalla (4 imágenes):
1. **cap3_codigo_backend.png** → Captura VS Code con `sesionChatController.ts` abierto
2. **comparativa_ollama_lmstudio.png** → Split screen: Ollama CLI vs LM Studio GUI
3. **cap3_interfaz_tkinter.png** → App Python Tkinter del sistema de voz funcionando
4. **cap4_comparacion_respuestas.png** → Comparación lado a lado DeepSeek-R1 vs GPT-4

### Para 📐 Diagramas Técnicos (3 imágenes):
1. **cap3_flujo_comunicacion.png** → Diagrama de secuencia (PlantUML/Mermaid)
2. **cap3_backend_mysql.png** → Diagrama de arquitectura backend (Draw.io)
3. **cap3_diagrama_flujo_voz.png** → Diagrama de flujo 4 capas (Draw.io)

### Para 🤖 Generación con IA (2 imágenes):
1. **arquitectura_moe_deepseek.png** → Diagrama técnico Mixture of Experts
2. **metodos_aprendizaje_ia.png** → Infografía taxonomía de aprendizaje IA

---

**Ver imágenes completadas:** `IMAGENES_COMPLETADAS.md`
