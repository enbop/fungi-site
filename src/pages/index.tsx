import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

const pillars = [
  {
    title: "Private Device Mesh",
    body: "Connect your own machines through an encrypted peer-to-peer network without depending on a hosted control plane.",
  },
  {
    title: "Capability-First Services",
    body: "Run container and WASI workloads under explicit runtime, path, and port policy instead of broad daemon privileges.",
  },
  {
    title: "Remote Control From Local CLI",
    body: "Target a remote peer, manage its services, inspect its catalog, and open its published web app locally with a small command set.",
  },
];

const workflow = [
  {
    label: "Service",
    command:
      "fungi peer admin service start --peer <peer-id> filebrowser-lite-wasi",
    body: "Start the remote service.",
  },
  {
    label: "Catalog",
    command: "fungi catalog list --peer <peer-id>",
    body: "See what that peer publishes.",
  },
  {
    label: "Access",
    command: "fungi access open --peer <peer-id> filebrowser-lite-wasi",
    body: "Open the web app locally.",
  },
];

const heroSteps = [
  {
    label: "Daemon",
    command: "fungi daemon",
    body: "Start the local daemon.",
  },
  {
    label: "Connect",
    command: "fungi ping <peer-id>",
    body: "Verify the peer is reachable.",
  },
  {
    label: "Access",
    command: "fungi access open --peer <peer-id> filebrowser-lite-wasi",
    body: "Access the remote service locally.",
  },
];

const docs = [
  {
    title: "Quick Start",
    href: "/docs/cli-service-quick-start",
    body: "Initialize Fungi, trust peers, and start a local service with the shortest path.",
  },
  {
    title: "Remote Service Control",
    href: "/docs/remote-service-control",
    body: "Learn the `service`, `catalog`, and `access` flow for controlling remote nodes and opening remote web apps locally.",
  },
  {
    title: "Services And Runtimes",
    href: "/docs/service-manifests",
    body: "Understand manifests, exposure rules, Docker-compatible runtimes, and WASI services.",
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <div className={styles.badges}>
              <span className={styles.badge}>Private P2P</span>
              <span className={styles.badge}>Capability-First</span>
              <span className={styles.badge}>Container + WASI</span>
            </div>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroTagline}>{siteConfig.tagline}</p>
            <p className={styles.heroDescription}>
              Build your own encrypted device mesh, run services under explicit
              runtime policy, and control remote nodes from a local CLI or GUI.
            </p>
            <div className={styles.buttons}>
              <Link
                className={styles.primaryButton}
                to="/docs/cli-service-quick-start"
              >
                Get Started
              </Link>
              <Link
                className={styles.secondaryButton}
                to="https://github.com/enbop/fungi/releases/latest"
              >
                Download Fungi CLI
              </Link>
              <Link
                className={styles.secondaryButton}
                to="https://github.com/enbop/fungi-app/releases/latest"
              >
                Download Fungi App (GUI)
              </Link>
            </div>
          </div>
          <div className={styles.heroPanel}>
            <p className={styles.panelLabel}>Basic Flow</p>
            {heroSteps.map((item) => (
              <div key={item.label} className={styles.panelBlock}>
                <span className={styles.panelGroup}>{item.label}</span>
                <code className={styles.panelCode}>{item.command}</code>
                <p className={styles.panelText}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Build a private P2P device network for capability-first container and WASI services."
    >
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Why Fungi</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Focused on private infrastructure, not generic sync features
              </Heading>
            </div>
            <div className={styles.cardGrid}>
              {pillars.map((item) => (
                <article key={item.title} className={styles.infoCard}>
                  <Heading as="h3" className={styles.cardTitle}>
                    {item.title}
                  </Heading>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Three Command Groups</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Remote workflow: Service, Catalog, Access
              </Heading>
            </div>
            <div className={styles.workflowGrid}>
              {workflow.map((item) => (
                <article key={item.label} className={styles.workflowCard}>
                  <span className={styles.workflowLabel}>{item.label}</span>
                  <code className={styles.workflowCode}>{item.command}</code>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Start Here</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Documentation paths by task
              </Heading>
            </div>
            <div className={styles.cardGrid}>
              {docs.map((item) => (
                <Link
                  key={item.title}
                  className={styles.docCard}
                  to={item.href}
                >
                  <Heading as="h3" className={styles.cardTitle}>
                    {item.title}
                  </Heading>
                  <p>{item.body}</p>
                </Link>
              ))}
            </div>
            <aside className={styles.deprecatedCallout}>
              <p className={styles.deprecatedLabel}>Deprecated</p>
              <Heading as="h3" className={styles.deprecatedTitle}>
                File transfer is being phased out
              </Heading>
              <p>
                The old FTP and WebDAV-based file workflow will be removed over
                the next few releases. Existing usage notes remain available,
                but new setups should use services instead.
              </p>
              <div className={styles.calloutLinks}>
                <Link
                  className={styles.inlineLink}
                  to="/docs/deprecated-file-transfer"
                >
                  View deprecated file transfer guide
                </Link>
                <Link
                  className={styles.inlineLink}
                  to="/docs/remote-service-control"
                >
                  Go to service-based remote control guide
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </Layout>
  );
}
