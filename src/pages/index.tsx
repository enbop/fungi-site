import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
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
    label: "Trust",
    command: "fungi security allowed-peers add <alias>",
    body: "Allow only your own device.",
  },
  {
    label: "Open",
    command: "fungi access open --peer <peer-id> filebrowser-lite-wasi",
    body: "Open a remote app locally.",
  },
];

const docs = [
  {
    title: "Install Fungi",
    href: "/docs/install",
    body: "One-line install for macOS and Linux, plus GitHub Releases, Windows, source build, and Linux systemd notes.",
  },
  {
    title: "3 Minutes: Build Your Private P2P Network",
    href: "/docs/quick-start/private-p2p-network",
    body: "Connect two of your own devices, trust them safely, and verify the link with ping.",
  },
  {
    title: "2 Minutes: Run A Remote Sandbox App",
    href: "/docs/quick-start/remote-sandbox-app",
    body: "Start a sandboxed app on one device and open it locally from another device.",
  },
  {
    title: "Reference Docs",
    href: "/docs/intro",
    body: "Dive into manifests, remote control, diagnostics, gRPC, relay setup, and runtime details.",
  },
];

const bottomActions = [
  {
    label: "Full install guide",
    href: "/docs/install",
    kind: "primary",
  },
  {
    label: "Join Discord",
    href: "https://discord.gg/A2vUXXB726",
    kind: "secondary",
    iconSrc: "/img/discord.png",
  },
];

const installCommand = "curl -fsSL https://fungi.rs/install.sh | sh";

function fallbackCopyToClipboard(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [copied, setCopied] = useState(false);
  const copyResetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const copyInstallCommand = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(installCommand);
      } else {
        fallbackCopyToClipboard(installCommand);
      }

      setCopied(true);
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
      copyResetTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copyResetTimeoutRef.current = null;
      }, 1500);
    } catch {
      setCopied(false);
    }
  }, []);

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
            <div className={styles.installCallout}>
              <p className={styles.installLabel}>macOS / Linux quick install</p>
              <div className={styles.installBar}>
                <code className={styles.installCode}>
                  {installCommand}
                </code>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={copyInstallCommand}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <div className={styles.buttons}>
              <Link className={styles.primaryButton} to="/docs/install">
                Full install guide
              </Link>
              <Link
                className={styles.secondaryButton}
                to="/docs/quick-start/private-p2p-network"
              >
                Quick Start
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
                Install first, then move through quick starts and references
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

        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.bottomCta}>
              <p className={styles.eyebrow}>Get Started</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Install Fungi, then join the community if you get stuck
              </Heading>
              <p className={styles.bottomCtaText}>
                Start with the install guide, or jump into Discord for release
                updates, questions, and feedback.
              </p>
              <div className={styles.bottomCtaActions}>
                {bottomActions.map((item) => (
                  <Link
                    key={item.label}
                    className={
                      item.kind === "primary"
                        ? styles.primaryButton
                        : styles.secondaryButton
                    }
                    to={item.href}
                  >
                    {item.iconSrc ? (
                      <img
                        src={item.iconSrc}
                        alt=""
                        aria-hidden="true"
                        className={styles.buttonIcon}
                      />
                    ) : null}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
