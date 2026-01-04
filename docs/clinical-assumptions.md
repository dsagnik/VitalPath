# Clinical Assumptions & Methodology

## Overview

This document outlines the clinical assumptions, thresholds, and decision logic used in VitalPath's clinical reasoning engine. All rules are based on established medical guidelines and are designed to be transparent and explainable.

## Clinical Guidelines Referenced

### 1. American Diabetes Association (ADA) Guidelines

**Fasting Glucose Thresholds:**
- Normal: <100 mg/dL
- Prediabetes: 100-125 mg/dL
- Diabetes: ≥126 mg/dL

**Diagnostic Criteria:**
- A fasting plasma glucose ≥126 mg/dL on two separate occasions confirms diabetes diagnosis
- Symptoms plus random glucose ≥200 mg/dL also diagnostic

### 2. American Heart Association (AHA) / ACC Blood Pressure Guidelines

**Blood Pressure Categories:**
- Normal: <120/80 mmHg
- Elevated: 120-129/<80 mmHg
- Stage 1 Hypertension: 130-139/80-89 mmHg
- Stage 2 Hypertension: ≥140/90 mmHg
- Hypertensive Crisis: ≥180/120 mmHg (immediate medical attention)

**Treatment Thresholds:**
- Lifestyle modifications recommended for all elevated BP
- Pharmacotherapy considered at ≥140/90 mmHg or ≥130/80 mmHg with high CV risk

### 3. NCEP ATP III Lipid Guidelines

**Total Cholesterol:**
- Desirable: <200 mg/dL
- Borderline High: 200-239 mg/dL
- High: ≥240 mg/dL

**LDL Cholesterol (Primary Target):**
- Optimal: <100 mg/dL
- Near Optimal: 100-129 mg/dL
- Borderline High: 130-159 mg/dL
- High: 160-189 mg/dL
- Very High: ≥190 mg/dL

**HDL Cholesterol:**
- Low (Risk Factor): <40 mg/dL (men), <50 mg/dL (women)
- High (Protective): ≥60 mg/dL

**Triglycerides:**
- Normal: <150 mg/dL
- Borderline High: 150-199 mg/dL
- High: 200-499 mg/dL
- Very High: ≥500 mg/dL (pancreatitis risk)

### 4. WHO BMI Classifications

- Underweight: <18.5 kg/m²
- Normal weight: 18.5-24.9 kg/m²
- Overweight: 25-29.9 kg/m²
- Obese Class I: 30-34.9 kg/m²
- Obese Class II: 35-39.9 kg/m²
- Obese Class III: ≥40 kg/m²

## Scoring Methodology

### Type 2 Diabetes Risk Assessment

**Scoring Factors:**

| Factor | Points | Criteria |
|--------|--------|----------|
| Fasting Glucose ≥126 mg/dL | 3 | Meets diagnostic criteria |
| Fasting Glucose 100-125 mg/dL | 2 | Prediabetes range |
| BMI ≥30 | 2 | Obesity (major risk factor) |
| BMI 25-29.9 | 1 | Overweight |
| Age ≥45 years | 1 | Increased risk threshold |
| Triglycerides ≥200 mg/dL | 1 | Insulin resistance indicator |
| Low HDL | 1 | Metabolic syndrome component |
| ≥2 Classic Symptoms | 1 | Polyuria, polydipsia, blurred vision, fatigue |

**Confidence Assignment:**
- High Confidence: Score ≥5
- Medium Confidence: Score 3-4
- Low Confidence: Score 1-2

### Hypertension Assessment

**Scoring Factors:**

| Factor | Points | Criteria |
|--------|--------|----------|
| BP ≥140/90 mmHg | 3 | Stage 2 HTN |
| BP 130-139/80-89 mmHg | 2 | Stage 1 HTN |
| BP 120-129/<80 mmHg | 1 | Elevated BP |
| Age ≥55 years | 1 | Age-related risk |
| BMI ≥30 | 1 | Obesity-related HTN |
| HTN Symptoms Present | 1 | Headache, dizziness, chest pain |

**Confidence Assignment:**
- High Confidence: Score ≥4
- Medium Confidence: Score 2-3
- Low Confidence: Score 1

### Dyslipidemia Assessment

**Scoring Factors:**

| Factor | Points | Criteria |
|--------|--------|----------|
| LDL ≥190 mg/dL | 3 | Very high LDL |
| LDL 160-189 mg/dL | 2 | High LDL |
| LDL 130-159 mg/dL | 1 | Borderline high LDL |
| Total Cholesterol ≥240 mg/dL | 2 | High total cholesterol |
| Total Cholesterol 200-239 mg/dL | 1 | Borderline high |
| HDL <40 (M) or <50 (F) mg/dL | 2 | Low HDL (risk factor) |
| Triglycerides ≥500 mg/dL | 2 | Very high (pancreatitis risk) |
| Triglycerides ≥200 mg/dL | 1 | High triglycerides |
| Triglycerides 150-199 mg/dL | 1 | Borderline high |

**Confidence Assignment:**
- High Confidence: Score ≥5
- Medium Confidence: Score 3-4
- Low Confidence: Score 1-2

### Combined Cardiovascular Risk Assessment

**Inclusion Criteria:**
- Requires ≥2 major risk factors to trigger assessment

**Major Risk Factors:**
1. Hypertension (BP ≥130/80 mmHg)
2. Dyslipidemia (LDL ≥160 or Total Cholesterol ≥240 mg/dL)
3. Diabetes/Prediabetes (Fasting glucose ≥100 mg/dL)
4. Obesity (BMI ≥30)

**Additional Risk Factors:**
- Age: ≥55 years (men), ≥65 years (women)
- Cardiovascular symptoms (chest pain, shortness of breath)

**Scoring:**
- Each major risk factor: 2 points
- Obesity: 1 point
- Age threshold: 1 point
- CV symptoms: 2 points

**Confidence Assignment:**
- High Confidence: Score ≥6
- Medium Confidence: Score 4-5
- Low Confidence: Score 2-3

## Clinical Reasoning Transparency

### Explainability Features

Each detected condition includes:

1. **Contributing Factors**: Specific data points that triggered the rule
2. **Clinical Reasoning**: Plain-language explanation of why the condition was flagged
3. **Confidence Level**: Based on strength and number of indicators
4. **Quantitative Values**: Actual patient measurements shown with thresholds

### Example Output Interpretation

**Condition**: Type 2 Diabetes Risk  
**Confidence**: High

**Contributing Factors:**
- Fasting glucose 145 mg/dL meets diagnostic criteria for diabetes (≥126 mg/dL)
- BMI 32.5 indicates obesity (≥30), a major risk factor for type 2 diabetes
- Age 58 years increases diabetes risk (≥45 years)

**Clinical Reasoning**: Multiple strong clinical indicators present, including glucose levels meeting diagnostic criteria. Clinical evaluation recommended urgently.

This transparent approach allows clinicians to:
- Understand exactly why a condition was flagged
- Verify the logic against their own clinical judgment
- Identify which specific values need attention
- Make informed decisions about next steps

## Limitations & Caveats

### What VitalPath Does NOT Do

1. **Does not make diagnoses**: Provides risk assessment and differential diagnosis suggestions only
2. **Does not prescribe medications**: No specific drug names or dosages provided
3. **Does not replace clinical judgment**: All findings must be verified by healthcare professionals
4. **Does not consider patient history**: Single-point-in-time assessment only
5. **Does not account for all conditions**: Limited to 4 specific metabolic/cardiovascular conditions

### Assumptions Made

1. **Fasting State**: Glucose and lipid values assumed to be from fasting samples (8-12 hours)
2. **Accurate Measurements**: All vital signs and lab values assumed to be accurately measured
3. **Single Reading**: BP and glucose readings not confirmed with repeat measurements
4. **No Medication Effects**: Does not account for patients on treatment affecting values
5. **No Genetic Factors**: Family history and genetic predisposition not considered
6. **Standard Population**: Guidelines based on general adult population, may not apply to all ethnicities equally

### Clinical Context Required

Healthcare professionals should consider:

1. **Patient History**: Previous medical conditions, medications, treatments
2. **Family History**: Genetic risk factors for metabolic and cardiovascular disease
3. **Symptoms Duration**: Acute vs. chronic presentation
4. **Medication Effects**: Current medications affecting lab values or BP
5. **Laboratory Conditions**: Fasting status, time of day, measurement technique
6. **Repeat Measurements**: Confirm abnormal values before making clinical decisions
7. **Physical Examination**: VitalPath cannot replace hands-on clinical assessment
8. **Patient-Specific Factors**: Age, ethnicity, pregnancy status, comorbidities

## Validation & Accuracy

### Algorithm Validation

The clinical rules have been:
- Mapped to established medical guidelines (ADA, AHA/ACC, NCEP, WHO)
- Reviewed for logical consistency
- Tested with sample patient scenarios
- Designed for maximum transparency and explainability

### Known Edge Cases

1. **Borderline Values**: Values near thresholds may not be clinically significant
2. **Secondary Causes**: Does not identify secondary hypertension or diabetes
3. **White Coat Hypertension**: Cannot distinguish from sustained hypertension
4. **Medication Adherence**: Cannot assess if patient is taking prescribed medications
5. **Lab Variations**: Different labs may have slightly different reference ranges

## Recommended Clinical Workflow

1. **Input**: Enter accurate, recent patient data
2. **Review Output**: Examine ranked conditions and contributing factors
3. **Clinical Correlation**: Compare findings with patient presentation and history
4. **Confirm Abnormalities**: Repeat measurements of abnormal values
5. **Additional Testing**: Order recommended diagnostic tests as appropriate
6. **Clinical Decision**: Integrate VitalPath findings with comprehensive clinical assessment
7. **Management Plan**: Develop treatment plan based on all available information
8. **Follow-up**: Monitor patient response and adjust management accordingly

## References

1. American Diabetes Association. (2024). Standards of Medical Care in Diabetes—2024. *Diabetes Care*, 47(Supplement 1).

2. Whelton, P. K., et al. (2017). 2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults. *Journal of the American College of Cardiology*, 71(19), e127-e248.

3. Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults. (2001). Executive Summary of The Third Report of The National Cholesterol Education Program (NCEP) Expert Panel on Detection, Evaluation, And Treatment of High Blood Cholesterol In Adults (Adult Treatment Panel III). *JAMA*, 285(19), 2486-2497.

4. World Health Organization. (2000). Obesity: preventing and managing the global epidemic. *WHO Technical Report Series*, 894.

## Version History

- **v1.0.0** (January 2026): Initial release with 4 condition assessments
  - Type 2 Diabetes Risk
  - Hypertension
  - Dyslipidemia
  - Combined Cardiovascular Risk

---

**Last Updated**: January 2026  
**Maintained By**: Sagnik & Sarmin  
**Contact**: For questions about clinical logic or to report issues with decision rules