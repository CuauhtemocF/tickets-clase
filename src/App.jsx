import { useState, useEffect, useRef } from "react";
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";

// ╔══════════════════════════════════════════════════════════╗
// ║  Cambia la contraseña del profesor aquí                  ║
const PROFESSOR_PASSWORD = "prof2024";
// ╚══════════════════════════════════════════════════════════╝

const defaultTopics = [
  { id: 1, nombre: "Inteligencia Artificial y Machine Learning" },
  { id: 2, nombre: "Blockchain y Criptomonedas" },
  { id: 3, nombre: "Computación Cuántica" },
  { id: 4, nombre: "Internet de las Cosas (IoT)" },
  { id: 5, nombre: "Ciberseguridad y Ethical Hacking" },
  { id: 6, nombre: "Realidad Virtual y Aumentada" },
  { id: 7, nombre: "Cloud Computing y Microservicios" },
  { id: 8, nombre: "Big Data y Análisis Predictivo" },
  { id: 9, nombre: "Desarrollo de Videojuegos" },
  { id: 10, nombre: "Robótica e Automatización Industrial" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateUID() {
  return "STU-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}
function generateTicketNumber() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Lee un documento de Firestore y devuelve su campo "data", o null
async function fsGet(docPath) {
  try {
    const snap = await getDoc(doc(db, ...docPath.split("/")));
    return snap.exists() ? snap.data().data : null;
  } catch { return null; }
}

// Escribe en Firestore bajo el campo "data"
async function fsSet(docPath, value) {
  try {
    await setDoc(doc(db, ...docPath.split("/")), { data: value });
  } catch (e) { console.error("Firestore error:", e); }
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onSuccess, onClose }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSubmit() {
    if (pw === PROFESSOR_PASSWORD) {
      onSuccess();
    } else {
      setShake(true);
      setPw("");
      setAttempts(a => a + 1);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shakeAnim { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 40px rgba(139,92,246,0.15)} 50%{box-shadow:0 0 70px rgba(139,92,246,0.35)} }
      `}</style>

      <div onClick={e => e.stopPropagation()} style={{
        background: "linear-gradient(160deg,#0e0b1e,#160d2e)",
        border: "1px solid rgba(139,92,246,0.25)",
        borderRadius: 24, padding: "2.8rem 2.2rem",
        width: "100%", maxWidth: 360,
        animation: shake ? "shakeAnim 0.4s ease" : "slideUp 0.35s ease",
        boxShadow: "0 0 60px rgba(139,92,246,0.2), 0 30px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(59,130,246,0.15))",
            border: "1px solid rgba(139,92,246,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.2rem", fontSize: "1.7rem",
            animation: "glowPulse 3s ease-in-out infinite",
          }}>🔐</div>
          <div style={{ fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.3)", letterSpacing: "0.22em", marginBottom: "0.5rem" }}>
            ACCESO RESTRINGIDO
          </div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Panel del Profesor</h2>
          {attempts > 0 && (
            <p style={{ color: "#f87171", fontSize: "0.75rem", fontFamily: "'Space Mono',monospace", margin: "0.6rem 0 0" }}>
              Contraseña incorrecta. Intento #{attempts}
            </p>
          )}
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.55rem", marginBottom: "1.3rem" }}>
          {Array.from({ length: PROFESSOR_PASSWORD.length }).map((_, i) => (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: "50%",
              background: i < pw.length ? "#8b5cf6" : "rgba(255,255,255,0.1)",
              transition: "all 0.15s",
              boxShadow: i < pw.length ? "0 0 10px rgba(139,92,246,0.9)" : "none",
              transform: i < pw.length ? "scale(1.2)" : "scale(1)",
            }} />
          ))}
        </div>

        <input
          ref={inputRef}
          type="password"
          value={pw}
          maxLength={PROFESSOR_PASSWORD.length}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
          placeholder="••••••••"
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)",
            border: shake ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(139,92,246,0.25)",
            borderRadius: 12, padding: "0.85rem 1rem",
            color: "#fff", fontFamily: "'Space Mono',monospace",
            fontSize: "1.1rem", outline: "none", textAlign: "center",
            letterSpacing: "0.35em", marginBottom: "1.1rem", transition: "border 0.2s",
          }}
        />

        <button onClick={handleSubmit} style={{
          width: "100%", padding: "0.88rem",
          background: "linear-gradient(135deg,#7c3aed,#2563eb)",
          border: "none", borderRadius: 12,
          color: "#fff", fontFamily: "'Sora',sans-serif",
          fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
          boxShadow: "0 0 28px rgba(124,58,237,0.4)",
          marginBottom: "0.8rem",
        }}>
          Entrar →
        </button>

        <button onClick={onClose} style={{
          width: "100%", padding: "0.55rem", background: "transparent",
          border: "none", color: "rgba(255,255,255,0.25)",
          fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", cursor: "pointer",
        }}>
          Cancelar (Esc)
        </button>
      </div>
    </div>
  );
}

// ─── TICKET CARD ──────────────────────────────────────────────────────────────
function TicketCard({ ticket, topic }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24,
      padding: "2.5rem 2rem", maxWidth: 460, margin: "0 auto",
      boxShadow: "0 0 60px rgba(139,92,246,0.25),0 20px 60px rgba(0,0,0,0.5)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(139,92,246,0.15)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(59,130,246,0.15)", filter: "blur(30px)" }} />
      <div style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 16, padding: "1.8rem 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ display: "inline-block", background: "linear-gradient(90deg,#8b5cf6,#3b82f6)", color: "#fff", fontSize: "0.7rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.2em", padding: "0.3rem 1rem", borderRadius: 999, marginBottom: "1rem" }}>
            TICKET ASIGNADO ✓
          </span>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "3rem", fontWeight: 700, lineHeight: 1, background: "linear-gradient(90deg,#c4b5fd,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            #{ticket.ticketNumber}
          </div>
        </div>
        <div style={{ borderTop: "1px dashed rgba(255,255,255,0.15)", margin: "1.2rem 0" }} />
        <div style={{ marginBottom: "1.2rem" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.15em", marginBottom: "0.4rem" }}>TEMA ASIGNADO</div>
          <div style={{ color: "#fff", fontSize: "1.05rem", fontFamily: "'Sora',sans-serif", fontWeight: 600, lineHeight: 1.4 }}>{topic ? topic.nombre : "—"}</div>
        </div>
        <div style={{ borderTop: "1px dashed rgba(255,255,255,0.15)", margin: "1.2rem 0" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.15em", marginBottom: "0.3rem" }}>ID ESTUDIANTE</div>
            <div style={{ color: "#c4b5fd", fontSize: "0.78rem", fontFamily: "'Space Mono',monospace", fontWeight: 700, wordBreak: "break-all" }}>{ticket.userId}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.62rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.15em", marginBottom: "0.3rem" }}>FECHA</div>
            <div style={{ color: "#93c5fd", fontSize: "0.78rem", fontFamily: "'Space Mono',monospace" }}>
              {new Date(ticket.assignedAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT VIEW ─────────────────────────────────────────────────────────────
function StudentView({ onUnlock }) {
  const [userId] = useState(() => {
    let id = localStorage.getItem("ticket_uid");
    if (!id) { id = generateUID(); localStorage.setItem("ticket_uid", id); }
    return id;
  });
  const [ticket, setTicket] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [msg, setMsg] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // 🔑 Escribir la contraseña en cualquier parte activa el modal
  const bufferRef = useRef("");
  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      bufferRef.current = (bufferRef.current + e.key).slice(-PROFESSOR_PASSWORD.length);
      if (bufferRef.current === PROFESSOR_PASSWORD) {
        bufferRef.current = "";
        setShowLogin(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Escucha en tiempo real cambios en temas y ticket del estudiante
  useEffect(() => {
    // Suscripción a temas
    const unsubTopics = onSnapshot(doc(db, "config", "topics"), snap => {
      setTopics(snap.exists() ? snap.data().data : defaultTopics);
    });

    // Suscripción al ticket del estudiante
    const unsubTicket = onSnapshot(doc(db, "assignments", userId), snap => {
      if (snap.exists()) setTicket(snap.data());
      setLoading(false);
    });

    // Si el doc de temas no existe aún, inicializar
    fsGet("config/topics").then(t => {
      if (!t) fsSet("config/topics", defaultTopics);
    });

    return () => { unsubTopics(); unsubTicket(); };
  }, [userId]);

  async function assignTicket() {
    setAssigning(true);
    setMsg("");

    // Verificar si ya tiene ticket (doble check)
    const mySnap = await getDoc(doc(db, "assignments", userId));
    if (mySnap.exists()) {
      setTicket(mySnap.data());
      setAssigning(false);
      return;
    }

    // Obtener todos los assignments para saber qué temas están ocupados
    const topicsData = await fsGet("config/topics") || defaultTopics;

    // Leer assignments actuales
    const { getDocs } = await import("firebase/firestore");
    const allAssignments = await getDocs(collection(db, "assignments"));
    const usedTopicIds = allAssignments.docs.map(d => d.data().topicId);

    const available = topicsData.filter(t => !usedTopicIds.includes(t.id));

    if (available.length === 0) {
      setMsg("⚠️ No hay temas disponibles. Contacta a tu profesor.");
      setAssigning(false);
      return;
    }

    const chosen = available[Math.floor(Math.random() * available.length)];
    const newTicket = {
      userId,
      topicId: chosen.id,
      topicName: chosen.nombre,
      ticketNumber: generateTicketNumber(),
      assignedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "assignments", userId), newTicket);
    setTicket(newTicket);
    setAssigning(false);
  }

  const topic = topics.find(t => t.id === ticket?.topicId);

  return (
    <div style={{ minHeight: "100vh", background: "#080612", color: "#fff", fontFamily: "'Sora',sans-serif", padding: "2rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {showLogin && (
        <LoginModal
          onSuccess={() => { setShowLogin(false); onUnlock(); }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Header */}
      <div style={{ maxWidth: 600, margin: "0 auto", marginBottom: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "0.65rem", fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", marginBottom: "0.3rem" }}>SISTEMA DE TICKETS</div>
        <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700, background: "linear-gradient(90deg,#c4b5fd,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Portal Estudiante
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono',monospace", fontSize: "0.85rem" }}>Conectando con Firebase...</div>
        </div>
      ) : ticket ? (
        <div>
          <TicketCard ticket={ticket} topic={topic} />
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "'Space Mono',monospace", marginTop: "1.5rem" }}>
            Este ticket es único e irrepetible · Tu ID: {userId}
          </p>
        </div>
      ) : (
        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>TU ID ÚNICO</div>
            <div style={{ color: "#c4b5fd", fontSize: "1.1rem", fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{userId}</div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", marginTop: "0.5rem" }}>Este ID es permanente en este navegador</div>
          </div>
          <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: "2rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎟️</div>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem", fontWeight: 600 }}>¿Listo para obtener tu tema?</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              Se te asignará un tema único de forma aleatoria. Esta acción no puede deshacerse.
            </p>
            <button onClick={assignTicket} disabled={assigning} style={{
              background: assigning ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg,#8b5cf6,#3b82f6)",
              color: "#fff", border: "none", padding: "0.9rem 2.5rem", borderRadius: 12,
              fontSize: "1rem", fontFamily: "'Sora',sans-serif", fontWeight: 700,
              cursor: assigning ? "not-allowed" : "pointer",
              boxShadow: assigning ? "none" : "0 0 30px rgba(139,92,246,0.4)",
              transition: "all 0.3s", width: "100%",
            }}>
              {assigning ? "Asignando..." : "✦ Asignar Mi Ticket"}
            </button>
          </div>
          {msg && <div style={{ color: "#fbbf24", fontSize: "0.85rem", fontFamily: "'Space Mono',monospace", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, padding: "0.8rem" }}>{msg}</div>}
        </div>
      )}

      {/* 🔑 Zona invisible en esquina — hover la revela sutilmente */}
      <div
        onClick={() => setShowLogin(true)}
        style={{
          position: "fixed", bottom: 16, right: 16,
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0)",
          border: "1px solid rgba(255,255,255,0)",
          cursor: "default", transition: "all 0.4s", zIndex: 50,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.cursor = "pointer"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0)"; e.currentTarget.style.cursor = "default"; }}
      />
    </div>
  );
}

// ─── PROFESSOR VIEW ───────────────────────────────────────────────────────────
function ProfessorView({ onLogout }) {
  const [topics, setTopics] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonSuccess, setJsonSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("topics");

  // Escucha en tiempo real
  useEffect(() => {
    const unsubTopics = onSnapshot(doc(db, "config", "topics"), snap => {
      setTopics(snap.exists() ? snap.data().data : defaultTopics);
    });

    const { onSnapshot: onSnap2, collection: col } = { onSnapshot, collection };
    const unsubAssign = onSnap2(col(db, "assignments"), snap => {
      setAssignments(snap.docs.map(d => d.data()));
      setLoading(false);
    });

    return () => { unsubTopics(); unsubAssign(); };
  }, []);

  async function loadJSON() {
    setJsonError(""); setJsonSuccess("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Debe ser un array JSON.");
      if (!parsed.every(t => t.id !== undefined && t.nombre)) throw new Error('Cada objeto debe tener "id" y "nombre".');
      await fsSet("config/topics", parsed);
      setJsonSuccess(`✓ ${parsed.length} temas cargados exitosamente.`);
      setJsonInput("");
    } catch (e) { setJsonError("❌ Error: " + e.message); }
  }

  async function resetAll() {
    if (!confirm("¿Eliminar TODAS las asignaciones? Esta acción no se puede deshacer.")) return;
    const { getDocs, deleteDoc } = await import("firebase/firestore");
    const snap = await getDocs(collection(db, "assignments"));
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    setAssignments([]);
  }

  async function resetTopics() {
    await fsSet("config/topics", defaultTopics);
    setJsonSuccess("✓ Temas restablecidos a los predeterminados.");
  }

  const usedTopicIds = assignments.map(a => a.topicId);
  const available = topics.filter(t => !usedTopicIds.includes(t.id));

  const btnStyle = (active) => ({
    background: active ? "rgba(139,92,246,0.2)" : "transparent",
    border: active ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
    color: active ? "#c4b5fd" : "rgba(255,255,255,0.5)",
    padding: "0.5rem 1.2rem", borderRadius: 8, cursor: "pointer",
    fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#08100f", color: "#fff", fontFamily: "'Sora',sans-serif", padding: "2rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", marginBottom: "0.3rem" }}>PANEL DE CONTROL</div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700, background: "linear-gradient(90deg,#6ee7b7,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Vista Profesor
            </h1>
          </div>
          <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Space Mono',monospace" }}>
            ← Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Temas Totales", value: topics.length, color: "#6ee7b7" },
            { label: "Asignados", value: assignments.length, color: "#93c5fd" },
            { label: "Disponibles", value: available.length, color: "#fbbf24" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Space Mono',monospace", color: s.color }}>{loading ? "—" : s.value}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "0.3rem", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <button style={btnStyle(tab === "topics")} onClick={() => setTab("topics")}>Temas</button>
          <button style={btnStyle(tab === "assignments")} onClick={() => setTab("assignments")}>Asignaciones</button>
          <button style={btnStyle(tab === "upload")} onClick={() => setTab("upload")}>Cargar JSON</button>
        </div>

        {/* TOPICS */}
        {tab === "topics" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button onClick={resetTopics} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.4rem 0.9rem", borderRadius: 7, cursor: "pointer", fontSize: "0.73rem", fontFamily: "'Space Mono',monospace" }}>
                Restablecer predeterminados
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {topics.map(t => {
                const assigned = usedTopicIds.includes(t.id);
                const assignee = assignments.find(a => a.topicId === t.id);
                return (
                  <div key={t.id} style={{ background: assigned ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.03)", border: assigned ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "0.9rem 1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", minWidth: "2rem" }}>#{t.id}</span>
                      <span style={{ fontSize: "0.9rem" }}>{t.nombre}</span>
                    </div>
                    <span style={{ fontSize: "0.65rem", fontFamily: "'Space Mono',monospace", padding: "0.25rem 0.7rem", borderRadius: 999, background: assigned ? "rgba(59,130,246,0.15)" : "rgba(110,231,183,0.1)", color: assigned ? "#93c5fd" : "#6ee7b7", whiteSpace: "nowrap" }}>
                      {assigned ? `✓ #${assignee?.ticketNumber || ""}` : "Disponible"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ASSIGNMENTS */}
        {tab === "assignments" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button onClick={resetAll} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "0.4rem 0.9rem", borderRadius: 7, cursor: "pointer", fontSize: "0.73rem", fontFamily: "'Space Mono',monospace" }}>
                Limpiar todo
              </button>
            </div>
            {assignments.length === 0 ? (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", padding: "3rem", fontFamily: "'Space Mono',monospace", fontSize: "0.85rem" }}>No hay asignaciones aún.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {assignments.map(a => {
                  const topic = topics.find(t => t.id === a.topicId);
                  return (
                    <div key={a.userId} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1rem 1.1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontFamily: "'Space Mono',monospace", color: "#c4b5fd", fontSize: "0.78rem", marginBottom: "0.3rem" }}>{a.userId}</div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{topic?.nombre || a.topicName || "—"}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Space Mono',monospace", color: "#6ee7b7", fontSize: "1rem", fontWeight: 700 }}>#{a.ticketNumber}</div>
                          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace" }}>{new Date(a.assignedAt).toLocaleDateString("es-MX")}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* UPLOAD JSON */}
        {tab === "upload" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: "1rem" }}>FORMATO ESPERADO</div>
              <pre style={{ margin: 0, color: "#6ee7b7", fontSize: "0.8rem", fontFamily: "'Space Mono',monospace", background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: 8, overflow: "auto" }}>{`[
  { "id": 1, "nombre": "Tu tema aquí" },
  { "id": 2, "nombre": "Otro tema" }
]`}</pre>
            </div>
            <textarea value={jsonInput} onChange={e => { setJsonInput(e.target.value); setJsonError(""); setJsonSuccess(""); }}
              placeholder="Pega tu JSON aquí..."
              style={{ width: "100%", minHeight: 200, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: "0.82rem", padding: "1rem", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
            {jsonError && <div style={{ color: "#f87171", fontSize: "0.8rem", fontFamily: "'Space Mono',monospace", marginTop: "0.7rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "0.7rem" }}>{jsonError}</div>}
            {jsonSuccess && <div style={{ color: "#6ee7b7", fontSize: "0.8rem", fontFamily: "'Space Mono',monospace", marginTop: "0.7rem", background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 8, padding: "0.7rem" }}>{jsonSuccess}</div>}
            <button onClick={loadJSON} style={{ marginTop: "1rem", background: "linear-gradient(135deg,#059669,#3b82f6)", border: "none", color: "#fff", padding: "0.85rem 2rem", borderRadius: 10, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", width: "100%", boxShadow: "0 0 20px rgba(5,150,105,0.3)" }}>
              ↑ Cargar Temas desde JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("student");
  return view === "student"
    ? <StudentView onUnlock={() => setView("professor")} />
    : <ProfessorView onLogout={() => setView("student")} />;
}
