'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
  Bell,
  Calendar,
  Check,
  Clock,
  FileText,
  Home,
  LayoutGrid,
  Plus,
  Settings,
  Stethoscope,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { apiService, Appointment, Pet } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import zoodoLogo from '@/assets/zoodo.png';
import zoodoLightLogo from '@/assets/Zoodo-light.png';

type ServiceType = 'clinic' | 'home' | 'online';

interface AvailabilitySlot {
  id: string;
  service: ServiceType;
  fromDate: string; // ISO date (yyyy-mm-dd)
  toDate: string;   // ISO date
  startTime: string; // HH:mm (24h)
  endTime: string;   // HH:mm
  days: Array<'S' | 'M' | 'T' | 'W' | 'T2' | 'F' | 'S2'>; // visual day chips
  enabled: boolean;
  durationMinutes?: number;
  bufferMinutes?: number;
}

interface AppointmentItem {
  id: string;
  petName: string;
  species: string;
  owner: string;
  date: string; // ISO date
  time: string; // HH:mm
  service: Extract<ServiceType, 'home' | 'online'>;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'in-progress';
}

interface ReportItem {
  id: string;
  petName: string;
  owner: string;
  date: string; // ISO
  summary: string;
  status: 'draft' | 'pending' | 'finalized';
}

function formatHumanTime(time24h: string): string {
  try {
    const [h, m] = time24h.split(':');
    const d = new Date();
    d.setHours(Number(h));
    d.setMinutes(Number(m));
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  } catch {
    return time24h;
  }
}

export default function VetDashboardPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Availability state kept locally for now; later this should come from backend
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<AvailabilitySlot | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'availability'>('overview');
  const [draftError, setDraftError] = useState('');
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);

  // Individual veterinarian account: only Online and Home Visit
  const allowedServices = useMemo<ServiceType[]>(() => ['home', 'online'], []);

  useEffect(() => setMounted(true), []);

  // Load saved availability from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vetAvailabilitySlots');
      if (raw) {
        const parsed = JSON.parse(raw) as AvailabilitySlot[];
        if (Array.isArray(parsed)) setSlots(parsed);
      }
    } catch {}
  }, []);

  // Persist slots
  useEffect(() => {
    try {
      localStorage.setItem('vetAvailabilitySlots', JSON.stringify(slots));
    } catch {}
  }, [slots]);

  // Fetch real appointments and reports
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch appointments for this veterinarian
        const appointmentsResponse = await apiService.getAppointments();
        
        if (appointmentsResponse.success && appointmentsResponse.data) {
          // Filter appointments for this veterinarian and convert to the expected format
          const vetAppointments = appointmentsResponse.data
            .filter(apt => apt.providerId === user.id)
            .map(apt => ({
              id: apt.id,
              petName: 'Pet', // This would need to be fetched from pet data
              species: 'Unknown', // This would need to be fetched from pet data
              owner: 'Owner', // This would need to be fetched from owner data
              date: apt.appointmentDate.split('T')[0],
              time: apt.appointmentDate.split('T')[1]?.substring(0, 5) || '00:00',
              service: apt.type === 'consultation' ? 'online' as const : 'home' as const,
              status: apt.status
            }));
          
          setAppointments(vetAppointments);
        }

        // For now, set empty reports - this would need a separate API endpoint
        setReports([]);
        
      } catch (error) {
        console.error('Error fetching veterinarian dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Helpers
  const openCreateModal = () => {
    const today = new Date();
    const plus10 = new Date();
    plus10.setDate(today.getDate() + 10);
    const newDraft: AvailabilitySlot = {
      id: crypto.randomUUID(),
      service: allowedServices[0],
      fromDate: today.toISOString().slice(0, 10),
      toDate: plus10.toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '17:30',
      days: ['S', 'M', 'T', 'W', 'T2', 'F', 'S2'],
      enabled: true,
      durationMinutes: 25,
      bufferMinutes: 10,
    };
    setDraft(newDraft);
    setDraftError('');
    setIsModalOpen(true);
  };

  const saveDraft = () => {
    if (!draft) return;
    // Basic validation: dates, times, days, allowed service
    if (!allowedServices.includes(draft.service)) {
      setDraftError('Selected service is not available for this account.');
      return;
    }
    if (!draft.fromDate || !draft.toDate) {
      setDraftError('Please select a valid date range.');
      return;
    }
    if (new Date(draft.fromDate) > new Date(draft.toDate)) {
      setDraftError('Start date must be before end date.');
      return;
    }
    if (!draft.startTime || !draft.endTime) {
      setDraftError('Please provide start and end time.');
      return;
    }
    const [sh, sm] = draft.startTime.split(':').map(Number);
    const [eh, em] = draft.endTime.split(':').map(Number);
    if (eh * 60 + em <= sh * 60 + sm) {
      setDraftError('End time must be after start time.');
      return;
    }
    if (!draft.days || draft.days.length === 0) {
      setDraftError('Select at least one working day.');
      return;
    }
    setDraftError('');
    setSlots(prev => {
      const exists = prev.some(s => s.id === draft.id);
      return exists ? prev.map(s => (s.id === draft.id ? draft : s)) : [...prev, draft];
    });
    setIsModalOpen(false);
  };

  const removeSlot = (id: string) => setSlots(prev => prev.filter(s => s.id !== id));

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
              alt="Zoodo"
              width={120}
              height={32}
              className="w-auto h-5"
            />
            <Badge variant="secondary" className="hidden sm:inline-flex">Dashboard</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5"/></Button>
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5"/></Button>
            <Avatar>
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Manage your services and appointments with ease.</p>
          </div>
          <div className="flex gap-2">
            {allowedServices.includes('online') && (
              <Button className="gap-2"><Video className="h-4 w-4"/>Start online</Button>
            )}
            <Button variant="outline" className="gap-2" onClick={openCreateModal}><Plus className="h-4 w-4"/>Add slot</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v)=>setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="overview" className="gap-2"><LayoutGrid className="h-4 w-4"/>Overview</TabsTrigger>
            <TabsTrigger value="availability" className="gap-2"><Calendar className="h-4 w-4"/>Availability</TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2"><Clock className="h-4 w-4"/>Appointments</TabsTrigger>
            <TabsTrigger value="reports" className="gap-2"><FileText className="h-4 w-4"/>Reports</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Today" value="0" icon={<Calendar className="h-4 w-4"/>} note="appointments" />
              <StatCard title="Completed" value="0" icon={<Check className="h-4 w-4"/>} note="today" />
              <StatCard title="Pending" value="0" icon={<Clock className="h-4 w-4"/>} note="upcoming" />
              <StatCard title="Services" value={String(allowedServices.length)} icon={<Stethoscope className="h-4 w-4"/>} note="Individual vet" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Today’s appointments</CardTitle>
                <CardDescription>{appointments.filter(a=>a.date===new Date().toISOString().slice(0,10)).length === 0 ? 'No upcoming appointments.' : 'Your schedule for today'}</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.filter(a=>a.date===new Date().toISOString().slice(0,10)).length === 0 ? (
                  <EmptyState label="No upcoming appointments" />
                ) : (
                  <div className="space-y-3">
                    {appointments.filter(a=>a.date===new Date().toISOString().slice(0,10)).map(a => (
                      <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{a.petName} • {a.species}</div>
                          <div className="text-xs text-muted-foreground">{a.owner} • {a.service === 'online' ? 'Online' : 'Home visit'}</div>
                        </div>
                        <div className="text-sm">{formatHumanTime(a.time)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AVAILABILITY */}
          <TabsContent value="availability" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Manage Availability</h3>
                <p className="text-sm text-muted-foreground">Create windows when pet owners can book you.</p>
              </div>
              <Button onClick={openCreateModal} className="gap-2"><Plus className="h-4 w-4"/>Add new slot</Button>
            </div>

            {slots.length === 0 ? (
              <Card>
                <CardContent className="py-16">
                  <EmptyState label="You have no available slots. Create one to get new appointments." actionLabel="Add Availability" onAction={openCreateModal} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slots.map(slot => (
                  <Card key={slot.id} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ServiceBadge service={slot.service} />
                          <span className="text-sm text-muted-foreground">{slot.fromDate} - {slot.toDate}</span>
                        </div>
                        <label className="inline-flex items-center gap-2 text-xs">
                          <input type="checkbox" checked={slot.enabled} onChange={(e)=>setSlots(prev=>prev.map(s=>s.id===slot.id?{...s, enabled:e.target.checked}:s))} />
                          {slot.enabled? 'Active':'Paused'}
                        </label>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md border text-sm">
                        {formatHumanTime(slot.startTime)} – {formatHumanTime(slot.endTime)}
                      </div>
                      <div className="mt-3 flex gap-2">
                        {slot.days.map((d, i)=> (
                          <span key={i} className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs">{d.replace('2','')}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={()=>{ setDraft(slot); setIsModalOpen(true); }}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={()=>removeSlot(slot.id)}>Remove</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* APPOINTMENTS */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All appointments</CardTitle>
                <CardDescription>Upcoming and recent sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {appointments.map(a => (
                    <div key={a.id} className="p-4 rounded-lg border bg-card/40">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{a.petName} <span className="text-muted-foreground font-normal">({a.species})</span></div>
                        <span className="text-xs rounded-full px-2 py-1 border">{a.status}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">Owner: {a.owner}</div>
                      <div className="mt-2 text-sm">{a.date} • {formatHumanTime(a.time)} • {a.service==='online'?'Online':'Home visit'}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTS */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post-consultation reports</CardTitle>
                <CardDescription>Drafts, pending and finalized reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map(r => (
                    <div key={r.id} className="p-4 rounded-lg border bg-card/40 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{r.petName}</div>
                        <div className="text-xs text-muted-foreground">Owner: {r.owner} • {r.date}</div>
                        <div className="mt-2 text-sm text-foreground/90">{r.summary}</div>
                      </div>
                      <span className="text-xs rounded-full px-2 py-1 border self-start">{r.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Slot Modal */}
      {isModalOpen && draft && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40">
          <div className="w-full max-w-xl rounded-2xl border bg-card shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h4 className="font-semibold">{slots.some(s=>s.id===draft.id)? 'Edit':'Add'} Availability</h4>
              <button onClick={()=>setIsModalOpen(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex gap-2 flex-wrap">
                {(['home','online'] as ServiceType[]).map(s=> (
                  <button
                    key={s}
                    disabled={!allowedServices.includes(s)}
                    onClick={()=>setDraft(prev=>prev?{...prev, service:s}:prev)}
                    className={`px-3 py-1 rounded-full text-sm border ${draft.service===s?'bg-primary text-primary-foreground border-primary':'bg-background'} ${!allowedServices.includes(s)?'opacity-40 cursor-not-allowed':''}`}
                  >
                    <ServiceLabel service={s} />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Start date">
                  <input type="date" className="w-full h-10 rounded-md border bg-background px-3" value={draft.fromDate} onChange={(e)=>setDraft(prev=>prev?{...prev, fromDate:e.target.value}:prev)} />
                </Field>
                <Field label="End date">
                  <input type="date" className="w-full h-10 rounded-md border bg-background px-3" value={draft.toDate} onChange={(e)=>setDraft(prev=>prev?{...prev, toDate:e.target.value}:prev)} />
                </Field>
                <Field label="Start time">
                  <input type="time" className="w-full h-10 rounded-md border bg-background px-3" value={draft.startTime} onChange={(e)=>setDraft(prev=>prev?{...prev, startTime:e.target.value}:prev)} />
                </Field>
                <Field label="End time">
                  <input type="time" className="w-full h-10 rounded-md border bg-background px-3" value={draft.endTime} onChange={(e)=>setDraft(prev=>prev?{...prev, endTime:e.target.value}:prev)} />
                </Field>
                <Field label="Consultation duration (minutes)">
                  <input type="number" min={5} step={5} className="w-full h-10 rounded-md border bg-background px-3" value={draft.durationMinutes ?? 25} onChange={(e)=>setDraft(prev=>prev?{...prev, durationMinutes: Number(e.target.value)||25}:prev)} />
                </Field>
                <Field label="Buffer time (minutes)">
                  <input type="number" min={0} step={5} className="w-full h-10 rounded-md border bg-background px-3" value={draft.bufferMinutes ?? 10} onChange={(e)=>setDraft(prev=>prev?{...prev, bufferMinutes: Number(e.target.value)||0}:prev)} />
                </Field>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Working days</div>
                <div className="flex flex-wrap gap-2">
                  {(['S','M','T','W','T2','F','S2'] as AvailabilitySlot['days']).map(d => (
                    <button key={d} onClick={()=>setDraft(prev=>prev?{...prev, days: prev.days.includes(d)? prev.days.filter(x=>x!==d) : [...prev.days, d]}:prev)} className={`h-9 w-9 rounded-full border text-sm ${draft.days.includes(d)?'bg-primary text-primary-foreground border-primary':'bg-background'}`}>{d.replace('2','')}</button>
                  ))}
                </div>
              </div>
            </div>
            {draftError && (
              <div className="px-5 text-destructive text-sm">{draftError}</div>
            )}
            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={()=>setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={saveDraft}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, note, icon }: { title: string; value: string; note?: string; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {note && <p className="text-xs text-muted-foreground mt-1">{note}</p>}
      </CardContent>
    </Card>
  );
}

function EmptyState({ label, actionLabel, onAction }: { label: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="w-full grid place-items-center text-center">
      <div className="mx-auto max-w-md">
        <div className="h-24 w-24 mx-auto rounded-full border grid place-items-center text-muted-foreground/70">
          <Stethoscope className="h-8 w-8" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{label}</p>
        {actionLabel && (
          <Button className="mt-4" onClick={onAction}>{actionLabel}</Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function ServiceBadge({ service }: { service: ServiceType }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
      <ServiceIcon service={service} />
      <ServiceLabel service={service} />
    </span>
  );
}

function ServiceIcon({ service }: { service: ServiceType }) {
  switch (service) {
    case 'clinic':
      return <Home className="h-3.5 w-3.5" />;
    case 'home':
      return <Home className="h-3.5 w-3.5" />;
    case 'online':
      return <Video className="h-3.5 w-3.5" />;
  }
}

function ServiceLabel({ service }: { service: ServiceType }) {
  switch (service) {
    case 'clinic':
      return <>Clinic consultation</>;
    case 'home':
      return <>Home visit</>;
    case 'online':
      return <>Online consultation</>;
  }
}