from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

OUTPUT_PATH = r"G:\Gestorops\GestorOps_Estrategia_v1.0.pdf"

# ── Color palette ──────────────────────────────────────────────────────────────
C_BG        = colors.HexColor("#09090b")
C_SURFACE   = colors.HexColor("#18181b")
C_BORDER    = colors.HexColor("#27272a")
C_TEXT      = colors.HexColor("#fafafa")
C_MUTED     = colors.HexColor("#a1a1aa")
C_ACCENT    = colors.HexColor("#6366f1")
C_SUCCESS   = colors.HexColor("#22c55e")
C_WARNING   = colors.HexColor("#f59e0b")
C_ERROR     = colors.HexColor("#ef4444")
C_WHITE     = colors.white
C_DARK_BG   = colors.HexColor("#0f0f11")

W, H = A4  # 595.28 x 841.89 pts

# ── Document ───────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    leftMargin=18*mm,
    rightMargin=18*mm,
    topMargin=20*mm,
    bottomMargin=20*mm,
    title="GestorOps — Documento Estratégico v1.0",
    author="GestorOps Strategy",
)

# ── Styles ─────────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def style(name, parent="Normal", **kw):
    s = ParagraphStyle(name, parent=base[parent], **kw)
    return s

S = {
    "cover_title": style("cover_title", "Title",
        fontSize=34, leading=42, textColor=C_TEXT,
        alignment=TA_LEFT, spaceAfter=6),
    "cover_sub": style("cover_sub",
        fontSize=14, leading=20, textColor=C_ACCENT,
        alignment=TA_LEFT, spaceAfter=4),
    "cover_meta": style("cover_meta",
        fontSize=10, leading=14, textColor=C_MUTED,
        alignment=TA_LEFT),
    "phase_label": style("phase_label",
        fontSize=9, leading=12, textColor=C_ACCENT,
        alignment=TA_LEFT, spaceAfter=2,
        fontName="Helvetica-Bold", spaceBefore=18),
    "h1": style("h1", "Heading1",
        fontSize=20, leading=26, textColor=C_TEXT,
        spaceAfter=8, spaceBefore=14, fontName="Helvetica-Bold"),
    "h2": style("h2", "Heading2",
        fontSize=14, leading=20, textColor=C_TEXT,
        spaceAfter=5, spaceBefore=10, fontName="Helvetica-Bold"),
    "h3": style("h3", "Heading3",
        fontSize=11, leading=16, textColor=C_ACCENT,
        spaceAfter=4, spaceBefore=8, fontName="Helvetica-Bold"),
    "body": style("body",
        fontSize=9.5, leading=15, textColor=C_MUTED,
        spaceAfter=6, alignment=TA_LEFT),
    "body_white": style("body_white",
        fontSize=9.5, leading=15, textColor=C_TEXT,
        spaceAfter=6),
    "bullet": style("bullet",
        fontSize=9.5, leading=15, textColor=C_MUTED,
        leftIndent=14, spaceAfter=3,
        bulletText="•", bulletIndent=4, bulletFontSize=9),
    "code": style("code",
        fontSize=8, leading=13, textColor=colors.HexColor("#a5b4fc"),
        fontName="Courier", backColor=C_SURFACE,
        leftIndent=10, rightIndent=10, spaceAfter=6,
        borderPadding=(6, 8, 6, 8)),
    "table_header": style("table_header",
        fontSize=8, leading=12, textColor=C_TEXT,
        fontName="Helvetica-Bold", alignment=TA_LEFT),
    "table_cell": style("table_cell",
        fontSize=8, leading=12, textColor=C_MUTED,
        alignment=TA_LEFT),
    "tag": style("tag",
        fontSize=7.5, leading=11, textColor=C_ACCENT,
        fontName="Helvetica-Bold"),
    "caption": style("caption",
        fontSize=8, leading=12, textColor=C_MUTED,
        alignment=TA_CENTER, spaceAfter=4),
    "summary_title": style("summary_title",
        fontSize=11, leading=16, textColor=C_TEXT,
        fontName="Helvetica-Bold", spaceAfter=4, spaceBefore=8),
    "rec": style("rec",
        fontSize=10, leading=15, textColor=C_SUCCESS,
        fontName="Helvetica-Bold"),
}

# ── Page background ────────────────────────────────────────────────────────────
def draw_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # subtle top accent bar
    canvas.setFillColor(C_ACCENT)
    canvas.rect(0, H - 3, W, 3, fill=1, stroke=0)
    # footer
    canvas.setFillColor(C_BORDER)
    canvas.rect(0, 0, W, 18, fill=1, stroke=0)
    canvas.setFillColor(C_MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(18*mm, 6, "GestorOps — Documento Estratégico v1.0")
    canvas.drawRightString(W - 18*mm, 6, f"Página {doc.page}")
    canvas.restoreState()

def divider(color=C_BORDER, thickness=0.5, space_before=4, space_after=10):
    return [
        Spacer(1, space_before),
        HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=space_after),
    ]

def accent_divider():
    return divider(C_ACCENT, 1.2, 2, 10)

def section_tag(text):
    return Paragraph(text.upper(), S["phase_label"])

def h1(text): return Paragraph(text, S["h1"])
def h2(text): return Paragraph(text, S["h2"])
def h3(text): return Paragraph(text, S["h3"])
def body(text): return Paragraph(text, S["body"])
def body_white(text): return Paragraph(text, S["body_white"])
def bullet(text): return Paragraph(f"<bullet>&bull;</bullet>{text}", S["bullet"])
def code_block(text): return Paragraph(text.replace("\n", "<br/>").replace(" ", "&nbsp;"), S["code"])
def spacer(h=6): return Spacer(1, h)

def make_table(headers, rows, col_widths=None):
    data = [[Paragraph(h, S["table_header"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), S["table_cell"]) for c in row])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), C_SURFACE),
        ("BACKGROUND", (0, 1), (-1, -1), C_DARK_BG),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [C_DARK_BG, C_SURFACE]),
        ("GRID", (0, 0), (-1, -1), 0.4, C_BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t

def callout(text, color=C_ACCENT):
    data = [[Paragraph(text, ParagraphStyle("cb", fontSize=9, leading=14,
                textColor=color, spaceAfter=0))]]
    t = Table(data, colWidths=[W - 36*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), C_SURFACE),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LINEAFTER", (0, 0), (0, -1), 3, color),
        ("BOX", (0, 0), (-1, -1), 0.4, C_BORDER),
    ]))
    return t

# ── STORY ──────────────────────────────────────────────────────────────────────
story = []

# ═══════════════════════════════════════════════════════════════════════════════
# COVER
# ═══════════════════════════════════════════════════════════════════════════════
story += [
    spacer(40),
    Paragraph("GestorOps", S["cover_title"]),
    Paragraph("Documento Estratégico v1.0", S["cover_sub"]),
    spacer(4),
] + accent_divider() + [
    spacer(6),
    Paragraph("Arquitectura · Producto · Roadmap · Seguridad · UX", S["cover_meta"]),
    spacer(4),
    Paragraph("Fecha: Mayo 2026  ·  Versión: 1.0  ·  Confidencial", S["cover_meta"]),
    spacer(50),
    callout("Este documento define la estrategia completa, arquitectura técnica y plan de "
            "desarrollo de un sistema operativo interno para agencias tecnológicas y freelance. "
            "Cubre desde el análisis de producto hasta el roadmap de implementación.", C_ACCENT),
    spacer(20),
]

# TOC
toc_data = [
    ["Sección", "Contenido"],
    ["Propuestas de nombre", "15 opciones de branding modernas y tecnológicas"],
    ["Fase 1 — Análisis de Producto", "Problema, valor, usuarios, MVP, riesgos"],
    ["Fase 2 — Arquitectura", "Stack técnico, diagrama, análisis crítico"],
    ["Fase 3 — Estructura Funcional", "Módulos, objetivos, prioridades"],
    ["Fase 4 — Base de Datos", "Entidades, relaciones, datos sensibles"],
    ["Fase 5 — Seguridad", "Vault, cifrado, roles, errores a evitar"],
    ["Fase 6 — UX / Visual", "Paleta, layout, patrones, micro-detalles"],
    ["Fase 7 — Roadmap", "Bloques, fases, dependencias, orden"],
    ["Fase 8 — Visión Futura", "Evolución SaaS, límites, oportunidades"],
    ["Resumen Ejecutivo", "Decisiones clave consolidadas"],
]
story.append(h2("Índice"))
story.append(make_table(toc_data[0], toc_data[1:], [60*mm, W - 36*mm - 60*mm]))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# PROPUESTAS DE NOMBRE
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Branding")] + accent_divider()
story.append(h1("Propuestas de Nombre"))
story.append(body("15 opciones modernas, tecnológicas y escalables para SaaS B2B."))
story.append(spacer(6))

names_data = [
    ["#", "Nombre", "Concepto"],
    ["1", "Opsra", "Operations + aura. Breve, tech, memorable."],
    ["2", "Velox", "Velocidad operativa. Limpio, serio, pronunciable."],
    ["3", "Nexlink", "Nexo entre cliente y operación técnica."],
    ["4", "Clarix", "Claridad operativa. Elegante, tech, distintivo."],
    ["5", "Orbix", "Centro de operaciones orbital. Moderno."],
    ["6", "Stackly", "Stack de operaciones. Técnico, familiar."],
    ["7", "Corevex", "Core operations. Serio, escalable."],
    ["8", "Opflow", "Operations flow. Directo, limpio, intuitivo."],
    ["9", "Lumio", "Luminoso, claro, operativo. Fácil de recordar."],
    ["10", "Netron", "Red operativa técnica. Serio y tech."],
    ["11", "Zephyr", "Ligero, rápido, fluido. Premium natural."],
    ["12", "Klarix", "Claridad + operación. Variante más agresiva."],
    ["13", "Pulseo", "Pulso de la operación. Vivo, dinámico."],
    ["14", "Aevio", "Eterno + operativo. Elegante, único."],
    ["15", "Vexor", "Vector operativo. Técnico, escalable, SaaS-ready."],
]
story.append(make_table(names_data[0], names_data[1:], [12*mm, 30*mm, W - 36*mm - 42*mm]))
story.append(spacer(10))
story.append(callout("Recomendación principal: CLARIX o ORBIX — cortos, técnicos, con buena "
                     "disponibilidad potencial de dominio, sin ser genéricos.", C_SUCCESS))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 1 — ANÁLISIS DE PRODUCTO
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 1")] + accent_divider()
story.append(h1("Análisis de Producto"))

story.append(h2("El problema real"))
story.append(body(
    "Una agencia tecnológica pequeña o freelance senior acumula clientes de forma orgánica. "
    "Con 10 clientes ya existe caos: contraseñas dispersas, mantenimientos sin registro, "
    "incidencias por WhatsApp, renovaciones de dominio olvidadas, proyectos con estados informales "
    "y documentación técnica dispersa. Con 20 clientes el caos es operativo. Con 40, es un riesgo real de negocio."
))
story.append(h3("Problema central"))
story.append(callout(
    "Ausencia de un sistema de registro operativo profesional y centralizado, "
    "pensado específicamente para agencias tech y freelance.", C_ACCENT))
story.append(spacer(8))

story.append(h2("Valor que aporta"))
for v in [
    "Control total: todo sobre cada cliente en un único lugar.",
    "Reducción de errores: renovaciones, mantenimientos y accesos trazados.",
    "Velocidad operativa: encontrar cualquier dato en 3 segundos.",
    "Historial técnico: saber qué se hizo, cuándo y por qué.",
    "Profesionalidad interna: operar como una empresa seria.",
    "Escalabilidad del equipo: onboarding de un nuevo técnico en minutos.",
]:
    story.append(bullet(v))
story.append(spacer(6))

story.append(h2("Usuario objetivo"))
users_data = [
    ["Perfil", "Descripción"],
    ["Freelance senior", "10–50 clientes, opera solo o con 1-2 colaboradores"],
    ["Microagencia tech", "3–15 personas, clientes SMB, servicios recurrentes"],
    ["Consultora técnica", "Gestión de proyectos + mantenimientos complejos"],
]
story.append(make_table(users_data[0], users_data[1:], [55*mm, W - 36*mm - 55*mm]))
story.append(spacer(8))

story.append(h2("Funcionalidades críticas — MVP"))
for f in [
    "Gestión de clientes con ficha completa",
    "Gestión de proyectos por cliente",
    "Registro de accesos técnicos cifrados",
    "Control de mantenimientos mensuales",
    "Registro de incidencias",
    "Renovaciones con alertas",
    "Dashboard operativo resumen",
]:
    story.append(bullet(f))
story.append(spacer(6))

story.append(h2("Funcionalidades que pueden esperar (v2+)"))
for f in [
    "Analítica avanzada",
    "Automatizaciones y notificaciones push",
    "Integración con herramientas externas (Slack, Linear, etc.)",
    "Portal de cliente externo",
    "Facturación o integración contable",
    "Gestión multiusuario con permisos granulares",
    "App móvil",
]:
    story.append(bullet(f))
story.append(spacer(8))

story.append(h2("Riesgos de diseño inicial"))
risks_data = [
    ["Riesgo", "Descripción", "Mitigación"],
    ["Sobre-ingeniería prematura", "Construir 20 módulos antes de validar los 5 críticos", "MVP disciplinado"],
    ["Diseño de BD rígido", "Tablas sin flexibilidad que bloquean el crecimiento", "JSONB para metadatos extensibles"],
    ["Seguridad superficial", "Guardar credenciales sin cifrado real", "AES-256 obligatorio desde día 1"],
    ["UX compleja", "Dashboard con demasiada información", "Jerarquía visual estricta"],
    ["Sin separación de contextos", "Datos de clientes mezclados", "Isolation por client_id en todas las tablas"],
    ["Dependencia única de Supabase", "Sin estrategia de backup externa", "Backups automáticos + exportación manual"],
]
story.append(make_table(risks_data[0], risks_data[1:], [45*mm, 65*mm, W - 36*mm - 110*mm]))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 2 — ARQUITECTURA
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 2")] + accent_divider()
story.append(h1("Arquitectura del Sistema"))

story.append(h2("Stack recomendado"))
stack_data = [
    ["Capa", "Tecnología", "Rol"],
    ["Frontend", "Next.js 14+ (App Router) + React + TypeScript", "SSR, RSC, routing"],
    ["Estilos", "Tailwind CSS + shadcn/ui", "Diseño, componentes"],
    ["Backend", "Next.js API Routes / Server Actions + Supabase Edge Functions", "Lógica de negocio"],
    ["Auth", "Supabase Auth (JWT + RLS)", "Autenticación y autorización"],
    ["Base datos", "PostgreSQL vía Supabase", "Persistencia principal"],
    ["Secretos", "Vault (Supabase) + AES-256 app level", "Credenciales cifradas"],
    ["Storage", "Supabase Storage", "Archivos y documentos"],
    ["Despliegue", "Vercel", "Edge deploy, CI/CD"],
    ["Monitoreo", "Vercel Analytics + Sentry", "Observabilidad"],
]
story.append(make_table(stack_data[0], stack_data[1:], [28*mm, 80*mm, W - 36*mm - 108*mm]))
story.append(spacer(10))

story.append(h2("Análisis crítico del stack"))
story.append(h3("Next.js + App Router"))
story.append(body("<b>Ventajas:</b> SSR, RSC, API nativa, ecosistema enorme, Vercel-native. "
                  "Server Actions simplifican el backend para operaciones CRUD."))
story.append(body("<b>Limitaciones:</b> App Router tiene rough edges. Curva de aprendizaje de RSC es real."))

story.append(h3("Supabase"))
story.append(body("<b>Ventajas:</b> PostgreSQL real, Auth integrado con RLS, Storage, Realtime, "
                  "Vault para secretos, excelente DX, muy rápido para MVP."))
story.append(body("<b>Limitaciones:</b> Free tier pausa proyectos inactivos. Producción requiere "
                  "plan Pro ($25/mes). Vendor lock-in moderado — mitigado usando PostgreSQL estándar."))

story.append(h3("Tailwind + shadcn/ui"))
story.append(body("<b>Ventajas:</b> shadcn/ui son componentes que se copian al proyecto — control total, "
                  "accesibilidad nativa (Radix UI), altamente customizable."))

story.append(h3("Vercel"))
story.append(body("<b>Ventajas:</b> Zero-config deployment, Edge Network, preview deployments, "
                  "integración nativa con Next.js. Viable en free tier para uso interno inicial."))
story.append(spacer(8))

story.append(h2("Diagrama de Arquitectura Conceptual"))
arch_text = (
    "CLIENTE (Browser) — Next.js App (SSR + Client)\n"
    "        ↓ HTTPS\n"
    "VERCEL EDGE — Next.js Server (API Routes + RSC + Server Actions)\n"
    "        ↓              ↓                    ↓\n"
    "Supabase DB    Supabase Storage      Supabase Vault\n"
    "(PostgreSQL    (Documentos,          (Accesos cifrados)\n"
    "+ RLS)          adjuntos)\n"
    "        ↓\n"
    "Supabase Auth (JWT + RLS)"
)
story.append(code_block(arch_text))
story.append(spacer(8))

story.append(h2("Seguridad de capa de arquitectura"))
sec_layers = [
    ["Capa", "Tecnología", "Función"],
    ["1", "HTTPS (Vercel)", "Transporte cifrado — automático"],
    ["2", "Supabase Auth", "JWT, sesiones, refresh tokens"],
    ["3", "RLS PostgreSQL", "Autorización a nivel fila en BD"],
    ["4", "Cifrado en reposo", "Supabase cifra la BD base"],
    ["5", "AES-256-GCM app", "Vault de accesos técnicos"],
    ["6", "Audit log inmutable", "Trazabilidad de acciones"],
    ["7", "Rate limiting", "Protección brute force"],
]
story.append(make_table(sec_layers[0], sec_layers[1:], [12*mm, 50*mm, W - 36*mm - 62*mm]))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 3 — ESTRUCTURA FUNCIONAL
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 3")] + accent_divider()
story.append(h1("Estructura Funcional — Módulos"))

modules = [
    {
        "name": "Dashboard",
        "priority": "CRÍTICA",
        "priority_color": C_ERROR,
        "block": "Bloque 1",
        "desc": "Vista operativa en tiempo real del estado del negocio.",
        "content": [
            "Incidencias abiertas (crítico primero)",
            "Mantenimientos pendientes del mes",
            "Renovaciones próximas (30/15/7 días)",
            "Proyectos activos por estado",
            "Últimas actividades del sistema",
        ],
        "rel": "Agrega datos de todos los módulos del Bloque 1",
    },
    {
        "name": "Clientes",
        "priority": "CRÍTICA",
        "priority_color": C_ERROR,
        "block": "Bloque 1",
        "desc": "CRM interno completo para registrar todo sobre cada cliente.",
        "content": [
            "Nombre, empresa, sector, tipo (activo/inactivo/prospect)",
            "Contactos múltiples (técnico, comercial, decisor)",
            "Notas internas y tags",
            "Fecha de alta y último contacto",
        ],
        "rel": "Todos los módulos tienen client_id como FK",
    },
    {
        "name": "Proyectos",
        "priority": "CRÍTICA",
        "priority_color": C_ERROR,
        "block": "Bloque 1",
        "desc": "Gestión del ciclo de vida de proyectos técnicos.",
        "content": [
            "Estados: proposal → active → paused → completed → cancelled",
            "Stack técnico, alcance, presupuesto",
            "Fecha inicio / fin estimado / fin real",
            "Hitos y tareas asociadas",
        ],
        "rel": "Pertenece a Cliente. Relacionado con Incidencias y Documentación",
    },
    {
        "name": "Mantenimientos",
        "priority": "CRÍTICA",
        "priority_color": C_ERROR,
        "block": "Bloque 1",
        "desc": "Control de contratos de mantenimiento recurrente por cliente.",
        "content": [
            "Contratos con periodicidad configurable",
            "Instancias mensuales: pending → in_progress → completed → invoiced",
            "Historial de acciones realizadas por mes",
            "Notas técnicas del periodo",
        ],
        "rel": "Pertenece a Cliente",
    },
    {
        "name": "Incidencias",
        "priority": "ALTA",
        "priority_color": C_WARNING,
        "block": "Bloque 1",
        "desc": "Registro y resolución de problemas técnicos.",
        "content": [
            "Estados: open → in_progress → waiting_client → resolved → closed",
            "Prioridad: critical / high / medium / low",
            "Tiempo invertido y resolución final",
            "Vinculable a proyecto o cliente directamente",
        ],
        "rel": "Pertenece a Cliente, opcional a Proyecto",
    },
    {
        "name": "Accesos Técnicos",
        "priority": "CRÍTICA",
        "priority_color": C_ERROR,
        "block": "Bloque 1",
        "desc": "Vault cifrado de credenciales y accesos por cliente. Módulo más sensible del sistema.",
        "content": [
            "Tipos: hosting, BD, plataformas, APIs, dominios, email, custom",
            "Campos cifrados con AES-256-GCM a nivel aplicación",
            "Log de accesos: quién vio qué y cuándo",
            "Oculto por defecto / mostrar bajo demanda",
        ],
        "rel": "Pertenece a Cliente. Tiene access_log propio",
    },
    {
        "name": "Renovaciones",
        "priority": "ALTA",
        "priority_color": C_WARNING,
        "block": "Bloque 1",
        "desc": "Control de vencimientos de dominios, hosting, licencias y certificados.",
        "content": [
            "Tipos: dominios, hosting, licencias, SSL, contratos",
            "Alertas: 90/30/15/7/1 días antes",
            "Estado: active / expired / cancelled",
            "Proveedor, coste, notas",
        ],
        "rel": "Pertenece a Cliente",
    },
    {
        "name": "Documentación",
        "priority": "MEDIA",
        "priority_color": C_ACCENT,
        "block": "Bloque 2",
        "desc": "Base de conocimiento técnica interna.",
        "content": [
            "Tipos: documentación de proyecto, manuales, procedimientos, notas",
            "Estructura jerárquica: colección > documento > secciones",
            "Editor de texto enriquecido (Markdown)",
        ],
        "rel": "Vinculable a Cliente o Proyecto",
    },
    {
        "name": "Infraestructura",
        "priority": "MEDIA",
        "priority_color": C_ACCENT,
        "block": "Bloque 2",
        "desc": "Registro del stack técnico de cada cliente (qué servicios tiene activos).",
        "content": [
            "Servidores, bases de datos, CDNs, plataformas SaaS",
            "Estado, proveedor, descripción",
            "Diferente de Accesos: descriptivo, no operativo",
        ],
        "rel": "Pertenece a Cliente",
    },
    {
        "name": "Historial Técnico",
        "priority": "MEDIA",
        "priority_color": C_ACCENT,
        "block": "Bloque 2",
        "desc": "Log cronológico de todo lo realizado para cada cliente.",
        "content": [
            "Generación automática por eventos del sistema",
            "Entradas manuales por el técnico",
            "Formato: [fecha] [tipo] [descripción] [módulo] [autor]",
        ],
        "rel": "Fuente: activity_log. Vinculado a Cliente",
    },
    {
        "name": "Tareas",
        "priority": "MEDIA",
        "priority_color": C_ACCENT,
        "block": "Bloque 2",
        "desc": "Gestión ligera de work items internos del equipo técnico.",
        "content": [
            "Título, descripción, estado, prioridad",
            "Asignación, fecha límite",
            "Vinculable a Cliente o Proyecto",
        ],
        "rel": "Opcional: Cliente, Proyecto",
    },
    {
        "name": "Analítica",
        "priority": "BAJA",
        "priority_color": C_MUTED,
        "block": "Bloque 3",
        "desc": "Visibilidad sobre el negocio y la operación.",
        "content": [
            "Incidencias por cliente/mes",
            "Tiempo de resolución promedio",
            "Estado de mantenimientos del mes",
            "Proyectos activos vs completados",
        ],
        "rel": "Agrega datos de todos los módulos",
    },
    {
        "name": "Usuarios y Permisos",
        "priority": "ALTA",
        "priority_color": C_WARNING,
        "block": "Bloque 0",
        "desc": "Gestión de acceso al sistema con roles y permisos.",
        "content": [
            "Roles: admin | technician | readonly",
            "Supabase Auth + RLS como base",
            "Preparado para permisos granulares en v2",
        ],
        "rel": "Transversal — afecta todos los módulos",
    },
]

for mod in modules:
    color = mod["priority_color"]
    p_label = Paragraph(f"<b>{mod['priority']}</b> &nbsp;&nbsp; {mod['block']}",
                        ParagraphStyle("ml", fontSize=8, textColor=color, leading=12))
    story.append(KeepTogether([
        spacer(4),
        h3(mod["name"]),
        p_label,
        body(mod["desc"]),
    ] + [bullet(c) for c in mod["content"]] + [
        Paragraph(f"<i>Relaciones: {mod['rel']}</i>",
                  ParagraphStyle("rel", fontSize=8, textColor=C_MUTED, leading=12, spaceAfter=6)),
        HRFlowable(width="100%", thickness=0.3, color=C_BORDER, spaceAfter=4),
    ]))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 4 — BASE DE DATOS
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 4")] + accent_divider()
story.append(h1("Diseño de Base de Datos"))

story.append(h2("Jerarquía de entidades"))
hierarchy = (
    "organizations\n"
    "  └── users              (técnicos y admins)\n"
    "  └── clients            (clientes gestionados)\n"
    "        └── projects\n"
    "        └── maintenances\n"
    "        │     └── maintenance_entries\n"
    "        └── incidents\n"
    "        └── technical_accesses\n"
    "        │     └── access_log\n"
    "        └── renewals\n"
    "        └── infrastructure_items\n"
    "        └── documents\n"
    "        └── activity_log  (append-only)\n"
    "  └── tasks\n"
    "  └── notifications"
)
story.append(code_block(hierarchy))
story.append(spacer(8))

story.append(h2("Tablas principales"))

tables_info = [
    ("clients", "id, org_id, name, company, sector, type, email, phone, website, notes, status, created_at, updated_at, created_by"),
    ("projects", "id, client_id, org_id, title, description, tech_stack (jsonb), status, priority, start_date, estimated_end_date, actual_end_date, budget, notes, tags[]"),
    ("maintenances", "id, client_id, org_id, name, description, type, price, billing_period, status, start_date"),
    ("maintenance_entries", "id, maintenance_id, period (YYYY-MM), status, work_done, hours_spent, completed_at, completed_by"),
    ("incidents", "id, client_id, project_id?, org_id, title, description, priority, status, resolution_notes, hours_spent, opened_at, closed_at, assigned_to"),
    ("technical_accesses", "id, client_id, org_id, type, name, url, username_encrypted, password_encrypted, notes_encrypted, last_verified_at, status"),
    ("renewals", "id, client_id, org_id, name, type, provider, renewal_date, cost, status, notify_days[]"),
    ("infrastructure_items", "id, client_id, org_id, category, name, provider, url, description, status, metadata (jsonb)"),
    ("documents", "id, client_id?, project_id?, org_id, title, content, type, tags, created_by"),
    ("activity_log", "id, org_id, entity_type, entity_id, action, description, metadata (jsonb), performed_by, created_at  [APPEND-ONLY]"),
    ("tasks", "id, org_id, client_id?, project_id?, title, description, status, priority, due_date, assigned_to"),
    ("users", "id (=Supabase Auth uid), org_id, full_name, email, role, avatar_url, status, last_login"),
]

tables_data = [["Tabla", "Campos principales"]]
for name, fields in tables_info:
    tables_data.append([name, fields])
story.append(make_table(tables_data[0], tables_data[1:], [45*mm, W - 36*mm - 45*mm]))
story.append(spacer(10))

story.append(h2("Datos sensibles y protección"))
sensitive_data = [
    ["Dato", "Sensibilidad", "Protección"],
    ["Contraseñas de cliente", "CRÍTICA", "AES-256-GCM, cifrado aplicación"],
    ["Tokens / API keys", "CRÍTICA", "Mismo cifrado, log de acceso obligatorio"],
    ["Datos de cliente (PII)", "ALTA", "RLS en Supabase por org"],
    ["Notas técnicas", "MEDIA", "RLS por org / rol"],
    ["Historial de actividad", "ALTA (integridad)", "Append-only — sin DELETE permitido"],
    ["Documentación", "MEDIA", "RLS por org y rol"],
]
story.append(make_table(sensitive_data[0], sensitive_data[1:], [55*mm, 35*mm, W - 36*mm - 90*mm]))
story.append(spacer(8))

story.append(h2("Preparación para crecer"))
for item in [
    "org_id presente en todas las tablas críticas desde el día 1 — multitenancy listo en el modelo.",
    "metadata (jsonb) en tablas clave para campos extensibles sin migración.",
    "activity_log como tabla de eventos central — base para auditoría y analítica futura.",
    "Índices en columnas frecuentes: client_id, status, renewal_date, created_at.",
    "tags (text[]) en proyectos y documentos para filtrado rápido.",
]:
    story.append(bullet(item))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 5 — SEGURIDAD
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 5")] + accent_divider()
story.append(h1("Seguridad y Accesos"))

story.append(callout(
    "CRÍTICO: Estás gestionando credenciales de terceros. Una brecha aquí no afecta solo "
    "a tu empresa — afecta a todos tus clientes. Esto requiere una postura de seguridad "
    "seria desde el día 1.", C_ERROR))
story.append(spacer(8))

story.append(h2("Arquitectura de seguridad en capas"))
sec_data = [
    ["Capa", "Tecnología", "Función"],
    ["1 — Transporte", "HTTPS (Vercel automático)", "Cifrado en tránsito"],
    ["2 — Autenticación", "Supabase Auth + JWT", "Identidad de usuario"],
    ["3 — Autorización", "RLS en PostgreSQL", "Control de acceso a nivel fila"],
    ["4 — Cifrado reposo", "Supabase + AES-256 app", "Protección de datos almacenados"],
    ["5 — Vault de accesos", "AES-256-GCM derivado servidor", "Credenciales de clientes"],
    ["6 — Audit log", "activity_log inmutable", "Trazabilidad completa"],
    ["7 — Rate limiting", "Supabase Auth + Vercel WAF", "Protección brute force"],
]
story.append(make_table(sec_data[0], sec_data[1:], [38*mm, 55*mm, W - 36*mm - 93*mm]))
story.append(spacer(8))

story.append(h2("Roles del sistema"))
roles_data = [
    ["Rol", "Capacidades"],
    ["admin", "Acceso total. Puede crear usuarios, ver todos los módulos, acceder al vault completo."],
    ["technician", "Acceso operativo. Puede ver/editar clientes, proyectos, incidencias. Acceso limitado al vault."],
    ["readonly", "Solo lectura. Para colaboradores externos o revisores."],
]
story.append(make_table(roles_data[0], roles_data[1:], [35*mm, W - 36*mm - 35*mm]))
story.append(spacer(8))

story.append(h2("Gestión del Vault de Accesos Técnicos"))
story.append(h3("Cómo NO hacerlo"))
for item in [
    "Guardar contraseñas en texto plano en la BD",
    "Cifrar solo en BD sin cifrado a nivel aplicación",
    "Exponer credenciales descifradas en respuestas de API",
    "Loggear credenciales en errores o consola",
    "Enviar credenciales por correo o Slack",
]:
    story.append(bullet(item))
story.append(spacer(4))

story.append(h3("Flujo correcto de cifrado"))
cipher_text = (
    "CLAVE = derivada de ENCRYPTION_SECRET (Vercel env var — nunca en código)\n"
    "DATO_CIFRADO = AES-256-GCM(dato_plano, CLAVE, IV_aleatorio)\n"
    "BD guarda: dato_cifrado + IV   (nunca la clave)\n\n"
    "Flujo de acceso:\n"
    "1. Usuario autenticado solicita ver credencial\n"
    "2. Server Action valida JWT + RLS\n"
    "3. Servidor descifra en memoria (nunca persistido descifrado)\n"
    "4. Responde solo el dato — registra en access_log: quién, qué, cuándo\n"
    "5. Campos en UI: ocultos por defecto, copiar sin mostrar visualmente"
)
story.append(code_block(cipher_text))
story.append(spacer(8))

story.append(h2("Errores críticos a evitar"))
errors_data = [
    ["Error", "Consecuencia", "Solución"],
    ["RLS desactivado en alguna tabla", "Filtración cross-tenant", "RLS en TODAS las tablas con org_id"],
    ["Secret en código fuente", "Compromiso completo del sistema", "Solo env vars en Vercel — nunca en repo"],
    ["Sin log de acceso a credenciales", "Sin trazabilidad forense", "access_log obligatorio desde v1"],
    ["Backup sin cifrar", "Exposición de datos sensibles", "Supabase cifra backups automáticamente"],
    ["Sin expiración de sesión", "Sesiones infinitas reutilizables", "JWT con TTL razonable (7 días)"],
    ["Errores verbosos en producción", "Leak de información técnica", "Sentry solo en server, mensajes genéricos al cliente"],
]
story.append(make_table(errors_data[0], errors_data[1:], [52*mm, 52*mm, W - 36*mm - 104*mm]))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 6 — UX / VISUAL
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 6")] + accent_divider()
story.append(h1("Experiencia Visual y UX"))

story.append(h2("Filosofía de interfaz"))
story.append(body(
    "Referentes: Linear para densidad informativa y velocidad. Vercel para limpieza visual. "
    "Notion para flexibilidad. Stripe Dashboard para jerarquía de datos operativos."
))
story.append(callout(
    "Principio rector: Un operador técnico debe poder encontrar cualquier dato "
    "en menos de 3 clics y menos de 5 segundos.", C_ACCENT))
story.append(spacer(8))

story.append(h2("Sistema de color"))
color_data = [
    ["Token", "Hex", "Uso"],
    ["Background", "#09090b", "Fondo principal (zinc-950)"],
    ["Surface", "#18181b", "Cards y paneles (zinc-900)"],
    ["Border", "#27272a", "Separadores (zinc-800)"],
    ["Text primary", "#fafafa", "Texto principal (zinc-50)"],
    ["Text muted", "#a1a1aa", "Texto secundario (zinc-400)"],
    ["Accent", "#6366f1", "Acción principal (indigo-500)"],
    ["Success", "#22c55e", "Confirmaciones (green-500)"],
    ["Warning", "#f59e0b", "Alertas (amber-500)"],
    ["Error", "#ef4444", "Errores (red-500)"],
]
story.append(make_table(color_data[0], color_data[1:], [35*mm, 30*mm, W - 36*mm - 65*mm]))
story.append(spacer(4))
story.append(body("Modo oscuro por defecto. El 90% de usuarios técnicos trabajan en dark mode. "
                  "No ofrecer modo claro en v1 — añade complejidad sin valor inicial."))
story.append(spacer(8))

story.append(h2("Estructura de Layout"))
layout_text = (
    "SIDEBAR (240px fijo)     |  MAIN CONTENT\n"
    "                         |\n"
    "[Logo / Org name]        |  [Breadcrumb + Page title]\n"
    "                         |  [Action bar]\n"
    "Navigation:              |\n"
    "  Dashboard              |  [Content area]\n"
    "  Clientes               |\n"
    "  Proyectos              |\n"
    "  Mantenimientos         |\n"
    "  Incidencias            |\n"
    "  Accesos                |\n"
    "  Renovaciones           |\n"
    "  ─────────────          |\n"
    "  Docs / Infra / Tareas  |\n"
    "  ─────────────          |\n"
    "  Analítica              |\n"
    "  Configuración          |\n"
    "                         |\n"
    "[User avatar + name]     |"
)
story.append(code_block(layout_text))
story.append(spacer(8))

story.append(h2("Patrones de UX clave"))
ux_patterns = [
    ("Command Palette (Cmd/Ctrl+K)", "Búsqueda global: clientes, proyectos, accesos, documentos. Navegación sin sidebar."),
    ("Listas con alta densidad", "Tablas con filas compactas (44px). Acciones en hover. Ordenación por columna."),
    ("Formularios en modal/slideoveer", "No páginas nuevas — el contexto no se rompe. Validación inline."),
    ("Skeleton screens", "Para listas y cards durante carga. Sin spinners centrales."),
    ("Toast notifications", "Top-right, 3s para éxito, persistente para errores. Deshacer donde sea viable."),
    ("Badges de alerta en sidebar", "Renovaciones vencidas, incidencias críticas, mantenimientos pendientes."),
    ("Confirmaciones destructivas", "Input de texto para operaciones críticas — no solo botón de confirmación."),
    ("Empty states con CTA", "No pantallas vacías — siempre orientar la siguiente acción."),
]
ux_data = [["Patrón", "Descripción"]]
for p, d in ux_patterns:
    ux_data.append([p, d])
story.append(make_table(ux_data[0], ux_data[1:], [55*mm, W - 36*mm - 55*mm]))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 7 — ROADMAP
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 7")] + accent_divider()
story.append(h1("Roadmap de Desarrollo"))

story.append(callout(
    "Principio: Cada bloque produce un sistema usable y valioso al terminar, "
    "no depende del siguiente bloque para aportar valor.", C_ACCENT))
story.append(spacer(10))

blocks = [
    {
        "name": "Bloque 0 — Fundación",
        "time": "3–5 días",
        "color": C_MUTED,
        "items": [
            "Setup del repositorio, Next.js + Tailwind + TypeScript + shadcn/ui",
            "Configuración Supabase (proyecto, auth, DB)",
            "Sistema de autenticación completo (login, sesión, logout, rutas protegidas)",
            "Layout base (sidebar, navegación, estructura de páginas)",
            "Design tokens y componentes base (Button, Input, Card, Badge, Modal, Table)",
            "CI/CD básico con Vercel",
        ],
        "result": "Shell profesional de la aplicación. Login funciona. Navegación funciona. Sin datos reales.",
    },
    {
        "name": "Bloque 1 — Núcleo Operativo",
        "time": "2–3 semanas",
        "color": C_ERROR,
        "items": [
            "1. Clientes — CRUD completo con ficha detallada",
            "2. Proyectos — CRUD + estados + relación con cliente",
            "3. Mantenimientos — Contratos + entradas mensuales",
            "4. Incidencias — CRUD + estados + prioridad",
            "5. Renovaciones — CRUD + fechas + alertas visuales",
            "6. Accesos Técnicos — Vault cifrado + audit log",
            "7. Dashboard — Vista agregada de los módulos anteriores",
        ],
        "result": "Sistema completamente usable en el día a día. Reemplaza Notion/Excel/1Password.",
    },
    {
        "name": "Bloque 2 — Profundidad Operativa",
        "time": "2 semanas",
        "color": C_WARNING,
        "items": [
            "Documentación — Editor markdown + organización jerárquica",
            "Infraestructura — Registro de servicios por cliente",
            "Historial técnico — Log automático + manual de eventos",
            "Tareas — Gestión ligera de work items",
            "Command Palette — Búsqueda global Cmd+K",
            "Notificaciones internas — Alertas de renovaciones y pendientes",
        ],
        "result": "Sistema completo y profundo. Toda la información operativa centralizada.",
    },
    {
        "name": "Bloque 3 — Calidad y Polish",
        "time": "1 semana",
        "color": C_SUCCESS,
        "items": [
            "Analítica básica (métricas clave del negocio)",
            "Exportación de datos (CSV para backups manuales)",
            "Gestión de usuarios (si hay equipo)",
            "Onboarding / empty states pulidos",
            "Performance audit y optimización",
            "Accesibilidad básica",
        ],
        "result": "Producto terminado y pulido, listo para uso profesional diario estable.",
    },
]

for block in blocks:
    story.append(KeepTogether([
        spacer(4),
        h2(block["name"]),
        Paragraph(f"Duración estimada: <b>{block['time']}</b>",
                  ParagraphStyle("bt", fontSize=9, textColor=block["color"], leading=14, spaceAfter=4)),
    ] + [bullet(i) for i in block["items"]] + [
        callout(f"Resultado: {block['result']}", block["color"]),
        spacer(6),
    ]))

story.append(spacer(8))
story.append(h2("Dependencias técnicas críticas"))
deps_text = (
    "Auth ─────────────────────────────────────► Todo lo demás\n"
    "Clientes ─────────────────────────────────► Proyectos, Mantenimientos, Incidencias\n"
    "Proyectos ────────────────────────────────► Incidencias, Documentación\n"
    "Cifrado (Accesos) ────────────────────────► Vault de accesos técnicos\n"
    "Activity Log ─────────────────────────────► Historial, Analítica futura"
)
story.append(code_block(deps_text))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# FASE 8 — VISIÓN FUTURA
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Fase 8")] + accent_divider()
story.append(h1("Visión Futura"))

story.append(h2("Trayectoria natural del producto"))

evolutions = [
    ("Fase actual — Herramienta interna",
     "Aplicación que el equipo pequeño usa internamente para operar mejor. "
     "No necesita ser perfecta — necesita ser útil."),
    ("Evolución 1 — Agencia con equipo (5–10 personas)",
     "Roles y permisos granulares, asignaciones por técnico, métricas de productividad, "
     "comunicación interna básica. No requiere rediseño — modelado desde el inicio con org_id y assigned_to."),
    ("Evolución 2 — Plataforma multiagencia (SaaS)",
     "El mercado hispanohablante tiene decenas de miles de agencias con este problema. "
     "Requiere: onboarding automático, planes + facturación (Stripe), aislamiento entre orgs (ya preparado). "
     "Precio potencial: $29–$49/mes early adopter, $59–99/mes en versión madura."),
    ("Evolución 3 — Centro operativo inteligente",
     "Integración con Linear/GitHub, webhooks de Vercel para actualizar estados automáticamente, "
     "alertas por email/Slack/WhatsApp, OCR de facturas para registrar renovaciones, API pública."),
    ("Evolución 4 — Portal de cliente",
     "Vista externa de solo lectura para que el cliente vea el estado de sus proyectos e incidencias. "
     "Comunicación cliente-agencia directamente en el sistema. Requiere subdominio separado y rol client_user."),
]

for title, desc in evolutions:
    story.append(h3(title))
    story.append(body(desc))
    story.append(spacer(4))

story.append(spacer(8))
story.append(h2("Límites reales del stack"))
limits_data = [
    ["Escenario", "Límite", "Solución"],
    [">100 usuarios simultáneos", "Supabase Pro escala bien", "Pro plan o Supabase Dedicated"],
    [">500k rows en tablas activas", "Rendimiento requiere índices cuidados", "Normalizar + índices + particionado"],
    ["Requisito GDPR estricto", "Supabase EU region disponible", "Seleccionar región EU al crear proyecto"],
    ["Tiempo real crítico", "Supabase Realtime funciona hasta cierto punto", "Arquitectura de eventos dedicada"],
    ["Compliance financiero", "Fuera del scope", "No añadir facturación sin auditoría de seguridad"],
]
story.append(make_table(limits_data[0], limits_data[1:], [48*mm, 50*mm, W - 36*mm - 98*mm]))
story.append(spacer(8))

story.append(h2("Oportunidad de negocio"))
opp_data = [
    ["Dimensión", "Análisis"],
    ["Mercado objetivo", "Agencias tech + freelance senior hispanohablantes — decenas de miles"],
    ["Problema", "Concreto, doloroso y costoso en tiempo y errores humanos"],
    ["Competencia", "Herramientas genéricas (Notion, Asana, HubSpot) no resuelven el caso específico"],
    ["Poder adquisitivo", "$49–$99/mes razonable para una agencia con 20+ clientes"],
    ["Barrera de entrada", "Baja para el producto, alta para el nicho — requiere conocimiento del sector"],
]
story.append(make_table(opp_data[0], opp_data[1:], [45*mm, W - 36*mm - 45*mm]))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# RESUMEN EJECUTIVO
# ═══════════════════════════════════════════════════════════════════════════════
story += [section_tag("Resumen Ejecutivo")] + accent_divider()
story.append(h1("Resumen Ejecutivo"))

summary_data = [
    ["Dimensión", "Decisión"],
    ["Stack", "Next.js + Supabase + Vercel + Tailwind + shadcn/ui"],
    ["Arquitectura", "Monolito modular con API Routes / Server Actions"],
    ["Auth", "Supabase Auth + RLS (Row Level Security)"],
    ["Seguridad crítica", "AES-256-GCM a nivel aplicación para el vault de accesos"],
    ["Diseño", "Dark mode, minimalista denso, inspirado en Linear"],
    ["MVP", "Bloque 0 + Bloque 1 = sistema usable y completo"],
    ["Tiempo a MVP usable", "3–4 semanas de desarrollo continuo"],
    ["Escalabilidad", "Multitenancy preparado desde el diseño inicial (org_id)"],
    ["Nombre recomendado", "CLARIX o ORBIX"],
]
story.append(make_table(summary_data[0], summary_data[1:], [55*mm, W - 36*mm - 55*mm]))
story.append(spacer(16))

story.append(h2("Próximos pasos antes de escribir código"))
story.append(body("Validar las siguientes decisiones antes de iniciar el desarrollo:"))
for step in [
    "Modelo de datos: confirmar que las entidades y relaciones cubren la operativa real.",
    "Módulos del Bloque 1: verificar que son los 7 correctos para el MVP.",
    "Diseño visual: confirmar dirección dark mode / Linear-inspired.",
    "Nombre: seleccionar uno y verificar disponibilidad de dominio.",
    "Stack: confirmar que Next.js + Supabase + Vercel es el camino correcto.",
]:
    story.append(bullet(step))

story.append(spacer(16))
story.append(callout(
    "Con estas decisiones tomadas, el Bloque 0 puede comenzar con claridad total "
    "y el sistema estará operativo en menos de un mes.", C_SUCCESS))

story.append(spacer(30))
story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER))
story.append(spacer(8))
story.append(Paragraph(
    "GestorOps — Documento Estratégico v1.0  |  Mayo 2026  |  Confidencial",
    ParagraphStyle("footer_doc", fontSize=8, textColor=C_MUTED, alignment=TA_CENTER, leading=12)
))

# ── BUILD ──────────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=draw_background, onLaterPages=draw_background)
print(f"PDF generado: {OUTPUT_PATH}")
