import { type ReactNode, useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

const pillars = [
  {
    title: "Devices",
    body: "Connect your devices over encrypted links, directly when possible or through a relay when needed. Only devices you approve can initiate access.",
  },
  {
    title: "Sandboxed Apps",
    body: "Run portable WebAssembly apps in the built-in Wasmtime sandbox, or use an optional constrained Docker backend.",
  },
  {
    title: "Easy Access",
    body: "Access services across your device network without exposing them to the public internet.",
  },
];

const demos = [
  {
    title: "Connect a device",
    image: "/img/fungi-ping-dark.gif",
    alt: "Fungi ping connects to a saved device",
    href: "/docs/quick-start/connect-devices",
  },
  {
    title: "Open an app from another device",
    image: "/img/fungi-filebrowser-dark.gif",
    alt: "Fungi opens a file browser service from another device on localhost",
    href: "/docs/quick-start/use-service",
  },
];

const workflow = [
  {
    label: "Save",
    command: "fungi device add my-mac <device-id>",
    body: "Give another device a local name.",
  },
  {
    label: "Trust",
    command: "fungi device trust my-mac",
    body: "Allow the saved device to make Fungi service requests.",
  },
  {
    label: "Open",
    command: "fungi files@my-mac",
    body: "Open a service from the current device.",
  },
];

const docs = [
  {
    title: "Install Fungi",
    href: "/docs/install",
    body: "Install the CLI, start the daemon, and update safely.",
  },
  {
    title: "Connect Two Devices",
    href: "/docs/quick-start/connect-devices",
    body: "Save another device, trust it, and verify the encrypted link.",
  },
  {
    title: "Use A Service",
    href: "/docs/quick-start/use-service",
    body: "Run an app on one device and open it locally from another.",
  },
  {
    title: "Upgrade To 0.7",
    href: "/docs/upgrade-0.7",
    body: "Move from legacy peer and tunnel workflows to devices and services.",
  },
];

const bottomActions = [
  {
    label: "Read the docs",
    href: "/docs/intro",
    kind: "primary",
  },
  {
    label: "Join Discord",
    href: "https://discord.gg/A2vUXXB726",
    kind: "secondary",
    iconSrc: "/img/discord.png",
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [copied, setCopied] = useState(false);

  async function copyInstallCommand() {
    try {
      await navigator.clipboard.writeText(
        "curl -fsSL https://fungi.rs/install.sh | sh",
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <div className={styles.badges}>
              <span className={styles.badge}>Encrypted links</span>
              <span className={styles.badge}>Sandboxed apps</span>
              <span className={styles.badge}>Private access</span>
            </div>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroTagline}>{siteConfig.tagline}</p>
            <p className={styles.heroDescription}>
              Fungi connects your trusted devices and runs apps as sandboxed
              services. Access those services locally from another device
              without opening public ports.
            </p>
            <div className={styles.installCallout}>
              <p className={styles.installLabel}>macOS / Linux quick install</p>
              <div className={styles.installBar}>
                <code className={styles.installCode}>
                  curl -fsSL https://fungi.rs/install.sh | sh
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
                Install
              </Link>
              <Link
                className={styles.secondaryButton}
                to="/docs/quick-start/connect-devices"
              >
                Quick Start
              </Link>
              <Link
                className={styles.secondaryButton}
                to="https://github.com/enbop/fungi"
              >
                GitHub
              </Link>
            </div>
          </div>
          <div className={styles.heroDemos}>
            {demos.map((item) => (
              <Link
                key={item.title}
                className={styles.heroDemoLink}
                to={item.href}
              >
                <figure className={styles.heroDemo}>
                  <img src={item.image} alt={item.alt} />
                  <figcaption>{item.title}</figcaption>
                </figure>
              </Link>
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
      title={siteConfig.title}
      description="Fungi turns your devices into a personal app platform. Run apps on any device, and access them securely from anywhere."
    >
      <HomepageHeader />
      <main>
        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Personal App Platform</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Built around devices, sandboxed apps, and private access
              </Heading>
            </div>
            <div className={styles.pillarGrid}>
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

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Workflow</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Save a device, trust it, open a service
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

        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Start Here</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Install first, then connect devices and use a service
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
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.bottomCta}>
              <p className={styles.eyebrow}>Next</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Build your personal app platform one step at a time
              </Heading>
              <p className={styles.bottomCtaText}>
                Start with two devices and one service. Fungi keeps the network,
                trust, and local access behind a small set of commands.
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
