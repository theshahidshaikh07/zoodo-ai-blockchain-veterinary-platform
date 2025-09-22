import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import heroVet from "@/assets/hero-vet.jpg";
import aiPetcare from "@/assets/Shahid-Passport.png";
import communityPets from "@/assets/Aayushee .jpg";
import diversePets from "@/assets/khushi.jpg";

export const metadata: Metadata = {
  title: "About Zoodo — Enterprise AI & Blockchain Veterinary Platform",
  description:
    "Discover Zoodo's mission, values, and the team building an enterprise-grade AI and blockchain powered veterinary ecosystem.",
};

const stats = [
  { label: "AI-assisted triage models", value: "4" },
  { label: "Microservices", value: "5+" },
  { label: "Smart-contract modules", value: "3" },
  { label: "Planned regions", value: "10+" },
];

const values = [
  {
    title: "Patient-first care",
    desc: "Every decision optimizes outcomes for pets and the people who love them.",
  },
  {
    title: "Trust by design",
    desc: "Blockchain-backed records, privacy-first data policies, verifiable integrity.",
  },
  {
    title: "Operational excellence",
    desc: "Enterprise architecture, observability, CI/CD, and rigorous security baselines.",
  },
  {
    title: "Inclusive ecosystem",
    desc: "Owners, vets, trainers, NGOs, and clinics connected with shared context.",
  },
];

const timeline = [
  { year: "2024 Q4", title: "Concept & Research", body: "Defined problem space, stakeholder interviews, rapid prototypes." },
  { year: "2025 Q1", title: "Architecture & Contracts", body: "Microservices blueprint, first Solidity contracts, secure auth." },
  { year: "2025 Q2", title: "AI & Telehealth", body: "Symptom triage assistant, appointment flows, community hub alpha." },
  { year: "2025 Q3", title: "Enterprise Hardening", body: "Observability, rate limits, RBAC refinements, perf and DX upgrades." },
];

const team = [
  {
    name: "Shahid Shaikh",
    role: "Founder & Lead Engineer",
    img: aiPetcare,
    bio: "Owns product direction and architecture. Leads backend, platform, and integrations.",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    name: "Aayushee Dhanokar",
    role: "AI & Frontend Engineer",
    img: communityPets,
    bio: "Designs AI experiences and builds delightful, performant user interfaces.",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    name: "Khushi Mishra",
    role: "Blockchain & DevOps Engineer",
    img: diversePets,
    bio: "Implements smart contracts and reliable cloud-native delivery pipelines.",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="relative container mx-auto px-4 lg:px-8">
        <div className="absolute inset-0 -z-10 opacity-30 blur-3xl" aria-hidden>
          <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.5),transparent_60%)] absolute -top-10 -left-10 animate-float" />
          <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--zoodo-blue)/0.4),transparent_60%)] absolute top-20 right-0 animate-float" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="px-3 py-1">About Zoodo</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Building the intelligent, trusted future of pet healthcare
              <span className="block gradient-hero-text">— at enterprise scale.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Zoodo unifies AI triage, blockchain-backed medical records, and role-specific workflows
              into a secure, scalable platform for owners, veterinarians, trainers, and communities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="hover:shadow-glow" asChild>
                <Link href="/role-selection">Get Started</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/ai-assistant">Try AI Assistant</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs mt-1 text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden glow-effect border border-border/40">
              <Image src={heroVet} alt="Zoodo platform" className="w-full h-auto object-cover" priority />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 shadow-elegant hidden md:block">
              <div className="text-sm">Next.js • Spring Boot • FastAPI • Solidity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 lg:px-8 mt-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="glass-card rounded-2xl p-6 hover-glow h-full">
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 lg:px-8 mt-20">
        <div className="mb-8">
          <Badge variant="secondary">Roadmap</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">From concept to enterprise readiness</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">Milestones that shaped Zoodo’s product and platform maturity.</p>
        </div>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <div key={t.title} className="relative">
                <div className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_0_6px_hsl(var(--primary)/0.15)]" />
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">{t.year}</div>
                    <Badge>{i < timeline.length - 1 ? "Done" : "In Progress"}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mt-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 lg:px-8 mt-20">
        <div className="mb-8 text-center">
          <Badge variant="secondary">Team</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Leadership</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Final year B.Tech CSE — building with enterprise rigor and real-world ambition.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className="glass-card rounded-3xl overflow-hidden hover-glow flex flex-col">
              <div className="relative h-64 w-full">
                <Image src={m.img} alt={m.name} fill className="object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold">{m.name}</h3>
                <div className="text-sm text-primary mt-0.5">{m.role}</div>
                <p className="text-sm text-muted-foreground mt-3 flex-1">{m.bio}</p>
                <div className="flex gap-3 mt-4">
                  {m.links.map((l) => (
                    <Button key={l.label} variant="ghost" size="sm" asChild>
                      <Link href={l.href}>{l.label}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Proof */}
      <section className="container mx-auto px-4 lg:px-8 mt-20">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <Badge variant="secondary">Why Zoodo</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Enterprise-grade by default</h2>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
              <li>Role-based access control with JWT and rate limiting</li>
              <li>Immutable records on-chain; privacy-focused off-chain storage</li>
              <li>Containerized microservices with CI/CD-ready deployment</li>
              <li>Observability hooks for metrics, logs, and tracing</li>
            </ul>
            <div className="flex gap-3 pt-2">
              <Button asChild>
                <Link href="/docs">Read Documentation</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Explore Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden glow-effect border border-border/40">
            <Image src={aiPetcare} alt="Enterprise architecture" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-8 mt-20">
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold">Join the Zoodo ecosystem</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Connect your practice, organization, or pet family to a secure, intelligent, and unified platform.</p>
          <div className="flex gap-3 justify-center mt-6">
            <Button size="lg" asChild>
              <Link href="/role-selection">Get Started</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}


