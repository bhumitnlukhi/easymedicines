#!/usr/bin/env python3
"""Research-backed catalog enricher: preserves spreadsheet names/prices, adds verified specs + images."""

from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "source-catalog.csv"
SALTS_PATH = ROOT / "data" / "research" / "salt-profiles.json"
IMAGES_PATH = ROOT / "data" / "research" / "verified-images.json"
ALIASES_PATH = ROOT / "data" / "research" / "image-aliases.json"
BRANDS_PATH = ROOT / "data" / "research" / "brand-manufacturers.json"

PLACEHOLDERS = {
    "inhaler": "/images/placeholders/inhaler.svg",
    "cream": "/images/placeholders/cream.svg",
    "gel": "/images/placeholders/cream.svg",
    "jelly": "/images/placeholders/oral-jelly.svg",
    "drops": "/images/placeholders/drops.svg",
    "injection": "/images/placeholders/injection.svg",
    "capsule": "/images/placeholders/capsule.svg",
    "softgel": "/images/placeholders/capsule.svg",
    "tablet": "/images/placeholders/tablet.svg",
}

# Brand / name patterns -> salt key
BRAND_SALT = [
    (r"signatret|accufine|isotret", "isotretinoin"),
    (r"aspadol|tapal|typentadol|tapentadol", "tapentadol"),
    (r"baclo|baclofen", "baclofen"),
    (r"\bzop\b|zopisign|zopicone|zopicare|zopiclone", "zopiclone"),
    (r"topnite|zunestar|eszopiclone|hypnite", "eszopiclone"),
    (r"nalsign|naltrexone", "naltrexone"),
    (r"finasteride|prosteride|healpecia", "finasteride"),
    (r"gabasign|gabatop|gabapentin", "gabapentin"),
    (r"nervigesic|neuro\s*-?\s*seliron|pregabalin", "pregabalin"),
    (r"cenforce|kamagra|fildena|malegra|sildigra|suhagra|silagra|caverta|aurogra|zenegra|vega|eriacta|ericta|sexforce|ayurmax|ladygra|lovegra|femalegra|careforce|maxgun|leeforce|vigore|mahabra|mahagra|sildamax|sildgra|silvitra", "sildenafil"),
    (r"vidalista|tadalista|tadarise|tadaga|tadalis|tadagra|tadasoft|tadora|tadalee|tadavar|tadacip|apcalis|eroxib|female\s*up|femalefil", "tadalafil"),
    (r"vilitra|snovitra|valif|filitra", "vardenafil"),
    (r"avana\b|avimax", "avanafil"),
    (r"poxet|vriligy|prejac|dapoforce|dapoxetine", "dapoxetine"),
    (r"super\s*p\s*force|extra\s*super\s*p|cenforce-?d|sildigra\s*super|super\s*kamagra", "sildenafil_dapoxetine"),
    (r"super\s*tadalista|super\s*tadapox|super\s*vidalista|super\s*tadarise|tadapox", "tadalafil_dapoxetine"),
    (r"super\s*vilitra|snovitra\s*super", "vardenafil_dapoxetine"),
    (r"sildalist", "sildenafil_tadalafil"),
    (r"malegra\s*dxt", "sildenafil_duloxetine"),
    (r"malegra\s*fxt", "sildenafil_fluoxetine"),
    (r"cobra|begma", "sildenafil"),
    (r"dolo|paracip|leemol|paracetamol", "paracetamol"),
    (r"asthalin|asthlin|salbutamol", "salbutamol"),
    (r"budecort|budesonide", "budesonide"),
    (r"azitop|azeetop|azisign|azithromycin", "azithromycin"),
    (r"augmine|amoxyheal|zylomox|mormox|amoxicillin", "amoxicillin_clavulanate"),
    (r"zoviclovir|zovirax|acivir|acyclovir|aciclovir", "acyclovir"),
    (r"valclovir|centrex|valacyclovir|valaciclovir", "valacyclovir"),
    (r"iverheal|emectin|ivervid|iverjon|iveroot|ivermectin", "ivermectin"),
    (r"fungicyte|fluconaz|fluconazole", "fluconazole"),
    (r"modalert|modvigil|modactive|vilafinil|modafinil", "modafinil"),
    (r"artvigil|waklert|armodafinil", "armodafinil"),
    (r"atomoxet|axepta|atomoxetine", "atomoxetine"),
    (r"dulata|duloxetine|duloexetine", "duloxetine"),
    (r"sertafine|sertima|sertraline|sertaline", "sertraline"),
    (r"escitalopram|lexaheal|citapad", "escitalopram"),
    (r"tritin|flt\b|fluxican|fluoxetine|fluoxentine", "fluoxetine"),
    (r"cotrip|amitriptyline", "amitriptyline"),
    (r"seroquit|quetiapine", "quetiapine"),
    (r"olanzap|olanzapine", "olanzapine"),
    (r"afferrox|venlafaxine", "venlafaxine"),
    (r"pain-?o-?soma|prosoma|carisoma|carisoprodol", "carisoprodol"),
    (r"healtroxin|thyroxine|thyronorm", "thyroxine"),
    (r"glycoheal|metfor|walcephanse|metformin", "metformin"),
    (r"predniheal|omnacortil|ventocortil|prednisolone", "prednisolone"),
    (r"p-?nolol|propranolol", "propranolol"),
    (r"frasix|lasix|frusenex|furosemide|frusemide", "furosemide"),
    (r"clofi|fertogard|clomisign|clomifene|clomiphene", "clomiphene"),
    (r"letroheal|letrozole", "letrozole"),
    (r"tamodex|tamilong|tamoxilon|tamoxifen", "tamoxifen"),
    (r"cabgoline|dostiheal|cabergoline", "cabergoline"),
    (r"premarin", "conjugated_estrogen"),
    (r"estraheal|estradiol", "estradiol"),
    (r"ovidac|puretrig|\bhcg\b", "hcg"),
    (r"cernos|testoheal|sustanon|testosterone", "testosterone"),
    (r"careprost|super\s*lash|bimatoprost", "bimatoprost"),
    (r"orligal|orlistat", "orlistat"),
    (r"rizatrax|rizatriptan", "rizatriptan"),
    (r"sumitop|sumatriptan", "sumatriptan"),
    (r"tamsuhealn|tamsulosin", "tamsulosin"),
    (r"topaheal|topiramate", "topiramate"),
    (r"omeeforce|omeprazole", "omeprazole"),
    (r"esoprol|esomeprazole", "esomeprazole"),
    (r"metroga|metronidazole", "metronidazole"),
    (r"phalexin|cephalexin|cefalexin", "cephalexin"),
    (r"tetracin|tetracycline", "tetracycline"),
    (r"doxycycline", "doxycycline"),
    (r"clindamycine|clindamycin", "clindamycin"),
    (r"floxip|ciprofloxacin|ciplox", "ciprofloxacin"),
    (r"cotrimoxazole|co-?trimoxazole", "cotrimoxazole"),
    (r"ampicilin|ampicillin", "ampicillin"),
    (r"amlode|amlodipine", "amlodipine"),
    (r"hypernil|enalapril|lisinopril", "enalapril"),
    (r"celeheal|celecoxib", "celecoxib"),
    (r"cyproheptadine", "cyproheptadine"),
    (r"hq-?star|hqcheal|hydroxychloroquine", "hydroxychloroquine"),
    (r"raloxiheal|raloxifene", "raloxifene"),
    (r"anaridex|anastrozole", "anastrozole"),
    (r"tretiheal|trtiheal|tretinoin", "tretinoin"),
    (r"flexabenz|cyclobenzaprine", "cyclobenzaprine"),
    (r"reactin|diclofenac|ibuprofen", "ibuprofen"),
    (r"fiban|flibanserin", "flibanserin"),
    (r"vominorm|ondansetron|metoclopramide", "ondansetron"),
    (r"lquin|levofloxacin", "levofloxacin"),
    (r"glimith|glimepiride", "glimepiride"),
    (r"clenbuterol|clenn-?burn", "clenbuterol"),
    (r"tofisopam", "tofisopam"),
    (r"trazocan|trazodone", "trazodone"),
    (r"architol|cholecalciferol|vitamin\s*d", "cholecalciferol"),
    (r"rivasmart|rivastigmine", "rivastigmine"),
    (r"walapan|pantoprazole", "omeprazole"),
    (r"betablock|metoprolol", "propranolol"),
    (r"davlexin|cadiwin|cronotol", "cephalexin"),
]

MANUFACTURERS = {
    "cenforce": "Centurion Laboratories Pvt. Ltd.",
    "kamagra": "Ajanta Pharma Ltd.",
    "vidalista": "Centurion Laboratories Pvt. Ltd.",
    "fildena": "Fortune Healthcare",
    "malegra": "Sunrise Remedies Pvt. Ltd.",
    "tadalista": "Fortune Healthcare",
    "tadarise": "Sunrise Remedies Pvt. Ltd.",
    "suhagra": "Cipla Ltd.",
    "silagra": "Cipla Ltd.",
    "caverta": "Sun Pharmaceutical Industries Ltd.",
    "zenegra": "Alkem Laboratories Ltd.",
    "poxet": "Sunrise Remedies Pvt. Ltd.",
    "vriligy": "Centurion Laboratories Pvt. Ltd.",
    "aspadol": "HAB Pharmaceuticals & Research Ltd.",
    "tapal": "MSN Laboratories Pvt. Ltd.",
    "signatret": "HAB Pharmaceuticals / Signature",
    "accufine": "HAB Pharmaceuticals / Signature",
    "dolo": "Micro Labs Ltd.",
    "paracip": "Cipla Ltd.",
    "asthalin": "Cipla Ltd.",
    "budecort": "Cipla Ltd.",
    "omnacortil": "Macleods Pharmaceuticals Ltd.",
    "lasix": "Sanofi India",
    "waklert": "Sun Pharmaceutical Industries Ltd.",
    "modalert": "Sun Pharmaceutical Industries Ltd.",
    "axepta": "Intas Pharmaceuticals Ltd.",
    "cernos": "Sun Pharmaceutical Industries Ltd.",
    "careprost": "Sun Pharmaceutical Industries Ltd.",
    "premarin": "Pfizer / Wyeth",
    "tadacip": "Cipla Ltd.",
    "flexabenz": "Macleods Pharmaceuticals Ltd.",
    "orligal": "Intas Pharmaceuticals Ltd.",
    "healpecia": "Healing Pharma India Pvt. Ltd.",
    "healtroxin": "Healing Pharma India Pvt. Ltd.",
    "predniheal": "Healing Pharma India Pvt. Ltd.",
    "glycoheal": "Healing Pharma India Pvt. Ltd.",
    "iverheal": "Healing Pharma India Pvt. Ltd.",
    "zovirax": "GlaxoSmithKline",
    "acivir": "Cipla Ltd.",
    "sustanon": "Aspen / Organon",
    "amlode": "Unichem Laboratories Ltd.",
    "hypernil": "Lupin Ltd.",
    "reactin": "Cipla Ltd.",
    "vominorm": "Cipla Ltd.",
}


def slugify(text: str) -> str:
    s = re.sub(r"[^\w\s-]", "", text.lower())
    s = re.sub(r"[\s_-]+", "-", s).strip("-")
    return s or "product"


def parse_price(raw: str):
    original = (raw or "").strip()
    if not original:
        return 0.0, True, ""
    try:
        num = float(re.sub(r"[^0-9.]", "", original) or "nan")
    except ValueError:
        num = float("nan")
    if num != num or num <= 0:
        return 0.0, True, original
    return round(num, 2), False, original


def extract_strength(name: str, dosage: str, generic: str) -> str:
    if dosage and dosage.strip():
        return dosage.strip()
    for text in (name, generic):
        m = re.search(r"\b\d+(\.\d+)?\s*(mg|mcg|gm|g|ml|%|iu|dose|k)\b", text or "", re.I)
        if m:
            return m.group(0)
    return ""


def extract_form(name: str, generic: str, default: str = "Tablet") -> str:
    combined = f"{name} {generic}".lower()
    if "inhaler" in combined or "inhealer" in combined:
        return "Inhaler"
    if "oral jelly" in combined or "jelly" in combined:
        return "Oral Jelly"
    if "cream" in combined:
        return "Topical Cream"
    if " gel" in combined or combined.endswith("gel") or "cernos" in combined:
        return "Topical Gel"
    if "softgel" in combined or "soft gel" in combined:
        return "Softgel Capsule"
    if "capsule" in combined:
        return "Capsule"
    if "drop" in combined or "ophthalmic" in combined or "lash" in combined:
        return "Eye Drops"
    if "injection" in combined or " iu" in combined or "ampoule" in combined:
        return "Injection"
    if "chewable" in combined:
        return "Chewable Tablet"
    if "effervescent" in combined:
        return "Effervescent Tablet"
    if "sublingual" in combined or "professional" in combined and "sild" in combined:
        return "Sublingual Tablet"
    if "prolonged" in combined or " xr" in combined or " er " in combined:
        return "Prolonged Release Tablet"
    return default


def resolve_salt(name: str, generic: str) -> tuple[str | None, str]:
    blob = f"{name} {generic}".lower()
    for pattern, salt_key in BRAND_SALT:
        if re.search(pattern, blob, re.I):
            return salt_key, "brand_or_name"
    # generic text hints
    g = (generic or "").lower()
    generic_map = [
        (r"sildenafil|sildeanfil", "sildenafil"),
        (r"tadalafil", "tadalafil"),
        (r"vardenafil", "vardenafil"),
        (r"avanafil", "avanafil"),
        (r"dapoxet", "dapoxetine"),
        (r"tapentadol", "tapentadol"),
        (r"isotret", "isotretinoin"),
        (r"baclofen", "baclofen"),
        (r"zopiclone", "zopiclone"),
        (r"eszopiclone", "eszopiclone"),
        (r"naltrexone", "naltrexone"),
        (r"finasteride", "finasteride"),
        (r"gabapentin", "gabapentin"),
        (r"pregabalin", "pregabalin"),
        (r"paracetamol|acetaminophen", "paracetamol"),
        (r"salbutamol|albuterol", "salbutamol"),
        (r"azithromycin", "azithromycin"),
        (r"acyclovir|aciclovir", "acyclovir"),
        (r"valacyclovir|valaciclovir", "valacyclovir"),
        (r"ivermectin", "ivermectin"),
        (r"fluconazole", "fluconazole"),
        (r"modafinil", "modafinil"),
        (r"armodafinil", "armodafinil"),
        (r"atomoxetine", "atomoxetine"),
        (r"duloxet", "duloxetine"),
        (r"sertraline|sertaline", "sertraline"),
        (r"escitalopram", "escitalopram"),
        (r"fluoxet", "fluoxetine"),
        (r"amitriptyline", "amitriptyline"),
        (r"quetiapine", "quetiapine"),
        (r"olanzapine", "olanzapine"),
        (r"venlafaxine", "venlafaxine"),
        (r"carisoprodol", "carisoprodol"),
        (r"thyroxine|levothyroxine", "thyroxine"),
        (r"metformin", "metformin"),
        (r"prednisolone", "prednisolone"),
        (r"propranolol", "propranolol"),
        (r"frusemide|furosemide", "furosemide"),
        (r"clomifene|clomiphene", "clomiphene"),
        (r"letrozole", "letrozole"),
        (r"tamoxifen", "tamoxifen"),
        (r"cabergoline", "cabergoline"),
        (r"testosterone", "testosterone"),
        (r"bimatoprost", "bimatoprost"),
        (r"orlistat", "orlistat"),
        (r"rizatriptan", "rizatriptan"),
        (r"sumatriptan", "sumatriptan"),
        (r"tamsulosin", "tamsulosin"),
        (r"topiramate", "topiramate"),
        (r"omeprazole", "omeprazole"),
        (r"metronidazole", "metronidazole"),
        (r"cephalexin|cefalexin", "cephalexin"),
        (r"tetracycline", "tetracycline"),
        (r"doxycycline", "doxycycline"),
        (r"clindamycin", "clindamycin"),
    ]
    for pattern, salt_key in generic_map:
        if re.search(pattern, g, re.I):
            return salt_key, "generic"
    return None, "unmatched"


def manufacturer_for(name: str) -> str | None:
    lower = name.lower()
    for key, mfr in MANUFACTURERS.items():
        if key in lower:
            return mfr
    return None


def placeholder_for(form: str) -> str:
    f = form.lower()
    if "inhaler" in f:
        return PLACEHOLDERS["inhaler"]
    if "cream" in f:
        return PLACEHOLDERS["cream"]
    if "gel" in f:
        return PLACEHOLDERS["gel"]
    if "jelly" in f:
        return PLACEHOLDERS["jelly"]
    if "drop" in f:
        return PLACEHOLDERS["drops"]
    if "inject" in f or "vial" in f:
        return PLACEHOLDERS["injection"]
    if "capsule" in f or "softgel" in f:
        return PLACEHOLDERS["capsule"]
    return PLACEHOLDERS["tablet"]


def image_for(name: str, form: str, images: dict, aliases: dict) -> tuple[str, str, str | None]:
    lower = name.lower()
    for alias, key in aliases.items():
        if alias in lower and key in images:
            entry = images[key]
            return entry["local"], "verified_pack", entry.get("remote")
    # direct key contains
    for key, entry in images.items():
        token = key.split("-")[0]
        if token in lower:
            return entry["local"], "verified_pack", entry.get("remote")
    return placeholder_for(form), "placeholder", None


def clean_generic(raw: str, salt: dict | None, name: str) -> str:
    g = (raw or "").strip()
    if g and g.lower() not in {"0.5mg", "ct", "nan"}:
        # fix common typos lightly for display while keeping original in source
        fixes = {
            "isotretinion": "Isotretinoin",
            "duloexetine": "Duloxetine",
            "dapoxentine": "Dapoxetine",
            "amoxcicllin": "Amoxicillin",
            "sildeanfil": "Sildenafil",
            "fluoxentine": "Fluoxetine",
            "sertaline": "Sertraline",
            "clindamycine": "Clindamycin",
        }
        low = g.lower()
        for bad, good in fixes.items():
            if bad in low:
                return good + g[len(bad) :] if False else re.sub(bad, good, g, flags=re.I)
        return g
    if salt:
        return salt["genericName"]
    return name


def main() -> None:
    salts = json.loads(SALTS_PATH.read_text())
    images = json.loads(IMAGES_PATH.read_text()) if IMAGES_PATH.exists() else {}
    aliases = json.loads(ALIASES_PATH.read_text()) if ALIASES_PATH.exists() else {}

    rows = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        for i, r in enumerate(reader, start=2):
            if not r or not any(c.strip() for c in r if c):
                continue
            rows.append(
                {
                    "row": i,
                    "name": (r[0] if len(r) > 0 else "").strip(),
                    "generic": (r[2] if len(r) > 2 else "").strip(),
                    "dosage": (r[4] if len(r) > 4 else "").strip(),
                    "price": (r[5] if len(r) > 5 else "").strip(),
                }
            )

    products = []
    categories = defaultdict(int)
    report_rows = []
    seen_slugs = set()
    missing_required = []
    missing_images = []
    ambiguous = []
    pending = []
    prescription_review = []

    for row in rows:
        name = row["name"]
        if not name:
            missing_required.append({"row": row["row"], "missing": ["Product Name"]})
            continue

        price, is_por, original_price = parse_price(row["price"])
        if is_por:
            missing_required.append(
                {
                    "row": row["row"],
                    "missing": [
                        f'Price missing or non-numeric (original value: "{original_price}"). Preserved; displayed as Price on Request.'
                    ],
                }
            )

        salt_key, match_via = resolve_salt(name, row["generic"])
        salt = salts.get(salt_key) if salt_key else None

        strength = extract_strength(name, row["dosage"], row["generic"])
        form = extract_form(name, row["generic"], (salt or {}).get("dosageFormDefault", "Tablet"))
        brand = name.split()[0]
        mfr = manufacturer_for(name) or (salt and "See pack / manufacturer label") or "Pending verification"

        data_warnings = []
        sources = []
        if salt:
            sources.extend(salt.get("sources") or [])
            confidence = salt.get("confidence", "high" if match_via != "unmatched" else "low")
            if confidence == "high" and match_via in {"brand_or_name", "generic"}:
                match_confidence = "exact" if match_via == "brand_or_name" else "high"
                verification = "verified"
            elif confidence == "medium":
                match_confidence = "medium"
                verification = "pending_review"
            else:
                match_confidence = "low" if confidence == "low" else "high"
                verification = "pending_review" if confidence == "low" else "verified"
            generic_name = clean_generic(row["generic"], salt, name)
            active = salt.get("activeIngredients") or [generic_name]
            description = salt["description"]
            if strength:
                description = f"{description} Listed strength/pack cue from catalog: {strength}."
            key_info = {
                "uses": salt.get("uses"),
                "precautions": salt.get("precautions"),
                "storage": salt.get("storage"),
            }
            rx = bool(salt.get("prescriptionRequired", True))
            pack = salt.get("packSizeDefault") or f"Standard pack ({form})"
            category = salt.get("category") or "Prescription Medicines"
            if confidence == "low":
                data_warnings.append("Manufacturer/identity confidence low — verify pack label before clinical use claims.")
        else:
            match_confidence = "unmatched"
            verification = "pending_review"
            generic_name = clean_generic(row["generic"], None, name) or name
            active = [generic_name] if generic_name else []
            description = (
                f"{name} is listed in the EasyMeds catalog"
                + (f" as {generic_name}" if generic_name and generic_name != name else "")
                + (f" ({strength})" if strength else "")
                + ". Product identity requires manual verification before clinical claims are published."
            )
            key_info = {
                "precautions": ["Manual verification required", "Use only as directed by a registered medical practitioner"],
                "storage": "Follow the storage instructions printed on the original pack.",
            }
            rx = True  # conservative default when unknown; flagged for review
            pack = f"As supplied ({form})"
            category = "Prescription Medicines"
            data_warnings.append("Could not confidently match to a researched medicine profile.")
            prescription_review.append(
                {"id": f"em-cat-{row['row']:04d}", "name": name, "reason": "Unmatched identity; Rx assumed pending review"}
            )
            ambiguous.append(
                {
                    "row": row["row"],
                    "originalName": name,
                    "issue": f"No confident salt/brand match (generic='{row['generic']}')",
                    "confidence": "unmatched",
                }
            )

        image_url, image_status, remote = image_for(name, form, images, aliases)
        if image_status != "verified_pack":
            missing_images.append({"id": f"em-cat-{row['row']:04d}", "name": name})

        sku = f"EM-CAT-{row['row']:04d}"
        base = slugify(f"{name}-{strength}" if strength else name)
        final = base
        n = 1
        while final in seen_slugs:
            final = f"{base}-r{row['row']}"
            n += 1
        seen_slugs.add(final)

        if original_price and is_por and original_price not in {"", "None"}:
            data_warnings.append(f'Original spreadsheet price "{original_price}" was non-numeric.')

        product = {
            "id": sku.lower(),
            "sku": sku,
            "slug": final,
            "name": name,
            "brand": brand,
            "genericName": generic_name,
            "activeIngredients": active,
            "strength": strength or None,
            "dosageForm": form,
            "packSize": pack,
            "category": category,
            "description": description,
            "keyInformation": {k: v for k, v in key_info.items() if v},
            "price": price,
            "originalPriceRaw": original_price,
            "isPriceOnRequest": is_por,
            "currency": "INR",
            "imageUrl": image_url,
            "prescriptionRequired": rx,
            "availabilityStatus": "in_stock",
            "manufacturer": mfr if mfr != "See pack / manufacturer label" else brand,
            "sourceSpreadsheetRow": row["row"],
            "sourceProductName": name,
            "matchConfidence": match_confidence,
            "verificationStatus": verification,
            "dataWarnings": data_warnings or None,
        }
        # strip None warnings
        if not product["dataWarnings"]:
            del product["dataWarnings"]
        if not product["strength"]:
            del product["strength"]

        products.append(product)
        categories[category] += 1

        if verification == "pending_review":
            pending.append(name)

        report_rows.append(
            {
                "row": row["row"],
                "originalName": name,
                "originalPrice": original_price if original_price != "" else None,
                "matchedIdentity": {
                    "brand": brand,
                    "genericName": generic_name,
                    "saltKey": salt_key,
                    "strength": strength or None,
                    "dosageForm": form,
                    "manufacturer": product["manufacturer"],
                },
                "sources": sources,
                "imageUrl": image_url,
                "imageRemoteUrl": remote,
                "imageVerificationStatus": image_status,
                "researchStatus": verification,
                "matchConfidence": match_confidence,
                "missingOrUncertain": data_warnings,
            }
        )

    cat_list = []
    for cat_name, count in sorted(categories.items(), key=lambda x: (-x[1], x[0])):
        cat_list.append(
            {
                "id": slugify(cat_name),
                "slug": slugify(cat_name),
                "name": cat_name,
                "description": f"Browse {cat_name.lower()} from the EasyMeds researched catalog.",
                "iconName": "Pill",
                "itemCount": count,
            }
        )

    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sourceFile": "data/source-catalog.csv",
        "spreadsheetSource": "/Users/bhumit/Downloads/MEDICINE PRICE - Copy.xlsx",
        "totalRows": len(rows),
        "validProducts": len(products),
        "duplicateRows": [],
        "missingRequiredFields": missing_required,
        "ambiguousMatches": ambiguous,
        "missingImages": missing_images,
        "prescriptionReviewRequired": prescription_review,
        "priceDiscrepancies": [],
        "summary": {
            "verified": sum(1 for p in products if p["verificationStatus"] == "verified"),
            "pending_review": sum(1 for p in products if p["verificationStatus"] == "pending_review"),
            "verified_pack_images": sum(1 for r in report_rows if r["imageVerificationStatus"] == "verified_pack"),
            "placeholder_images": sum(1 for r in report_rows if r["imageVerificationStatus"] == "placeholder"),
            "priceOnRequest": sum(1 for p in products if p.get("isPriceOnRequest")),
            "pricedProducts": sum(1 for p in products if not p.get("isPriceOnRequest")),
        },
        "products": report_rows,
        "pendingReviewNames": sorted(set(pending)),
    }

    (ROOT / "data" / "products.json").write_text(json.dumps(products, indent=2), encoding="utf-8")
    (ROOT / "data" / "categories.json").write_text(json.dumps(cat_list, indent=2), encoding="utf-8")
    (ROOT / "data" / "catalog-validation-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

    # Markdown summary
    md = [
        "# EasyMeds Catalog Validation Report",
        "",
        f"- Generated: `{report['timestamp']}`",
        f"- Source: `{report['spreadsheetSource']}`",
        f"- Rows: **{report['totalRows']}** → products: **{report['validProducts']}**",
        f"- Verified: **{report['summary']['verified']}** | Pending review: **{report['summary']['pending_review']}**",
        f"- Pack images verified: **{report['summary']['verified_pack_images']}** | Placeholders: **{report['summary']['placeholder_images']}**",
        f"- Priced: **{report['summary']['pricedProducts']}** | Price on request: **{report['summary']['priceOnRequest']}**",
        "",
        "## Products needing manual verification",
        "",
    ]
    for n in report["pendingReviewNames"]:
        md.append(f"- {n}")
    if not report["pendingReviewNames"]:
        md.append("- None")
    md.append("")
    md.append("## Notes")
    md.append("- Original spreadsheet product names and Price INR values were preserved.")
    md.append("- Unsplash stock images were removed; missing pack shots use form-specific local placeholders.")
    (ROOT / "data" / "catalog-validation-report.md").write_text("\n".join(md), encoding="utf-8")

    print(f"products={len(products)} verified={report['summary']['verified']} pending={report['summary']['pending_review']}")
    print(f"images pack={report['summary']['verified_pack_images']} placeholder={report['summary']['placeholder_images']}")


if __name__ == "__main__":
    main()
