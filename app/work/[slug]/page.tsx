import Link from "next/link";
import { notFound } from "next/navigation";
import { SHIPPED_PROJECTS, getProjectBySlug } from "@/data/work";
import { TopUtilityBar } from "@/components/SiteChrome";
import { ProjectPreview } from "@/components/previews/ProjectPreview";
import { ShiftSimulator } from "@/components/labs/ShiftSimulator";
import { InspectTag } from "@/components/InspectTag";

export function generateStaticParams() {
  return SHIPPED_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found — selenyel.com" };
  return {
    title: `${project.title} — Selen Yel Temellioğlu`,
    description: project.tagline,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIdx = SHIPPED_PROJECTS.findIndex((p) => p.slug === project.slug);
  const nextProject =
    SHIPPED_PROJECTS[(currentIdx + 1) % SHIPPED_PROJECTS.length];

  return (
    <main id="main" style={{ paddingBottom: "5rem" }}>
      <div className="wrap">
        <TopUtilityBar />

        <div style={{ marginTop: "2.25rem", marginBottom: "1.5rem" }}>
          <Link href="/#work" className="pill-btn" style={{ padding: "0.35rem 0.85rem" }}>
            ← Back to shipped work
          </Link>
        </div>

        {/* Executive Header */}
        <header
          data-inspect-box="case-header"
          style={{
            paddingBottom: "1.8rem",
            borderBottom: "var(--guide-w) var(--guide-style) var(--guide)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
            <span className="tag" data-d={project.discipline}>
              {project.discipline}
            </span>
            <span className="spec">
              {project.number} / 0{SHIPPED_PROJECTS.length}
            </span>
            <InspectTag token="full-width showcase" detail="visual-first layout" />
          </div>

          <h1 style={{ fontSize: "var(--step-3)", marginBottom: "0.9rem", maxWidth: "24ch" }}>
            {project.title}
          </h1>
          <p className="lede" style={{ maxWidth: "68ch" }}>
            {project.tagline}
          </p>

          {/* 4-column metadata strip */}
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginTop: "1.8rem",
              paddingTop: "1.2rem",
              borderTop: "var(--guide-w) var(--guide-style) var(--guide)",
            }}
          >
            {[
              ["Role", project.role],
              ["Organization", project.organization],
              ["Timeline", project.period],
              ["Scale", project.scale],
            ].map(([label, val]) => (
              <div key={label}>
                <dt className="spec" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                  {label}
                </dt>
                <dd style={{ margin: "0.25rem 0 0", fontWeight: 500, fontSize: "0.92rem" }}>
                  {val}
                </dd>
              </div>
            ))}
          </dl>

          {project.hipaaNotice && (
            <div
              role="note"
              style={{
                marginTop: "1.25rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-s)",
                background: "var(--paper-2)",
                border: "var(--guide-w) solid var(--guide)",
                fontSize: "0.82rem",
                color: "var(--graphite)",
              }}
            >
              <strong style={{ color: "var(--ink)" }}>Privacy &amp; Synthetic Data Notice:</strong>{" "}
              {project.hipaaNotice}
            </div>
          )}
        </header>

        {/* FULL-WIDTH VISUAL & INTERACTIVE SHOWCASE ON TOP */}
        <section aria-label="Interactive project showcase" style={{ marginBottom: "2.8rem" }}>
          <div
            style={{
              border: "var(--guide-w) solid var(--guide)",
              borderRadius: "var(--radius)",
              padding: "clamp(1.2rem, 3vw, 2rem)",
              background: "var(--paper-2)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <span className="spec">LIVE INTERACTIVE SPECIMEN</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {project.platforms.map((pl) => (
                  <span key={pl} className="tag" data-d="concept">
                    {pl}
                  </span>
                ))}
              </div>
            </div>

            <ProjectPreview kind={project.previewKind} interactive />

            {project.slug === "onewell-mobile" && (
              <div style={{ marginTop: "2rem", paddingTop: "1.75rem", borderTop: "var(--guide-w) var(--guide-style) var(--guide)" }}>
                <ShiftSimulator />
              </div>
            )}
          </div>

          {/* Summary metric strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.85rem",
              marginTop: "1rem",
            }}
          >
            {project.summaryMetrics.map((m) => (
              <div
                key={m.label}
                style={{
                  border: "var(--guide-w) solid var(--guide)",
                  borderRadius: "var(--radius-s)",
                  padding: "0.95rem 1.1rem",
                  background: "var(--paper-elevated)",
                }}
              >
                <div className="spec" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 500, marginTop: "0.2rem" }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NARRATIVE DEEP-DIVE BELOW */}
        <article
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "2.25rem",
            maxWidth: "74ch",
          }}
        >
          <section>
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "0.75rem" }}>01 · The Brief</h2>
            <p style={{ margin: 0, color: "var(--graphite)", lineHeight: 1.7 }}>
              {project.brief}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "0.75rem" }}>
              02 · Research &amp; Telemetry
            </h2>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--graphite)", lineHeight: 1.7 }}>
              {project.researchAndTelemetry.map((item) => (
                <li key={item} style={{ marginBottom: "0.55rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "0.75rem" }}>
              03 · System &amp; Craft
            </h2>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--graphite)", lineHeight: 1.7 }}>
              {project.systemAndCraft.map((item) => (
                <li key={item} style={{ marginBottom: "0.55rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "0.75rem" }}>04 · Outcomes</h2>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--ink)", lineHeight: 1.7 }}>
              {project.outcomes.map((item) => (
                <li key={item} style={{ marginBottom: "0.55rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </article>

        {/* Next Project Navigation */}
        <nav
          aria-label="Next case study"
          style={{
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "var(--guide-w) var(--guide-style) var(--guide)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Link href="/#work" className="pill-btn">
            ← All shipped work
          </Link>
          <Link href={`/work/${nextProject.slug}`} className="pill-btn">
            Next project: {nextProject.shortTitle} →
          </Link>
        </nav>
      </div>
    </main>
  );
}
