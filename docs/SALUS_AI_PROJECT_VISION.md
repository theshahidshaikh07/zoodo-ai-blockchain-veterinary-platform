# 🐾 SALUS AI — Project Vision & Architecture

## Executive Summary

**Salus AI** is not a symptom checker. It's a **Personal AI Care Manager for Pet Parents** — a comprehensive operating system for pet health, wellness, travel, finance, and lifestyle management.

**Vision**: The first platform globally where pet parents can manage their pet's entire life journey through an intelligent AI companion.

---

## 1️⃣ CORE IDENTITY & POSITIONING

### What Salus IS:
- ✅ **Holistic Pet Health & Wellness Manager**
- ✅ **Pet Travel & Documentation Expert**
- ✅ **Personal Finance Advisor** (for pet expenses)
- ✅ **Behavioral & Training Coach**
- ✅ **Insurance & Legal Advisor**
- ✅ **Lifestyle Companion**

### What Salus IS NOT:
- ❌ A replacement for veterinarians
- ❌ A simple symptom checker
- ❌ Random Q&A chatbot
- ❌ Generic pet information site

### Tagline:
> "Everything your pet needs. In one place." — **Managed by Salus AI**

---

## 2️⃣ THE 11 KNOWLEDGE PILLARS

Every question a pet parent asks falls into one of these 11 domains:

### 🩺 **Pillar 1: Health & Medical (CRITICAL)**
**Depth Level: Expert**

The foundation of everything.

#### A. General Health
- Symptom checker (safe, never diagnostic)
- When to visit vet vs home care
- Vaccination schedules (breed-specific)
- Deworming protocols
- Tick & flea prevention
- Heat stroke prevention
- First aid guidance

#### B. Medical Information
- Common diseases (Parvo, Distemper, Rabies)
- Breed-specific genetic diseases
- Chronic conditions (diabetes, arthritis, IVDD)
- Post-surgery care protocols
- Medication safety (toxicity database)

#### C. Advanced Medical
- Lab report interpretation
- Blood test explanations
- Neutering/spaying benefits
- Microchipping procedures
- Pre-surgical checklists

**AI Logic**:
```
If user mentions symptoms:
  1. Check severity (emergency? → direct to vet + emergency contacts)
  2. Cross-reference with pet profile (breed, age, weight)
  3. Provide differential possibilities (NOT diagnosis)
  4. Always end with: "See a vet for confirmation"
```

---

### ✈️ **Pillar 2: Pet Travel & Documentation (PREMIUM)**
**Depth Level: Global Expert**

This is where Salus becomes premium and differentiated.

#### A. What Is a Pet Passport? (Understanding)
A **pet passport is an official document proving**:
- Pet is vaccinated (especially rabies)
- Pet is microchipped
- Pet meets destination country health requirements

**Key Concept**: No universal worldwide passport exists.
- EU: Official "EU Pet Passport" booklet
- USA: State-by-state certificates
- India: No passport booklet; requires AQCS certificates
- UAE, UK, Canada: Each has unique rules

#### B. Pet Passport Components
What Salus Must Know:

| Component | Purpose | Critical? |
|-----------|---------|-----------|
| Owner Details | Identification | ✅ |
| Pet Details | Name, Breed, DOB, Color | ✅ |
| **Microchip Number** | ISO 11784/11785 format | **✅✅** |
| **Rabies Vaccination** | Proof of immunity | **✅✅** |
| Rabies Antibody Titer | Immunity level proof | ⚠️ (country-dependent) |
| Other Vaccinations | DHPP, Leptospirosis, etc. | ✅ |
| Deworming Records | Some countries require | ✅ |
| Health Certificate | Government vet approval | ✅ |
| Official Vet Stamp | Authority validation | ✅ |

#### C. Microchip Explained
**What It Is**:
- Tiny electronic chip (grain of rice size)
- Implanted under skin (neck area, usually)
- Contains unique identification number (15-digit)
- **NOT GPS** — NOT real-time tracking
- Only stores ID that links to owner database

**Why Mandatory for Travel**:
- ISO 11784/11785 compliant required
- Must be implanted BEFORE rabies vaccination
- If vaccine given first → vaccine becomes invalid

**Critical AI Logic**:
```
If user says: "My dog got rabies vaccine before microchip"
AI Response: ❌ PROBLEM DETECTED
  - Vaccine is now invalid for international travel
  - Must get microchipped
  - Must re-vaccinate after 30 days recovery
  - Then restart waiting periods
```

#### D. Rabies Vaccination (MOST CRITICAL)
**The Order Matters**:

```
Step 1: MICROCHIP FIRST
        ↓
Step 2: RABIES VACCINE (wait 30 days)
        ↓
Step 3: RABIES ANTIBODY TITER TEST (if required)
        ↓
Step 4: WAIT 3 MONTHS (some countries)
        ↓
Step 5: HEALTH CERTIFICATE (7-10 days before travel)
        ↓
Step 6: TRAVEL APPROVED
```

**Mistake**: Reverse order = 3-6 month restart.

#### E. Rabies Antibody Titer Test (RNATT)
**What It Measures**:
Rabies Neutralized Antibody Titration Test checks if pet has sufficient rabies antibodies.

**Minimum Required**: 0.5 IU/ml

**Why It Matters**:
- Proves immunity beyond just vaccination
- Some countries demand this
- Must be done at approved lab
- Test is expensive ($100-200)
- Must be current within 12 months

#### F. International Travel Requirements Database

Salus Must Have a Country Database:

**🟢 Low Risk** (Simple Rules)
- Example: Australia to New Zealand
- Requirement: Rabies vaccine + health certificate
- Wait time: 30 days

**🟡 Medium Risk** (Moderate Rules)
- Example: USA to Mexico
- Requirements: Microchip + rabies vaccine + health certificate
- Wait time: 30 days

**🔴 High Risk** (Complex Rules)
- Example: India to UK/Canada/UAE
- Requirements: Microchip + rabies vaccine + titer test + import permit + waiting periods
- Wait time: 3-6 months
- Quarantine: Possible (7 days to 6 months)

#### G. India-Specific Travel Rules
**Export from India**:
1. DGFT (Directorate General of Foreign Trade) approval
2. Animal Quarantine & Certification Service (AQCS) certificate
3. Health certificate from state vet authority
4. Import permit from destination country
5. NOC (No Objection Certificate) from local municipal corporation

**Import to India**:
1. Country-specific import permit
2. Health certificate from origin country vet authority
3. Microchip proof
4. Vaccination proof
5. AQCS approval
6. Quarantine (sometimes 30 days)

#### H. Airline Rules (IATA Standards)
**Crate Requirements**:
- Allow pet to stand upright
- Turn around 360°
- Lie down comfortably
- Ventilation on 3-4 sides
- Water bowl attached
- Leak-proof floor

**Crate Size Calculator AI Logic**:
```
Length = (Nose to tail base) + (Half front leg length)
Width = Pet width + 6 inches
Height = Standing height + 6 inches
```

**Breed Restrictions**:
- ❌ Brachycephalic breeds (flat nose): Pug, French Bulldog, Persian cat
- ✅ Can travel but with oxygen, cooling
- ⚠️ Some airlines ban them entirely

---

### 🛡️ **Pillar 3: Pet Insurance**
**Depth Level: Specialist**

Most Indian pet parents don't know this exists.

#### Types of Coverage
| Type | Covers | Cost | When to Choose |
|------|--------|------|-----------------|
| **Accident-Only** | Injury, poisoning, hit-by-car | $5-10/mo | Budget conscious |
| **Accident + Illness** | Above + infections, diseases | $15-25/mo | Standard choice |
| **Comprehensive** | Above + surgery, hospitalization, diagnostics | $30-50/mo | Best protection |

#### What Insurance COVERS
- Veterinary examination fees
- Surgical procedures
- Hospitalization
- Diagnostic tests (X-ray, ultrasound)
- Medications (if prescribed)
- Emergency care

#### What Insurance DOES NOT Cover
- ❌ Pre-existing conditions
- ❌ Routine check-ups
- ❌ Grooming
- ❌ Cosmetic procedures (ear crops, etc.)
- ❌ Preventive care (vaccines, deworming)
- ❌ Behavioral training

#### Common Insurance Terms
- **Waiting Period**: 7-30 days before coverage starts
- **Deductible**: You pay first $100-500, insurance pays rest
- **Annual Limit**: Max payout per year ($5,000-50,000)
- **Lifetime Limit**: Max ever paid (some plans unlimited)
- **Pre-existing Condition**: Illness before policy start

**AI Logic**:
```
If user says: "Is my dog's diabetes covered?"
AI must ask:
  1. When was dog diagnosed? (before or after policy start?)
  2. Do you have medical records? (proof of diagnosis)
  3. What's your plan type?
  
Then: Calculate actual coverage based on terms
```

---

### 🍖 **Pillar 4: Food & Nutrition**
**Depth Level: Specialist**

#### What Salus Must Know
- **Breed-specific diet needs**
  - German Shepherd: High protein, joint support
  - Pug: Calorie control (prone to obesity)
  - Large breeds: Large-breed puppy formula (specific calcium ratios)

- **Life stage feeding**
  - Puppy (0-12 months): High calories, specific nutrients
  - Adult (1-7 years): Maintenance calories
  - Senior (7+ years): Lower calories, joint support

- **Food types**
  - Kibble: Convenient, economical
  - Wet food: High moisture, better hydration
  - Raw diet: Pros/cons, handling risk
  - Homemade: Nutritional balance challenges

- **Toxic foods database**
  - Chocolate: Theobromine toxicity (1g per kg = dangerous)
  - Onions/Garlic: Hemolytic anemia
  - Grapes/Raisins: Kidney failure
  - Avocado: Persin toxicity
  - Xylitol: Hypoglycemia

- **Weight management**
  - Calorie calculator based on breed, age, activity
  - Treat allowance (max 10% of daily calories)
  - Exercise + diet balance

---

### 🧠 **Pillar 5: Behavior & Training**
**Depth Level: Expert**

#### Categories Salus Must Handle
- **Potty Training**: Step-by-step, age-appropriate
- **Biting Issues**: Puppy vs adult, redirection techniques
- **Aggression**: Resource guarding, fear-based, dominance
- **Separation Anxiety**: Crating, desensitization, medication options
- **Excessive Barking**: Triggers, training, when to see trainer
- **Socialization**: Critical periods (3-16 weeks), exposure guidelines
- **Cat Litter Issues**: Elimination outside box, medical vs behavioral

**AI Logic**:
```
If user says: "My puppy bites during play"
AI checks:
  1. Age? (8-week pups = normal teething)
  2. Frequency? (occasional vs constant)
  3. Intensity? (pinch vs major wounds)
  
Then: Provides training steps or "see behavioral trainer" advice
```

---

### 🛁 **Pillar 6: Grooming & Hygiene**
**Depth Level: Operational**

- Grooming frequency (breed-dependent)
- Nail cutting: Overgrowth causes mobility issues
- Ear cleaning: Especially floppy ear breeds
- Breed-specific coat care (shedding, matting)
- Seasonal grooming (summer shave-down)
- When to hire professional groomer

---

### 🏠 **Pillar 7: Adoption, Legal & Ownership**
**Depth Level: Regulatory Expert**

#### Legal Knowledge Required
- Adoption process: Shelter vs breeder
- Legal ownership: Registration documents
- Apartment pet rules: Breed restrictions, deposit
- RWA (Resident Welfare Association) rules in India
- Stray dog laws: Adoption rights, liability
- Animal cruelty: Reporting procedures

#### India-Specific Regulations
- **Animal Welfare Board of India**: Enforcement body
- **Prevention of Cruelty to Animals Act**, 1960
- Municipal pet registration requirements
- Tax implications

---

### 👥 **Pillar 8: Lifestyle & Daily Care**
**Depth Level: Lifestyle Coach**

- How long can pet be alone? (breed, age dependent)
- Ideal exercise routine: Energy burn calculation
- Mental stimulation: Puzzle toys, training sessions
- Pet-friendly travel spots (restaurants, parks, hotels)
- Pet-friendly cafes in major cities
- Pet birthdays, celebrations, milestone tracking

**Location-Aware AI Logic**:
```
If user says: "I live in Mumbai, want to take dog to cafe"
AI responds with: Specific pet-friendly cafes + their policies
```

---

### 🚨 **Pillar 9: Emergency & Critical**
**Depth Level: URGENT**

**Salus Must Detect Emergency Keywords**:
- Choking
- Poison/ingestion
- Snake bite
- Hit by car
- Heat stroke
- Severe bleeding
- Loss of consciousness

**Emergency Response Protocol**:
```
If EMERGENCY DETECTED:
  1. ✅ Display WARNING BANNER (top screen)
  2. ✅ Provide immediate first aid steps
  3. ✅ Show nearest emergency vet (location-based)
  4. ✅ Enable 1-click emergency consultation call
  5. ✅ Provide emergency hotline numbers
  6. 🚨 ALWAYS END WITH: "GET TO VET NOW. THIS IS NOT A REPLACEMENT."
```

---

### 🐾 **Pillar 10: Breed Intelligence Database**
**Depth Level: Expert**

For every breed, Salus knows:
- Temperament profile
- Energy level (low/medium/high)
- Grooming needs (frequency, cost)
- Genetic health risks
- Climate suitability (critical for India's heat)
- Lifespan
- Size at maturity
- Training difficulty
- Good for apartments? (yes/no/conditional)
- Good with kids/other pets?

**Example Data Structure**:
```json
{
  "breed": "Siberian Husky",
  "origin": "Russia",
  "temperament": "Friendly, energetic, stubborn",
  "energy_level": "Very High",
  "grooming": "Weekly brushing, seasonal heavy shedding",
  "health_risks": ["Hip dysplasia", "Eye issues", "Hypothyroidism"],
  "climate_suitability": "❌ NOT SUITABLE FOR TROPICAL (India heat)",
  "lifespan": "12-14 years",
  "weight": "45-60 lbs",
  "training_difficulty": "Hard (independent)",
  "apartment_suitable": "No (needs large yard)",
  "kids": "Great",
  "other_pets": "Can prey drive on cats"
}
```

---

### 🧮 **Pillar 11: Cost Planning (PREMIUM FEATURE)**
**Depth Level: Financial Advisor**

Salus calculates total cost of pet ownership, breaking down:

#### Monthly Maintenance Cost
- Food: Breed + quality dependent ($20-100/month)
- Treats: $5-20/month
- Toys: $10-20/month

#### Yearly Costs
- Vaccinations: $200-400
- Grooming: $300-1,200 (breed-dependent)
- Heartworm prevention: $100-200
- Dental cleaning: $500-1,000 (if needed)

#### Emergency Fund
- Recommended: 3x annual vet costs ($2,000-5,000)

#### Travel Cost Estimate
- Microchip: $50-100
- Rabies vaccine: $25-50
- Titer test: $100-200
- Health certificates: $100-200
- Airlines fees: $100-500
- Quarantine (if needed): $1,000-5,000

#### Insurance Cost Analysis
- Monthly plan cost: $15-50
- vs. Average emergency: $1,500-5,000

**AI Logic**:
```
If user says: "Can I afford a Golden Retriever in Mumbai?"
AI calculates:
  1. Monthly cost breakdown (food + care)
  2. Yearly vet costs
  3. Emergency fund required
  4. Insurance recommendation
  5. Total 10-year cost: $X,XXX
  
Provides: Clear yes/no/conditional advice
```

---

## 3️⃣ DEVELOPMENT PHASES

### 🚀 **PHASE 1: MVP (Fast Launch — 30-45 Days)**
**Goal**: Launch a functional AI assistant with core features.

**In Scope**:
- ✅ Pet profile creation (name, breed, age, weight)
- ✅ Ask anything Q&A with context awareness
- ✅ Vaccination schedule (breed-specific)
- ✅ Symptom triage (safe guidance only)
- ✅ Breed intelligence database
- ✅ Basic emergency detection
- ✅ Medication toxicity checker

**Data Structure**:
```typescript
interface PetProfile {
  id: string;
  owner_id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  dob: Date;
  weight: number; // kg
  microchip_id?: string;
  neutered_spayed: boolean;
  medical_conditions: string[];
  allergies: string[];
  vaccinations: Vaccination[];
}

interface Vaccination {
  name: string;
  date: Date;
  expiry_date?: Date;
  vet_name: string;
}
```

**Key Features**:
```
🏠 Home Screen
  ├─ 🐶 My Pet (view/edit profile)
  ├─ 💬 Ask Salus (AI chat)
  ├─ 📋 Vaccine Tracker
  ├─ 🆘 Emergency Alert System
  └─ 🔗 Find Services (vets, trainers, groomers)

💬 AI Chat Logic
  ├─ Context aware (knows pet's profile)
  ├─ Emergency keyword detection
  ├─ Safe suggestion (never diagnostic)
  ├─ Breed-specific answers
  └─ "See a vet" always included
```

---

### 🧾 **PHASE 2: Premium Layer (45-90 Days)**
**Goal**: Add documentation & travel planning (differentiation).

**New Features**:
- ✅ Travel planner (country database)
- ✅ Document vault (digital storage)
- ✅ Health certificate generator
- ✅ Microchip number validator
- ✅ Insurance plan comparison
- ✅ Vaccination expiry alerts
- ✅ Health reminder system

**Database Additions**:
```typescript
interface Country {
  name: string;
  rabies_risk_level: 'low' | 'medium' | 'high';
  titer_required: boolean;
  import_permit_required: boolean;
  quarantine_days?: number;
  waiting_period_days: number;
  special_requirements: string[];
}

interface TravelPlan {
  pet_id: string;
  origin_country: string;
  destination_country: string;
  travel_date: Date;
  steps: TravelStep[];
  timeline: Timeline;
  estimated_cost: number;
}

interface TravelStep {
  step_number: number;
  action: string;
  deadline: Date;
  completed: boolean;
  document_required?: string;
}

interface DocumentVault {
  id: string;
  pet_id: string;
  document_type: 'vaccine' | 'microchip' | 'health_cert' | 'insurance' | 'passport';
  file_url: string;
  upload_date: Date;
  expiry_date?: Date;
  is_expired: boolean;
}
```

**New UI Screens**:
```
✈️ Travel Planner
  ├─ Select destination country
  ├─ Auto-generate step-by-step timeline
  ├─ Track progress (check-boxes)
  ├─ Cost calculator
  ├─ Document checklist
  └─ Remind on deadlines

📄 Document Vault
  ├─ Upload certificates
  ├─ Auto-expiry detection
  ├─ Digital storage (cloud)
  ├─ Share with vet/airline
  └─ Backup system

💰 Insurance Hub
  ├─ Compare plans
  ├─ Coverage calculator
  ├─ Claim assistant
  └─ Pre-existing condition checker
```

---

### 🧠 **PHASE 3: AI Risk Intelligence (90-180 Days)**
**Goal**: Predictive health & financial insights.

**Advanced Features**:
- ✅ Health risk scoring (breed + age + climate + weight)
- ✅ Behavior risk prediction (aggression, anxiety likelihood)
- ✅ Financial forecasting (10-year cost estimate)
- ✅ Insurance claim automation
- ✅ Growth tracking (weight chart, milestones)
- ✅ Medication reminder system
- ✅ Health risk trend analysis

**ML Models**:
```
Risk Scoring Model:
  Input: Breed + Age + Weight + Climate + Medical history
  Output: Health risk score (0-100)
  
  Example:
  Siberian Husky, 5 years, 50kg, Mumbai heat
  → Risk Score: 78/100 (HIGH - HEAT INTOLERANCE)
```

---

## 4️⃣ TECHNICAL ARCHITECTURE

### Layer 1: Core AI Engine
```
User Input
    ↓
[LLM - Claude/GPT4] ← Vet-Approved Prompt
    ↓
Safety Checks (Emergency detection, no diagnosis)
    ↓
Context Enrichment (From pet profile)
    ↓
Response Generation
    ↓
Output (With disclaimers)
```

### Layer 2: Structured Knowledge Engine
```
NOT everything should be LLM.

Deterministic Data:
├─ Vaccination schedules (Database lookup)
├─ Travel rules by country (Database lookup)
├─ Toxicity database (Database lookup)
├─ Breed information (Database lookup)
└─ Insurance plans (Database lookup)

LLM Explanation:
├─ Why this recommendation?
├─ How to implement?
├─ Q&A with nuance
└─ Personalized advice
```

### Database Schema (Simplified)
```sql
-- Core tables
CREATE TABLE pets (
  id UUID PRIMARY KEY,
  owner_id UUID,
  name VARCHAR,
  breed VARCHAR,
  dob DATE,
  weight_kg FLOAT,
  species ENUM('dog', 'cat', 'other'),
  created_at TIMESTAMP
);

CREATE TABLE vaccinations (
  id UUID PRIMARY KEY,
  pet_id UUID,
  vaccine_type VARCHAR,
  date_given DATE,
  expiry_date DATE,
  vet_name VARCHAR
);

CREATE TABLE countries (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,
  rabies_risk_level ENUM('low', 'medium', 'high'),
  titer_required BOOLEAN,
  import_permit_required BOOLEAN,
  quarantine_days INT,
  waiting_period_days INT
);

CREATE TABLE breeds (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,
  species ENUM('dog', 'cat'),
  temperament TEXT,
  energy_level ENUM('low', 'medium', 'high'),
  health_risks JSON,
  climate_suitability JSON
);

CREATE TABLE document_vault (
  id UUID PRIMARY KEY,
  pet_id UUID,
  document_type ENUM('vaccine', 'microchip', 'health_cert', 'insurance'),
  file_url VARCHAR,
  upload_date TIMESTAMP,
  expiry_date DATE
);

CREATE TABLE insurance_plans (
  id UUID PRIMARY KEY,
  provider VARCHAR,
  plan_type ENUM('accident-only', 'accident+illness', 'comprehensive'),
  monthly_cost FLOAT,
  waiting_period_days INT,
  annual_limit FLOAT,
  pre_existing_excluded BOOLEAN
);
```

---

## 5️⃣ KEY SUCCESS METRICS

### User Engagement
- Daily active users
- Avg session length
- Questions asked per user (target: 5+ per week)
- Pet profile completion rate

### Content Quality
- Emergency detection accuracy
- User satisfaction with answers
- Vet validation score
- Safety incident rate (zero target)

### Business Metrics
- Free → Premium conversion rate (target: 5-10%)
- Document uploads (travel/insurance)
- Travel plan completions
- Insurance comparison clicks

### Retention
- 30-day retention: 60%+
- 90-day retention: 40%+
- Subscription churn: <5% monthly

---

## 6️⃣ MONETIZATION STRATEGY

### Free Tier
- AI Q&A (all 11 pillars)
- Pet profile
- Basic vaccine reminders
- Emergency detection

### Premium Tier ($4.99/month)
- Travel planner + timeline
- Document vault (unlimited uploads)
- Insurance plan comparison
- Cost forecasting
- Health risk scoring
- Priority emergency consultation

### B2B Tier
- White-label Salus for insurance companies
- Vet clinic integration
- Bulk pet management

---

## 7️⃣ COMPETITIVE MOAT

**Why Salus Wins**:

1. **Holistic** — Not symptom checking, but life management
2. **Localized** — India rules, Indian prices, Indian climate
3. **Travel Expert** — Only platform with country-specific travel AI
4. **Financial** — Cost planning + insurance advisor
5. **Blockchain-Ready** — Integration with medical records (unique)
6. **Mobile-First** — AI that works offline during vet visits

---

## 8️⃣ ROADMAP (Next 12 Months)

```
Month 1-2:   MVP Launch (Phase 1)
Month 3-4:   Travel Planner (Phase 2)
Month 5-6:   Document Vault + Insurance Hub
Month 7-8:   Health Risk Scoring (Phase 3)
Month 9-10:  Behavior Prediction AI
Month 11-12: Blockchain integration + Pet health passport NFT
```

---

## 9️⃣ SUCCESS DEFINITION

✅ **Salus is successful when**:
- 100K+ pet parents use it monthly
- Pet travels are booked through Salus (data + docs)
- Insurance comparison clicks → conversions
- Vets recommend Salus to patients
- Salus is first thing pet parent opens for any question

---

## 🎯 FINAL VISION

**Salus AI = Pet Parent's Most Trusted Advisor**

Not a chatbot.
Not a website.
Not a service marketplace.

**A complete operating system for pet parenting.**

When a pet parent thinks:
- "Is my dog sick?" → Salus
- "Can I travel with my cat?" → Salus
- "What insurance should I buy?" → Salus
- "How do I train my puppy?" → Salus
- "My dog is choking" → Salus
- "What should my dog eat?" → Salus

**Salus is the answer.**

---

**Document Created**: March 1, 2026
**Status**: Vision & Architecture Document
**Next Step**: Technical implementation sprint
