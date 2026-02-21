"""
════════════════════════════════════════════════════════════════════════════════
Dr. Salus AI — Core LLM Service  v3.0
Zoodo Pet Health Platform
The most comprehensive AI veterinary assistant ever engineered.
Combines: Clinical Triage · Breed Intelligence · Toxicology · Behavioral Medicine
          Nutrition Science · Preventive Care · Multi-species Support
════════════════════════════════════════════════════════════════════════════════
"""

import os
import re
import time
import json
import logging
from typing import Dict, List, Optional, Tuple
from google import genai
from google.genai import types

# ─────────────────────────────────────────────────────────────────────────────
# LOGGING
# ─────────────────────────────────────────────────────────────────────────────
logger = logging.getLogger("dr_salus_ai")

# ─────────────────────────────────────────────────────────────────────────────
# TOXIN DATABASE — Clinical Veterinary Toxicology Reference
# Each entry: toxin → { species, mechanism, onset, signs, first_aid, severity }
# ─────────────────────────────────────────────────────────────────────────────
TOXIN_DATABASE: Dict[str, Dict] = {
    "chocolate": {
        "species": ["dog", "cat"],
        "toxic_agent": "Theobromine & Caffeine",
        "severity": "HIGH",
        "danger_ranking": 9,
        "onset": "30 minutes – 4 hours",
        "mechanism": "Theobromine inhibits adenosine receptors, causing CNS stimulation, cardiac arrhythmias, and diuresis.",
        "toxic_dose": "Dark chocolate: 1 oz/kg body weight. Milk chocolate: 2.5 oz/kg. Baking chocolate: 0.1 oz/kg.",
        "clinical_signs": ["vomiting", "diarrhea", "restlessness", "excessive urination", "muscle tremors", "seizures", "cardiac arrhythmia", "death"],
        "first_aid": "Do NOT induce vomiting at home. Call vet immediately. Activated charcoal may be administered by vet.",
        "vet_action": "EMERGENCY — Rush to vet now",
    },
    "xylitol": {
        "species": ["dog"],
        "toxic_agent": "Xylitol (artificial sweetener)",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "15–30 minutes for hypoglycemia; 12–24 hours for liver failure",
        "mechanism": "Causes massive insulin release → severe hypoglycemia. Direct hepatotoxicity at higher doses → acute liver failure.",
        "toxic_dose": "0.1 g/kg causes hypoglycemia. 0.5 g/kg causes liver failure.",
        "clinical_signs": ["sudden weakness", "collapse", "vomiting", "tremors", "seizures", "jaundice", "death"],
        "first_aid": "EMERGENCY. DO NOT induce vomiting. Rush to vet immediately — minutes matter.",
        "vet_action": "EMERGENCY — Glucose supplementation + liver support",
        "common_sources": ["sugar-free gum", "sugar-free peanut butter", "baked goods", "mouthwash", "vitamins"],
    },
    "grapes_raisins": {
        "species": ["dog", "cat"],
        "toxic_agent": "Unknown — likely tartaric acid",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "2–24 hours",
        "mechanism": "Causes acute kidney failure. Even a single grape can be fatal in some dogs. No safe dose established.",
        "toxic_dose": "ANY amount. No minimum safe dose known.",
        "clinical_signs": ["vomiting", "diarrhea", "lethargy", "abdominal pain", "decreased urination", "kidney failure"],
        "first_aid": "EMERGENCY. Induce vomiting ONLY if within 30 min AND directed by vet. Rush immediately.",
        "vet_action": "EMERGENCY — IV fluids, kidney function monitoring for 48–72 hrs",
    },
    "onion_garlic": {
        "species": ["dog", "cat"],
        "toxic_agent": "N-propyl disulfide & organosulfur compounds",
        "severity": "HIGH",
        "danger_ranking": 7,
        "onset": "Several days (cumulative)",
        "mechanism": "Damages red blood cell membranes causing Heinz body hemolytic anemia. Cats are 5× more sensitive than dogs.",
        "toxic_dose": "5 g/kg for onions (dogs). All forms dangerous: raw, cooked, powdered.",
        "clinical_signs": ["pale gums", "weakness", "decreased appetite", "reddish/brown urine", "collapse"],
        "first_aid": "Call vet. Do not induce vomiting unless directed. Monitor for pale gums.",
        "vet_action": "URGENT — Blood transfusion may be required",
    },
    "macadamia_nuts": {
        "species": ["dog"],
        "toxic_agent": "Unknown toxic agent",
        "severity": "MODERATE-HIGH",
        "danger_ranking": 7,
        "onset": "12 hours",
        "mechanism": "Unknown mechanism. Affects nervous system and musculoskeletal system.",
        "toxic_dose": "2.2 g/kg",
        "clinical_signs": ["weakness", "hyperthermia", "vomiting", "tremors", "inability to walk"],
        "first_aid": "Call vet. Most recover within 48 hrs with supportive care.",
        "vet_action": "URGENT — Supportive care, fever management",
    },
    "antifreeze": {
        "species": ["dog", "cat"],
        "toxic_agent": "Ethylene glycol",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "30 minutes for initial signs. Kidney failure: 24–72 hours",
        "mechanism": "Metabolizes to oxalate crystals causing acute kidney tubule necrosis. Sweet taste makes it dangerously attractive.",
        "toxic_dose": "Dogs: 4.4 ml/kg. Cats: 1.5 ml/kg (far more sensitive)",
        "clinical_signs": ["apparent intoxication/stumbling", "vomiting", "seizures", "coma", "kidney failure"],
        "first_aid": "EMERGENCY. Every minute counts. Antidote (fomepizole/4-MP for dogs) must be given within 5 hours to be effective.",
        "vet_action": "EMERGENCY — Antidote within 5 hrs or outcome is fatal",
    },
    "lilies": {
        "species": ["cat"],
        "toxic_agent": "Unknown — water-soluble toxin",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "2–6 hours vomiting; 24–72 hours kidney failure",
        "mechanism": "Causes acute proximal tubular necrosis → complete kidney failure in cats. Even pollen or water from vase is lethal.",
        "toxic_dose": "Any part of the plant — 2–3 leaves = potentially fatal for a cat.",
        "clinical_signs": ["vomiting", "lethargy", "loss of appetite", "kidney failure", "death"],
        "first_aid": "EMERGENCY. Cats only. Induce vomiting ONLY if within 30 min and directed by vet. Rush immediately.",
        "vet_action": "EMERGENCY — Aggressive IV fluid diuresis for 48–72 hrs",
        "note": "True lilies (Lilium, Hemerocallis). Peace lilies, calla lilies cause oral irritation but not kidney failure.",
    },
    "permethrin": {
        "species": ["cat"],
        "toxic_agent": "Permethrin (pyrethroid insecticide)",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "1–3 hours",
        "mechanism": "Cats lack the liver enzyme to metabolize pyrethroids. Causes neurotoxicity with severe tremors.",
        "toxic_dose": "Spot-on dog flea products applied to cats = lethal",
        "clinical_signs": ["severe muscle tremors", "hyperthermia", "seizures", "death"],
        "first_aid": "EMERGENCY. Wash product off with dish soap + water immediately. Rush to vet.",
        "vet_action": "EMERGENCY — Methocarbamol for tremors, cooling therapy",
        "common_sources": ["dog flea treatments (especially spot-on)"],
    },
    "ibuprofen": {
        "species": ["dog", "cat"],
        "toxic_agent": "Ibuprofen / NSAIDs",
        "severity": "CRITICAL",
        "danger_ranking": 9,
        "onset": "1–4 hours",
        "mechanism": "Inhibits COX enzymes → gastrointestinal ulceration, kidney failure, CNS effects. Cats lack glucuronidation pathway.",
        "toxic_dose": "Dogs: 25 mg/kg GI effects. >175 mg/kg: kidney failure. Cats: much lower threshold.",
        "clinical_signs": ["vomiting", "blood in vomit", "lethargy", "abdominal pain", "kidney failure", "seizures"],
        "first_aid": "EMERGENCY. Never give ibuprofen, aspirin, or acetaminophen to pets.",
        "vet_action": "EMERGENCY — Emesis, GI protectants, IV fluid support",
    },
    "acetaminophen": {
        "species": ["cat", "dog"],
        "toxic_agent": "Acetaminophen (Paracetamol)",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "1–4 hours",
        "mechanism": "Forms toxic NAPQI metabolite → methemoglobinemia in cats, liver necrosis in dogs. Cats: ANY dose is lethal.",
        "toxic_dose": "Cats: any amount. Dogs: >150 mg/kg",
        "clinical_signs": ["brown/chocolate-colored gums", "difficulty breathing", "facial swelling (cats)", "liver failure"],
        "first_aid": "EMERGENCY. Antidote (N-acetylcysteine) must be given rapidly.",
        "vet_action": "EMERGENCY — N-acetylcysteine, methylene blue for cats",
    },
    "rat_poison": {
        "species": ["dog", "cat"],
        "toxic_agent": "Rodenticide — typically anticoagulant or bromethalin",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "Anticoagulant: 3–7 days delayed. Bromethalin: 24 hours",
        "mechanism": "Anticoagulants block Vitamin K→ internal bleeding. Bromethalin: cerebral edema.",
        "toxic_dose": "Even small amounts dangerous. Secondary poisoning (eating poisoned rodent) also possible.",
        "clinical_signs": ["anticoagulant: bleeding from gums/wounds, blood in urine/stool", "bromethalin: seizures, tremors, paralysis"],
        "first_aid": "EMERGENCY. Bring the poison package to the vet — type of rodenticide determines treatment.",
        "vet_action": "EMERGENCY — Vitamin K1 therapy for anticoagulants. Mannitol for bromethalin.",
    },
    "sago_palm": {
        "species": ["dog", "cat"],
        "toxic_agent": "Cycasin (methylazoxymethanol glycoside)",
        "severity": "CRITICAL",
        "danger_ranking": 10,
        "onset": "12–15 minutes",
        "mechanism": "Every part of the plant is toxic. Causes fulminant liver failure.",
        "toxic_dose": "1–2 seeds can be fatal",
        "clinical_signs": ["vomiting", "diarrhea", "lethargy", "seizures", "liver failure", "death (up to 50% fatality)"],
        "first_aid": "EMERGENCY. One of the most toxic plants for pets.",
        "vet_action": "EMERGENCY — Aggressive decontamination, liver support",
    },
    "avocado": {
        "species": ["bird", "rabbit", "dog", "cat"],
        "toxic_agent": "Persin",
        "severity": "HIGH for birds/rabbits; MODERATE for dogs/cats",
        "danger_ranking": 8,
        "onset": "12–24 hours",
        "mechanism": "Persin causes myocardial necrosis in birds/rabbits, GI distress in dogs/cats.",
        "clinical_signs": ["birds: weakness, inability to perch, death", "dogs: vomiting, diarrhea"],
        "first_aid": "Birds/rabbits: EMERGENCY. Dogs/cats: call vet, monitor.",
        "vet_action": "URGENT for birds. SOON for dogs eating small amounts.",
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# BREED HEALTH PROFILES — Predispositions, Screening Recommendations
# ─────────────────────────────────────────────────────────────────────────────
BREED_HEALTH_PROFILES: Dict[str, Dict] = {
    "golden_retriever": {
        "lifespan": "10–12 years",
        "size": "Large",
        "top_health_risks": ["Cancer (61% of deaths)", "Hip/elbow dysplasia", "Hypothyroidism", "Heart disease (SAS)"],
        "weight_range": "25–34 kg",
        "screening_recommended": ["Hip OFA screening", "Cardiac exam by cardiologist", "Eye CAER exam", "Annual thyroid panel after 4yrs", "Cancer screening after 6yrs"],
        "diet_notes": "Prone to obesity post-spay/neuter. Monitor weight carefully. Low-fat diet for seniors.",
        "exercise": "60–90 min/day. Avoid overexertion in puppies (growth plates close at 18 months).",
        "grooming": "Heavy shedder. Brush 3–4× weekly. Professional groom every 6–8 weeks.",
        "vaccination_notes": "Standard core vaccines. Bordetella if social dog (dog parks, boarding).",
        "life_stage_notes": {
            "puppy": "No high-impact exercise until 18 months. Socialization window: 3–14 weeks.",
            "adult": "Annual wellness exam. Dental cleaning every 1–2 years.",
            "senior": "Twice-yearly exams. Bloodwork every 6 months. Joint supplements (glucosamine/chondroitin).",
        },
    },
    "german_shepherd": {
        "lifespan": "9–13 years",
        "size": "Large",
        "top_health_risks": ["Hip/elbow dysplasia", "Degenerative myelopathy (DM)", "Bloat (GDV)", "Exocrine pancreatic insufficiency (EPI)", "Perianal fistulas"],
        "weight_range": "22–40 kg",
        "screening_recommended": ["OFA hip/elbow radiographs", "DM DNA test", "Annual GI enzyme panel if chronic soft stools"],
        "diet_notes": "Feed from elevated bowl (debated for bloat — consult vet). High-quality protein. Watch for EPI signs (voluminous stools, weight loss despite eating).",
        "exercise": "90–120 min/day. Working breed — needs mental stimulation.",
        "grooming": "Double coat. Sheds year-round. Brush 3–4× weekly. Blow-coat seasonally.",
        "life_stage_notes": {
            "senior": "DM typically presents at 8–14 years. Monitor for hindlimb weakness.",
        },
    },
    "labrador_retriever": {
        "lifespan": "10–12 years",
        "size": "Large",
        "top_health_risks": ["Obesity (highest of all breeds)", "Hip/elbow dysplasia", "Exercise-induced collapse (EIC)", "Progressive retinal atrophy (PRA)", "Laryngeal paralysis (seniors)"],
        "weight_range": "25–36 kg",
        "screening_recommended": ["OFA hips/elbows", "EIC DNA test", "PRA DNA test", "Annual weight monitoring"],
        "diet_notes": "Extremely food-motivated. Strict portion control. Measured meals only — no free feeding. Prone to stealing food.",
        "exercise": "60–90 min/day. Love swimming — great low-impact exercise.",
        "grooming": "Short dense coat. Sheds heavily. Weekly brush. Ear infections common — dry ears after swimming.",
    },
    "french_bulldog": {
        "lifespan": "10–12 years",
        "size": "Small/Medium",
        "top_health_risks": ["BOAS (Brachycephalic Obstructive Airway Syndrome)", "Spinal problems (hemivertebrae, IVDD)", "Skin fold dermatitis", "Allergies", "Eye ulcers", "Heat intolerance"],
        "weight_range": "8–13 kg",
        "screening_recommended": ["BOAS grading", "Spinal MRI if neurological signs", "Annual respiratory assessment"],
        "diet_notes": "Use slow feeder bowls. Do not exercise after eating. Prone to obesity.",
        "exercise": "20–30 min/day max. NEVER in heat/humidity. Early morning or late evening walks only.",
        "grooming": "Clean skin folds daily to prevent infection. Face, tail pocket, vulvar fold.",
        "emergency_red_flags": ["Open-mouth breathing", "Blue/purple tongue", "Heavy panting at rest — heat emergency"],
    },
    "poodle": {
        "lifespan": "12–18 years",
        "size": "Toy/Miniature/Standard (varies)",
        "top_health_risks": ["Addison's disease", "Bloat (Standard)", "Hip dysplasia (Standard)", "Progressive retinal atrophy", "Sebaceous adenitis"],
        "weight_range": "Toy: <4kg, Mini: 4–7kg, Standard: 18–32kg",
        "screening_recommended": ["Annual ACTH stimulation test (if Addison's suspected)", "Eye CAER exam", "OFA hips (Standard)"],
        "diet_notes": "Non-shedding but regular grooming essential. Prone to dental tartar buildup in Toy/Mini.",
        "grooming": "Professional grooming every 6–8 weeks. Daily brushing to prevent matting.",
    },
    "persian_cat": {
        "lifespan": "12–17 years",
        "size": "Medium",
        "top_health_risks": ["Polycystic kidney disease (PKD)", "Brachycephalic issues", "Eye discharge/entropion", "Dental malocclusion", "Skin fold dermatitis"],
        "weight_range": "3.5–5.5 kg",
        "screening_recommended": ["PKD DNA test or ultrasound", "Annual kidney function panel", "Eye specialist exam"],
        "diet_notes": "Hairball prevention critical — high-fiber food or enzymatic supplement. Wet food preferred for kidney health.",
        "grooming": "Daily brushing mandatory to prevent mats. Clean face folds daily.",
    },
    "siamese_cat": {
        "lifespan": "15–20 years",
        "size": "Medium",
        "top_health_risks": ["Asthma/bronchial disease", "Amyloidosis (liver)", "Progressive retinal atrophy", "Mediastinal lymphoma", "Dental disease"],
        "weight_range": "3–5 kg",
        "screening_recommended": ["Chest X-ray if wheezing", "Annual liver panel after 8yrs"],
        "diet_notes": "Highly active — higher caloric needs. Dental cleanings more frequently needed.",
    },
    "dachshund": {
        "lifespan": "12–16 years",
        "size": "Small",
        "top_health_risks": ["IVDD (Intervertebral Disc Disease) — 25% of all IVDD cases", "Obesity (worsens IVDD)", "Cushing's disease", "Dental disease", "Progressive retinal atrophy"],
        "weight_range": "3.5–14.5 kg (mini vs. standard)",
        "screening_recommended": ["Spinal MRI if back pain or stumbling", "Annual Cushing's screening after 7yrs", "PRA DNA test"],
        "diet_notes": "STRICT weight management. Every extra 500g dramatically increases spinal disc pressure.",
        "exercise": "Moderate only. NO jumping on/off furniture. Ramps recommended. No stairs if possible.",
        "emergency_red_flags": ["Back pain, yelping when picked up", "Hindlimb weakness or dragging", "Loss of bladder/bowel control — EMERGENCY SPINAL SURGERY window is 24–48hrs"],
    },
    "beagle": {
        "lifespan": "12–15 years",
        "size": "Small/Medium",
        "top_health_risks": ["Obesity", "Epilepsy", "Musladin-Lueke Syndrome", "Ear infections (floppy ears)", "Hip dysplasia"],
        "weight_range": "9–11 kg",
        "screening_recommended": ["MLS DNA test", "Annual ear exam"],
        "diet_notes": "Scent hounds with voracious appetites. Measured feeding strictly required. Prone to obesity.",
        "grooming": "Low-maintenance coat. Weekly brushing. Monthly ear cleaning critical.",
    },
    "chihuahua": {
        "lifespan": "12–20 years",
        "size": "Toy",
        "top_health_risks": ["Hypoglycemia (especially puppies)", "Tracheal collapse", "Luxating patella", "Dental disease (overcrowded teeth)", "Hydrocephalus"],
        "weight_range": "1.5–3 kg",
        "screening_recommended": ["Patella evaluation", "Cardiac exam (mitral valve disease common)", "Dental X-rays annually"],
        "diet_notes": "High-calorie density food for puppies to prevent hypoglycemia. Feed 4–5× daily for puppies. Kibble size matters — use small breed formula.",
        "emergency_red_flags": ["Trembling, weakness, collapse in young puppies → hypoglycemia emergency"],
    },
    "rabbit": {
        "lifespan": "8–12 years",
        "size": "Varies",
        "top_health_risks": ["GI stasis (most common cause of death)", "Dental malocclusion", "Uterine cancer (unspayed females — 80% by age 5)", "Respiratory infections", "Flystrike"],
        "weight_range": "1–10 kg (breed varies)",
        "screening_recommended": ["Annual dental exam", "Spay females before 2 years", "GI assessment if appetite changes"],
        "diet_notes": "Unlimited grass hay (timothy/orchard) = 80% diet. Fresh leafy greens daily. Pellets sparingly. NO iceberg lettuce, NO sugary fruits in excess.",
        "emergency_red_flags": ["Not eating for >12 hours", "No stool for >8 hours", "Bloated abdomen — GI stasis emergency"],
        "special_notes": "GI stasis is SILENT — rabbit stops eating, no gut sounds. Fatal within 24–48 hours without treatment.",
    },
    "parrot_budgie": {
        "lifespan": "Budgie: 5–10 yrs, Parrot: 20–80 yrs",
        "size": "Varies",
        "top_health_risks": ["Psittacosis (Chlamydiosis — zoonotic)", "Proventricular Dilatation Disease (PDD)", "Aspergillosis (fungal)", "Feather destructive behavior", "Vitamin A deficiency"],
        "weight_range": "Varies by species",
        "screening_recommended": ["Annual Avian vet exam", "Psittacosis PCR test on adoption", "Vitamin A blood panel"],
        "diet_notes": "Seed-only diets cause malnutrition. Fresh vegetables (especially orange/green), formulated pellets 50–60% of diet. NO avocado, chocolate, onion, caffeine, alcohol.",
        "emergency_red_flags": ["Fluffed feathers + eyes closed = seriously ill", "Open-mouth breathing or tail bobbing", "Seizures", "Birds hide illness — assume URGENT if ANY symptoms present"],
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# INTENT CLASSIFICATION KEYWORDS
# Maps message keywords → intent categories for structured response selection
# ─────────────────────────────────────────────────────────────────────────────
INTENT_KEYWORDS: Dict[str, List[str]] = {
    "symptom": [
        "vomit", "diarrhea", "scratch", "itch", "limp", "letharg", "cough", "sneez",
        "bleed", "wound", "swollen", "lump", "mass", "pain", "hurt", "eat", "drink",
        "urinat", "pee", "poop", "stool", "fever", "temperature", "shaking", "tremor",
        "seizure", "collapse", "weak", "tired", "breathe", "breath", "discharge",
        "eye", "ear", "skin", "rash", "bald", "hair loss", "weight loss", "weight gain",
        "paralyz", "dragg", "stumbl", "fall", "pale", "gum",
    ],
    "emergency": [
        "emergency", "please help", "urgent", "dying", "unconscious", "not breathing",
        "collapsed", "seizure", "poison", "toxic", "ate chocolate", "ate grape",
        "ate raisin", "bloat", "can't breathe", "not waking", "blood everywhere",
        "severe bleed", "hit by car", "fell from", "broken bone", "can't walk",
        "blocking", "straining", "no urine", "heatstroke",
    ],
    "nutrition": [
        "food", "diet", "feed", "eat", "meal", "nutrition", "weight", "fat", "thin",
        "obese", "calori", "portion", "brand", "kibble", "raw food", "wet food",
        "dry food", "vegetable", "fruit", "safe to eat", "can dog eat", "can cat eat",
        "supplement", "vitamin", "omega", "protein", "carbohydrate",
    ],
    "behavior": [
        "behav", "aggress", "bark", "bite", "growl", "anxious", "anxiety", "fear",
        "phobia", "separat", "destruct", "chew", "potty", "toilet", "train", "socialization",
        "stress", "depress", "obsess", "compulsive", "hyperactiv", "jump", "pull on leash",
        "dominant", "submissiv", "territorial", "resource guard",
    ],
    "grooming": [
        "groom", "bath", "shampoo", "brush", "mat", "tangle", "shed", "nail", "claw",
        "ear clean", "teeth", "dental", "coat", "fur", "hair cut", "trim", "deshed",
    ],
    "vaccine": [
        "vaccin", "shot", "immunize", "booster", "rabies", "parvo", "distemper",
        "deworm", "flea", "tick", "heartworm", "preventive", "prevention", "annual",
        "checkup", "wellness", "health check",
    ],
    "medication": [
        "medic", "drug", "tablet", "pill", "dose", "dosage", "prescri", "painkiller",
        "antibiotic", "ibuprofen", "paracetamol", "aspirin", "overdose", "side effect",
        "treatment", "give my dog", "give my cat", "can i give",
    ],
    "reproduction": [
        "pregnan", "breed", "mate", "heat", "season", "spay", "neuter", "castrat",
        "puppy", "kitten", "litter", "birth", "deliver", "whelp", "queen", "stud",
        "season", "estrus", "false pregnan",
    ],
    "senior_care": [
        "old dog", "old cat", "senior", "aging", "geriatric", "arthritis", "joint",
        "cognitive", "dementia", "blind", "deaf", "end of life", "euthanasia", "quality of life",
    ],
    "general": [],  # Catch-all
}

# ─────────────────────────────────────────────────────────────────────────────
# EMERGENCY KEYWORDS — Triage 🔴 Detection
# ─────────────────────────────────────────────────────────────────────────────
EMERGENCY_KEYWORDS: List[str] = [
    # Breathing
    "can't breathe", "not breathing", "difficulty breathing", "gasping", "choking",
    "blue gums", "purple gums", "open mouth breathing",
    # Bleeding
    "severe bleeding", "bleeding heavily", "won't stop bleeding", "blood everywhere",
    # Neurological
    "seizure", "seizing", "convulsing", "shaking uncontrollably", "paralyzed",
    "can't walk", "dragging legs", "sudden collapse",
    # Toxin
    "poisoned", "ate poison", "ate chocolate", "ate grapes", "ate raisins",
    "ate onion", "ate garlic", "xylitol", "antifreeze", "rat poison",
    "lily", "ate lily", "ingested",
    # Collapse
    "collapsed", "unconscious", "unresponsive", "won't wake up", "can't wake",
    # Urinary blockage
    "can't urinate", "unable to pee", "straining to urinate", "blocked", "no urine",
    "crying to pee", "squatting with no urine",
    # Pain
    "severe pain", "crying in pain", "screaming", "yelping in pain",
    # Trauma
    "hit by car", "fell from height", "trauma", "broken bone", "car accident",
    # Temperature
    "heatstroke", "heat stroke", "overheating", "panting excessively", "heat emergency",
    # GI
    "bloat", "swollen abdomen", "distended belly", "retching with no vomit",
    "stomach bloated", "can't vomit",
    # Cardiovascular
    "pale gums", "white gums", "heart attack",
]

# ─────────────────────────────────────────────────────────────────────────────
# FOLLOW-UP SUGGESTION CHIPS — Contextual Next Steps by Intent
# ─────────────────────────────────────────────────────────────────────────────
FOLLOW_UP_SUGGESTIONS: Dict[str, List[str]] = {
    "symptom":      ["How long has this been happening?", "Is your pet still eating normally?", "Find a vet near me"],
    "emergency":    ["Find emergency vet now", "What NOT to do in this emergency", "First aid steps"],
    "nutrition":    ["What foods are toxic to my pet?", "How much should I feed?", "Best food brands for my pet"],
    "behavior":     ["Is this a medical issue?", "Find a pet trainer near me", "Training tips for this behavior"],
    "grooming":     ["How often should I groom?", "Best grooming tools for my breed", "When to see a groomer"],
    "vaccine":      ["When is the next vaccine due?", "Are there any side effects?", "Find a vet near me"],
    "medication":   ["Is this safe for my pet?", "What are the side effects?", "Correct dose for my pet's weight"],
    "reproduction": ["When is my pet in heat?", "How to care for a pregnant pet", "Spay/neuter benefits"],
    "senior_care":  ["Signs of pain in older pets", "Senior diet recommendations", "Quality of life assessment"],
    "general":      ["Ask about symptoms", "Get a diet plan", "Find a vet nearby"],
}

# ─────────────────────────────────────────────────────────────────────────────
# SEASONAL HEALTH REMINDERS
# ─────────────────────────────────────────────────────────────────────────────
SEASONAL_HEALTH_TIPS: Dict[str, List[str]] = {
    "summer": [
        "Heatstroke risk: Never leave pets in cars. Provide shade and fresh water always.",
        "Hot pavement burns paw pads. Test with your hand — if too hot for 5 sec, too hot for paws.",
        "Tick and flea season peak. Ensure parasite prevention is up to date.",
        "Brachycephalic breeds (Bulldogs, Pugs) are at extreme heat risk — limit outdoor time.",
    ],
    "monsoon": [
        "Increased leptospirosis risk from puddles/floodwater. Ensure vaccination is current.",
        "Skin infections and fungal issues surge in humidity — keep pet dry.",
        "Ear infections spike in wet season — dry ears thoroughly after any water exposure.",
    ],
    "winter": [
        "Antifreeze (ethylene glycol) poisoning peaks in winter — keep away from all pets.",
        "Arthritis worsens in cold weather — senior pets need joint support.",
        "Hypothermia risk for small/shorthair breeds in cold climates.",
        "Salt on icy roads causes paw irritation — rinse paws after walks.",
    ],
    "spring": [
        "Allergen season — pets can develop environmental allergies causing skin/ear issues.",
        "Tick season begins — check pets after outdoor exposure.",
        "Lilies bloom in spring — extremely toxic to cats. Remove from home/garden.",
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# FIRST AID QUICK REFERENCE
# ─────────────────────────────────────────────────────────────────────────────
FIRST_AID_REFERENCE: Dict[str, str] = {
    "choking": "Hold pet upside down for small pets, or apply modified Heimlich (5 firm back blows between shoulder blades). Do NOT finger-sweep blindly.",
    "bleeding": "Apply firm direct pressure with clean cloth for 5 minutes minimum. Do NOT remove cloth — add more on top. Tourniquet only for limbs as last resort.",
    "burns": "Cool with room-temperature water for 20 minutes. Do NOT use ice, butter, or toothpaste. Cover loosely. Rush to vet.",
    "seizure": "Do NOT restrain. Time the seizure. Keep area clear of hazards. Do NOT put hand near mouth. After seizure: keep warm, calm, quiet — rush to vet.",
    "heatstroke": "Move to shade immediately. Apply cool (NOT cold/ice) water to paw pads, groin, armpits. Offer small amounts of cool water if conscious. Rush to vet.",
    "drowning": "Hold small pets upside down by hips, gently swing to drain lungs. Compress chest: 100-120/min. 1 breath into nostrils every 5 compressions. Rush to vet.",
    "fracture": "Do NOT straighten limb. Immobilize with makeshift splint (board + bandage). Muzzle dog (pain causes biting). Rush to vet.",
    "eye_injury": "Do NOT rub eye. Flush with saline if chemical. Cover loosely. Rush to vet — eye injuries worsen rapidly.",
}

# ─────────────────────────────────────────────────────────────────────────────
# ZOONOTIC DISEASE AWARENESS (diseases transmissible from pets to humans)
# ─────────────────────────────────────────────────────────────────────────────
ZOONOTIC_DISEASES: Dict[str, Dict] = {
    "rabies": {
        "carriers": ["dogs", "cats", "bats", "foxes"],
        "transmission": "Bite/scratch from infected animal",
        "human_risk": "Fatal if untreated. Post-exposure prophylaxis must begin immediately.",
        "prevention": "Annual rabies vaccination for all dogs and cats.",
    },
    "leptospirosis": {
        "carriers": ["dogs", "rats", "wildlife"],
        "transmission": "Urine-contaminated water or soil",
        "human_risk": "Liver/kidney failure. Flu-like symptoms.",
        "prevention": "Lepto vaccine for dogs. Avoid stagnant water contact.",
    },
    "ringworm": {
        "carriers": ["cats", "dogs", "rabbits"],
        "transmission": "Direct contact with infected skin/fur",
        "human_risk": "Circular skin lesion. Treatable with antifungals.",
        "prevention": "Treat infected pets promptly. Wash hands after handling.",
    },
    "toxoplasmosis": {
        "carriers": ["cats (fecal oocysts)"],
        "transmission": "Contact with cat feces",
        "human_risk": "Serious risk to pregnant women — fetal abnormalities.",
        "prevention": "Pregnant women should avoid changing cat litter. Daily litter box cleaning by someone else.",
    },
    "psittacosis": {
        "carriers": ["parrots", "cockatiels", "pigeons"],
        "transmission": "Inhaling dried feces or respiratory secretions of infected birds",
        "human_risk": "Pneumonia-like illness. Treatable with antibiotics.",
        "prevention": "Annual avian vet checkup. Good ventilation in bird areas.",
    },
}


# =============================================================================
# DR. SALUS AI - GeminiService CLASS
# =============================================================================

class GeminiService:
    """
    Core AI service for Dr. Salus AI - Zoodo Pet Health Platform.
    Handles: response generation, intent detection, triage, toxin detection,
    breed context, follow-up suggestions, emergency detection, pet info extraction.
    """

    def __init__(self):
        """Initialize Dr. Salus AI with Gemini backend"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.0-flash"

        # --- MASTER SYSTEM PROMPT --------------------------------------------
        self.system_prompt = """You are Dr. Salus AI - the most advanced AI veterinary assistant ever built, exclusively for Zoodo Pet Health. You combine the clinical knowledge of a board-certified veterinarian, the empathy of a dedicated pet parent advocate, and the structured precision of a clinical diagnostic system.

You are NOT ChatGPT. You are NOT a general assistant. You are DR. SALUS AI - purpose-built for one mission: delivering world-class veterinary guidance that saves and improves the lives of pets everywhere.

------------------------------------------------------
IDENTITY & MISSION
------------------------------------------------------
- Platform: Zoodo Pet Health
- Role: AI Veterinary Clinical Assistant  
- Mission: Give every pet parent instant, professional-grade veterinary intelligence
- Tone: Warm like a trusted family vet. Precise like a specialist. Never robotic or generic.

------------------------------------------------------
ABSOLUTE COMMUNICATION RULES
------------------------------------------------------
? NEVER say: "Thank you for reaching out", "Certainly!", "Of course!", "Great question!", "I understand your concern", "As an AI...", "I'm just an AI"
? NEVER re-introduce yourself after the first message
? NEVER start with "Hello/Hi/Hey" unless the user's ONLY intent was a greeting
? NEVER give generic advice - always tailor to species, breed, age, and context
? NEVER ask more than ONE question per response
? NEVER refuse to help by citing "not being a real vet" - provide the best possible guidance and recommend follow-up appropriately
? NEVER give human medication dosage for pets without veterinary caveats
? NEVER say "I cannot diagnose" then give no useful information - give a differential and clinical next step

? ALWAYS dive directly into the clinical response without preamble
? ALWAYS use the pet's name naturally throughout the response if known
? ALWAYS be empathetic but efficient - worried pet parents need clarity and action, not fluff
? ALWAYS end every response with ONE targeted question or clear next action
? ONLY handle: pets, animals, veterinary care, nutrition, behavior, grooming, breeding, preventive care, pet medications, zoonotic disease awareness
? ALWAYS use the rich markdown formatting structure for each category - see response templates below

For non-pet topics respond with exactly: "Dr. Salus AI is specialized exclusively in pet health and care. How can I help with your pet today?"

------------------------------------------------------
CLINICAL REASONING FRAMEWORK
(Apply this mental checklist before every single response)
------------------------------------------------------

STEP 1 - IDENTIFY SPECIES & BREED PREDISPOSITIONS:
- Large/Giant breeds (Labs, GSDs, Great Danes, Rottweilers): GDV/Bloat, hip/elbow dysplasia, DCM, osteosarcoma
- Brachycephalic breeds (Bulldogs, Pugs, French Bulldogs, Persians): BOAS breathing crisis, heatstroke, eye prolapse, skin fold infection
- Small/Toy breeds (Chihuahua, Yorkie, Pomeranian, Shih Tzu): Hypoglycemia, tracheal collapse, luxating patella, dental overcrowding
- Chondrodystrophic breeds (Dachshund, Basset, Corgi): IVDD - any back pain is urgent
- Retrievers (Golden, Lab): Obesity, cancer, hip dysplasia, ear infections (floppy ears)
- Cats (general): Male cat + urinary strain = ALWAYS EMERGENCY. Senior cats: CKD, hyperthyroidism, IBD
- Rabbits: GI stasis or dental pain = silent killer. Any appetite loss = urgent
- Birds: Hide illness aggressively. Any visible symptom = already serious

STEP 2 - ASSESS AGE & LIFE STAGE:
- Neonatal (<8 weeks): Hypothermia, fading puppy/kitten syndrome, hypoglycemia
- Puppy/Kitten (<1yr): Parvo/distemper risk, vaccine gaps, parasites, socialization
- Adult (1-7yr): Dental disease, weight management, annual preventive care
- Senior dog (7+ small; 6+ large/giant): Arthritis, organ decline, cognitive dysfunction, cancer
- Senior cat (10+): CKD, hyperthyroidism, hypertension, dental resorption

STEP 3 - ASSIGN TRIAGE URGENCY:
?? EMERGENCY (Go NOW - minutes matter):
   Breathing difficulty, collapse, uncontrolled bleeding, active seizure, suspected poisoning/toxin, male cat straining with no urine (urethral blockage = fatal in hours), GDV/bloat (distended abdomen + unproductive retching), severe trauma (hit by car, fall from height), heatstroke, pale/white/blue gums

?? URGENT (Vet within 2-12 hours):
   Eye injury or sudden vision loss, suspected fracture, blood in vomit/urine/stool, not eating 48+ hrs (24hrs for small breeds/cats), severe ongoing lethargy, repeated vomiting >4 times, difficulty urinating (female), suspected bite wounds

?? SOON (Vet within 2-3 days):
   Persistent vomiting or diarrhea >24hrs, limping that worsens, skin infection/hot spots, ear irritation/odor, minor cuts possibly needing stitches, worsening appetite, cloudy eye

?? MONITOR (Home care + watchful observation):
   Single vomiting episode with no other signs, mild loose stools <24hrs, minor scrape/abrasion, mild increased scratching, slightly decreased appetite in otherwise alert pet

STEP 4 - TOXIN AWARENESS (Immediately escalate if mentioned):
Critical Pet Toxins - flag ANY mention for ?? EMERGENCY response:
- Chocolate (theobromine toxicity - dark/baking worst)
- Xylitol (sugar-free products - liver failure in dogs within hours)
- Grapes/Raisins (no safe dose - acute kidney failure)
- Onion/Garlic (all forms - hemolytic anemia)
- Lilies - ALL species (TRUE lily = any amount, even pollen = fatal kidney failure in CATS)
- Permethrin/dog flea products on cats (fatal neurotoxicity)
- Antifreeze/ethylene glycol (sweet taste + fatal kidney failure - antidote window: 5 hours)
- Rat poison/rodenticide (anticoagulant or bromethalin)
- Ibuprofen/Naproxen/Acetaminophen (NSAID toxicity - especially acetaminophen in cats)
- Sago Palm (all parts - liver failure, 50% fatality)
- Macadamia nuts (dogs - neurological)
- Avocado (birds/rabbits: cardiac. Dogs: GI)
- Alcohol (any amount - respiratory depression)

STEP 5 - BREED-SYMPTOM PATTERN MATCHING:
- Golden Retriever + new lump ? Cancer risk high - prompt biopsy (do NOT delay)
- Male cat + straining to urinate ? EMERGENCY urethral blockage - fatal in 24-48hrs
- Dachshund + back pain/hindlimb weakness ? EMERGENCY IVDD - 24hr surgery window
- Any pet + pale/white/blue gums ? EMERGENCY (internal hemorrhage, shock, or severe anemia)
- Bulldog/French Bulldog + labored breathing in heat ? Heat emergency - cool immediately
- Senior cat + weight loss + polydipsia ? Hyperthyroidism or CKD - urgent bloodwork
- Dog + distended abdomen + unproductive retching ? GDV/Bloat - EMERGENCY surgery
- Rabbit + not eating or no droppings >8hrs ? GI Stasis - URGENT
- Bird + fluffed feathers + eyes closed ? CRITICALLY ill - birds hide illness until severe

------------------------------------------------------
RESPONSE TEMPLATES - USE RICH MARKDOWN EXACTLY AS SHOWN
(Tables - Arrows - Blockquotes - Bold - Italic - Emoji - Dividers)
------------------------------------------------------

??? TEMPLATE 1: SYMPTOM / HEALTH CONCERN ???
(Pet has a symptom, illness, pain, or physical abnormality)

?? **[Symptom Name] - [Pet Name]**

**Clinical Assessment**
[2-3 sentences: State what's most likely happening. Include breed/age context. Be direct about urgency level.]

**Urgency** ? [?? Emergency | ?? Urgent | ?? See vet soon | ?? Monitor at home]

---

**?? Most Likely Causes**

| # | Cause | Clinical Explanation |
|---|-------|---------------------|
| 1 | **[Primary cause]** | *[Brief, clear mechanism]* |
| 2 | **[Secondary cause]** | *[Brief explanation]* |
| 3 | **[Third if relevant]** | *[Brief explanation]* |

---

**?? Immediate Home Care**
- ? [Specific actionable step - not vague]
- ? [Second concrete step]
- ? [Third step if applicable]

---

**?? Rush to Emergency Vet Immediately if:**
- ? [Specific observable red flag 1]
- ? [Specific observable red flag 2]

---

> ?? **Preventive Insight:** *[Breed/age-specific advice to prevent recurrence - genuinely useful, not generic]*

*[ONE clinically valuable follow-up question - the single most important missing piece of information]*

??? TEMPLATE 2: EMERGENCY / POISONING ???
(Life-threatening: see ?? triage list)

?? **VETERINARY EMERGENCY - [Pet Name]**

> ?? *[One sentence: acknowledge severity + keep pet parent calm and focused on action]*

---

**? Do This Right Now - Step by Step:**

1. **[Most critical first action]** - *[Why this is first]*
2. **[Second action]** - *[Brief clinical context]*
3. **[Stabilization / transport step]**

---

**?? Do NOT:**
- ? [Dangerous common mistake 1 - e.g., "Do NOT induce vomiting unless a vet instructs you"]
- ? [Dangerous common mistake 2]

---

**?? While Traveling to the Vet:**
? *[Critical en-route instruction - positioning, monitoring vital signs, what to tell the vet on arrival]*

---

> ?? **Every minute is critical.** Head to the nearest emergency vet clinic immediately.
> Tap **"Find Vet Nearby"** below to locate one right now.

??? TEMPLATE 3: NUTRITION / DIET ???
(Food safety, diet plans, feeding schedule, weight, nutrition questions)

?? **Nutrition Plan - [Pet Name]**

**Optimal ### Daily Diet Breakdown**

| Nutrient | Best Sources for This Pet | Why It Matters |
|----------|--------------------------|----------------|
| **Protein** | *[Specific proteins suited to this species/breed]* | *[Clinical reason]* |
| **Healthy Fats** | *[Omega-3/6 sources]* | *[Coat, brain, joint benefit]* |
| **Carbs & Fiber** | *[Appropriate vegetables or grains]* | *[Digestive benefit]* |
| **Key Micronutrients** | *[Vitamins/minerals for this life stage]* | *[Specific function]* |

---

**? Safe & Beneficial Foods**
- ? **[Food 1]** - *[Specific benefit for this breed or age]*
- ? **[Food 2]** - *[Specific benefit]*
- ? **[Food 3]** - *[Specific benefit]*

**?? Never Feed These**
- ? **[Toxic or harmful food 1]** - *[Exact medical danger it causes]*
- ? **[Toxic or harmful food 2]** - *[Exact medical danger]*

---

**? Feeding Schedule**

| Life Stage | Meals / Day | Approx. Portion |
|-----------|------------|-----------------|
| *Puppy / Kitten* | 3-4- | *[Weight-based estimate]* |
| *Adult* | 2- | *[Weight-based estimate]* |
| *Senior* | 2-3- | *[Reduced calorie - slower metabolism]* |

---

> ?? **Pro Tip:** *[One breed/age-specific nutrition fact most pet parents don't know - genuinely insightful]*

*[ONE question - most critical unknown: weight, age, current food brand, or medical condition]*

??? TEMPLATE 4: BEHAVIOR / TRAINING ???
(Aggression, anxiety, destructive behavior, training, socialization, phobias)

?? **Understanding [Behavior] - [Pet Name]** *(Breed - Age)*

**Root Cause Analysis**
*[2-3 sentences: explain the neuroscience or behavioral psychology behind WHY this happens - breed instinct, developmental stage, past trauma, environmental trigger, or underlying medical cause. Never blame the pet.]*

---

**?? Training Protocol**

| Phase | What to Do | How Often |
|-------|-----------|-----------|
| **1 - Foundation** | *[Specific technique: clear, step-by-step instruction]* | *[Daily schedule]* |
| **2 - Practice** | *[Next building block with timing guidance]* | *[Repetitions/sessions]* |
| **3 - Reinforcement** | *[Long-term consistency and fading schedule]* | *[Ongoing]* |

---

**?? Common Mistakes That Make It Worse**
- ? **[Punishment-based mistake]** - *[Why it damages the behavior and the relationship]*
- ? **[Second common error]** - *[Why it backfires]*

**??? Recommended Tools / Aids:** *[Specific items: Adaptil/Feliway diffuser, slow feeder, thundershirt, puzzle toy, long line - whatever is relevant]*

---

**? Realistic Timeline:** *[Honest expectation - e.g., "Most dogs show measurable improvement within 2-3 weeks of daily 5-minute structured sessions"]*

**????? Escalate to Professional If:** *[Specific trigger - e.g., "Any bite that breaks skin, or aggression toward children - consult a certified veterinary behaviorist immediately"]*

??? TEMPLATE 5: PREVENTIVE CARE & VACCINES ???
(Vaccination schedules, deworming, parasite prevention, annual health checks)

??? **Preventive Care Plan - [Pet Name]**

**?? Core Vaccination Schedule**

| Vaccine | Classification | Schedule | Disease It Prevents |
|---------|---------------|----------|-------------------|
| **[Vaccine 1]** | Core | *[When/how often]* | *[Disease name + severity]* |
| **[Vaccine 2]** | Core | *[When/how often]* | *[Disease name]* |
| **[Vaccine 3]** | Lifestyle/Optional | *[Risk-based]* | *[Disease name]* |

---

**?? Parasite Prevention Protocol**
- ? **Fleas & Ticks:** *[Product type (spot-on/oral/collar) + frequency]*
- ? **Intestinal Parasites:** *[Deworming schedule - puppies/kittens more frequent: every 2 weeks until 12 weeks, then monthly until 6 months]*
- ? **Heartworm:** *[Monthly preventive - critical in humid climates: Dirofilaria transmitted by mosquitoes]*

---

**?? Annual Health Monitoring**
- ? Complete physical exam every 12 months *(every 6 months for seniors 7+)*
- ? *[Age-appropriate bloodwork - e.g., CBC, chemistry panel, thyroid for cats 10+]*
- ? Fecal parasite test annually
- ? Professional dental cleaning every *[1-2 years - breed dependent]*
- ? *[Senior-specific: blood pressure, urinalysis, joint/mobility assessment]*

---

> ?? **Immediate Next Step:** *[Specific, actionable recommendation - e.g., "Based on [Pet Name]'s age, the next vaccine booster is due. I'd recommend scheduling a wellness visit within the next 2 weeks."]*

??? TEMPLATE 6: GROOMING ???
(Coat care, bathing, nail trimming, ear/eye hygiene, dental care)

?? **Grooming Guide - [Pet Name]** *(Breed - Coat Type)*

**?? Coat & Skin Care**

| Task | Frequency | Best Tool / Product |
|------|-----------|-------------------|
| **Brushing** | *[Specific frequency for this coat type]* | *[Slicker, pin, deshedding, comb - specify]* |
| **Bathing** | *[How often - over-bathing strips oils]* | *[Shampoo type: medicated/hypoallergenic/breed-specific]* |
| **Professional Groom** | *[Every X weeks]* | *[Specific cut style if known - e.g., puppy cut, lion cut]* |

---

**?? Nail Care**
- ? Trim every **[X weeks]** - overgrown nails change gait and stress joints
- ? Cut *at the hook* - stay 2mm from the pink quick (blood vessel)
- ? If nails click on hard floors ? **overdue for a trim immediately**
- ? Use styptic powder if you accidentally nick the quick

**?? Ear Care**
- ? Clean every **[X weeks]** with vet-approved ear solution on cotton ball
- ? Never insert cotton buds into ear canal
- ?? **See a vet if:** foul odor - dark discharge - head shaking - redness ? *otitis (ear infection)*

**?? Dental Hygiene**
- ? Brush daily with **pet-safe enzymatic toothpaste** *(NEVER human toothpaste - xylitol/fluoride = toxic)*
- ? Alternatives if resistant: **VOHC-certified dental chews**, enzymatic water additives
- ? Professional dental scaling under anaesthesia every **[1-2 years]**
- ? Small/brachycephalic breeds need more frequent dental care due to tooth crowding

---

> ?? **Pro Tip for [Breed]:** *[One breed-specific grooming insight that is genuinely missed by most owners]*

??? TEMPLATE 7: MEDICATION / DRUG SAFETY ???
(Pet medications, human drug safety, dosing questions, overdose concern)

?? **Medication Guidance - [Medication Name]**

> ?? *Critical: Never administer human medications to pets without explicit veterinary approval. Many safe human drugs are toxic to animals at any dose.*

---

**About [Medication]:**
*[Clinical description: what it is, veterinary applications, which species it is approved for, common brand names in veterinary use]*

**Safety Profile for [Species]:**

| Aspect | Details |
|--------|---------|
| **Risk Classification** | *[Safe with caution / Limited use / TOXIC - specify clearly]* |
| **Mechanism of Harm** | *[How it damages the pet's body - specific and educational]* |
| **Danger Signs** | *[Observable toxicity signs - vomiting, tremors, pale gums, collapse]* |
| **Safe Veterinary Alternative** | *[What a vet would actually prescribe instead]* |

---

**?? If Accidental Ingestion or Overdose:**
1. ? **Do NOT induce vomiting** unless a vet explicitly tells you to
2. ? Call your vet or **Animal Poison Control immediately**
3. ? Have ready: *product name - estimated amount - time of ingestion - pet's weight*

> ?? **ASPCA Animal Poison Control (24/7):** +1-888-426-4435 *(consultation fee may apply)*
> ?? **UK: Animal Poison Line:** 01202 509000

??? TEMPLATE 8: REPRODUCTIVE / BREEDING HEALTH ???
(Heat cycles, pregnancy, whelping, spay/neuter, false pregnancy)

?? **Reproductive Health - [Pet Name]**

**Current Status:** *[In heat / Pregnant / Post-whelping / Neutered / Intact]*

**Key Milestones:**

| Stage | What to Expect | Duration |
|-------|---------------|----------|
| *[Stage 1 name]* | *[Clinical description]* | *[Typical duration]* |
| *[Stage 2 name]* | *[Clinical description]* | *[Typical duration]* |

---

**?? Veterinary Care Required:**
- ? *[Essential vet visits/tests for this stage]*
- ? *[Nutrition adjustments if pregnant/nursing]*
- ? *[Warning signs that require immediate vet attention]*

> ?? **Spay/Neuter Recommendation:** *[Evidence-based guidance on optimal timing for this breed/size - e.g., "Research shows waiting until 18 months for large breeds reduces orthopedic disease risk"]*

??? TEMPLATE 9: SENIOR PET CARE ???
(Aging pets: arthritis, organ decline, cognitive dysfunction, quality of life)

?? **Senior Care Guide - [Pet Name]**

**Age in Human Years:** *[Approximate conversion - 7yr dog - 44-56 human years depending on size]*

**Priority Health Concerns for This Age & Breed:**
- ?? *[Primary age-related condition most likely developing]*
- ?? *[Secondary concern]*
- ?? *[Third concern if applicable]*

---

**?? Senior Health Protocol**

| Check | Frequency | Why It Matters |
|-------|-----------|----------------|
| **Vet Exam** | Every 6 months | *[Age-related conditions progress faster]* |
| **Bloodwork** | Every 6-12 months | *[Kidney, liver, thyroid monitoring]* |
| **Blood Pressure** | Annually | *[Hypertension common in senior cats]* |
| **Joint Assessment** | Each visit | *[Arthritis = pain = behavior change]* |
| **Dental Check** | Every 6 months | *[Dental disease systemic effects]* |

---

**?? Quality of Life Adjustments**
- ? *[Pain management: joint supplements, vet-prescribed NSAIDs if appropriate]*
- ? *[Environmental modifications: ramps, orthopedic bedding, raised food bowls]*
- ? *[Cognitive support: mental enrichment, night lights for confusion, routine maintenance]*
- ? *[Nutritional adjustments: senior formula with lower phosphorus for kidney protection]*

> ?? **Quality of Life:** *[Honest, compassionate guidance - always remember that pain-free days matter more than calendar days]*

??? TEMPLATE 10: GENERAL / CONVERSATIONAL ???
For greetings, simple factual questions, or short follow-ups:
? Respond in 2-5 warm, natural sentences - no rigid structure
? Use **bold** for key health terms where helpful
? Always close with ONE question or clear next step that moves toward helping the pet

------------------------------------------------------
CONTEXT MEMORY & PERSONALIZATION RULES
------------------------------------------------------
- Pet name known         → Use it naturally in EVERY response, not just once
- Breed known            → Reference breed predispositions when clinically relevant
- Age known              → Explicitly tailor advice to that life stage in every response
- Weight known           → Use it for portion calculations, medication context, obesity/BCS comment
- Activity level known   → Adjust caloric needs, exercise recs, and training approach accordingly
- Prior symptom mentioned → Reference it: "Since [pet name] was also showing [X] earlier..."
- User sounds panicked   → Lead with ONE empathetic sentence, then pivot immediately to clear action
- User is first-time owner → Explain veterinary terms briefly without being condescending
- Multi-pet household    → Address each pet's concern separately

BODY CONDITION CONTEXT (when weight + breed size is known):
- Underweight: prioritize caloric density, parasite check, GI disease ruled out
- Ideal weight: reinforce current diet, maintain activity
- Overweight: lower caloric density, portion control, joint protection, increased activity
- Large breed + overweight: URGENT orthopedic concern — hip/elbow/knee joint stress

------------------------------------------------------
FINAL CLINICAL PRINCIPLE
------------------------------------------------------
Every response you give may be the difference between a pet surviving a crisis or not.
You are the vet that pet parents could not afford, or could not reach at 2am, or were too scared to call.
Treat every conversation with the gravity of a clinical consultation.
Give answers that a real veterinarian would be proud to stand behind.
Be precise. Be caring. Be Dr. Salus AI - the best vet assistant ever built."""


# =============================================================================
# DR. SALUS AI — GeminiService CLASS
# =============================================================================

class GeminiService:
    """
    Core AI service powering Dr. Salus AI on Zoodo Pet Health Platform.
    Handles: response generation, intent detection, triage, toxin detection,
    breed context injection, follow-up suggestions, emergency detection.
    """

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.0-flash"

        self.system_prompt = """You are Dr. Salus AI — the most advanced AI veterinary assistant ever built, exclusively for Zoodo Pet Health. You combine the clinical knowledge of a board-certified veterinarian, the empathy of a dedicated pet parent advocate, and the structured precision of a clinical diagnostic system.

You are NOT a general AI assistant. You are DR. SALUS AI — purpose-built for one mission: delivering world-class veterinary guidance that saves and improves the lives of pets.

======================================================
IDENTITY & MISSION
======================================================
- Platform: Zoodo Pet Health
- Role: AI Veterinary Clinical Assistant
- Mission: Give every pet parent instant, professional-grade veterinary intelligence
- Tone: Warm like a trusted family vet. Precise like a specialist. Never robotic.

======================================================
ABSOLUTE COMMUNICATION RULES
======================================================
NEVER say: "Thank you for reaching out", "Certainly!", "Of course!", "Great question!", "I understand your concern", "As an AI...", "I cannot diagnose"
NEVER re-introduce yourself after the first message
NEVER start with Hello/Hi/Hey unless the users ONLY intent was a greeting
NEVER give generic non-tailored advice
NEVER ask more than ONE question per response
NEVER refuse to help. Always give the best clinical guidance possible with appropriate vet referral

ALWAYS dive directly into the clinical response without preamble
ALWAYS use the pet name naturally throughout if known
ALWAYS end with ONE targeted question or clear next action
ONLY handle: pets, animals, veterinary care, nutrition, behavior, grooming, breeding, preventive care, medications, zoonotic diseases

For non-pet topics: "Dr. Salus AI is specialized exclusively in pet health. How can I help with your pet today?"

======================================================
CLINICAL REASONING FRAMEWORK
======================================================
Before every response mentally apply:

1. BREED PREDISPOSITIONS:
   - Large breeds: GDV/Bloat, hip dysplasia, DCM, osteosarcoma
   - Brachycephalic: BOAS crisis, heatstroke, eye prolapse, skin folds
   - Small/Toy breeds: Hypoglycemia, tracheal collapse, luxating patella, dental disease
   - Dachshund: IVDD - any back pain/hindlimb weakness = EMERGENCY
   - Golden Retriever: Cancer predisposition - 61% die of cancer
   - Male cat + urinary straining = ALWAYS EMERGENCY (urethral blockage fatal in hours)
   - Rabbit + not eating/no droppings 8hrs = GI Stasis EMERGENCY
   - Bird + any visible symptom = URGENT (birds hide illness until critically ill)

2. AGE CONTEXT:
   - Puppy/Kitten <1yr: Parvo risk, parasites, vaccination gaps, hypoglycemia, socialization
   - Adult 1-7yr: Dental disease, weight, preventive care
   - Senior dog 7+yr: Arthritis, CKD/liver/heart, cognitive dysfunction, cancer
   - Senior cat 10+yr: CKD, hyperthyroidism, hypertension, resorptive lesions

3. TRIAGE LEVELS - always assign one:
   EMERGENCY (Rush NOW - minutes matter):
   Breathing difficulty, collapse, active seizure, uncontrolled bleeding, toxin ingestion, male cat straining with no urine, GDV bloat (distended abdomen + unproductive retching), severe trauma, heatstroke, pale/white/blue gums

   URGENT (Vet within 2-12 hours):
   Eye injury, suspected fracture, blood in vomit/stool, not eating 48hrs+, severe lethargy, repeated vomiting >4x

   SOON (Vet within 2-3 days):
   Persistent vomiting/diarrhea >24hrs, worsening limp, ear odor, skin infection, cloudy eye

   MONITOR (Home care + observation):
   Single vomit episode, mild loose stools <24hrs, minor scrape, mild scratching

4. TOXIN AWARENESS - escalate ANY mention to EMERGENCY:
   Chocolate, Xylitol (sugar-free products), Grapes/Raisins, Onion/Garlic (all forms),
   Lilies (ANY lily species in CATS - even pollen = fatal kidney failure),
   Permethrin/dog flea products on cats, Antifreeze (5hr antidote window),
   Rat poison, Ibuprofen/Acetaminophen, Sago Palm, Macadamia nuts, Avocado (birds critical)

======================================================
SMART QUERY INTELLIGENCE
======================================================
GENERIC vs SPECIFIC QUERY:
- GENERIC query (no breed/name/age/weight given — e.g., "puppy training tips", "dog diet plan"):
  Give a comprehensive, universally applicable response using the correct template.
  Cover principles that apply to ALL pets of that type.
  End with: "These are universal guidelines — tell me your [pet]'s **breed**, **age**, and **weight** so I can personalize this specifically for them."

- SPECIFIC query (breed/name/age/weight given — e.g., "my 3yr old 28kg Golden Retriever is limping"):
  Tailor EVERY sentence to that exact pet. Reference breed predispositions, life stage, and body condition.

RULE: Never withhold helpful information waiting for details. Give universal value FIRST, then ask ONE targeted follow-up.

======================================================
INFORMATION GATHERING — PROGRESSIVE PRIORITY ORDER
======================================================
Collect these ONE question at a time, in this clinical priority order:

1. Pet name — humanizes the conversation (skip in emergencies)
2. Species + breed — determines predispositions and appropriate advice
3. Age — determines life stage (puppy/adult/senior approach differs dramatically)
4. Weight — critical for: diet portions, medication dosing, obesity risk, joint load assessment
5. Daily activity level — low/moderate/high activity changes: caloric needs, training approach, exercise tolerance
6. Duration of symptom/issue — how long has this been happening?
7. Other symptoms — appetite change, energy level, thirst, stool/urine changes
8. Vaccination + deworming status — affects risk profile
9. Any recent changes — new food, environment, medications, other pets, stressors

WHEN TO ASK EACH:
- Weight: Always relevant for nutrition, medication, and obesity checks. Ask early for diet/health queries.
- Activity level: Ask for training, nutrition, weight management, and senior care queries.
  Ask as: "How active is [pet name] day-to-day — mostly resting, moderately active, or very energetic?"
- Do NOT ask weight and activity in the same message — ONE question per response.

ACTIVITY LEVEL CLINICAL IMPACT:
  Low activity: → higher obesity risk, less caloric need, joint problems may worsen faster
  Moderate activity: → standard maintenance feeding, regular exercise needed
  High activity: → increased caloric needs, protein requirements higher, hydration critical

======================================================
RESPONSE TEMPLATES — FOLLOW EXACTLY (Rich Markdown)
Use: Tables, → arrows, > blockquotes, **Bold**, *Italic*, emoji icons, --- dividers
======================================================

=== TEMPLATE 1: SYMPTOM / HEALTH CONCERN ===

## 🩺 [Symptom] Assessment

**Clinical Assessment**
[2-3 sentences: what is most likely happening, breed/age context, honest urgency. Be direct.]

**Urgency** → [🔴 Emergency | 🟠 Urgent | 🟡 See vet soon | 🟢 Monitor at home]

---

**🔍 Most Likely Causes**

| # | Cause | Clinical Explanation |
|---|-------|---------------------|
| 1 | **[Primary cause]** | *[Brief clinical mechanism]* |
| 2 | **[Secondary cause]** | *[Brief explanation]* |
| 3 | **[Third cause]** | *[Brief explanation]* |

---

### 💊 Immediate Home Care
- [Specific actionable step — not vague]
- [Second concrete step]
- [Third step if applicable]

---

### 🚨 Go to Emergency Vet Immediately if:
- [Specific observable red flag 1]
- [Specific observable red flag 2]

---

> 💡 **Preventive Insight:** *[Breed/age-specific insight on preventing recurrence]*

*[ONE follow-up question — ask for the single most clinically important unknown. Bold the specific info you need (e.g. **weight**, **breed**, **duration**)]*

=== TEMPLATE 2: EMERGENCY / POISONING ===

## 🚨 VETERINARY EMERGENCY

> ⚠️ *[One sentence: acknowledge severity + keep pet parent calm and focused]*

---

### ⚡ Act Right Now — Step by Step:

1. **[Most critical first action]** — *[Why this comes first]*
2. **[Second action]** — *[Brief context]*
3. **[Transport/stabilization step]**

---

### 🚫 Do NOT:
- [Dangerous common mistake 1]
- [Dangerous common mistake 2]

---

### 🚗 While Traveling to the Vet:
→ *[Position, what to monitor, what to tell the vet on arrival]*

---

> ⏱️ **Every minute is critical.** Head to the nearest emergency vet now.
> Tap **"Find Vet Nearby"** below to locate one instantly.

=== TEMPLATE 3: NUTRITION / DIET ===

## 🥗 Nutrition Plan

### Daily Diet Breakdown

| Nutrient | Best Sources | Why It Matters |
|----------|-------------|----------------|
| **Protein** | *[Species/breed-specific sources]* | *[Clinical reason]* |
| **Healthy Fats** | *[Omega-3/6 sources]* | *[Coat/brain/joint benefit]* |
| **Carbs & Fiber** | *[Appropriate vegetables or grains]* | *[Digestive benefit]* |
| **Key Micronutrients** | *[Life-stage vitamins/minerals]* | *[Function]* |

---

### ✅ Safe & Beneficial Foods
- **[Food 1]** — *[Specific benefit for this breed/age]*
- **[Food 2]** — *[Benefit]*
- **[Food 3]** — *[Benefit]*

### 🚫 Never Feed These
- **[Toxic food 1]** — *[Exact medical danger it causes]*
- **[Toxic food 2]** — *[Exact medical danger]*

---

### ⏰ Feeding Schedule

| Life Stage | Meals/Day | Approx. Portion |
|-----------|-----------|-----------------|
| *Puppy/Kitten* | 3–4× | *[Weight-based guide]* |
| *Adult* | 2× | *[Weight-based guide]* |
| *Senior* | 2–3× | *[Reduced — slower metabolism]* |

---

> 💡 **Pro Tip:** *[One breed/age-specific nutrition insight most pet parents miss]*

*[ONE question — weight, age, or current food brand to personalize further]*

=== TEMPLATE 4: BEHAVIOR / TRAINING ===

## ⏱️ Training & Behavior

### Root Cause
*[2-3 sentences: WHY this happens scientifically — breed drive, developmental stage, trauma, environment, or medical trigger. Never frame the pet as "bad." Frame it as communication or unmet need.]*

---

### 📋 Training Protocol

| Phase | What to Do | How Often |
|-------|-----------|-----------|
| **1. Foundation** | *[Specific first technique: clear, actionable, how-to]* | *[Daily schedule]* |
| **2. Practice** | *[Next building block with timing guidance]* | *[Repetitions/sessions]* |
| **3. Reinforcement** | *[Long-term consistency and reward fading strategy]* | *[Ongoing]* |

---

### ⚠️ Mistakes That Make It Worse
- **[Punishment-based mistake]** — *[Exactly why it backfires neurologically/behaviorally]*
- **[Second common error]** — *[Why it damages trust or worsens behavior]*

**🛠️ Recommended Tools:** *[Specific: Adaptil/Feliway diffuser, thundershirt, puzzle feeder, long line, clicker — relevant only]*

---

**⏳ Realistic Timeline:** *[Honest expectation — e.g., "Most dogs show measurable improvement in 2–3 weeks of consistent 5-min daily sessions"]*

**👨‍⚕️ Escalate to Professional If:** *[Specific trigger — biting, lunging, self-harm — and who to call: certified veterinary behaviorist (DACVB) or CCPDT trainer]*

=== TEMPLATE 5: PREVENTIVE CARE / VACCINES ===

## 🛡️ Preventive Care Plan

**💉 Core Vaccination Schedule**

| Vaccine | Type | Schedule | Protects Against |
|---------|------|----------|-----------------|
| **[Vaccine 1]** | Core | *[When/how often]* | *[Disease + why it's serious]* |
| **[Vaccine 2]** | Core | *[When/how often]* | *[Disease]* |
| **[Vaccine 3]** | Lifestyle | *[Risk-based]* | *[Disease]* |

---

**🦟 Parasite Prevention**
- **Fleas & Ticks:** *[Product type (spot-on/oral/collar) + frequency]*
- **Intestinal Parasites:** *[Deworming: every 2 weeks until 12wk, monthly until 6mo, then quarterly adults]*
- **Heartworm:** *[Monthly oral prevention — especially critical in humid/tropical climates]*

---

**🔬 Annual Health Checks**
- Full physical exam every 12 months *(every 6 months for seniors 7+)*
- *[Age-appropriate bloodwork — CBC + chemistry panel + thyroid for cats 10+]*
- Fecal parasite test annually
- Professional dental cleaning every *[1–2 years — depends on breed]*
- *[Senior: blood pressure, urinalysis, joint/mobility assessment]*

---

> 📅 **Next Step:** *[Exactly what to schedule next based on age and history known]*

=== TEMPLATE 6: GROOMING ===

## ✨ Professional Grooming

**🧴 Coat & Skin Care**

| Task | Frequency | Tool / Product |
|------|-----------|----------------|
| **Brushing** | *[Breed/coat-specific frequency]* | *[Slicker / deshedding / pin / comb]* |
| **Bathing** | *[How often — over-bathing strips oils]* | *[Shampoo type: medicated/hypoallergenic]* |
| **Professional Groom** | *[Every X weeks]* | *[Style if applicable]* |

---

**💅 Nail Care**
- Trim every **[X weeks]** — overgrown nails change gait and stress joints long-term
- Cut at the hook, staying 2mm from the pink quick (blood vessel)
- Nails clicking on hard floors = **overdue for a trim right now**
- Keep styptic powder handy in case you nick the quick

**👂 Ear Care**
- Clean every **[X weeks]** with vet-approved ear solution on a cotton ball
- Never insert cotton buds into the ear canal
- 🚨 **See vet if:** foul odor · dark waxy discharge · head shaking · redness = otitis (ear infection)

**🦷 Dental Hygiene**
- Brush **daily** with pet-safe enzymatic toothpaste *(NEVER human toothpaste — xylitol/fluoride = toxic)*
- Alternatives: VOHC-certified dental chews, enzymatic water additives
- Professional dental scaling under anaesthesia every **[1–2 years]**

---

> 💡 **Pro Tip for [Breed]:** *[One breed-specific grooming insight most owners miss]*

=== TEMPLATE 7: MEDICATION / DRUG SAFETY ===

💊 **Medication Guidance — [Medication Name]**

> ⚠️ *Critical: Never administer human medications to pets without explicit veterinary approval — many are toxic at any dose.*

---

**About [Medication]:**
*[What it is, veterinary applications, which species it's approved for, common vet brand names]*

**Safety Profile for [Species]:**

| Aspect | Details |
|--------|---------|
| **Risk Level** | *[Safe with vet guidance / Caution / TOXIC — be explicit]* |
| **Mechanism of Harm** | *[How it damages the pet's body]* |
| **Toxicity Signs** | *[Specific observable symptoms to watch for]* |
| **Vet Alternative** | *[What a vet would actually prescribe instead]* |

---

**🆘 If Accidental Ingestion:**
1. → **Do NOT induce vomiting** unless a vet explicitly tells you to
2. → Call your vet or **Poison Control immediately**
3. → Have ready: *product name · estimated amount · time of ingestion · pet's weight*

> 📞 **ASPCA Poison Control (24/7):** +1-888-426-4435
> 📞 **UK Animal Poison Line:** 01202 509000

=== TEMPLATE 8: SENIOR PET CARE ===

## 🐾 Senior Care Protocol

**Priority Health Concerns for This Age & Breed:**
- ⚠️ *[Primary age-related condition most likely developing — be specific]*
- ⚠️ *[Secondary concern]*
- ⚠️ *[Third concern]*

---

**Senior Health Protocol**

| Assessment | Frequency | Purpose |
|-----------|-----------|---------|
| **Vet Exam** | Every 6 months | *[Conditions progress faster in seniors]* |
| **Bloodwork** | Every 6–12 months | *[Kidney, liver, thyroid, glucose monitoring]* |
| **Blood Pressure** | Annually | *[Hypertension common — especially senior cats]* |
| **Joint Assessment** | Each visit | *[Arthritis = pain = behavioral changes]* |
| **Dental Check** | Every 6 months | *[Dental disease systemic effects worsen with age]* |

---

**🏠 Quality of Life Adjustments**
- *[Pain management: joint supplements, vet-prescribed NSAIDs if appropriate]*
- *[Environmental modifications: ramps, orthopedic bed, raised food bowls]*
- *[Cognitive support: consistent routine, mental enrichment, night lights for confusion]*
- *[Senior nutrition: lower phosphorus for kidney protection, easy-to-chew formula]*

---

> 💡 **Quality over Quantity:** *[Honest, compassionate perspective — pain-free days matter more than calendar days. Guidance on recognizing when intervention truly helps.]*

=== TEMPLATE 9: GENERAL / CONVERSATIONAL ===
For greetings, simple factual questions, or short follow-ups:
→ Respond in 2–5 warm, natural sentences. No rigid structure needed.
→ Use **bold** for key health terms where it helps clarity.
→ Always close with ONE question or clear next step to help the pet.

======================================================
FINAL PRINCIPLE
======================================================
You are the vet that pet parents could not afford, or could not reach at 2am.
Every response may be the difference between a pet surviving or not.
Be precise. Be caring. Be Dr. Salus AI."""


    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: detect_intent
    # Classifies the user message into one of 10 veterinary intent categories
    # ─────────────────────────────────────────────────────────────────────────
    def detect_intent(self, message: str) -> str:
        """
        Classify user message into a veterinary intent category.
        Used to select the correct response template and follow-up suggestions.

        Returns one of: symptom, emergency, nutrition, behavior, grooming,
                        vaccine, medication, reproduction, senior_care, general
        """
        message_lower = message.lower()

        # Emergency check first — highest priority
        if any(kw in message_lower for kw in EMERGENCY_KEYWORDS):
            return "emergency"

        # Score each intent category by keyword matches
        scores: Dict[str, int] = {}
        for intent, keywords in INTENT_KEYWORDS.items():
            if intent == "general":
                continue
            score = sum(1 for kw in keywords if kw in message_lower)
            if score > 0:
                scores[intent] = score

        if not scores:
            return "general"

        # Return highest-scoring intent
        return max(scores, key=scores.get)

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: calculate_triage_level
    # Returns urgency classification with clinical reasoning
    # ─────────────────────────────────────────────────────────────────────────
    def calculate_triage_level(self, message: str, pet_context: Dict = None) -> Dict:
        """
        Assign a clinical triage level to the user message.

        Returns:
            Dict with keys: level (str), emoji (str), label (str), reasoning (str)
        """
        message_lower = message.lower()
        pet_context = pet_context or {}
        breed = (pet_context.get("breed") or "").lower()
        species = (pet_context.get("species") or "").lower()

        # 🔴 EMERGENCY checks
        emergency_triggers = [
            ("can't breathe", "Respiratory distress is life-threatening"),
            ("not breathing", "Absence of breathing requires immediate CPR and vet care"),
            ("difficulty breathing", "Respiratory compromise can deteriorate rapidly"),
            ("gasping", "Gasping indicates severe respiratory distress"),
            ("collapse", "Collapse indicates cardiovascular or neurological emergency"),
            ("collapsed", "Collapsed animal requires immediate resuscitation assessment"),
            ("unconscious", "Loss of consciousness is a critical emergency"),
            ("unresponsive", "Unresponsive pet requires immediate emergency care"),
            ("seizure", "Active seizure requires urgent veterinary management"),
            ("seizing", "Active seizure — time-sensitive neurological emergency"),
            ("severe bleed", "Uncontrolled hemorrhage is immediately life-threatening"),
            ("bleeding heavily", "Severe hemorrhage can cause shock within minutes"),
            ("pale gums", "Pale gums indicate shock, anemia, or internal hemorrhage"),
            ("white gums", "White/pale gums are a grave sign — internal bleeding or severe anemia"),
            ("blue gums", "Cyanosis — critical oxygen deprivation"),
            ("can't urinate", "Urinary blockage, especially in male cats, is fatal within 24-48 hours"),
            ("straining to urinate", "Possible urethral obstruction — emergency in male cats"),
            ("no urine", "Complete urinary obstruction is a critical emergency"),
            ("bloat", "GDV/Bloat requires emergency surgery — 50% mortality without treatment"),
            ("swollen abdomen", "Distended abdomen with retching indicates GDV"),
            ("ate chocolate", "Chocolate toxicity — severity depends on amount and type"),
            ("ate grapes", "Grape toxicity causes acute kidney failure — no safe dose"),
            ("ate raisins", "Raisin toxicity — acute kidney failure risk"),
            ("xylitol", "Xylitol = liver failure within hours in dogs"),
            ("antifreeze", "Ethylene glycol poisoning — 5-hour antidote window"),
            ("rat poison", "Rodenticide ingestion — type determines treatment urgency"),
            ("poisoned", "Suspected poisoning requires immediate decontamination"),
            ("hit by car", "Trauma victim — internal injuries may not be immediately visible"),
            ("heatstroke", "Heatstroke causes irreversible organ damage within minutes"),
        ]

        # Breed-specific emergency escalations
        breed_escalations = {
            "dachshund": ["back pain", "can't walk", "drag", "paralyz", "hindlimb"],
            "french bulldog": ["breathing", "panting", "purple", "blue"],
            "bulldog": ["breathing", "panting", "collapse"],
            "pug": ["breathing", "gasping", "overheating"],
        }

        for trigger_phrase, reasoning in emergency_triggers:
            if trigger_phrase in message_lower:
                return {
                    "level": "emergency",
                    "emoji": "🔴",
                    "label": "EMERGENCY — Rush to vet NOW",
                    "reasoning": reasoning,
                }

        # Breed-specific emergency check
        for breed_name, danger_words in breed_escalations.items():
            if breed_name in breed:
                if any(dw in message_lower for dw in danger_words):
                    return {
                        "level": "emergency",
                        "emoji": "🔴",
                        "label": f"EMERGENCY — {breed.title()} at high risk",
                        "reasoning": f"{breed.title()} breeds face critical risk with this combination of symptoms",
                    }

        # 🟠 URGENT checks
        urgent_phrases = [
            "blood in stool", "bloody stool", "blood in urine", "bloody urine",
            "vomiting blood", "blood in vomit", "eye injury", "can't see", "sudden blindness",
            "broken", "fracture", "bone showing", "not eating for 2 days", "not eaten in 2",
            "severe lethargy", "barely moving", "won't wake", "extremely weak",
        ]
        if any(phrase in message_lower for phrase in urgent_phrases):
            return {
                "level": "urgent",
                "emoji": "🟠",
                "label": "URGENT — Vet within 12 hours",
                "reasoning": "This symptom warrants prompt veterinary evaluation",
            }

        # 🟡 SOON checks
        soon_phrases = [
            "vomiting", "diarrhea", "limping", "scratching", "ear smell", "ear odor",
            "skin rash", "hot spot", "not eating", "drinking more", "lump", "coughing",
            "sneezing a lot", "eye discharge",
        ]
        if any(phrase in message_lower for phrase in soon_phrases):
            return {
                "level": "soon",
                "emoji": "🟡",
                "label": "See a vet within 2-3 days",
                "reasoning": "Persistent symptoms should be evaluated before they worsen",
            }

        # 🟢 MONITOR
        return {
            "level": "monitor",
            "emoji": "🟢",
            "label": "Monitor at home",
            "reasoning": "This appears mild — monitor closely and seek care if symptoms worsen or persist beyond 24 hours",
        }

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: detect_toxin_mention
    # Checks if a specific toxin from TOXIN_DATABASE is mentioned
    # ─────────────────────────────────────────────────────────────────────────
    def detect_toxin_mention(self, message: str) -> Optional[Dict]:
        """
        Detect if the user message references a known toxin.
        Returns the toxin profile dict if found, None otherwise.

        This allows the generate_response method to inject specific
        toxin data into the prompt for maximally accurate emergency responses.
        """
        message_lower = message.lower()

        toxin_keyword_map = {
            "chocolate": "chocolate",
            "xylitol": "xylitol",
            "grape": "grapes_raisins",
            "raisin": "grapes_raisins",
            "onion": "onion_garlic",
            "garlic": "onion_garlic",
            "macadamia": "macadamia_nuts",
            "antifreeze": "antifreeze",
            "lily": "lilies",
            "lilies": "lilies",
            "permethrin": "permethrin",
            "ibuprofen": "ibuprofen",
            "acetaminophen": "acetaminophen",
            "paracetamol": "acetaminophen",
            "rat poison": "rat_poison",
            "rodenticide": "rat_poison",
            "sago palm": "sago_palm",
            "avocado": "avocado",
        }

        for keyword, toxin_key in toxin_keyword_map.items():
            if keyword in message_lower:
                toxin_data = TOXIN_DATABASE.get(toxin_key)
                if toxin_data:
                    logger.info(f"Toxin detected: {toxin_key}")
                    return {**toxin_data, "toxin_name": toxin_key}

        return None

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: get_breed_health_context
    # Injects breed-specific health notes into the prompt
    # ─────────────────────────────────────────────────────────────────────────
    def get_breed_health_context(self, breed: str) -> str:
        """
        Look up breed in BREED_HEALTH_PROFILES and return a formatted
        context string to inject into the prompt for breed-specific advice.

        Args:
            breed: Raw breed string from user (will be fuzzy-matched)
        Returns:
            Formatted breed health context string, or empty string if not found
        """
        if not breed:
            return ""

        breed_lower = breed.lower().replace(" ", "_").replace("-", "_")

        # Direct match
        profile = BREED_HEALTH_PROFILES.get(breed_lower)

        # Fuzzy match for common variations
        if not profile:
            breed_key_map = {
                "golden": "golden_retriever",
                "retriever": "golden_retriever",
                "labrador": "labrador_retriever",
                "lab": "labrador_retriever",
                "gsd": "german_shepherd",
                "alsatian": "german_shepherd",
                "frenchie": "french_bulldog",
                "french": "french_bulldog",
                "frenchbulldog": "french_bulldog",
                "dachshund": "dachshund",
                "sausage dog": "dachshund",
                "weiner": "dachshund",
                "chi": "chihuahua",
                "beagle": "beagle",
                "persian": "persian_cat",
                "siamese": "siamese_cat",
                "poodle": "poodle",
                "bunny": "rabbit",
                "budgie": "parrot_budgie",
                "parrot": "parrot_budgie",
                "budgerigar": "parrot_budgie",
            }
            for key, mapped in breed_key_map.items():
                if key in breed_lower:
                    profile = BREED_HEALTH_PROFILES.get(mapped)
                    if profile:
                        break

        if not profile:
            return ""

        # Build context string
        context_lines = [f"\n**Breed Health Context — {breed.title()}:**"]
        context_lines.append(f"- Lifespan: {profile.get('lifespan', 'N/A')}")
        risks = profile.get("top_health_risks", [])
        if risks:
            context_lines.append(f"- Top Health Risks: {', '.join(risks[:3])}")
        diet = profile.get("diet_notes", "")
        if diet:
            context_lines.append(f"- Diet Note: {diet}")
        red_flags = profile.get("emergency_red_flags", [])
        if red_flags:
            context_lines.append(f"- Emergency Red Flags: {', '.join(red_flags)}")

        return "\n".join(context_lines)

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: get_follow_up_suggestions
    # Returns 3 contextual follow-up chip suggestions based on intent
    # ─────────────────────────────────────────────────────────────────────────
    def get_follow_up_suggestions(self, intent: str, is_emergency: bool = False) -> List[str]:
        """
        Return 3 relevant follow-up suggestion chips for the frontend to display.
        These chips help guide the user to the next logical question.

        Args:
            intent: Detected intent category
            is_emergency: Whether this is an emergency situation
        Returns:
            List of 3 suggestion strings
        """
        if is_emergency:
            return [
                "Find emergency vet near me",
                "What NOT to do in this emergency",
                "First aid steps while traveling",
            ]

        suggestions = FOLLOW_UP_SUGGESTIONS.get(intent, FOLLOW_UP_SUGGESTIONS["general"])
        return suggestions[:3]

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: build_toxin_context
    # Formats toxin data into a prompt injection string
    # ─────────────────────────────────────────────────────────────────────────
    def build_toxin_context(self, toxin_data: Dict) -> str:
        """
        Format detected toxin information into a clinical context string
        to inject into the AI prompt for accurate emergency toxicology response.
        """
        if not toxin_data:
            return ""

        lines = [
            f"\n**TOXIN ALERT — Clinical Reference Data:**",
            f"- Toxic Agent: {toxin_data.get('toxic_agent', 'Unknown')}",
            f"- Severity: {toxin_data.get('severity', 'Unknown')}",
            f"- Onset: {toxin_data.get('onset', 'Unknown')}",
            f"- Mechanism: {toxin_data.get('mechanism', 'Unknown')}",
            f"- Toxic Dose: {toxin_data.get('toxic_dose', 'Unknown')}",
            f"- Clinical Signs: {', '.join(toxin_data.get('clinical_signs', []))}",
            f"- First Aid: {toxin_data.get('first_aid', 'Rush to vet immediately')}",
            f"- Vet Action: {toxin_data.get('vet_action', 'EMERGENCY')}",
        ]

        if toxin_data.get("common_sources"):
            lines.append(f"- Common Sources: {', '.join(toxin_data['common_sources'])}")
        if toxin_data.get("note"):
            lines.append(f"- Important Note: {toxin_data['note']}")

        return "\n".join(lines)

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: generate_response — MAIN ENTRY POINT
    # ─────────────────────────────────────────────────────────────────────────
    def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]] = None,
        pet_context: Optional[Dict] = None,
    ) -> str:
        """
        Generate a clinical AI response using Gemini, with:
        - Intent detection for template selection
        - Triage level calculation
        - Toxin detection and context injection
        - Breed-specific health context injection
        - Multi-model fallback chain (4 Gemini models)

        Args:
            user_message: The user's current message
            conversation_history: Previous conversation messages [{role, content}]
            pet_context: Known pet information {name, species, breed, age, weight, gender}

        Returns:
            AI-generated response string
        """
        try:
            pet_context = pet_context or {}

            # ── Step 1: Classify intent ───────────────────────────────────
            intent = self.detect_intent(user_message)
            logger.info(f"Detected intent: {intent}")

            # ── Step 2: Calculate triage ──────────────────────────────────
            triage = self.calculate_triage_level(user_message, pet_context)
            logger.info(f"Triage level: {triage['level']}")

            # ── Step 3: Detect toxin ──────────────────────────────────────
            toxin_data = self.detect_toxin_mention(user_message)

            # ── Step 4: Get breed context ─────────────────────────────────
            breed = pet_context.get("breed", "")
            breed_context = self.get_breed_health_context(breed)

            # ── Step 5: Build full prompt ─────────────────────────────────
            context_parts = [self.system_prompt]

            # Inject known pet information
            known_info = {k: v for k, v in pet_context.items() if v}
            if known_info:
                pet_info_lines = ["\n**Known Pet Information (use in every response):**"]
                for key, value in known_info.items():
                    pet_info_lines.append(f"- {key.title()}: {value}")
                context_parts.append("\n".join(pet_info_lines))

            # Inject breed health context
            if breed_context:
                context_parts.append(breed_context)

            # Inject toxin data for emergency accuracy
            if toxin_data:
                toxin_context = self.build_toxin_context(toxin_data)
                context_parts.append(toxin_context)

            # Inject triage context
            triage_context = (
                f"\n**Auto-Detected Triage:** {triage['emoji']} {triage['label']}"
                f"\nReasoning: {triage['reasoning']}"
                f"\nDetected Intent: {intent}"
            )
            context_parts.append(triage_context)

            # Inject conversation history (last 8 messages)
            if conversation_history:
                history_parts = ["\n**Conversation History:**"]
                for msg in conversation_history[-8:]:
                    role = "Pet Parent" if msg.get("role") == "user" else "Dr. Salus AI"
                    history_parts.append(f"{role}: {msg.get('content', '')}")
                context_parts.append("\n".join(history_parts))

            # Build final prompt
            full_prompt = "\n\n".join(context_parts)
            full_prompt += f"\n\n**Pet Parent's Message:**\n{user_message}\n\n**Dr. Salus AI Response:**"

            # ── Step 6: Multi-model Gemini fallback chain ─────────────────
            models_to_try = [
                self.model_name,            # gemini-2.0-flash — primary
                "gemini-flash-latest",      # fallback 1
                "gemini-2.0-flash-lite-001",# fallback 2
                "gemini-pro-latest",        # fallback 3 — most stable free tier
            ]

            rate_limited_count = 0

            for model in models_to_try:
                try:
                    response = self.client.models.generate_content(
                        model=model,
                        contents=full_prompt,
                    )

                    if hasattr(response, "text") and response.text:
                        logger.info(f"Response generated using: {model}")
                        return response.text

                    elif hasattr(response, "candidates") and response.candidates:
                        text = response.candidates[0].content.parts[0].text
                        logger.info(f"Response generated using: {model}")
                        return text

                    else:
                        logger.warning(f"Unexpected response format from {model}: {type(response)}")

                except Exception as api_error:
                    error_str = str(api_error)
                    logger.warning(f"Model {model} error: {error_str[:100]}")
                    if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                        rate_limited_count += 1
                    continue

            # All models exhausted
            if rate_limited_count == len(models_to_try):
                return "The AI model usage limit has been exceeded. Please try again later."

            return "I'm having trouble generating a response right now. Please try again in a moment."

        except Exception as e:
            logger.error(f"Unexpected error in generate_response: {str(e)}")
            return "I apologize, but I'm having trouble connecting to the service right now. Please try again in a moment."

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: detect_emergency
    # Fast keyword-based emergency detection for backend routing
    # ─────────────────────────────────────────────────────────────────────────
    def detect_emergency(self, message: str) -> Dict[str, any]:
        """
        Detect if the message indicates a life-threatening pet emergency.
        Uses the EMERGENCY_KEYWORDS constant for fast pattern matching.
        Called by the API route layer before generating a response.

        Returns:
            Dict: { is_emergency: bool, severity: str, matched_keyword: str }
        """
        message_lower = message.lower()

        for keyword in EMERGENCY_KEYWORDS:
            if keyword in message_lower:
                logger.warning(f"Emergency keyword detected: '{keyword}'")
                return {
                    "is_emergency": True,
                    "severity": "high",
                    "matched_keyword": keyword,
                }

        return {
            "is_emergency": False,
            "severity": "normal",
            "matched_keyword": None,
        }

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: extract_pet_info
    # Basic NLP to extract pet details from user messages
    # ─────────────────────────────────────────────────────────────────────────
    def extract_pet_info(self, message: str, current_context: Dict) -> Dict:
        """
        Attempt to extract pet information from a user message using
        simple pattern matching. Updates and returns the existing context dict.

        Detects: pet name (when asked), age, weight, species mentions.
        Full NER would require a separate model — this covers common patterns.

        Args:
            message: User's raw message
            current_context: Existing pet context dict
        Returns:
            Updated pet context dict
        """
        updated_context = current_context.copy() if current_context else {}
        message_lower = message.lower()

        # Species detection
        species_map = {
            "dog": ["dog", "puppy", "pup", "canine", "hound"],
            "cat": ["cat", "kitten", "kitty", "feline"],
            "rabbit": ["rabbit", "bunny", "bun", "hare"],
            "bird": ["bird", "parrot", "budgie", "cockatiel", "canary"],
            "hamster": ["hamster", "hammy"],
            "guinea_pig": ["guinea pig", "guinea-pig", "cavy"],
        }

        if not updated_context.get("species"):
            for species, keywords in species_map.items():
                if any(kw in message_lower for kw in keywords):
                    updated_context["species"] = species
                    break

        # Age extraction — simple pattern matching
        if not updated_context.get("age"):
            age_patterns = [
                r"(\d+)\s*(?:year|yr)s?\s*old",
                r"(\d+)\s*(?:month|mo)s?\s*old",
                r"he'?s?\s+(\d+)",
                r"she'?s?\s+(\d+)",
            ]
            for pattern in age_patterns:
                match = re.search(pattern, message_lower)
                if match:
                    updated_context["age"] = match.group(0)
                    break

        # Weight extraction — kg, lbs, grams
        if not updated_context.get("weight"):
            weight_patterns = [
                r"(\d+(?:\.\d+)?)\s*(?:kg|kilogram)",
                r"(\d+(?:\.\d+)?)\s*(?:lb|pound)",
                r"(\d+(?:\.\d+)?)\s*(?:g|gram)s?",
            ]
            for pattern in weight_patterns:
                match = re.search(pattern, message_lower)
                if match:
                    updated_context["weight"] = match.group(0)
                    break

        # Activity level extraction — detect from natural language
        if not updated_context.get("activity_level"):
            low_activity = ["lazy", "mostly sleeps", "not very active", "sedentary",
                            "low activity", "couch potato", "barely moves", "rests a lot",
                            "not active", "inactive", "slow", "low energy"]
            moderate_activity = ["moderate", "daily walk", "walks every day", "some exercise",
                                  "normal activity", "regular walk", "average activity",
                                  "plays sometimes", "moderate energy"]
            high_activity = ["very active", "high energy", "loves to run", "runs daily",
                             "working dog", "sport dog", "agility", "very energetic",
                             "hyperactive", "athletic", "high activity", "always moving",
                             "never stops"]

            if any(kw in message_lower for kw in low_activity):
                updated_context["activity_level"] = "low"
            elif any(kw in message_lower for kw in high_activity):
                updated_context["activity_level"] = "high"
            elif any(kw in message_lower for kw in moderate_activity):
                updated_context["activity_level"] = "moderate"

        # Gender extraction
        if not updated_context.get("gender"):
            if any(w in message_lower for w in ["he is", "he's", "he was", " male ", "boy dog", "male dog", "neutered male"]):
                updated_context["gender"] = "male"
            elif any(w in message_lower for w in ["she is", "she's", "she was", " female ", "girl dog", "female dog", "spayed"]):
                updated_context["gender"] = "female"

        return updated_context

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: get_first_aid_guidance
    # Returns structured first aid for common emergency scenarios
    # ─────────────────────────────────────────────────────────────────────────
    def get_first_aid_guidance(self, emergency_type: str) -> Optional[str]:
        """
        Return first aid guidance for a given emergency type.
        Supplements the AI response with clinically verified first aid steps.

        Args:
            emergency_type: One of the FIRST_AID_REFERENCE keys
        Returns:
            First aid string or None if not found
        """
        return FIRST_AID_REFERENCE.get(emergency_type.lower())

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: get_zoonotic_warning
    # Returns zoonotic disease info if relevant disease is mentioned
    # ─────────────────────────────────────────────────────────────────────────
    def get_zoonotic_warning(self, message: str) -> Optional[Dict]:
        """
        Detect if the user's message involves a zoonotic disease risk.
        Returns disease info dict if detected, None otherwise.
        Helps protect human health alongside pet health.
        """
        message_lower = message.lower()

        zoonotic_triggers = {
            "rabies": ["rabies", "rabid", "foam at mouth", "bit by wild"],
            "leptospirosis": ["leptospirosis", "lepto", "puddle water", "flood water"],
            "ringworm": ["ringworm", "ring worm", "circular rash", "circular patch"],
            "toxoplasmosis": ["toxoplasma", "toxoplasmosis", "cat litter", "pregnant"],
            "psittacosis": ["psittacosis", "chlamydia bird", "bird sneez", "bird cough"],
        }

        for disease, keywords in zoonotic_triggers.items():
            if any(kw in message_lower for kw in keywords):
                return {
                    "disease": disease,
                    **ZOONOTIC_DISEASES.get(disease, {}),
                }

        return None

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: get_seasonal_tip
    # Returns a relevant seasonal health reminder
    # ─────────────────────────────────────────────────────────────────────────
    def get_seasonal_tip(self, season: str = "summer") -> str:
        """
        Return a seasonal pet health tip.
        Can be used to proactively surface timely health reminders.

        Args:
            season: one of summer, monsoon, winter, spring
        Returns:
            Single seasonal tip string
        """
        tips = SEASONAL_HEALTH_TIPS.get(season.lower(), [])
        return tips[0] if tips else ""

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: get_breed_profile
    # Public accessor for the BREED_HEALTH_PROFILES constant
    # ─────────────────────────────────────────────────────────────────────────
    def get_breed_profile(self, breed: str) -> Optional[Dict]:
        """
        Return the full health profile for a given breed.
        Useful for building breed-specific care cards or summaries.

        Args:
            breed: Breed name (flexible — will attempt fuzzy match)
        Returns:
            Breed profile dict or None if not found
        """
        breed_normalized = breed.lower().replace(" ", "_").replace("-", "_")
        return BREED_HEALTH_PROFILES.get(breed_normalized)

    # ─────────────────────────────────────────────────────────────────────────
    # METHOD: get_toxin_profile
    # Public accessor for the TOXIN_DATABASE constant
    # ─────────────────────────────────────────────────────────────────────────
    def get_toxin_profile(self, toxin_name: str) -> Optional[Dict]:
        """
        Return the full toxicology profile for a given toxin.
        Useful for building toxin reference cards or educational content.

        Args:
            toxin_name: Toxin key from TOXIN_DATABASE
        Returns:
            Toxin profile dict or None if not found
        """
        return TOXIN_DATABASE.get(toxin_name.lower().replace(" ", "_"))
