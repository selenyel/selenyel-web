import Link from "next/link";
import { SHIPPED_PROJECTS } from "@/data/work";
import { CONCEPT_STUDIES } from "@/data/concepts";
import { CRAFT_GROUPS, TIMELINE_ROLES } from "@/data/timeline";
import {
  CopyEmailButton,
  HeroAppearanceBar,
  HeroPortrait,
  TopUtilityBar,
} from "@/components/SiteChrome";
import { InspectTag } from "@/components/InspectTag";
import { ProjectPreview } from "@/components/previews/ProjectPreview";
import {
  FieldPosMiniPreview,
  GameHeroMiniPreview,
} from "@/components/previews/ConceptPreviews";
import { TasteComparisonsLab } from "@/components/labs/TasteComparisonsLab";
import { ShiftSimulator } from "@/components/labs/ShiftSimulator";
import { ComponentStateSandbox } from "@/components/labs/ComponentStateSandbox";
import { ScientificUxLab } from "@/components/labs/ScientificUxLab";

export default function HomePage() {
  return (
    <main id="main">
      {/* ===================== HERO ===================== */}
      <header
        id="top"
        style={{
          position: "relative",
          paddingBottom: "var(--gap-section)",
          overflow: "hidden",
        }}
      >
        <img
          src="/images/bg-canvas.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-4%",
            left: "-8%",
            width: "min(1080px, 90%)",
            opacity: 0.42,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <TopUtilityBar />

          <div
            className="hero-grid"
            data-inspect-box="hero"
            style={{ marginTop: "clamp(3rem, 7vw, 6.2rem)" }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "clamp(1.2rem, 3vw, 2.1rem)" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--step-1)",
                    fontWeight: 500,
                    color: "var(--graphite)",
                    margin: 0,
                  }}
                >
                  Selen Yel Temellioğlu
                </p>
                <InspectTag token="--step-4" detail="max-width: 17ch" />
              </div>

              <h1
                style={{
                  fontSize: "var(--step-4)",
                  fontWeight: 500,
                  maxWidth: "17ch",
                  marginBottom: "clamp(1.4rem, 3vw, 2.2rem)",
                }}
              >
                I design software for people whose hands are already full.
              </h1>

              <p
                style={{
                  maxWidth: "56ch",
                  color: "var(--graphite)",
                  fontSize: "var(--step-1)",
                  lineHeight: 1.56,
                  margin: 0,
                }}
              >
                I&apos;m a Lead Designer and frontend engineer at OneWell Health Care, shaping
                multi-state US healthcare platforms across 12 states alongside clinical AI
                (iOS, Android &amp; web) and AI-driven banking products. From brand, typography,
                and custom iconography to APCA design tokens, React/TypeScript libraries, and
                AI-agent engineering guidelines, I own both the research and the code that ships it.
              </p>
            </div>

            <HeroPortrait />
          </div>

          <HeroAppearanceBar />
        </div>
      </header>

      {/* ===================== SHIPPED WORK (VISUAL BENTO GRID) ===================== */}
      <section id="work" className="page-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Shipped work</h2>
              <p className="spec" style={{ margin: "0.4rem 0 0" }}>
                Production platforms &amp; systems · open any card for full case study
              </p>
            </div>
            <InspectTag token=".bento-grid" detail="2-col · gap: 1.65rem" />
          </div>

          <div className="bento-grid" data-inspect-box="work-grid">
            {SHIPPED_PROJECTS.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="bento-card"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span className="tag" data-d={project.discipline}>
                    {project.discipline}
                  </span>
                  <span className="spec" style={{ fontSize: "0.72rem" }}>
                    {project.number} · {project.scale}
                  </span>
                </div>

                <ProjectPreview kind={project.previewKind} />

                <div>
                  <h3 style={{ fontSize: "var(--step-1)", marginBottom: "0.4rem" }}>
                    {project.title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--graphite)", fontSize: "var(--step--1)", lineHeight: 1.55 }}>
                    {project.tagline}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "0.65rem",
                    borderTop: "var(--guide-w) var(--guide-style) var(--guide)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  <span>{project.role}</span>
                  <span className="spec" style={{ color: "var(--ink)" }}>
                    Read case study →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CRAFT & AI-AGENT TASTE LAB ===================== */}
      <section id="taste" className="page-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Encoding taste into systems &amp; coding agents</h2>
              <p className="spec" style={{ margin: "0.4rem 0 0" }}>
                Interactive default-vs-crafted comparisons
              </p>
            </div>
            <InspectTag token="motion/react" detail="scale(0.95) · ease-out 180ms" />
          </div>

          <p className="lede" style={{ marginBottom: "2rem" }}>
            Good UI craft is never accidental. Every decision—initial scale, deceleration curves,
            luminance pinning, focus rings—can be articulated into concrete design-system rules and
            AI-agent guidelines so teams ship consistent polish at speed.
          </p>

          <TasteComparisonsLab />
        </div>
      </section>

      {/* ===================== SHIFT FLOW & COMPONENT STATES ===================== */}
      <section id="flow" className="page-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Logging a task in the fewest taps I can manage</h2>
              <p className="spec" style={{ margin: "0.4rem 0 0" }}>
                Cross-device density · Watch, Phone &amp; Web
              </p>
            </div>
            <InspectTag token="target <= 2 taps" detail="watchOS 2s glance" />
          </div>

          <p className="lede" style={{ marginBottom: "2.25rem" }}>
            A Direct Support Professional is mid-shift. Every tap is a second of attention taken away
            from the person in front of them. Try the flow, then switch devices to see how density
            adapts across sizes.
          </p>

          <ShiftSimulator />

          <div style={{ marginTop: "clamp(3.5rem, 6vw, 5.5rem)" }}>
            <div className="section-head">
              <div>
                <h3>States are the design</h3>
                <p className="spec" style={{ margin: "0.35rem 0 0" }}>
                  Form row · every accessible edge state
                </p>
              </div>
            </div>
            <ComponentStateSandbox />
          </div>
        </div>
      </section>

      {/* ===================== SCIENTIFIC UX (ALL 4 MODULES) ===================== */}
      <section id="scientific-ux" className="page-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>How I measure &amp; engineer UX</h2>
              <p className="spec" style={{ margin: "0.4rem 0 0" }}>
                Adaptive tokens · Lighthouse audits · Real vs. Digital Twins · UX KPI scoring
              </p>
            </div>
            <InspectTag token="lib/apca.ts + lib/kpi.ts" showLiveApca />
          </div>

          <p className="lede" style={{ marginBottom: "2rem" }}>
            Design decisions hold up when backed by measurement. Explore the four mechanisms I use
            to benchmark legacy systems, compare synthetic personas against real interviews, model UX
            health, and adapt interfaces live to user needs.
          </p>

          <ScientificUxLab />
        </div>
      </section>

      {/* ===================== INTERFACE LAB (SEPARATED CONCEPT STUDIES) ===================== */}
      <section id="lab" className="page-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Interface lab — Concept studies</h2>
              <p className="spec" style={{ margin: "0.4rem 0 0" }}>
                Explicitly separated from shipped client work · standalone subdomains in Phase 2
              </p>
            </div>
          </div>

          <div className="bento-grid">
            {CONCEPT_STUDIES.map((concept) => (
              <article
                key={concept.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "clamp(1.2rem, 2.4vw, 1.65rem)",
                  borderRadius: "var(--radius)",
                  border: "var(--guide-w) var(--guide-style) var(--guide)",
                  background: "var(--paper-2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className="tag" data-d="concept">
                    {concept.badge}
                  </span>
                  <span className="spec" style={{ fontSize: "0.72rem" }}>
                    {concept.plannedUrl} · {concept.phase}
                  </span>
                </div>

                {concept.previewKind === "field-pos" ? (
                  <FieldPosMiniPreview />
                ) : (
                  <GameHeroMiniPreview />
                )}

                <div>
                  <h3 style={{ fontSize: "var(--step-1)", marginBottom: "0.4rem" }}>
                    {concept.title}
                  </h3>
                  <p style={{ margin: "0 0 0.65rem", color: "var(--graphite)", fontSize: "var(--step--1)" }}>
                    {concept.summary}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--graphite)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                    {concept.constraints.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHAT I WORK WITH ===================== */}
      <section id="craft" className="page-section">
        <div className="wrap">
          <div className="section-head">
            <h2>What I work with</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "clamp(1.75rem, 4vw, 3.2rem)",
            }}
          >
            {CRAFT_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 style={{ fontSize: "var(--step-1)", marginBottom: "0.9rem", display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: group.accent,
                      border: "1px solid var(--guide)",
                      flex: "none",
                    }}
                  />
                  {group.title}
                </h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "0.42rem" }}>
                  {group.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "var(--step--1)",
                        color: "var(--graphite)",
                        border: "var(--guide-w) solid var(--guide)",
                        borderRadius: "999px",
                        padding: "0.26rem 0.72rem",
                        background: "var(--paper-elevated)",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== EXPERIENCE & EDUCATION ===================== */}
      <section id="experience" className="page-section">
        <div className="wrap">
          <div className="section-head">
            <h2>Experience</h2>
          </div>

          <div>
            {TIMELINE_ROLES.map((role) => (
              <div key={`${role.org}-${role.period}`} className="role-row">
                <span className="spec">{role.period}</span>
                <div>
                  <h3 style={{ fontSize: "var(--step-1)", marginBottom: "0.2rem" }}>
                    {role.title}
                  </h3>
                  <p style={{ color: "var(--ink)", fontSize: "var(--step-0)", fontWeight: 500, margin: "0 0 0.55rem" }}>
                    {role.org}
                  </p>
                  <p style={{ margin: 0, color: "var(--graphite)", maxWidth: "62ch", fontSize: "var(--step--1)", lineHeight: 1.65 }}>
                    {role.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }}>
            <div className="section-head">
              <h2>Education, Credentials &amp; Contact</h2>
            </div>

            <p className="lede" style={{ marginBottom: "1rem" }}>
              B.S. in Computer Engineering, TOBB University of Economics and Technology (2022),
              including the TÜBİTAK-funded ADMP research project under Prof. Dr. Mehmet Akşit.
            </p>
            <p style={{ color: "var(--graphite)", maxWidth: "68ch", fontSize: "var(--step--1)", margin: "0 0 1.6rem" }}>
              <strong style={{ color: "var(--ink)" }}>Selected Credentials:</strong> Google Cloud
              Certified: Generative AI Leader (2026); 2026 IxDF Masterclasses in Gen AI in UX,
              Accessible &amp; Inclusive Design Patterns, Designing for Neurodiversity, and
              Accessible Typography; IBM SkillsBuild UX Design Fundamentals (2025); Micro Focus /
              OpenText Testing &amp; Performance Engineering (2022).
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", alignItems: "center" }}>
              <CopyEmailButton />
              <a className="pill-btn" href="mailto:hello@selenyel.com">
                Email hello@selenyel.com
              </a>
              <a className="pill-btn" href="https://www.linkedin.com/in/selenyeltemellioglu/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="pill-btn" href="https://github.com/selenyel" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="pill-btn" href="https://www.credly.com/users/selen-yel-temellioglu" target="_blank" rel="noreferrer">
                Credly
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="wrap"
        style={{
          borderTop: "var(--guide-w) var(--guide-style) var(--guide)",
          paddingBlock: "2rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          color: "var(--graphite-2)",
          fontSize: "var(--step--1)",
        }}
      >
        <span>© 2026 Selen Yel Temellioğlu · selenyel.com</span>
        <span className="spec">Built with Next.js App Router, React 19 &amp; Cloudflare Workers</span>
      </footer>
    </main>
  );
}
