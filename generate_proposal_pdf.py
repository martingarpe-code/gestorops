from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUTPUT = r"G:\Gestorops\GestorOps_ClaudeCode_Propuesta_Tecnica.pdf"

W, H = A4

# ── Paleta ────────────────────────────────────────────────────────────────────
C_BG      = colors.HexColor("#09090b")
C_SURFACE = colors.HexColor("#18181b")
C_BORDER  = colors.HexColor("#27272a")
C_TEXT    = colors.HexColor("#fafafa")
C_MUTED   = colors.HexColor("#a1a1aa")
C_ACCENT  = colors.HexColor("#6366f1")
C_GREEN   = colors.HexColor("#22c55e")
C_AMBER   = colors.HexColor("#f59e0b")
C_RED     = colors.HexColor("#ef4444")
C_BLUE    = colors.HexColor("#3b82f6")
C_DARK    = colors.HexColor("#0f0f11")

# ── Estilos ───────────────────────────────────────────────────────────────────
def S(name, parent="Normal", **kw):
    return ParagraphStyle(name, getSampleStyleSheet()[parent], **kw)

ST = {
    "h1":     S("h1",  fontSize=20, leading=26, textColor=C_TEXT, spaceAfter=8, spaceBefore=14, fontName="Helvetica-Bold"),
    "h2":     S("h2",  fontSize=13, leading=18, textColor=C_TEXT, spaceAfter=5, spaceBefore=10, fontName="Helvetica-Bold"),
    "h3":     S("h3",  fontSize=10, leading=14, textColor=C_ACCENT, spaceAfter=4, spaceBefore=7, fontName="Helvetica-Bold"),
    "body":   S("body", fontSize=9, leading=14, textColor=C_MUTED, spaceAfter=5),
    "body_w": S("body_w", fontSize=9, leading=14, textColor=C_TEXT, spaceAfter=4),
    "code":   S("code", fontSize=7.5, leading=11, textColor=colors.HexColor("#a5b4fc"), fontName="Courier",
                backColor=C_SURFACE, leftIndent=8, rightIndent=8, spaceAfter=5, borderPadding=(5,7,5,7)),
    "phase":  S("phase", fontSize=8, leading=11, textColor=C_ACCENT, fontName="Helvetica-Bold",
                spaceBefore=14, spaceAfter=2),
    "th":     S("th", fontSize=8, leading=11, textColor=C_TEXT, fontName="Helvetica-Bold"),
    "td":     S("td", fontSize=8, leading=11, textColor=C_MUTED),
    "cover_t":S("cover_t", fontSize=32, leading=40, textColor=C_TEXT, fontName="Helvetica-Bold"),
    "cover_s":S("cover_s", fontSize=14, leading=20, textColor=C_ACCENT),
    "cover_m":S("cover_m", fontSize=9, leading=13, textColor=C_MUTED),
    "tag":    S("tag", fontSize=7.5, leading=10, textColor=C_ACCENT, fontName="Helvetica-Bold"),
    "warn":   S("warn", fontSize=8.5, leading=13, textColor=C_AMBER),
    "green":  S("green", fontSize=8.5, leading=13, textColor=C_GREEN),
    "red":    S("red", fontSize=8.5, leading=13, textColor=C_RED),
}

def draw_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(C_ACCENT)
    canvas.rect(0, H-3, W, 3, fill=1, stroke=0)
    canvas.setFillColor(C_BORDER)
    canvas.rect(0, 0, W, 18, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(C_MUTED)
    canvas.drawString(18*mm, 6, "GestorOps × Claude Code — Propuesta Técnica de Integración")
    canvas.drawRightString(W-18*mm, 6, f"Página {doc.page}")
    canvas.restoreState()

doc = SimpleDocTemplate(OUTPUT, pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm,
    topMargin=20*mm, bottomMargin=22*mm,
    title="GestorOps × Claude Code — Propuesta Técnica",
    author="GestorOps")

def sp(h=6): return Spacer(1, h)
def h1(t): return Paragraph(t, ST["h1"])
def h2(t): return Paragraph(t, ST["h2"])
def h3(t): return Paragraph(t, ST["h3"])
def body(t): return Paragraph(t, ST["body"])
def bodyw(t): return Paragraph(t, ST["body_w"])
def code(t): return Paragraph(t.replace("\n","<br/>").replace(" ","&nbsp;"), ST["code"])
def phase(t): return Paragraph(t, ST["phase"])
def div(*items, color=C_BORDER):
    return [sp(2), HRFlowable(width="100%", thickness=0.4, color=color, spaceAfter=6), *items]
def accent_div():
    return [sp(2), HRFlowable(width="100%", thickness=1.2, color=C_ACCENT, spaceAfter=8)]

def callout(text, color=C_ACCENT):
    t = Table([[Paragraph(text, ParagraphStyle("cb", fontSize=8.5, leading=13, textColor=color))]], colWidths=[W-36*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),C_SURFACE),
        ("LEFTPADDING",(0,0),(-1,-1),10), ("RIGHTPADDING",(0,0),(-1,-1),10),
        ("TOPPADDING",(0,0),(-1,-1),8), ("BOTTOMPADDING",(0,0),(-1,-1),8),
        ("LINEAFTER",(0,0),(0,-1),3,color), ("BOX",(0,0),(-1,-1),0.4,C_BORDER),
    ]))
    return t

def tbl(headers, rows, widths=None):
    data = [[Paragraph(h, ST["th"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), ST["td"]) for c in row])
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),C_SURFACE),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[C_DARK, C_SURFACE]),
        ("GRID",(0,0),(-1,-1),0.4,C_BORDER),
        ("TOPPADDING",(0,0),(-1,-1),5), ("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(-1,-1),7), ("RIGHTPADDING",(0,0),(-1,-1),7),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    return t

# ── STORY ─────────────────────────────────────────────────────────────────────
story = []

# ── PORTADA ───────────────────────────────────────────────────────────────────
story += [sp(40),
    Paragraph("GestorOps", ST["cover_t"]),
    Paragraph("× Claude Code", ParagraphStyle("x", fontSize=28, leading=36, textColor=C_ACCENT, fontName="Helvetica-Bold")),
    sp(6),
    Paragraph("Propuesta Técnica de Integración", ST["cover_s"]),
    sp(4),
] + accent_div() + [
    sp(4),
    Paragraph("Arquitectura · Seguridad · Autonomía · Roadmap · Costes", ST["cover_m"]),
    Paragraph("Mayo 2026  ·  Versión 1.0  ·  Confidencial", ST["cover_m"]),
    sp(40),
    callout("Propuesta técnica completa para integrar Claude Code como motor principal de análisis "
            "y mantenimiento técnico dentro del gestor operativo GestorOps. Cubre arquitectura, "
            "seguridad, niveles de autonomía, integración con GitHub y roadmap de implementación.", C_ACCENT),
    sp(20),
]

# Índice
toc = [
    ["Parte", "Contenido"],
    ["1", "Viabilidad técnica y comparativa Claude Code vs API"],
    ["2", "Arquitectura completa del sistema"],
    ["3", "Niveles de autonomía (1–5)"],
    ["4", "Tipos de tareas — implementación detallada"],
    ["5", "Integración con GitHub (GitHub App)"],
    ["6", "Workers y ejecución aislada"],
    ["7", "Base de datos — esquema completo"],
    ["8", "UX del gestor — diseño de pantallas"],
    ["9", "Seguridad — estrategia y mitigaciones"],
    ["10", "Roadmap de implementación (5 fases)"],
    ["11", "Respuestas a preguntas clave"],
    ["12", "Estimación de costes"],
]
story.append(h2("Índice"))
story.append(tbl(toc[0], toc[1:], [15*mm, W-36*mm-15*mm]))
story.append(PageBreak())

# ── PARTE 1 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 1"))
story += accent_div()
story.append(h1("Viabilidad Técnica"))

story.append(callout("Veredicto: SÍ es viable. Claude Code no es un chatbot — es un agente técnico real "
    "con capacidad de leer codebases, ejecutar comandos, modificar archivos y tomar decisiones en múltiples pasos. "
    "La complejidad está en la infraestructura alrededor, no en Claude Code.", C_GREEN))
story.append(sp(8))

story.append(h2("Capacidades confirmadas de Claude Code"))
caps = [
    ["Capacidad", "Descripción"],
    ["Leer codebases completos", "Explorar estructura, leer archivos, entender arquitectura"],
    ["Ejecutar comandos", "bash, git, npm, pytest, linters, tests — cualquier CLI"],
    ["Crear/modificar archivos", "Read, Write, Edit con precisión quirúrgica"],
    ["Decisiones multi-paso", "Bucle autónomo hasta resolver el objetivo"],
    ["Generar informes", "Markdown estructurado, JSON para el gestor"],
    ["Usar herramientas", "Grep, Glob, Bash — búsqueda inteligente en código"],
]
story.append(tbl(caps[0], caps[1:], [55*mm, W-36*mm-55*mm]))
story.append(sp(8))

story.append(h2("Limitaciones reales"))
lims = [
    ["Limitación", "Impacto", "Mitigación"],
    ["Sin contexto infinito", "Proyectos >500k tokens son caros", "Indexar solo archivos relevantes"],
    ["No determinista", "Dos runs pueden dar resultados distintos", "Revisión humana siempre"],
    ["Sin contexto de negocio", "Solo ve código, no lógica implícita", "Enriquecer con docs del gestor"],
    ["Coste por token", "Proyectos grandes escalan el coste", "Límites + caching + chunking"],
    ["Sin estado entre runs", "No recuerda ejecuciones anteriores", "Estado persistido en BD"],
    ["Rate limits", "Límites de Anthropic por organización", "Cola de tareas + retry"],
]
story.append(tbl(lims[0], lims[1:], [45*mm, 45*mm, W-36*mm-90*mm]))
story.append(sp(8))

story.append(h2("Claude Code vs Claude API — Cuándo usar cada uno"))
compare = [
    ["Tarea", "Claude Code", "Claude API"],
    ["Analizar repositorio completo", "Ideal", "Muy costoso"],
    ["Ejecutar comandos (tests, linters)", "Nativo", "Imposible"],
    ["Crear/modificar archivos", "Nativo", "Manual"],
    ["Mantenimiento mensual", "Ideal", "No puede"],
    ["Clasificar una incidencia", "Overkill", "Barato y directo"],
    ["Chat asistente en el gestor", "Overkill", "Ideal"],
    ["Resumir diff de PR", "Posible", "Más simple"],
]
story.append(tbl(compare[0], compare[1:], [70*mm, 35*mm, 35*mm]))
story.append(PageBreak())

# ── PARTE 2 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 2"))
story += accent_div()
story.append(h1("Arquitectura del Sistema"))

story.append(h2("Diagrama de componentes"))
arch = (
    "GestorOps (Next.js)\n"
    "  [Botón Tarea] → [API Route] → [Supabase: ai_tasks]\n"
    "                                        ↓\n"
    "Task Queue (Supabase polling / webhook)\n"
    "                                        ↓\n"
    "Worker Service (Node.js — Railway/Fly.io)\n"
    "  1. Fetch task           5. Launch Claude Code\n"
    "  2. Setup workspace      6. Capture logs realtime\n"
    "  3. Clone repo (GitHub)  7. Upload artifacts\n"
    "  4. Inject context       8. Update task status\n"
    "                                        ↓\n"
    "Docker Container (efímero por tarea)\n"
    "  - Cloned repo   - Claude Code CLI\n"
    "  - Limited env   - No producción\n"
    "  - Internet solo: Anthropic + GitHub + npm\n"
    "                                        ↓\n"
    "Supabase Storage\n"
    "  - Reports (MD/JSON)  - Diffs  - Logs  - Artifacts"
)
story.append(code(arch))
story.append(sp(6))

story.append(h2("Flujo completo de una tarea"))
flow = [
    ["Paso", "Actor", "Acción"],
    ["1", "Usuario", "Pulsa 'Analizar proyecto' en el gestor"],
    ["2", "Gestor", "Verifica permisos, crea ai_tasks (status: queued)"],
    ["3", "Worker", "Detecta tarea nueva, marca como 'running'"],
    ["4", "Worker", "Crea workspace /tmp/task-{uuid}/, clona repo"],
    ["5", "Worker", "Carga contexto: incidencias, notas, último mantenimiento"],
    ["6", "Claude Code", "Analiza proyecto según tipo de tarea"],
    ["7", "Claude Code", "Genera REPORT.md y PLAN.json en workspace"],
    ["8", "Worker", "Sube artefactos a Supabase Storage, actualiza BD"],
    ["9", "Gestor", "Muestra resultado al usuario en tiempo real"],
    ["10", "Usuario", "Revisa informe, aprueba/rechaza plan"],
    ["11", "Worker", "Si aprobado: aplica cambios, abre PR en GitHub"],
    ["12", "Gestor", "Registra todo en activity_log y historial técnico"],
]
story.append(tbl(flow[0], flow[1:], [12*mm, 30*mm, W-36*mm-42*mm]))
story.append(PageBreak())

# ── PARTE 3 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 3"))
story += accent_div()
story.append(h1("Niveles de Autonomía"))

levels = [
    ("NIVEL 1 — READ ONLY", C_GREEN, "Sin aprobación previa",
     "Claude Code solo lee el proyecto, ejecuta análisis pasivos y genera diagnóstico. "
     "Imposible romper nada. Acceso de solo lectura al repositorio.",
     ["Leer cualquier archivo del repo", "Ejecutar comandos de análisis (git log, grep, tree)",
      "Ejecutar tests en modo dry-run", "Generar informe de diagnóstico"],
     "Analizar proyecto · Auditoría de seguridad · Revisar deuda técnica"),

    ("NIVEL 2 — PROPOSE", C_BLUE, "Sin aprobación, resultado para revisar",
     "Claude Code genera plan de acción estructurado, checklist y propuesta de mejoras. "
     "El usuario decide si ejecutar el plan.",
     ["Todo el Nivel 1", "Generar plan de acción en JSON", "Proponer lista de cambios específicos",
      "Estimar impacto, riesgo y horas"],
     "Mantenimiento mensual · Proponer mejoras · Análisis de dependencias"),

    ("NIVEL 3 — BRANCH", C_AMBER, "Requiere aprobación explícita",
     "Solo se ejecuta si el usuario ha revisado el plan del Nivel 2 y ha pulsado 'Aprobar'. "
     "Modifica código únicamente en rama separada, nunca en main.",
     ["Todo el Nivel 2", "Crear rama feature/{task-id}-{description}", "Modificar archivos en esa rama",
      "Ejecutar tests automatizados", "Preparar commit con mensaje descriptivo"],
     "Preparar parche · Actualizar dependencias en rama"),

    ("NIVEL 4 — PULL REQUEST", C_AMBER, "Requiere aprobación + confirmación",
     "Solo si el usuario ha revisado el diff y ha pulsado 'Abrir PR'. "
     "Jamás merge automático.",
     ["Todo el Nivel 3", "git push de la rama al remoto", "Abrir pull request con descripción técnica",
      "Añadir labels y revisores sugeridos"],
     "Abrir PR para parche aprobado"),

    ("NIVEL 5 — AUTO SUPERVISADO", C_RED, "Solo operaciones preautorizadas por admin",
     "Para tareas repetitivas de bajísimo riesgo configuradas explícitamente. "
     "NUNCA cambios de lógica, BD, auth o deploys.",
     ["Actualizar dependencias patch version", "Formatear código según linter",
      "Actualizar comentarios en rama separada"],
     "Operaciones rutinarias de bajo riesgo preaprobadas"),
]

for title, color, badge, desc, can_do, use_case in levels:
    story.append(KeepTogether([
        sp(4),
        h3(title),
        Paragraph(f"<b>{badge}</b>", ParagraphStyle("b", fontSize=8, textColor=color, leading=12, spaceAfter=3)),
        body(desc),
        Paragraph("<b>Puede hacer:</b>", ParagraphStyle("bl", fontSize=8, textColor=C_TEXT, leading=12, spaceAfter=2)),
    ] + [Paragraph(f"  ✓  {item}", ParagraphStyle("li", fontSize=8, textColor=C_MUTED, leading=12, leftIndent=10, spaceAfter=1)) for item in can_do] + [
        sp(3),
        Paragraph(f"<i>Casos de uso: {use_case}</i>", ParagraphStyle("uc", fontSize=7.5, textColor=C_MUTED, leading=11, spaceAfter=4)),
        HRFlowable(width="100%", thickness=0.3, color=C_BORDER, spaceAfter=4),
    ]))

story.append(PageBreak())

# ── PARTE 4 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 4"))
story += accent_div()
story.append(h1("Tipos de Tareas"))

tasks_def = [
    ("Mantenimiento mensual", "Nivel 2", C_BLUE,
     ["Revisar dependencias desactualizadas con npm audit",
      "Detectar TODOs/FIXMEs y código complejo",
      "Ejecutar suite de tests y analizar cobertura",
      "Buscar secretos hardcodeados",
      "Generar informe con estado general (Saludable/Atención/Crítico)",
      "Plan de acción priorizado por riesgo"]),

    ("Revisión de seguridad", "Nivel 1", C_GREEN,
     ["Escanear secretos con patrones regex (API keys, tokens)",
      "Ejecutar npm audit / pip-audit con salida JSON",
      "Revisar configuración de seguridad (CORS, headers, auth)",
      "Detectar rutas sin autenticación",
      "Clasificar hallazgos con severidad CVSS"]),

    ("Debug de incidencia", "Nivel 2-3", C_AMBER,
     ["Leer descripción de la incidencia desde el gestor",
      "Localizar archivos relevantes mediante búsqueda",
      "Trazar flujo de código relacionado con el error",
      "Identificar causa más probable con hipótesis ordenadas",
      "Proponer parche específico (sin aplicar hasta aprobación)",
      "Generar casos de test para validar el fix"]),

    ("Actualizar dependencias", "Nivel 3-4", C_AMBER,
     ["Detectar paquetes con major/minor/patch updates",
      "Evaluar riesgo de actualización (breaking changes)",
      "Actualizar en rama separada",
      "Ejecutar tests completos para detectar regresiones",
      "Abrir PR con changelog de cambios importantes"]),

    ("Generación de documentación", "Nivel 2", C_BLUE,
     ["Generar/actualizar README con stack detectado",
      "Documentar endpoints de API automáticamente",
      "Crear changelog desde git history",
      "Generar informe técnico para cliente"]),

    ("Onboarding de nuevo proyecto", "Nivel 1", C_GREEN,
     ["Analizar repositorio y detectar stack tecnológico",
      "Crear ficha técnica completa para el gestor",
      "Generar checklist inicial de mantenimiento",
      "Registrar dependencias críticas y sus versiones",
      "Detectar problemas de configuración iniciales"]),
]

for task_name, level, color, steps in tasks_def:
    story.append(KeepTogether([
        sp(4),
        h3(task_name),
        Paragraph(f"<b>{level}</b>", ParagraphStyle("lv", fontSize=8, textColor=color, leading=12, spaceAfter=3)),
    ] + [Paragraph(f"  {i+1}. {s}", ParagraphStyle("ts", fontSize=8.5, textColor=C_MUTED, leading=13, leftIndent=8, spaceAfter=2)) for i, s in enumerate(steps)] + [
        HRFlowable(width="100%", thickness=0.3, color=C_BORDER, spaceAfter=3),
    ]))

story.append(PageBreak())

# ── PARTE 5 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 5"))
story += accent_div()
story.append(h1("Integración con GitHub"))

story.append(callout("Recomendación definitiva: GitHub App — no OAuth App. "
    "Para un SaaS real con múltiples clientes, la GitHub App ofrece permisos por repositorio, "
    "tokens de corta duración (1h) y auditoría por cliente.", C_ACCENT))
story.append(sp(8))

story.append(h2("GitHub App vs OAuth — Comparativa"))
gh_compare = [
    ["Criterio", "GitHub App", "OAuth App"],
    ["Permisos por repositorio", "Granular por instalación", "Todo o nada por usuario"],
    ["Duración del token", "1 hora (installation token)", "Larga duración (riesgo)"],
    ["Actuar como la app", "Sí — no como usuario", "No — actúa como usuario"],
    ["Rate limits", "5.000 req/h por instalación", "5.000 req/h por usuario"],
    ["Revocación por repo", "Sí", "No"],
    ["Auditoría para clientes", "Total", "Limitada"],
]
story.append(tbl(gh_compare[0], gh_compare[1:], [50*mm, 55*mm, W-36*mm-105*mm]))
story.append(sp(8))

story.append(h2("Permisos mínimos necesarios"))
perms_code = (
    "permissions:\n"
    "  contents: write        # Clonar repo y crear ramas\n"
    "  pull_requests: write   # Abrir PRs\n"
    "  issues: read           # Leer issues para contexto\n"
    "  metadata: read         # Acceso básico al repo\n"
    "  statuses: write        # Marcar CI checks\n"
    "\n"
    "# NO necesario:\n"
    "# admin, org settings, secrets, delete branch"
)
story.append(code(perms_code))
story.append(sp(8))

story.append(h2("Flujo de autenticación segura"))
auth_flow = (
    "1. Instalar GitHub App en repo del cliente\n"
    "2. Guardar installation_id en tabla repositories\n"
    "3. Para cada tarea:\n"
    "   a. Generar JWT (válido 10 min) con GITHUB_APP_ID + PRIVATE_KEY\n"
    "   b. POST /app/installations/{id}/access_tokens\n"
    "   c. Recibir token temporal (válido 1 hora, escopado al repo)\n"
    "   d. Pasar token al worker via variable de entorno efímera\n"
    "   e. NUNCA guardar el token en base de datos"
)
story.append(code(auth_flow))
story.append(PageBreak())

# ── PARTE 6 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 6"))
story += accent_div()
story.append(h1("Workers y Ejecución"))

story.append(h2("Comparativa de plataformas"))
platforms = [
    ["Plataforma", "MVP", "Producción", "Ventajas", "Inconvenientes"],
    ["Railway", "Ideal", "Bueno", "Deploy simple, Docker nativo, $5-10/mes", "Menos control granular"],
    ["Fly.io", "Bueno", "Ideal", "Máquinas efímeras por tarea, global, $0 idle", "Curva de aprendizaje"],
    ["Render", "Fácil", "Limitado", "Configuración trivial", "Workers lentos en free"],
    ["GitHub Actions", "Limitado", "No recomendado", "Ya lo tienes", "No es worker general"],
    ["VPS propio", "Complejo", "Máximo control", "Control total, sin límites", "Gestión de infraestructura"],
]
story.append(tbl(platforms[0], platforms[1:], [28*mm, 18*mm, 22*mm, 50*mm, W-36*mm-118*mm]))
story.append(sp(6))
story.append(callout("Recomendación: Railway para MVP (despliega en 10 minutos). "
    "Fly.io para producción (máquinas efímeras por tarea = mejor aislamiento y escalado automático).", C_GREEN))
story.append(sp(8))

story.append(h2("Estructura del worker"))
worker_code = (
    "class TaskWorker:\n"
    "  async run():\n"
    "    while True:\n"
    "      task = await fetchNextTask()       # Supabase polling 10s\n"
    "      if not task: await sleep(10); continue\n"
    "      await processTask(task)\n"
    "\n"
    "  async processTask(task):\n"
    "    workspace = f'/tmp/task-{task.id}'\n"
    "    try:\n"
    "      await updateStatus(task.id, 'running')\n"
    "      await setupWorkspace(workspace, task)\n"
    "      await cloneRepo(workspace, task)           # GitHub token 1h\n"
    "      await injectGestorContext(workspace, task) # Incidencias, notas\n"
    "      result = await runClaudeCode(workspace, task)\n"
    "      await processResults(workspace, task, result)\n"
    "      await updateStatus(task.id, 'completed')\n"
    "    except Exception as e:\n"
    "      await handleError(task.id, e)\n"
    "    finally:\n"
    "      await cleanup(workspace)                   # Borrar workspace"
)
story.append(code(worker_code))
story.append(PageBreak())

# ── PARTE 7 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 7"))
story += accent_div()
story.append(h1("Base de Datos — Esquema Completo"))

db_tables = [
    ("repositories", "Repositorios GitHub vinculados a proyectos del gestor",
     "id, project_id, github_owner, github_repo, github_url, default_branch, installation_id, last_analyzed_at, status, metadata",
     "installation_id — acceso al repo del cliente"),
    ("ai_tasks", "Cola de tareas para Claude Code",
     "id, project_id, repository_id, type, level, status, input_params, context, result_summary, cost_tokens, cost_usd, timeout_ms, incident_id",
     "input_params, context pueden contener datos del cliente"),
    ("ai_task_runs", "Ejecuciones individuales (con retries)",
     "id, task_id, run_number, status, worker_id, exit_code, tokens_input, tokens_output, started_at, finished_at",
     "workspace_path solo durante ejecución, nunca persistir"),
    ("ai_task_logs", "Logs en tiempo real (append-only)",
     "id, run_id, level, message, metadata, created_at",
     "Retención: 90 días máximo"),
    ("ai_task_artifacts", "Archivos generados (informes, diffs, patches)",
     "id, task_id, type, filename, storage_path, size_bytes, is_sensitive",
     "is_sensitive=true para outputs con info de seguridad"),
    ("approvals", "Registro de aprobaciones/rechazos humanos",
     "id, task_id, decision, reviewer, notes, reviewed_at, level_approved",
     "Inmutable — auditía completa"),
    ("pull_requests", "PRs creados por Claude Code",
     "id, task_id, repository_id, github_pr_number, github_pr_url, branch_name, title, status",
     "Enlace permanente al PR en GitHub"),
    ("maintenance_runs", "Historial de mantenimientos mensuales",
     "id, maintenance_id, task_id, period, health_score, critical_issues, warnings, report_url",
     "health_score 0-100 para dashboards"),
]

for tname, desc, fields, sensitive in db_tables:
    story.append(KeepTogether([
        sp(4),
        h3(tname),
        body(desc),
        Paragraph(f"<b>Campos:</b> {fields}", ParagraphStyle("f", fontSize=7.5, textColor=C_MUTED, leading=11, fontName="Courier", spaceAfter=2)),
        Paragraph(f"<b>Sensible:</b> {sensitive}", ParagraphStyle("s", fontSize=7.5, textColor=C_AMBER, leading=11, spaceAfter=4)),
        HRFlowable(width="100%", thickness=0.3, color=C_BORDER, spaceAfter=3),
    ]))

story.append(PageBreak())

# ── PARTE 8 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 8"))
story += accent_div()
story.append(h1("UX del Gestor"))

story.append(h2("Pantalla de acciones disponibles"))
ux_actions = (
    "┌──────────────────────────────────────────────────────────┐\n"
    "│  Proyecto: empresa.com            ← Clientes / Proyecto  │\n"
    "├──────────────────────────────────────────────────────────┤\n"
    "│  Asistente técnico                                       │\n"
    "│                                                          │\n"
    "│  [Analizar proyecto]  [Mantenimiento mensual]            │\n"
    "│   Nivel 1 · ~3m · $0.05   Nivel 2 · ~8m · $0.15        │\n"
    "│                                                          │\n"
    "│  [Revisión seguridad]  [Debug incidencia]                │\n"
    "│   Nivel 1 · ~4m · $0.08   Nivel 2 · ~5m · $0.12        │\n"
    "│                                                          │\n"
    "│  [Actualizar deps]   [Generar documentación]             │\n"
    "│   Nivel 3 · ~10m · $0.20  Nivel 2 · ~6m · $0.10        │\n"
    "└──────────────────────────────────────────────────────────┘"
)
story.append(code(ux_actions))
story.append(sp(6))

story.append(h2("Vista durante ejecución"))
ux_running = (
    "┌──────────────────────────────────────────────────────────┐\n"
    "│  Análisis en curso — empresa.com                        │\n"
    "│  ████████████████░░░░  68%  Analizando dependencias…    │\n"
    "│  Tiempo: 2m 14s  ·  Tokens: 12.400  ·  Coste: $0.04    │\n"
    "│                                                          │\n"
    "│  ✓  Repositorio clonado (312 archivos)                  │\n"
    "│  ✓  Stack detectado: Next.js 14, PostgreSQL, Vercel     │\n"
    "│  ✓  package.json analizado — 47 dependencias            │\n"
    "│  ⚠  3 vulnerabilidades encontradas (1 alta, 2 medias)   │\n"
    "│  🔍 Buscando secretos expuestos…                        │\n"
    "└──────────────────────────────────────────────────────────┘"
)
story.append(code(ux_running))
story.append(sp(6))

story.append(h2("Vista de resultado con aprobación"))
ux_result = (
    "┌──────────────────────────────────────────────────────────┐\n"
    "│  Análisis completado  ·  Estado: Requiere atención       │\n"
    "│                                                          │\n"
    "│  Resumen ejecutivo:                                      │\n"
    "│  • 1 vulnerabilidad crítica (lodash CVE-2021-xxx)        │\n"
    "│  • 8 dependencias con major updates                      │\n"
    "│  • Cobertura de tests: 34% (recomendado: >70%)          │\n"
    "│  • 3 secretos potenciales detectados                     │\n"
    "│                                                          │\n"
    "│  Plan de acción (6 acciones):                           │\n"
    "│  CRÍTICO  Actualizar lodash a 4.17.21                   │\n"
    "│  ALTO     Actualizar next.js 13 → 14                    │\n"
    "│  MEDIO    Añadir tests para módulo de pagos             │\n"
    "│                                                          │\n"
    "│  [Ver informe completo]  [Aprobar y preparar rama]       │\n"
    "│  ⚠ Nivel 3 requiere aprobación antes de modificar       │\n"
    "└──────────────────────────────────────────────────────────┘"
)
story.append(code(ux_result))
story.append(PageBreak())

# ── PARTE 9 ───────────────────────────────────────────────────────────────────
story.append(phase("PARTE 9"))
story += accent_div()
story.append(h1("Seguridad"))

story.append(callout("Claude Code NUNCA debe tener acceso a: producción, bases de datos reales, "
    "claves maestras, credenciales críticas, secretos de clientes sin autorización explícita. "
    "Esto no es negociable.", C_RED))
story.append(sp(8))

threats = [
    ("Claude Code filtra secretos del cliente", C_RED,
     "Nunca inyectar credenciales reales en workspace. Solo código fuente. "
     "Escaneo previo del repo antes de ejecutar. Outputs revisados antes de guardar."),
    ("Se ejecutan comandos destructivos", C_RED,
     "Lista negra de comandos bloqueados: rm -rf, DROP TABLE, DELETE. "
     "Contenedor sin acceso a internet salvo Anthropic/GitHub/npm. Timeout de 10 minutos."),
    ("El coste de tokens se dispara", C_AMBER,
     "Límite de tokens por tarea (defecto: 50k). Límite mensual por organización. "
     "Circuit breaker si se detecta loop. Dashboard de costes en el gestor."),
    ("Claude Code rompe el proyecto del cliente", C_AMBER,
     "Nivel 1-2: SOLO LECTURA, imposible romper nada. "
     "Nivel 3: rama separada nunca toca main. Tests obligatorios. Diff revisado por humano."),
    ("Token GitHub comprometido", C_AMBER,
     "GitHub App tokens duran 1 hora. Nunca se guardan en BD. "
     "Se pasan como env var efímera al contenedor. Rotation automática."),
    ("Worker accede a datos de múltiples clientes", C_AMBER,
     "Un contenedor por tarea, destruido al terminar. "
     "El worker solo recibe datos necesarios para esa tarea. Sin caché entre clientes."),
]

for threat, color, mitigation in threats:
    story.append(KeepTogether([
        sp(4),
        Paragraph(f"<b>Amenaza:</b> {threat}", ParagraphStyle("th", fontSize=8.5, textColor=color, leading=13, fontName="Helvetica-Bold", spaceAfter=2)),
        Paragraph(f"<b>Mitigación:</b> {mitigation}", ParagraphStyle("mi", fontSize=8.5, textColor=C_MUTED, leading=13, spaceAfter=4)),
        HRFlowable(width="100%", thickness=0.3, color=C_BORDER, spaceAfter=3),
    ]))

story.append(PageBreak())

# ── PARTE 10 ──────────────────────────────────────────────────────────────────
story.append(phase("PARTE 10"))
story += accent_div()
story.append(h1("Roadmap de Implementación"))

phases_roadmap = [
    ("FASE 0 — Diseño y Fundación", "2 semanas", C_MUTED,
     ["Diseño del modelo de datos completo",
      "Crear tablas: repositories, ai_tasks, ai_task_runs, ai_task_logs, ai_task_artifacts",
      "Configurar GitHub App (permisos mínimos)",
      "Flujo de conexión de repositorio desde el gestor",
      "UI: pantalla de repositorios vinculados al proyecto"],
     "Sin código de agente todavía. Solo infraestructura."),

    ("FASE 1 — MVP Análisis Seguro", "3 semanas", C_GREEN,
     ["Worker básico en Railway (Node.js + Docker)",
      "Cola de tareas con Supabase polling",
      "Clonar repo con GitHub App token de 1 hora",
      "Ejecutar Claude Code en modo read-only (Nivel 1)",
      "Generar informe de análisis básico",
      "UI: botón Analizar, logs en tiempo real, resultado",
      "Control de costes y timeouts"],
     "Entregable: desde el gestor, analizar cualquier repo conectado en ~5 minutos."),

    ("FASE 2 — Propuestas con Contexto", "2 semanas", C_BLUE,
     ["Inyección de contexto del gestor (incidencias, notas técnicas)",
      "Tarea: mantenimiento mensual (Nivel 2)",
      "Tarea: revisión de seguridad (Nivel 1)",
      "Plan de acción estructurado en JSON con UI",
      "Estimación de coste visible antes de lanzar"],
     "Entregable: mantenimiento mensual completo con plan de acción priorizado."),

    ("FASE 3 — Cambios en Rama", "3 semanas", C_AMBER,
     ["UI de aprobación previa para Nivel 3",
      "Creación de ramas desde el worker",
      "Aplicación de parches propuestos",
      "Ejecución de tests automáticos",
      "Vista de diff en el gestor (similar a GitHub)",
      "Tarea: debug de incidencia → parche"],
     "Entregable: desde una incidencia, diagnosticar y preparar parche en rama."),

    ("FASE 4 — Pull Requests", "2 semanas", C_AMBER,
     ["Tabla pull_requests en BD",
      "Apertura de PR vía GitHub API con descripción técnica",
      "Vista de PRs creados vinculados al gestor",
      "Registro de aprobación/rechazo en historial"],
     "Entregable: el gestor abre PRs con descripción técnica generada por Claude Code."),

    ("FASE 5 — Automatización Supervisada", "4 semanas", C_RED,
     ["Motor de políticas configurables por proyecto",
      "Tareas periódicas automáticas (cron)",
      "Nivel 5: operaciones preautorizadas de bajo riesgo",
      "Dashboard de salud de proyectos",
      "Reportes automáticos mensuales"],
     "Entregable: mantenimientos semiautónomos con aprobación en pasos críticos."),
]

for phase_name, duration, color, tasks, deliverable in phases_roadmap:
    story.append(KeepTogether([
        sp(4),
        h3(phase_name),
        Paragraph(f"<b>Duración estimada: {duration}</b>", ParagraphStyle("d", fontSize=8, textColor=color, leading=12, spaceAfter=4)),
    ] + [Paragraph(f"  □  {t}", ParagraphStyle("pt", fontSize=8.5, textColor=C_MUTED, leading=13, leftIndent=8, spaceAfter=2)) for t in tasks] + [
        sp(3),
        callout(f"Entregable: {deliverable}", color),
        sp(4),
    ]))

story.append(PageBreak())

# ── PARTE 11 ──────────────────────────────────────────────────────────────────
story.append(phase("PARTE 11"))
story += accent_div()
story.append(h1("Preguntas Clave"))

qa = [
    ("¿Es viable técnicamente usar Claude Code como motor principal?",
     "Sí. Tiene todas las capacidades necesarias: leer código, ejecutar comandos, modificar archivos, "
     "tomar decisiones en bucle. La complejidad está en la infraestructura alrededor, no en Claude Code."),
    ("¿Qué limitaciones tiene?",
     "Sin contexto de negocio implícito. Coste escala con tamaño del proyecto. No determinista. "
     "Sin memoria entre runs. No entiende código legacy sin documentación."),
    ("¿Claude Code o Claude API — cuándo usar cada uno?",
     "Claude Code para todo lo que toca código real y herramientas. "
     "Claude API para clasificación de incidencias, resúmenes de texto, chat asistente en el gestor."),
    ("¿Qué arquitectura es más segura?",
     "Contenedores efímeros por tarea + GitHub App con tokens de 1h + revisión humana obligatoria "
     "para niveles 3+ + sin acceso a producción nunca."),
    ("¿Qué construir primero?",
     "Conectar repositorios + análisis de solo lectura (Nivel 1). Sin riesgo, valor inmediato, "
     "base para todo lo demás. No empezar por los niveles de modificación."),
    ("¿Qué NO automatizar al principio?",
     "Todo lo que toca producción. Merges de PRs. Despliegues. Cambios de esquema de BD. "
     "Modificación de secretos. Cualquier operación irreversible."),
    ("¿Cómo evitar riesgos legales o de seguridad?",
     "Obtener consentimiento explícito del cliente antes de procesar su código. "
     "Revisar políticas de datos de Anthropic API. Para clientes enterprise: evaluar modo on-premise. "
     "No usar outputs para entrenar modelos sin autorización."),
    ("¿Cómo convertir esto en ventaja comercial real?",
     "Diferenciador masivo: 'el único gestor que hace el mantenimiento técnico por ti'. "
     "Precio premium justificado. Reduce 60-80% del tiempo operativo de mantenimiento. "
     "Upselling natural: más proyectos conectados = más valor generado."),
]

for question, answer in qa:
    story.append(KeepTogether([
        sp(5),
        Paragraph(f"<b>— {question}</b>", ParagraphStyle("q", fontSize=9, textColor=C_TEXT, leading=14, fontName="Helvetica-Bold", spaceAfter=3)),
        Paragraph(answer, ParagraphStyle("a", fontSize=8.5, textColor=C_MUTED, leading=13, leftIndent=10, spaceAfter=4)),
        HRFlowable(width="100%", thickness=0.3, color=C_BORDER, spaceAfter=3),
    ]))

story.append(PageBreak())

# ── PARTE 12 ──────────────────────────────────────────────────────────────────
story.append(phase("PARTE 12"))
story += accent_div()
story.append(h1("Estimación de Costes"))

costs = [
    ["Tipo de tarea", "Tokens aprox.", "Coste estimado"],
    ["Análisis de proyecto estándar", "10k-20k tokens", "~$0.05 - $0.08"],
    ["Mantenimiento mensual completo", "20k-80k tokens", "~$0.15 - $0.30"],
    ["Debug de incidencia complejo", "40k-150k tokens", "~$0.30 - $0.60"],
    ["Revisión de seguridad", "15k-40k tokens", "~$0.08 - $0.18"],
    ["Actualizar dependencias + tests", "30k-100k tokens", "~$0.15 - $0.45"],
    ["Generar documentación", "20k-60k tokens", "~$0.10 - $0.25"],
]
story.append(tbl(costs[0], costs[1:], [70*mm, 50*mm, W-36*mm-120*mm]))
story.append(sp(10))

story.append(h2("Estimación mensual por agencia con 20 proyectos"))
monthly = [
    ["Concepto", "Cantidad", "Coste unitario", "Total/mes"],
    ["Análisis mensuales", "20", "$0.08", "$1.60"],
    ["Mantenimientos mensuales", "20", "$0.30", "$6.00"],
    ["Debug sesiones", "10", "$0.60", "$6.00"],
    ["Revisiones de seguridad", "5", "$0.15", "$0.75"],
    ["Documentación", "4", "$0.20", "$0.80"],
    ["TOTAL IA / MES", "", "", "~$15.15"],
]
story.append(tbl(monthly[0], monthly[1:], [70*mm, 25*mm, 35*mm, W-36*mm-130*mm]))
story.append(sp(8))
story.append(callout(
    "Con un precio SaaS de $49-99/mes por organización, el coste de IA (~$15/mes) "
    "representa solo el 15-30% del ingreso. Margen operativo excelente. "
    "El coste de infraestructura del worker (Railway ~$10/mes) "
    "eleva el total a ~$25/mes por organización.", C_GREEN))

story.append(sp(30))
story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER))
story.append(sp(8))
story.append(Paragraph(
    "GestorOps × Claude Code — Propuesta Técnica v1.0  ·  Mayo 2026  ·  Confidencial",
    ParagraphStyle("footer_doc", fontSize=8, textColor=C_MUTED, alignment=TA_CENTER, leading=12)
))

# ── BUILD ─────────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=draw_bg, onLaterPages=draw_bg)
print(f"PDF generado: {OUTPUT}")
