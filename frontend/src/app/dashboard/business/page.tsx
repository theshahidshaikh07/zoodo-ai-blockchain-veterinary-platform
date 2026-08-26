'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Home, Calendar, Store, ShieldCheck, BarChart2, Settings,
  LogOut, Upload, Check, Clock, AlertCircle, ChevronRight,
  Phone, MapPin, Globe, Star, Eye, Bell, CreditCard, Info,
  Save, X, Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────
type Section = 'overview' | 'bookings' | 'listing' | 'verification' | 'analytics' | 'settings';
type DocStatus = 'not_started' | 'uploaded' | 'under_review' | 'needs_action' | 'verified';

interface Doc {
  id: string;
  label: string;
  description: string;
  required: boolean;
  status: DocStatus;
  rejectReason?: string;
}

interface BusinessProfile {
  businessName: string;
  categories: string[];
  description: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  openHours: string;
  gst: string;
  pan: string;
  bankAccount: string;
  upi: string;
  notifBookings: boolean;
  notifReviews: boolean;
  notifVerification: boolean;
}

// ─── Verification document definitions ───────────────────
const COMMON_DOCS: Omit<Doc, 'status'>[] = [
  { id: 'phone_verified', label: 'Phone Number (OTP)', description: 'Customer-facing contact number, verified via OTP', required: true },
  { id: 'business_address', label: 'Business Address Proof', description: 'Utility bill or notarized lease agreement for your business premises', required: true },
  { id: 'logo_photos', label: 'Business Logo & Photos (3+)', description: 'High-quality photos of your premises and logo shown on your listing', required: true },
  { id: 'bank_account', label: 'Bank Account / UPI', description: 'For receiving payouts from customer bookings', required: true },
  { id: 'gst', label: 'GST Registration', description: 'Required if annual turnover exceeds ₹20 lakhs', required: false },
];

const CATEGORY_DOCS: Record<string, Omit<Doc, 'status'>[]> = {
  veterinarian: [
    { id: 'vcin', label: 'Veterinary Council Registration (VCIN)', description: 'Issued by Veterinary Council of India or respective State Veterinary Council', required: true },
    { id: 'degree', label: 'Degree Certificate (BVSc & AH / MVSc)', description: 'Veterinary degree from a recognized university under VCI', required: true },
    { id: 'clinical_est', label: 'Clinical Establishment Certificate', description: 'Issued under Clinical Establishments Act 2010 by state authority', required: true },
    { id: 'practice_license', label: 'Current Practicing License', description: 'Valid practicing license from state veterinary council', required: true },
  ],
  grooming: [
    { id: 'shop_est', label: 'Shop & Establishment License', description: 'Issued by local municipal corporation for your grooming premises', required: true },
    { id: 'biz_reg', label: 'Business Registration', description: 'Sole proprietorship declaration, partnership deed, or company CIN', required: true },
    { id: 'portfolio', label: 'Grooming Portfolio (5+ photos)', description: 'Before/after photos — helps build trust with customers', required: false },
  ],
  trainer: [
    { id: 'biz_reg', label: 'Business Registration', description: 'Sole prop or company registration document', required: true },
    { id: 'certification', label: 'Trainer Certification', description: 'KCAI, IMDT, or equivalent — optional but boosts your ranking', required: false },
    { id: 'liability_ins', label: 'Liability Insurance', description: 'Covers incidents or injuries during training sessions', required: false },
  ],
  insurance: [
    { id: 'irdai', label: 'IRDAI Agent / Broker License', description: 'Issued by Insurance Regulatory and Development Authority of India', required: true },
    { id: 'company_reg', label: 'Company Registration (CIN)', description: 'Company registration certificate from MCA/ROC', required: true },
    { id: 'product_docs', label: 'IRDAI-Approved Product Documents', description: 'Product approval documentation for all pet insurance plans offered', required: true },
  ],
  shop: [
    { id: 'shop_est', label: 'Shop & Establishment License', description: 'Issued by local municipal corporation', required: true },
    { id: 'drug_license', label: 'Drug License', description: 'Required if selling medicines, supplements, or prescription products', required: false },
    { id: 'fssai', label: 'FSSAI License', description: 'Required if selling pet food, treats, or any edible products', required: false },
    { id: 'gst_shop', label: 'GST Registration', description: 'Required for product-based businesses above ₹20L turnover', required: true },
  ],
  ngo: [
    { id: 'ngo_reg', label: 'NGO / Trust Registration Certificate', description: 'Societies Registration Act / Public Trust Act certificate', required: true },
    { id: 'pan_org', label: 'PAN Card (Organisation)', description: 'Organisation PAN card — not the individual founder\'s', required: true },
    { id: 'tax_exempt', label: '80G / 12A Certificate', description: 'Enables donors to claim income tax deductions on donations', required: false },
  ],
  transport: [
    { id: 'biz_reg', label: 'Business Registration', description: 'Company registration or sole proprietorship declaration', required: true },
    { id: 'vehicle_rc', label: 'Vehicle Registration Certificate (RC)', description: 'For all vehicles used for pet transport — if you operate own fleet', required: false },
    { id: 'travel_license', label: 'Travel Agency License', description: 'Required if facilitating airline or rail bookings on behalf of customers', required: false },
  ],
  hotel: [
    { id: 'shop_est', label: 'Shop & Establishment License', description: 'Issued by local municipal corporation for your boarding premises', required: true },
    { id: 'boarding_permit', label: 'Municipal Pet Boarding Permit', description: 'Local authority permit specifically for pet boarding operations', required: true },
    { id: 'hygiene_cert', label: 'Health & Hygiene Certificate', description: 'Sanitation clearance from the local health / municipal department', required: true },
    { id: 'capacity_decl', label: 'Capacity Declaration', description: 'Maximum number of pets your facility can board at one time', required: true },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  veterinarian: 'Veterinary & Healthcare',
  grooming: 'Grooming & Spa',
  trainer: 'Training & Behavior',
  insurance: 'Insurance & Protection',
  shop: 'Shop & Pharmacy',
  ngo: 'NGO & Rescue',
  transport: 'Transport & Travel',
  hotel: 'Hotel & Boarding',
};

// ─── Status config ────────────────────────────────────────
const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; Icon: any }> = {
  not_started: { label: 'Not uploaded', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800', Icon: Upload },
  uploaded: { label: 'Uploaded', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', Icon: Clock },
  under_review: { label: 'Under review', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', Icon: Clock },
  needs_action: { label: 'Needs action', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', Icon: AlertCircle },
  verified: { label: 'Verified', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', Icon: Check },
};

function initDocs(categories: string[]): Doc[] {
  const all: Doc[] = [
    ...COMMON_DOCS.map(d => ({ ...d, status: 'not_started' as DocStatus })),
    ...categories.flatMap(cat => (CATEGORY_DOCS[cat] || []).map(d => ({ ...d, status: 'not_started' as DocStatus }))),
  ];
  // Deduplicate by id
  return all.filter((d, i) => all.findIndex(x => x.id === d.id) === i);
}

// ─── Sidebar nav ──────────────────────────────────────────
const NAV = [
  { id: 'overview' as Section, label: 'Overview', Icon: Home },
  { id: 'bookings' as Section, label: 'Bookings', Icon: Calendar },
  { id: 'listing' as Section, label: 'My Listing', Icon: Store },
  { id: 'verification' as Section, label: 'Verification', Icon: ShieldCheck },
  { id: 'analytics' as Section, label: 'Analytics', Icon: BarChart2 },
  { id: 'settings' as Section, label: 'Settings', Icon: Settings },
];

// ════════════════════════════════════════════════════════
//  MODULE-LEVEL COMPONENTS
// ════════════════════════════════════════════════════════

function Sidebar({ active, setActive, user, biz, onLogout }: {
  active: Section; setActive: (s: Section) => void;
  user: any; biz: BusinessProfile; onLogout: () => void;
}) {
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'BZ';
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 h-full bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <Link href="/">
          <Image src="/pacifico-zoodo.png" alt="Zoodo" width={100} height={32} className="h-6 w-auto" />
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setActive(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              active === id
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-foreground'
            }`}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{biz.businessName || `${user?.firstName}'s Business`}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all">
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ active, setActive }: { active: Section; setActive: (s: Section) => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex z-50">
      {NAV.slice(0, 5).map(({ id, label, Icon }) => (
        <button key={id} onClick={() => setActive(id)}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] transition-all ${
            active === id ? 'text-primary' : 'text-muted-foreground'
          }`}>
          <Icon className="w-5 h-5" />
          <span>{label.split(' ')[0]}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Verification status banner ───────────────────────────
function VerifBanner({ docs, setActive }: { docs: Doc[]; setActive: (s: Section) => void }) {
  const verified = docs.filter(d => d.status === 'verified').length;
  const total = docs.length;
  const needsAction = docs.some(d => d.status === 'needs_action');
  const allVerified = verified === total && total > 0;

  if (allVerified) return null;

  return (
    <div className={`mx-6 mt-5 rounded-2xl p-4 flex items-center gap-3 ${
      needsAction
        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
    }`}>
      <AlertCircle className={`w-5 h-5 shrink-0 ${needsAction ? 'text-red-500' : 'text-amber-500'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${needsAction ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
          {needsAction ? 'Action required — some documents need resubmission' : `Verification in progress — ${verified} of ${total} documents approved`}
        </p>
        <p className={`text-xs mt-0.5 ${needsAction ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
          Your listing will go live once all required documents are verified.
        </p>
      </div>
      <button onClick={() => setActive('verification')}
        className={`text-xs font-medium shrink-0 px-3 py-1.5 rounded-full ${
          needsAction ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40'
        } transition-all`}>
        Fix now <ChevronRight className="inline w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Overview Section ─────────────────────────────────────
function OverviewSection({ user, biz, docs, setActive }: {
  user: any; biz: BusinessProfile; docs: Doc[]; setActive: (s: Section) => void;
}) {
  const verified = docs.filter(d => d.status === 'verified').length;
  const total = docs.length;
  const reqDocs = docs.filter(d => d.required);
  const reqVerified = reqDocs.filter(d => d.status === 'verified').length;

  const STATS = [
    { label: 'Verification', value: `${verified}/${total}`, sub: 'docs approved', color: 'text-primary' },
    { label: 'Today\'s Bookings', value: '0', sub: 'no bookings yet', color: 'text-foreground' },
    { label: 'Profile Views', value: '—', sub: 'go live to see stats', color: 'text-muted-foreground' },
    { label: 'Rating', value: '—', sub: 'no reviews yet', color: 'text-muted-foreground' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{biz.businessName || `${user?.firstName}'s Business`}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {biz.categories.map(c => (
            <span key={c} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              {CATEGORY_LABELS[c] || c}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Required docs progress */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-sm text-foreground">Required documents</p>
            <p className="text-xs text-muted-foreground">{reqVerified} of {reqDocs.length} verified</p>
          </div>
          <button onClick={() => setActive('verification')}
            className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${reqDocs.length ? Math.round((reqVerified / reqDocs.length) * 100) : 0}%` }} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Upload documents', icon: ShieldCheck, action: () => setActive('verification') },
          { label: 'Edit listing', icon: Store, action: () => setActive('listing') },
        ].map(({ label, icon: Icon, action }) => (
          <button key={label} onClick={action}
            className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all text-left">
            <Icon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────
function DocCard({ doc, onUpload, onSimulate }: {
  doc: Doc;
  onUpload: (id: string) => void;
  onSimulate: (id: string, status: DocStatus) => void;
}) {
  const cfg = STATUS_CONFIG[doc.status];
  return (
    <div className={`rounded-2xl border p-4 transition-all ${
      doc.status === 'needs_action' ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' :
      doc.status === 'verified' ? 'border-green-100 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' :
      'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{doc.label}</p>
            {doc.required
              ? <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Required</span>
              : <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-muted-foreground px-1.5 py-0.5 rounded">Optional</span>
            }
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{doc.description}</p>
          {doc.status === 'needs_action' && doc.rejectReason && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">
              ↳ {doc.rejectReason}
            </p>
          )}
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 shrink-0 ${cfg.bg} ${cfg.color}`}>
          <cfg.Icon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      {doc.status !== 'verified' && doc.status !== 'under_review' && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onUpload(doc.id)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all">
            <Upload className="w-3 h-3" />
            {doc.status === 'needs_action' ? 'Re-upload' : 'Upload file'}
          </button>
          {/* Demo only: simulate review flow */}
          <button onClick={() => onSimulate(doc.id, 'under_review')}
            className="h-8 px-3 rounded-full text-xs text-muted-foreground border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all">
            Simulate submit
          </button>
        </div>
      )}
      {doc.status === 'under_review' && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
          ⏳ Our team is reviewing this document. Usually takes 1–2 business days.
        </p>
      )}
    </div>
  );
}

// ─── Verification Section ─────────────────────────────────
function VerificationSection({ docs, setDocs, categories }: {
  docs: Doc[]; setDocs: (d: Doc[]) => void; categories: string[];
}) {
  const verified = docs.filter(d => d.status === 'verified').length;
  const total = docs.filter(d => d.required).length;
  const pct = total ? Math.round((verified / total) * 100) : 0;

  const commonDocs = docs.filter(d => COMMON_DOCS.some(c => c.id === d.id));
  
  // Track seen IDs to prevent duplicate rendering if multiple categories share a document (e.g. biz_reg)
  const seenDocIds = new Set<string>();
  const catDocs = categories.map(cat => {
    const catReqs = CATEGORY_DOCS[cat] || [];
    const matchedDocs = docs.filter(d => {
      if (catReqs.some(c => c.id === d.id) && !seenDocIds.has(d.id)) {
        seenDocIds.add(d.id);
        return true;
      }
      return false;
    });
    return {
      cat,
      label: CATEGORY_LABELS[cat] || cat,
      docs: matchedDocs,
    };
  }).filter(g => g.docs.length > 0);

  const simulate = (id: string, status: DocStatus) => {
    const updated = docs.map(d => d.id === id ? { ...d, status } : d);
    setDocs(updated);
    localStorage.setItem('zoodo_biz_docs', JSON.stringify(updated));
  };

  const upload = (id: string) => simulate(id, 'uploaded');

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Verification Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload your documents to get verified and go live on Zoodo.</p>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-sm text-foreground">Required documents</p>
            <p className="text-xs text-muted-foreground">{verified} of {total} verified</p>
          </div>
          <span className="text-xl font-bold text-primary">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = docs.filter(d => d.status === key).length;
            if (!count) return null;
            return (
              <span key={key} className={`flex items-center gap-1 ${cfg.color}`}>
                <cfg.Icon className="w-3 h-3" /> {count} {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Info note */}
      <div className="flex gap-2.5 text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>All documents are reviewed by the Zoodo trust & safety team within 1–2 business days. You'll be notified via email on approval or rejection.</p>
      </div>

      {/* Common docs */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Required for all businesses</h2>
        <div className="space-y-3">
          {commonDocs.map(doc => (
            <DocCard key={`common_${doc.id}`} doc={doc} onUpload={upload} onSimulate={simulate} />
          ))}
        </div>
      </div>

      {/* Category-specific docs */}
      {catDocs.map(group => (
        <div key={group.cat}>
          <h2 className="text-sm font-semibold text-foreground mb-3">{group.label}</h2>
          <div className="space-y-3">
            {group.docs.map(doc => (
              <DocCard key={`${group.cat}_${doc.id}`} doc={doc} onUpload={upload} onSimulate={simulate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Listing Section ──────────────────────────────────────
function ListingSection({ biz, setBiz }: { biz: BusinessProfile; setBiz: (b: BusinessProfile) => void }) {
  const [form, setForm] = useState<BusinessProfile>(biz);
  const [saved, setSaved] = useState(false);
  const upd = (field: keyof BusinessProfile, val: any) => setForm(p => ({ ...p, [field]: val }));
  const save = async () => {
    setBiz(form);
    localStorage.setItem('zoodo_biz', JSON.stringify(form));
    try {
      await apiService.updateBusinessProfile(form);
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const inputCls = 'h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm px-3.5 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50';
  const labelCls = 'text-xs font-medium text-muted-foreground mb-1 block';

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Listing</h1>
        <p className="text-sm text-muted-foreground">This is how customers find you on Zoodo.</p>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Basic Info</h3>
        <div>
          <label className={labelCls}>Business name</label>
          <input className={inputCls} placeholder="e.g. Happy Paws Clinic" value={form.businessName}
            onChange={e => upd('businessName', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm px-3.5 py-2.5 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 resize-none"
            rows={3} placeholder="What makes your business special? (Shown on your public listing)"
            value={form.description} onChange={e => upd('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} placeholder="+91 9800000000" value={form.phone}
              onChange={e => upd('phone', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Website (optional)</label>
            <input className={inputCls} placeholder="https://" value={form.website}
              onChange={e => upd('website', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Location</h3>
        <div>
          <label className={labelCls}>Street address</label>
          <input className={inputCls} placeholder="Building / Floor / Street" value={form.address}
            onChange={e => upd('address', e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} placeholder="Mumbai" value={form.city}
              onChange={e => upd('city', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input className={inputCls} placeholder="Maharashtra" value={form.state}
              onChange={e => upd('state', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input className={inputCls} placeholder="400001" value={form.pincode}
              onChange={e => upd('pincode', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Opening hours</label>
          <input className={inputCls} placeholder="Mon–Sat, 9:00 AM – 7:00 PM" value={form.openHours}
            onChange={e => upd('openHours', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button onClick={save}
          className={`h-10 px-6 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            saved ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save listing</>}
        </button>
        <button className="h-10 px-5 rounded-full text-sm text-muted-foreground border border-gray-200 dark:border-gray-700 hover:border-primary transition-all flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
      </div>
    </div>
  );
}

// ─── Business Settings ────────────────────────────────────
function BizSettingsSection({ user, biz, setBiz }: { user: any; biz: BusinessProfile; setBiz: (b: BusinessProfile) => void }) {
  const [form, setForm] = useState(biz);
  const [saved, setSaved] = useState(false);
  const upd = (field: keyof BusinessProfile, val: any) => setForm(p => ({ ...p, [field]: val }));
  const save = async () => {
    setBiz(form);
    localStorage.setItem('zoodo_biz', JSON.stringify(form));
    try {
      await apiService.updateBusinessProfile(form);
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const inputCls = 'h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm px-3.5 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50';
  const labelCls = 'text-xs font-medium text-muted-foreground mb-1 block';

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your business account settings</p>
      </div>

      {/* Tax & Legal */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Tax & Legal</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>GST Number</label>
            <input className={inputCls} placeholder="22AAAAA0000A1Z5" value={form.gst}
              onChange={e => upd('gst', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>PAN Number</label>
            <input className={inputCls} placeholder="AAAAA0000A" value={form.pan}
              onChange={e => upd('pan', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Payout */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Payouts</h3>
        <div>
          <label className={labelCls}>Bank Account Number</label>
          <input className={inputCls} placeholder="Enter account number" value={form.bankAccount}
            onChange={e => upd('bankAccount', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>UPI ID</label>
          <input className={inputCls} placeholder="yourbusiness@upi" value={form.upi}
            onChange={e => upd('upi', e.target.value)} />
        </div>
        <p className="text-xs text-muted-foreground">Payouts are processed every 7 days after each booking is completed.</p>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-0">
        <h3 className="font-semibold text-sm text-foreground mb-3">Notifications</h3>
        {([
          { key: 'notifBookings', label: 'New booking alerts', desc: 'Get notified instantly when a customer books' },
          { key: 'notifReviews', label: 'Customer reviews', desc: 'When someone leaves a rating or review' },
          { key: 'notifVerification', label: 'Verification updates', desc: 'Document approved, rejected, or needs action' },
        ] as const).map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <button onClick={() => upd(key, !form[key])}
              className={`w-10 h-6 rounded-full transition-all relative ${form[key] ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[key] ? 'left-5' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Danger */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="font-semibold text-sm text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
        <button className="h-9 px-4 rounded-full border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
          Delete business account
        </button>
      </div>

      <button onClick={save}
        className={`h-10 px-6 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
          saved ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}>
        {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save settings</>}
      </button>
    </div>
  );
}

function ComingSoonSection({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center max-w-xs">
        <div className="text-5xl mb-4">{emoji}</div>
        <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <span className="mt-4 inline-block text-xs bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 font-medium px-3 py-1.5 rounded-full">Coming soon</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ════════════════════════════════════════════════════════
const DEFAULT_BIZ: BusinessProfile = {
  businessName: '', categories: ['veterinarian'],
  description: '', phone: '', website: '',
  address: '', city: '', state: '', pincode: '',
  openHours: '', gst: '', pan: '', bankAccount: '', upi: '',
  notifBookings: true, notifReviews: true, notifVerification: true,
};

export default function BusinessDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<Section>('overview');
  const [localUser, setLocalUser] = useState<any>(null);
  const [biz, setBiz] = useState<BusinessProfile>(DEFAULT_BIZ);
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    // 1. Instant optimistic load from localStorage
    try {
      const savedUser = localStorage.getItem('zoodo_user');
      if (savedUser) setLocalUser(JSON.parse(savedUser));
      const savedBiz = localStorage.getItem('zoodo_biz');
      const parsed: BusinessProfile = savedBiz ? JSON.parse(savedBiz) : DEFAULT_BIZ;
      setBiz(parsed);

      const savedDocs = localStorage.getItem('zoodo_biz_docs');
      if (savedDocs) {
        setDocs(JSON.parse(savedDocs));
      } else {
        const cats = parsed.categories?.length ? parsed.categories : ['veterinarian'];
        setDocs(initDocs(cats));
      }
    } catch {
      setDocs(initDocs(['veterinarian']));
    }

    // 2. Fetch live data from unified backend
    const syncBackend = async () => {
      try {
        const [profileRes, docsRes] = await Promise.all([
          apiService.getBusinessProfile(),
          apiService.getBusinessDocuments(),
        ]);

        if (profileRes.success && profileRes.data) {
          setBiz(prev => ({ ...prev, ...profileRes.data }));
          localStorage.setItem('zoodo_biz', JSON.stringify(profileRes.data));
        }

        if (docsRes.success && Array.isArray(docsRes.data) && docsRes.data.length > 0) {
          setDocs(docsRes.data as any);
          localStorage.setItem('zoodo_biz_docs', JSON.stringify(docsRes.data));
        }
      } catch (err) {
        console.debug('Dashboard offline mode active', err);
      }
    };

    syncBackend();
  }, []);

  const activeUser = user || localUser;
  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950/50">
      <Sidebar active={section} setActive={setSection} user={activeUser} biz={biz} onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 flex flex-col">
        {section !== 'bookings' && section !== 'analytics' && (
          <VerifBanner docs={docs} setActive={setSection} />
        )}
        <div className="flex-1">
          {section === 'overview' && (
            <OverviewSection user={activeUser} biz={biz} docs={docs} setActive={setSection} />
          )}
          {section === 'bookings' && (
            <ComingSoonSection emoji="📅" title="Bookings"
              description="Manage customer bookings, approve requests, and view your full calendar. Goes live when your verification is complete." />
          )}
          {section === 'listing' && (
            <ListingSection biz={biz} setBiz={b => { setBiz(b); localStorage.setItem('zoodo_biz', JSON.stringify(b)); }} />
          )}
          {section === 'verification' && (
            <VerificationSection docs={docs} setDocs={setDocs} categories={biz.categories} />
          )}
          {section === 'analytics' && (
            <ComingSoonSection emoji="📊" title="Analytics"
              description="Profile views, booking conversion rate, customer demographics and revenue breakdown — available once your listing goes live." />
          )}
          {section === 'settings' && (
            <BizSettingsSection user={activeUser} biz={biz} setBiz={b => { setBiz(b); localStorage.setItem('zoodo_biz', JSON.stringify(b)); }} />
          )}
        </div>
      </main>

      <MobileNav active={section} setActive={setSection} />
    </div>
  );
}
