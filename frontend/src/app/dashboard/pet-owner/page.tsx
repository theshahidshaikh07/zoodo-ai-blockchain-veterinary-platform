'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Home, PawPrint, Calendar, FileText, Settings, LogOut,
  Phone, MapPin, User, Bell, Shield, ChevronRight,
  Check, Plus, Edit3, X, Save, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

// ─── Types ──────────────────────────────────────────────
type Section = 'home' | 'pets' | 'appointments' | 'records' | 'settings';
type SettingsTab = 'profile' | 'contact' | 'security' | 'notifications' | 'privacy';

interface ExtendedProfile {
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyName: string;
  emergencyPhone: string;
  notifAppointments: boolean;
  notifHealthTips: boolean;
  notifOffers: boolean;
  notifCommunity: boolean;
  profileVisibility: 'public' | 'private';
}

// ─── Constants ───────────────────────────────────────────
const SPECIES_EMOJI: Record<string, string> = {
  Dog: '🐶', Cat: '🐱', Bird: '🐦', Rabbit: '🐰',
  Hamster: '🐹', Fish: '🐟', Other: '🐾',
};

const DEFAULT_PROFILE: ExtendedProfile = {
  phone: '', address: '', city: '', state: '', pincode: '',
  emergencyName: '', emergencyPhone: '',
  notifAppointments: true, notifHealthTips: true,
  notifOffers: false, notifCommunity: true,
  profileVisibility: 'private',
};

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// ─── Sidebar nav items ───────────────────────────────────
const NAV = [
  { id: 'home' as Section, label: 'Home', Icon: Home },
  { id: 'pets' as Section, label: 'My Pets', Icon: PawPrint },
  { id: 'appointments' as Section, label: 'Appointments', Icon: Calendar },
  { id: 'records' as Section, label: 'Health Records', Icon: FileText },
  { id: 'settings' as Section, label: 'Settings', Icon: Settings },
];

// ════════════════════════════════════════════════════════
//  MODULE-LEVEL SUB-COMPONENTS (no focus loss)
// ════════════════════════════════════════════════════════

function Sidebar({ active, setActive, user, onLogout }: {
  active: Section; setActive: (s: Section) => void;
  user: any; onLogout: () => void;
}) {
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'ZU';
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
            <p className="text-sm font-medium text-foreground truncate">{user?.firstName} {user?.lastName}</p>
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex z-50 safe-area-bottom">
      {NAV.map(({ id, label, Icon }) => (
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

// ─── Completion Bar Card ─────────────────────────────────
function CompletionCard({ user, profile, pets, onGoToSettings }: {
  user: any; profile: ExtendedProfile; pets: any[]; onGoToSettings: () => void;
}) {
  const items = [
    { label: 'Full name', done: !!(user?.firstName && user?.lastName) },
    { label: 'Email verified', done: !!user?.email },
    { label: 'Phone number', done: !!profile.phone },
    { label: 'Home address', done: !!(profile.address && profile.city) },
    { label: 'Emergency contact', done: !!profile.emergencyName },
    { label: 'Pet profile added', done: pets.length > 0 },
  ];
  const done = items.filter(i => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  if (pct === 100) return null;

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-foreground text-sm">Complete your profile</p>
          <p className="text-xs text-muted-foreground mt-0.5">{done} of {items.length} steps done</p>
        </div>
        <span className="text-xl font-bold text-primary">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-2">
        {items.filter(i => !i.done).slice(0, 3).map(item => (
          <div key={item.label} className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <div className="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-gray-700 shrink-0" />
            {item.label}
          </div>
        ))}
        {items.filter(i => !i.done).length > 3 && (
          <p className="text-xs text-muted-foreground pl-6">+{items.filter(i => !i.done).length - 3} more</p>
        )}
      </div>
      <button onClick={onGoToSettings}
        className="mt-4 text-xs text-primary font-medium hover:underline flex items-center gap-1">
        Complete now <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Home Section ────────────────────────────────────────
function HomeSection({ user, profile, pets, onGoToSettings, onGoToPets }: {
  user: any; profile: ExtendedProfile; pets: any[];
  onGoToSettings: () => void; onGoToPets: () => void;
}) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-foreground">{greeting()}, {user?.firstName || 'there'} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your furry family.</p>
      </div>

      <CompletionCard user={user} profile={profile} pets={pets} onGoToSettings={onGoToSettings} />

      {/* Pets quick view */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Your Pets</h2>
          <button onClick={onGoToPets} className="text-xs text-primary hover:underline">See all</button>
        </div>
        {pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pets.slice(0, 4).map((pet: any, i: number) => (
              <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                  {SPECIES_EMOJI[pet.species] || '🐾'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{pet.name || 'Unnamed'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {pet.species}{pet.breed ? ` · ${pet.breed}` : ''}
                  </p>
                  {(pet.age || pet.birthday) && (
                    <p className="text-xs text-muted-foreground">
                      {pet.age ? `${pet.age} ${pet.ageUnit?.toLowerCase() || 'years'}` : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={onGoToPets}
            className="w-full bg-white dark:bg-gray-950 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-7 text-center hover:border-primary transition-colors group">
            <div className="text-3xl mb-2">🐾</div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Add your first pet</p>
            <p className="text-xs text-muted-foreground mt-1">Track health, vaccinations & more</p>
          </button>
        )}
      </div>

      {/* Appointments placeholder */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Upcoming Appointments</h2>
          <span className="text-[10px] bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 font-medium px-2 py-0.5 rounded-full">Coming soon</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Book vet visits, grooming sessions, and more. Your upcoming appointments will appear here.
        </p>
      </div>
    </div>
  );
}

// ─── My Pets Section ─────────────────────────────────────
function PetsSection({ pets, setPets }: { pets: any[]; setPets: (p: any[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', species: 'Dog', breed: '', gender: 'unknown', age: '', ageUnit: 'Years', weight: '', sterilized: false, birthday: '' });

  const savePet = async () => {
    if (!newPet.name.trim()) return;
    const tempId = String(Date.now());
    const optimisticPet = { ...newPet, id: tempId };
    const updated = [...pets, optimisticPet];
    setPets(updated);
    localStorage.setItem('zoodo_pets', JSON.stringify(updated));
    setAdding(false);

    try {
      const res = await apiService.createPet({
        name: newPet.name.trim(),
        species: newPet.species,
        breed: newPet.breed,
        gender: newPet.gender,
        age: newPet.age ? Number(newPet.age) : undefined,
        weight: newPet.weight ? Number(newPet.weight) : undefined,
      } as any);
      if (res.success && res.data) {
        const mapped = pets.map((p: any) => p.id === tempId ? res.data : p);
        setPets(mapped);
        localStorage.setItem('zoodo_pets', JSON.stringify(mapped));
      }
    } catch {}

    setNewPet({ name: '', species: 'Dog', breed: '', gender: 'unknown', age: '', ageUnit: 'Years', weight: '', sterilized: false, birthday: '' });
  };

  const removePet = (idx: number) => {
    const updated = pets.filter((_, i) => i !== idx);
    setPets(updated);
    localStorage.setItem('zoodo_pets', JSON.stringify(updated));
  };

  const fieldCls = 'h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm px-3 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50';

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Pets</h1>
          <p className="text-sm text-muted-foreground">{pets.length} pet{pets.length !== 1 ? 's' : ''} in your family</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Pet
        </button>
      </div>

      {/* Add Pet Form */}
      {adding && (
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-primary/30 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-foreground">New Pet</p>
            <button onClick={() => setAdding(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <input className={fieldCls} placeholder="Pet name *" value={newPet.name}
              onChange={e => setNewPet(p => ({ ...p, name: e.target.value }))} />
            <select className={fieldCls} value={newPet.species}
              onChange={e => setNewPet(p => ({ ...p, species: e.target.value }))}>
              {['Dog','Cat','Bird','Rabbit','Hamster','Fish','Other'].map(s => <option key={s}>{s}</option>)}
            </select>
            <input className={fieldCls} placeholder="Breed (optional)" value={newPet.breed}
              onChange={e => setNewPet(p => ({ ...p, breed: e.target.value }))} />
            <select className={fieldCls} value={newPet.gender}
              onChange={e => setNewPet(p => ({ ...p, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
            <div className="flex gap-2">
              <input type="number" className={fieldCls} placeholder="Age" value={newPet.age}
                onChange={e => setNewPet(p => ({ ...p, age: e.target.value }))} />
              <select className="h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm px-2 text-foreground outline-none focus:border-primary shrink-0"
                value={newPet.ageUnit} onChange={e => setNewPet(p => ({ ...p, ageUnit: e.target.value }))}>
                <option>Years</option><option>Months</option><option>Days</option>
              </select>
            </div>
            <input type="number" className={fieldCls} placeholder="Weight (kg)" value={newPet.weight}
              onChange={e => setNewPet(p => ({ ...p, weight: e.target.value }))} />
          </div>
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <div onClick={() => setNewPet(p => ({ ...p, sterilized: !p.sterilized }))}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${newPet.sterilized ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                {newPet.sterilized && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              Sterilized
            </label>
            <div className="flex-1" />
            <button onClick={savePet}
              className="flex items-center gap-2 h-9 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>
      )}

      {/* Pet Cards */}
      {pets.length === 0 && !adding ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">🐾</div>
          <p className="font-medium text-foreground">No pets yet</p>
          <p className="text-sm mt-1">Click "Add Pet" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((pet: any, i: number) => (
            <div key={pet.id || i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  {SPECIES_EMOJI[pet.species] || '🐾'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{pet.name}</p>
                    <button onClick={() => removePet(i)}
                      className="text-muted-foreground hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      pet.species,
                      pet.breed,
                      pet.gender !== 'unknown' && (pet.gender === 'male' ? '♂ Male' : '♀ Female'),
                      pet.age && `${pet.age} ${pet.ageUnit?.toLowerCase() || 'years'}`,
                      pet.weight && `${pet.weight} kg`,
                      pet.sterilized && 'Sterilized',
                    ].filter(Boolean).map((tag, j) => (
                      <span key={j} className="text-[11px] bg-gray-50 dark:bg-gray-800 text-muted-foreground px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Settings Section ────────────────────────────────────
function SettingsSection({ user, profile, setProfile }: {
  user: any; profile: ExtendedProfile; setProfile: (p: ExtendedProfile) => void;
}) {
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [form, setForm] = useState<ExtendedProfile>(profile);
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const upd = (field: keyof ExtendedProfile, val: any) =>
    setForm(p => ({ ...p, [field]: val }));

  const save = () => {
    setProfile(form);
    localStorage.setItem('zoodo_profile', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TABS: { id: SettingsTab; label: string; Icon: any }[] = [
    { id: 'profile', label: 'Personal Info', Icon: User },
    { id: 'contact', label: 'Contact & Location', Icon: MapPin },
    { id: 'security', label: 'Security', Icon: Shield },
    { id: 'notifications', label: 'Notifications', Icon: Bell },
    { id: 'privacy', label: 'Privacy', Icon: Eye },
  ];

  const inputCls = 'h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm px-3.5 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50';
  const labelCls = 'text-xs font-medium text-muted-foreground mb-1 block';

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex gap-5">
        {/* Settings sub-nav */}
        <div className="hidden sm:flex flex-col gap-0.5 w-44 shrink-0">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                tab === id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-foreground'
              }`}>
              <Icon className="w-4 h-4 shrink-0" /> {label}
            </button>
          ))}
        </div>

        {/* Mobile tab select */}
        <select className="sm:hidden mb-4 h-10 rounded-xl border border-gray-200 text-sm px-3 bg-white dark:bg-gray-950 outline-none"
          value={tab} onChange={e => setTab(e.target.value as SettingsTab)}>
          {TABS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">

          {tab === 'profile' && (
            <>
              <h3 className="font-semibold text-sm text-foreground">Personal Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First name</label>
                  <input className={inputCls} value={user?.firstName || ''} readOnly
                    title="Name cannot be changed here" />
                </div>
                <div>
                  <label className={labelCls}>Last name</label>
                  <input className={inputCls} value={user?.lastName || ''} readOnly />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email address</label>
                <div className="flex items-center gap-2">
                  <input className={`${inputCls} flex-1`} value={user?.email || ''} readOnly />
                  <span className="text-[10px] font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full whitespace-nowrap">Verified</span>
                </div>
              </div>
              <div>
                <label className={labelCls}>Username</label>
                <input className={inputCls} value={user?.username || ''} readOnly />
              </div>
              <p className="text-xs text-muted-foreground">To update your name or email, contact support.</p>
            </>
          )}

          {tab === 'contact' && (
            <>
              <h3 className="font-semibold text-sm text-foreground">Contact & Location</h3>
              <div>
                <label className={labelCls}>Phone number</label>
                <div className="flex gap-2">
                  <input className={`${inputCls} flex-1`} placeholder="+91 9800000000" value={form.phone}
                    onChange={e => upd('phone', e.target.value)} />
                  {form.phone && (
                    <span className="text-[10px] font-medium bg-amber-50 text-amber-600 dark:bg-amber-900/20 px-2 rounded-xl border border-amber-200 dark:border-amber-800 whitespace-nowrap flex items-center">
                      Verify →
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className={labelCls}>Street address</label>
                <input className={inputCls} placeholder="House / Flat / Building" value={form.address}
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
              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <h4 className="font-medium text-sm text-foreground mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Contact name</label>
                    <input className={inputCls} placeholder="Full name" value={form.emergencyName}
                      onChange={e => upd('emergencyName', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone number</label>
                    <input className={inputCls} placeholder="+91 9800000000" value={form.emergencyPhone}
                      onChange={e => upd('emergencyPhone', e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'security' && (
            <>
              <h3 className="font-semibold text-sm text-foreground">Security</h3>
              <div>
                <label className={labelCls}>New password</label>
                <div className="relative">
                  <input className={`${inputCls} pr-10`} type={showPw ? 'text' : 'password'}
                    placeholder="Min 6 characters" />
                  <button onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Confirm new password</label>
                <input className={inputCls} type="password" placeholder="Repeat password" />
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Google Account</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full font-medium">Connected</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">Coming soon</span>
                </div>
              </div>
            </>
          )}

          {tab === 'notifications' && (
            <>
              <h3 className="font-semibold text-sm text-foreground">Notification Preferences</h3>
              {([
                { key: 'notifAppointments', label: 'Appointment reminders', desc: 'Get reminded 24h before your booking' },
                { key: 'notifHealthTips', label: 'Pet health tips', desc: 'Weekly care tips for your pets' },
                { key: 'notifOffers', label: 'Offers & promotions', desc: 'Discounts from Zoodo and partners' },
                { key: 'notifCommunity', label: 'Community replies', desc: 'When someone replies to your posts' },
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
            </>
          )}

          {tab === 'privacy' && (
            <>
              <h3 className="font-semibold text-sm text-foreground">Privacy</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Profile visibility</p>
                  <p className="text-xs text-muted-foreground mb-2">Who can see your profile on Zoodo</p>
                  <div className="flex gap-2">
                    {(['public', 'private'] as const).map(v => (
                      <button key={v} onClick={() => upd('profileVisibility', v)}
                        className={`h-9 px-4 rounded-full border text-sm capitalize transition-all ${
                          form.profileVisibility === v
                            ? 'border-primary text-primary bg-primary/5 font-medium'
                            : 'border-gray-200 dark:border-gray-700 text-muted-foreground hover:border-gray-300'
                        }`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Danger zone</p>
                  <button className="h-9 px-4 rounded-full border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                    Delete account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Save button */}
          {tab !== 'profile' && tab !== 'security' && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <button onClick={save}
                className={`h-10 px-6 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  saved ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}>
                {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save changes</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Coming Soon Section ─────────────────────────────────
function ComingSoonSection({ title, description, emoji }: {
  title: string; description: string; emoji: string;
}) {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center max-w-xs">
        <div className="text-5xl mb-4">{emoji}</div>
        <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <span className="mt-4 inline-block text-xs bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 font-medium px-3 py-1.5 rounded-full">
          Coming soon
        </span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ════════════════════════════════════════════════════════
export default function PetOwnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<Section>('home');
  const [localUser, setLocalUser] = useState<any>(null);
  const [profile, setProfile] = useState<ExtendedProfile>(DEFAULT_PROFILE);
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    // 1. Instant optimistic load from localStorage
    try {
      const rawUser = localStorage.getItem('zoodo_user') || localStorage.getItem('user');
      if (rawUser) setLocalUser(JSON.parse(rawUser));
      const saved = localStorage.getItem('zoodo_profile');
      if (saved) setProfile(JSON.parse(saved));
      const savedPets = localStorage.getItem('zoodo_pets');
      if (savedPets) setPets(JSON.parse(savedPets));
    } catch {}

    // 2. Fetch live pets from unified backend
    const syncPets = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        const res = await apiService.getPets();
        if (res.success && Array.isArray(res.data)) {
          setPets(res.data);
          localStorage.setItem('zoodo_pets', JSON.stringify(res.data));
        }
      } catch (err) {
        // Quietly fallback to local cache
      }
    };

    syncPets();
  }, []);

  const activeUser = user || localUser;

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950/50">
      <Sidebar active={section} setActive={setSection} user={activeUser} onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        {section === 'home' && (
          <HomeSection user={activeUser} profile={profile} pets={pets}
            onGoToSettings={() => setSection('settings')}
            onGoToPets={() => setSection('pets')} />
        )}
        {section === 'pets' && (
          <PetsSection pets={pets} setPets={setPets} />
        )}
        {section === 'appointments' && (
          <ComingSoonSection
            title="Appointments"
            description="Book vet visits, grooming, training sessions and more. Your full appointment calendar will live here."
            emoji="📅" />
        )}
        {section === 'records' && (
          <ComingSoonSection
            title="Health Records"
            description="Vaccination history, prescriptions, medical reports and deworming schedules — all in one place."
            emoji="📋" />
        )}
        {section === 'settings' && (
          <SettingsSection user={activeUser} profile={profile} setProfile={setProfile} />
        )}
      </main>

      <MobileNav active={section} setActive={setSection} />
    </div>
  );
}