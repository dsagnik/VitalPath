/**
 * VitalPath - Clinical Rules & Thresholds
 * Contains evidence-based clinical decision rules
 * Based on standard medical guidelines (ADA, AHA, ACC, NCEP)
 */

const CLINICAL_THRESHOLDS = {
    // Blood Pressure (JNC 8 / AHA Guidelines)
    bloodPressure: {
        normal: { systolic: 120, diastolic: 80 },
        elevated: { systolic: 130, diastolic: 80 },
        stage1HTN: { systolic: 140, diastolic: 90 },
        stage2HTN: { systolic: 180, diastolic: 120 }
    },
    
    // Glucose (ADA Guidelines)
    glucose: {
        normal: 100,
        prediabetes: 126,
        diabetes: 126
    },
    
    // Lipid Panel (NCEP ATP III Guidelines)
    cholesterol: {
        totalDesirable: 200,
        totalBorderline: 240,
        ldlOptimal: 100,
        ldlNearOptimal: 130,
        ldlBorderline: 160,
        ldlHigh: 190,
        hdlLow: 40,  // for men
        hdlLowWomen: 50,
        hdlHigh: 60,
        triglyceridesNormal: 150,
        triglyceridesHigh: 200,
        triglyceridesVeryHigh: 500
    },
    
    // BMI Categories (WHO)
    bmi: {
        underweight: 18.5,
        normal: 25,
        overweight: 30,
        obese: 30
    }
};

/**
 * Rule: Assess Type 2 Diabetes Risk
 * @param {Object} data - Patient data
 * @returns {Object|null} Condition object or null
 */
function assessDiabetesRisk(data) {
    const factors = [];
    let score = 0;
    
    // Fasting glucose evaluation (strongest indicator)
    if (data.glucose >= CLINICAL_THRESHOLDS.glucose.diabetes) {
        factors.push(`Fasting glucose ${data.glucose} mg/dL meets diagnostic criteria for diabetes (≥126 mg/dL)`);
        score += 3;
    } else if (data.glucose >= CLINICAL_THRESHOLDS.glucose.prediabetes) {
        factors.push(`Fasting glucose ${data.glucose} mg/dL indicates prediabetes (100-125 mg/dL)`);
        score += 2;
    }
    
    // BMI evaluation (strong risk factor)
    if (data.bmi >= CLINICAL_THRESHOLDS.bmi.obese) {
        factors.push(`BMI ${data.bmi} indicates obesity (≥30), a major risk factor for type 2 diabetes`);
        score += 2;
    } else if (data.bmi >= CLINICAL_THRESHOLDS.bmi.overweight) {
        factors.push(`BMI ${data.bmi} indicates overweight status (25-29.9), increasing diabetes risk`);
        score += 1;
    }
    
    // Age factor
    if (data.age >= 45) {
        factors.push(`Age ${data.age} years increases diabetes risk (≥45 years)`);
        score += 1;
    }
    
    // Triglycerides (metabolic indicator)
    if (data.triglycerides >= CLINICAL_THRESHOLDS.cholesterol.triglyceridesHigh) {
        factors.push(`Elevated triglycerides ${data.triglycerides} mg/dL suggest insulin resistance (≥200 mg/dL)`);
        score += 1;
    }
    
    // HDL (protective factor - inverse relationship)
    const hdlThreshold = data.gender === 'male' ? 
        CLINICAL_THRESHOLDS.cholesterol.hdlLow : 
        CLINICAL_THRESHOLDS.cholesterol.hdlLowWomen;
    
    if (data.hdl < hdlThreshold) {
        factors.push(`Low HDL ${data.hdl} mg/dL associated with metabolic syndrome`);
        score += 1;
    }
    
    // Symptom evaluation
    const diabetesSymptoms = ['frequent_urination', 'increased_thirst', 'blurred_vision', 'fatigue'];
    const presentSymptoms = data.symptoms.filter(s => diabetesSymptoms.includes(s));
    
    if (presentSymptoms.length >= 2) {
        factors.push(`Classic diabetes symptoms present: ${presentSymptoms.length} of 4 cardinal symptoms`);
        score += 1;
    }
    
    // Determine confidence based on score
    if (score === 0) return null;
    
    let confidence;
    let reasoning;
    
    if (score >= 5) {
        confidence = 'High';
        reasoning = 'Multiple strong clinical indicators present, including glucose levels meeting diagnostic criteria. Clinical evaluation recommended urgently.';
    } else if (score >= 3) {
        confidence = 'Medium';
        reasoning = 'Several risk factors identified suggesting elevated diabetes risk. Further diagnostic testing recommended to confirm or rule out diabetes.';
    } else {
        confidence = 'Low';
        reasoning = 'Some risk factors present. Consider screening and lifestyle modification counseling.';
    }
    
    return {
        name: 'Type 2 Diabetes Risk',
        confidence: confidence,
        factors: factors,
        reasoning: reasoning,
        score: score
    };
}

/**
 * Rule: Assess Hypertension
 * @param {Object} data - Patient data
 * @returns {Object|null} Condition object or null
 */
function assessHypertension(data) {
    const factors = [];
    let score = 0;
    
    // Blood pressure classification
    if (data.systolic >= CLINICAL_THRESHOLDS.bloodPressure.stage2HTN.systolic || 
        data.diastolic >= CLINICAL_THRESHOLDS.bloodPressure.stage2HTN.diastolic) {
        factors.push(`Blood pressure ${data.systolic}/${data.diastolic} mmHg indicates Stage 2 Hypertension (≥140/90)`);
        score += 3;
    } else if (data.systolic >= CLINICAL_THRESHOLDS.bloodPressure.stage1HTN.systolic || 
               data.diastolic >= CLINICAL_THRESHOLDS.bloodPressure.stage1HTN.diastolic) {
        factors.push(`Blood pressure ${data.systolic}/${data.diastolic} mmHg indicates Stage 1 Hypertension (130-139/80-89)`);
        score += 2;
    } else if (data.systolic >= CLINICAL_THRESHOLDS.bloodPressure.elevated.systolic) {
        factors.push(`Blood pressure ${data.systolic}/${data.diastolic} mmHg is elevated (120-129/<80)`);
        score += 1;
    }
    
    // Risk factors
    if (data.age >= 55) {
        factors.push(`Age ${data.age} years is a significant risk factor for hypertension`);
        score += 1;
    }
    
    if (data.bmi >= CLINICAL_THRESHOLDS.bmi.obese) {
        factors.push(`Obesity (BMI ${data.bmi}) strongly associated with hypertension`);
        score += 1;
    }
    
    // Symptoms
    const htnSymptoms = ['headache', 'dizziness', 'chest_pain'];
    const presentSymptoms = data.symptoms.filter(s => htnSymptoms.includes(s));
    
    if (presentSymptoms.length >= 1) {
        factors.push(`Symptoms consistent with hypertension present`);
        score += 1;
    }
    
    if (score === 0) return null;
    
    let confidence;
    let reasoning;
    
    if (score >= 4) {
        confidence = 'High';
        reasoning = 'Blood pressure readings meet diagnostic criteria with additional risk factors. Requires clinical management and possible pharmacotherapy.';
    } else if (score >= 2) {
        confidence = 'Medium';
        reasoning = 'Elevated blood pressure with risk factors present. Repeat measurements and lifestyle modifications recommended.';
    } else {
        confidence = 'Low';
        reasoning = 'Borderline blood pressure elevation. Monitor regularly and address modifiable risk factors.';
    }
    
    return {
        name: 'Hypertension',
        confidence: confidence,
        factors: factors,
        reasoning: reasoning,
        score: score
    };
}

/**
 * Rule: Assess Dyslipidemia
 * @param {Object} data - Patient data
 * @returns {Object|null} Condition object or null
 */
function assessDyslipidemia(data) {
    const factors = [];
    let score = 0;
    
    // Total Cholesterol
    if (data.totalCholesterol >= CLINICAL_THRESHOLDS.cholesterol.totalBorderline) {
        factors.push(`Total cholesterol ${data.totalCholesterol} mg/dL is high (≥240 mg/dL)`);
        score += 2;
    } else if (data.totalCholesterol >= CLINICAL_THRESHOLDS.cholesterol.totalDesirable) {
        factors.push(`Total cholesterol ${data.totalCholesterol} mg/dL is borderline high (200-239 mg/dL)`);
        score += 1;
    }
    
    // LDL Cholesterol (primary target)
    if (data.ldl >= CLINICAL_THRESHOLDS.cholesterol.ldlHigh) {
        factors.push(`LDL cholesterol ${data.ldl} mg/dL is very high (≥190 mg/dL)`);
        score += 3;
    } else if (data.ldl >= CLINICAL_THRESHOLDS.cholesterol.ldlBorderline) {
        factors.push(`LDL cholesterol ${data.ldl} mg/dL is high (160-189 mg/dL)`);
        score += 2;
    } else if (data.ldl >= CLINICAL_THRESHOLDS.cholesterol.ldlNearOptimal) {
        factors.push(`LDL cholesterol ${data.ldl} mg/dL is borderline high (130-159 mg/dL)`);
        score += 1;
    }
    
    // HDL Cholesterol (protective)
    const hdlThreshold = data.gender === 'male' ? 
        CLINICAL_THRESHOLDS.cholesterol.hdlLow : 
        CLINICAL_THRESHOLDS.cholesterol.hdlLowWomen;
    
    if (data.hdl < hdlThreshold) {
        factors.push(`HDL cholesterol ${data.hdl} mg/dL is low (cardiovascular risk factor)`);
        score += 2;
    }
    
    // Triglycerides
    if (data.triglycerides >= CLINICAL_THRESHOLDS.cholesterol.triglyceridesVeryHigh) {
        factors.push(`Triglycerides ${data.triglycerides} mg/dL are very high (≥500 mg/dL, pancreatitis risk)`);
        score += 2;
    } else if (data.triglycerides >= CLINICAL_THRESHOLDS.cholesterol.triglyceridesHigh) {
        factors.push(`Triglycerides ${data.triglycerides} mg/dL are high (≥200 mg/dL)`);
        score += 1;
    } else if (data.triglycerides >= CLINICAL_THRESHOLDS.cholesterol.triglyceridesNormal) {
        factors.push(`Triglycerides ${data.triglycerides} mg/dL are borderline high (150-199 mg/dL)`);
        score += 1;
    }
    
    if (score === 0) return null;
    
    let confidence;
    let reasoning;
    
    if (score >= 5) {
        confidence = 'High';
        reasoning = 'Multiple lipid abnormalities present indicating significant dyslipidemia. Requires therapeutic lifestyle changes and possible pharmacotherapy.';
    } else if (score >= 3) {
        confidence = 'Medium';
        reasoning = 'Lipid panel shows abnormalities requiring attention. Lifestyle modifications and follow-up testing recommended.';
    } else {
        confidence = 'Low';
        reasoning = 'Mild lipid abnormalities detected. Consider dietary counseling and repeat testing.';
    }
    
    return {
        name: 'Dyslipidemia',
        confidence: confidence,
        factors: factors,
        reasoning: reasoning,
        score: score
    };
}

/**
 * Rule: Assess Combined Cardiovascular Risk
 * @param {Object} data - Patient data
 * @returns {Object|null} Condition object or null
 */
function assessCardiovascularRisk(data) {
    const factors = [];
    let score = 0;
    
    // Multiple risk factors present
    const hasHTN = data.systolic >= CLINICAL_THRESHOLDS.bloodPressure.stage1HTN.systolic || 
                   data.diastolic >= CLINICAL_THRESHOLDS.bloodPressure.stage1HTN.diastolic;
    
    const hasDyslipidemia = data.ldl >= CLINICAL_THRESHOLDS.cholesterol.ldlBorderline || 
                            data.totalCholesterol >= CLINICAL_THRESHOLDS.cholesterol.totalBorderline;
    
    const hasDiabetes = data.glucose >= CLINICAL_THRESHOLDS.glucose.prediabetes;
    
    const isObese = data.bmi >= CLINICAL_THRESHOLDS.bmi.obese;
    
    // Count major risk factors
    let riskFactorCount = 0;
    
    if (hasHTN) {
        factors.push('Hypertension present');
        riskFactorCount++;
        score += 2;
    }
    
    if (hasDyslipidemia) {
        factors.push('Dyslipidemia present');
        riskFactorCount++;
        score += 2;
    }
    
    if (hasDiabetes) {
        factors.push('Diabetes or prediabetes present');
        riskFactorCount++;
        score += 2;
    }
    
    if (isObese) {
        factors.push('Obesity present (BMI ≥30)');
        riskFactorCount++;
        score += 1;
    }
    
    // Age factor (non-modifiable)
    if (data.age >= 55 && data.gender === 'male') {
        factors.push('Male age ≥55 years');
        score += 1;
    } else if (data.age >= 65 && data.gender === 'female') {
        factors.push('Female age ≥65 years');
        score += 1;
    }
    
    // Symptoms
    const cvSymptoms = ['chest_pain', 'shortness_of_breath'];
    const presentSymptoms = data.symptoms.filter(s => cvSymptoms.includes(s));
    
    if (presentSymptoms.length >= 1) {
        factors.push('Cardiovascular symptoms present');
        score += 2;
    }
    
    // Only flag if multiple risk factors (≥2)
    if (riskFactorCount < 2) return null;
    
    let confidence;
    let reasoning;
    
    if (score >= 6) {
        confidence = 'High';
        reasoning = 'Multiple major cardiovascular risk factors present indicating elevated 10-year ASCVD risk. Comprehensive risk reduction strategy recommended including lifestyle modification and possible pharmacotherapy.';
    } else if (score >= 4) {
        confidence = 'Medium';
        reasoning = 'Several cardiovascular risk factors identified. Calculate formal ASCVD risk score and implement preventive measures.';
    } else {
        confidence = 'Low';
        reasoning = 'Some cardiovascular risk factors present. Address modifiable factors through lifestyle changes.';
    }
    
    return {
        name: 'Combined Cardiovascular Risk',
        confidence: confidence,
        factors: factors,
        reasoning: reasoning,
        score: score
    };
}