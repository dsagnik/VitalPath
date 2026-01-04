/**
 * VitalPath - Medical Knowledge Base
 * Contains diagnostic tests and care pathway recommendations
 */

/**
 * Diagnostic tests mapped to conditions
 */
const DIAGNOSTIC_TESTS = {
    'Type 2 Diabetes Risk': [
        'Hemoglobin A1C (HbA1c) - 3-month average glucose',
        'Oral Glucose Tolerance Test (OGTT)',
        'Random plasma glucose test',
        'Lipid panel (comprehensive metabolic assessment)',
        'Urinalysis for glycosuria and microalbuminuria'
    ],
    
    'Hypertension': [
        'Ambulatory Blood Pressure Monitoring (24-hour)',
        'Electrocardiogram (ECG) to assess cardiac effects',
        'Echocardiogram if end-organ damage suspected',
        'Basic metabolic panel (electrolytes, creatinine)',
        'Urinalysis to assess renal function',
        'Lipid panel for cardiovascular risk assessment'
    ],
    
    'Dyslipidemia': [
        'Comprehensive lipid panel (fasting)',
        'Apolipoprotein B (ApoB) levels',
        'Lipoprotein(a) [Lp(a)] if family history present',
        'High-sensitivity C-reactive protein (hs-CRP)',
        'Thyroid function tests (TSH) to rule out secondary causes',
        'Liver function tests before considering statin therapy'
    ],
    
    'Combined Cardiovascular Risk': [
        'Coronary artery calcium (CAC) score',
        'Carotid intima-media thickness (CIMT)',
        'Ankle-brachial index (ABI)',
        'High-sensitivity troponin if symptoms present',
        'Exercise stress test or stress echocardiography',
        'Comprehensive metabolic panel'
    ]
};

/**
 * Care pathways mapped to conditions
 */
const CARE_PATHWAYS = {
    'Type 2 Diabetes Risk': {
        condition: 'Type 2 Diabetes Management',
        steps: [
            'Lifestyle Modification: Medical nutrition therapy with registered dietitian, target weight loss of 5-10% if overweight',
            'Physical Activity: Recommend 150 minutes/week of moderate-intensity aerobic activity plus resistance training',
            'Self-Monitoring: Blood glucose monitoring education and log review',
            'Diabetes Self-Management Education and Support (DSMES) program enrollment',
            'Regular follow-up: HbA1c monitoring every 3 months if above target, assess for complications',
            'Consider referral to endocrinology if glucose remains uncontrolled or complex case'
        ]
    },
    
    'Hypertension': {
        condition: 'Hypertension Management',
        steps: [
            'Lifestyle Modifications: DASH diet, sodium restriction (<2300mg/day), weight loss if BMI ≥25',
            'Home Blood Pressure Monitoring: Train patient on proper technique, target <130/80 mmHg',
            'Physical Activity: Aerobic exercise 90-150 minutes/week, resistance training 2-3 days/week',
            'Limit alcohol intake: ≤2 drinks/day for men, ≤1 drink/day for women',
            'Stress management and adequate sleep (7-9 hours/night)',
            'Follow-up schedule: Monthly until BP controlled, then every 3-6 months',
            'Consider cardiovascular risk calculator and assess for end-organ damage'
        ]
    },
    
    'Dyslipidemia': {
        condition: 'Dyslipidemia Management',
        steps: [
            'Therapeutic Lifestyle Changes (TLC): Reduce saturated fat (<7% of calories), eliminate trans fats',
            'Increase dietary fiber (10-25g soluble fiber daily) and plant stanols/sterols',
            'Weight management if overweight: 5-10% weight reduction improves lipid profile',
            'Regular aerobic exercise: 30-40 minutes of moderate-high intensity, 3-4 days/week',
            'Calculate 10-year ASCVD risk score to guide treatment intensity',
            'Follow-up lipid panel in 4-12 weeks after lifestyle changes or therapy initiation',
            'Consider referral to lipid specialist if LDL ≥190 mg/dL or familial hyperlipidemia suspected'
        ]
    },
    
    'Combined Cardiovascular Risk': {
        condition: 'Comprehensive Cardiovascular Risk Reduction',
        steps: [
            'Calculate formal 10-year ASCVD risk score using pooled cohort equations',
            'Multi-faceted risk factor management: Address all identified modifiable risk factors simultaneously',
            'Consider low-dose aspirin for primary prevention in select high-risk patients (discuss benefits/risks)',
            'Smoking cessation counseling if applicable (single most important modifiable risk factor)',
            'Comprehensive dietary intervention: Mediterranean or DASH diet pattern',
            'Structured exercise program with cardiac rehabilitation referral if appropriate',
            'Regular monitoring: Follow-up every 3-6 months with reassessment of all risk factors',
            'Consider cardiology referral if symptoms present or very high risk (≥20% 10-year ASCVD risk)'
        ]
    }
};

/**
 * Get relevant diagnostic tests for detected conditions
 * @param {Array} conditions - Array of condition objects
 * @returns {Array} Array of diagnostic test strings
 */
function getDiagnosticTests(conditions) {
    const tests = [];
    
    conditions.forEach(condition => {
        if (DIAGNOSTIC_TESTS[condition.name]) {
            tests.push(...DIAGNOSTIC_TESTS[condition.name]);
        }
    });
    
    // Remove duplicates and return
    return [...new Set(tests)];
}

/**
 * Get relevant care pathways for detected conditions
 * @param {Array} conditions - Array of condition objects
 * @returns {Array} Array of care pathway objects
 */
function getCarePathways(conditions) {
    const pathways = [];
    
    conditions.forEach(condition => {
        if (CARE_PATHWAYS[condition.name]) {
            pathways.push(CARE_PATHWAYS[condition.name]);
        }
    });
    
    return pathways;
}