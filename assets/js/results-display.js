/**
 * VitalPath - Results Display Handler
 * Comprehensive display logic for clinical analysis results
 */

// Load and process patient data
const patientData = JSON.parse(sessionStorage.getItem('patientData'));

if (!patientData) {
    alert('No patient data found. Redirecting to input form.');
    window.location.href = 'index.html';
} else {
    // Run analysis
    const analysis = analyzePatient(patientData);
    
    // Display all sections
    displayExecutiveSummary(patientData, analysis);
    displayPatientSummary(patientData);
    displayConditions(analysis.conditions);
    displayDiagnosticTests(analysis.diagnosticTests, analysis.conditions);
    displayCarePathways(analysis.carePathways, patientData);
    displayClinicalNotes(patientData, analysis);
}

/**
 * Display Executive Summary with risk assessment
 */
function displayExecutiveSummary(data, analysis) {
    const container = document.getElementById('executiveSummary');
    const overallRisk = calculateOverallRisk(analysis.conditions);
    const summary = generateClinicalSummary(data, analysis);
    
    const riskColorMap = {
        'High': 'danger',
        'Medium': 'warning',
        'Low': 'success'
    };
    
    const highPriorityCount = analysis.conditions.filter(c => c.confidence === 'High').length;
    const urgentSymptoms = getUrgentSymptoms(data.symptoms);
    
    container.innerHTML = `
        <div class="executive-summary-content">
            <div class="risk-indicator risk-${riskColorMap[overallRisk.level]}">
                <div class="risk-level">
                    <span class="risk-label">Overall Risk Level</span>
                    <span class="risk-value">${overallRisk.level} Risk</span>
                </div>
                <div class="risk-message">${overallRisk.message}</div>
                ${urgentSymptoms.length > 0 ? `
                    <div class="urgent-alert">
                        <strong>🚨 Urgent Symptoms Detected:</strong> ${urgentSymptoms.join(', ')}
                    </div>
                ` : ''}
            </div>

            <div class="clinical-summary-text">
                <h4>🩺 Clinical Synopsis</h4>
                <p>${summary}</p>
            </div>

            <div class="key-metrics">
                <div class="metric-item">
                    <span class="metric-label">Conditions Identified</span>
                    <span class="metric-value">${analysis.conditions.length}</span>
                    <span class="metric-sublabel">${analysis.conditions.length === 0 ? 'Healthy' : analysis.conditions.length === 1 ? 'Single concern' : 'Multiple concerns'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">High Priority Findings</span>
                    <span class="metric-value">${highPriorityCount}</span>
                    <span class="metric-sublabel">${highPriorityCount === 0 ? 'None detected' : 'Requires attention'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Diagnostic Tests</span>
                    <span class="metric-value">${new Set(analysis.diagnosticTests).size}</span>
                    <span class="metric-sublabel">Recommended studies</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Symptom Burden</span>
                    <span class="metric-value">${data.symptoms.length}</span>
                    <span class="metric-sublabel">${data.symptoms.length === 0 ? 'Asymptomatic' : data.symptoms.length <= 2 ? 'Mild' : 'Moderate'}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Display comprehensive patient profile
 */
function displayPatientSummary(data) {
    const content = document.getElementById('summaryContent');
    
    const bmiCategory = getBMICategory(data.bmi);
    const bpCategory = getBPCategory(data.systolic, data.diastolic);
    const glucoseCategory = getGlucoseCategory(data.glucose);
    const lipidRisk = getLipidRisk(data);
    
    content.innerHTML = `
        <div class="summary-section">
            <h4 class="summary-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="#2196F3" stroke-width="2" />
                    <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
                </svg>
                👤 Demographics & Body Composition
            </h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Age</span>
                    <span class="summary-value">${data.age} years</span>
                    <span class="summary-note ${data.age >= 45 ? 'warning-text' : 'success-text'}">
                        ${data.age < 30 ? 'Low age-related risk' : data.age < 45 ? 'Moderate age-related risk' : data.age < 65 ? 'Elevated age-related risk' : 'High age-related risk'}
                    </span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Gender</span>
                    <span class="summary-value">${data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}</span>
                    <span class="summary-note">Gender-specific risk thresholds applied</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Body Mass Index (BMI)</span>
                    <span class="summary-value">${data.bmi} kg/m²</span>
                    <span class="summary-note ${bmiCategory.colorClass}">${bmiCategory.category}</span>
                    <span class="summary-note">${bmiCategory.interpretation}</span>
                    <span class="summary-note"><strong>Clinical Impact:</strong> ${bmiCategory.clinicalImpact}</span>
                </div>
            </div>
        </div>

        <div class="summary-section">
            <h4 class="summary-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12L6 9L9 15L12 6L15 12L18 9L21 12" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ❤️ Cardiovascular Assessment
            </h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Systolic Blood Pressure</span>
                    <span class="summary-value">${data.systolic} mmHg</span>
                    <span class="summary-note ${bpCategory.systolic.colorClass}">${bpCategory.systolic.category}</span>
                    <span class="summary-note">${bpCategory.systolic.interpretation}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Diastolic Blood Pressure</span>
                    <span class="summary-value">${data.diastolic} mmHg</span>
                    <span class="summary-note ${bpCategory.diastolic.colorClass}">${bpCategory.diastolic.category}</span>
                    <span class="summary-note">${bpCategory.diastolic.interpretation}</span>
                </div>
                <div class="summary-item full-width">
                    <span class="summary-label">Blood Pressure Classification</span>
                    <span class="summary-value ${bpCategory.overall.colorClass}">${bpCategory.overall.category}</span>
                    <span class="summary-note"><strong>Recommendation:</strong> ${bpCategory.overall.recommendation}</span>
                    <span class="summary-note"><strong>Clinical Significance:</strong> ${bpCategory.overall.significance}</span>
                </div>
            </div>
        </div>

        <div class="summary-section">
            <h4 class="summary-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="8" r="4" stroke="#2196F3" stroke-width="2" />
                    <path d="M15 12V21" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
                </svg>
                🍬 Metabolic Status
            </h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Fasting Glucose</span>
                    <span class="summary-value">${data.glucose} mg/dL</span>
                    <span class="summary-note ${glucoseCategory.colorClass}">${glucoseCategory.category}</span>
                    <span class="summary-note">${glucoseCategory.interpretation}</span>
                    <span class="summary-note"><strong>Clinical Impact:</strong> ${glucoseCategory.clinicalImpact}</span>
                </div>
            </div>
        </div>

        <div class="summary-section">
            <h4 class="summary-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3V7C8 7 8 9 6 9C4 9 4 7 4 7V3" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6 9V21" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
                </svg>
                🧬 Complete Lipid Panel Analysis
            </h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">Total Cholesterol</span>
                    <span class="summary-value">${data.totalCholesterol} mg/dL</span>
                    <span class="summary-note ${lipidRisk.totalCholesterol.colorClass}">${lipidRisk.totalCholesterol.status}</span>
                    <span class="summary-note">${lipidRisk.totalCholesterol.interpretation}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">LDL Cholesterol</span>
                    <span class="summary-value">${data.ldl} mg/dL</span>
                    <span class="summary-note ${lipidRisk.ldl.colorClass}">${lipidRisk.ldl.status}</span>
                    <span class="summary-note">${lipidRisk.ldl.interpretation}</span>
                    <span class="summary-note"><strong>Primary treatment target</strong></span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">HDL Cholesterol</span>
                    <span class="summary-value">${data.hdl} mg/dL</span>
                    <span class="summary-note ${lipidRisk.hdl.colorClass}">${lipidRisk.hdl.status}</span>
                    <span class="summary-note">${lipidRisk.hdl.interpretation}</span>
                    <span class="summary-note">${lipidRisk.hdl.clinicalNote}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Triglycerides</span>
                    <span class="summary-value">${data.triglycerides} mg/dL</span>
                    <span class="summary-note ${lipidRisk.triglycerides.colorClass}">${lipidRisk.triglycerides.status}</span>
                    <span class="summary-note">${lipidRisk.triglycerides.interpretation}</span>
                </div>
                <div class="summary-item full-width">
                    <span class="summary-label">Comprehensive Lipid Assessment</span>
                    <span class="summary-value">${lipidRisk.overallAssessment}</span>
                    <span class="summary-note"><strong>Clinical Recommendation:</strong> ${lipidRisk.clinicalRecommendation}</span>
                </div>
            </div>
        </div>

        ${data.symptoms.length > 0 ? `
        <div class="summary-section">
            <h4 class="summary-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
                </svg>
                🩹 Symptom Analysis
            </h4>
            <div class="symptoms-display">
                ${data.symptoms.map(symptom => {
                    const severity = getSymptomSeverity(symptom);
                    return `<span class="symptom-badge severity-${severity.level}">${formatSymptom(symptom)}</span>`;
                }).join('')}
            </div>
            <p class="symptom-note"><strong>Symptom Correlation:</strong> ${getSymptomCorrelation(data.symptoms)}</p>
            <p class="symptom-note"><strong>Clinical Significance:</strong> ${getSymptomSignificance(data.symptoms)}</p>
        </div>
        ` : '<div class="summary-section"><p class="no-symptoms">✅ Patient reports no current symptoms (asymptomatic presentation)</p></div>'}
    `;
}

/**
 * Display detailed conditions analysis
 */
function displayConditions(conditions) {
    const container = document.getElementById('conditionsList');
    
    if (conditions.length === 0) {
        container.innerHTML = `
            <div class="no-findings">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" stroke-width="2" />
                    <path d="M8 12L11 15L16 9" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h4>✅ No Significant Conditions Identified</h4>
                <p>Based on comprehensive clinical analysis of vital signs, laboratory values, and reported symptoms, patient presents with stable metabolic and cardiovascular parameters within acceptable clinical ranges.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = conditions.map((condition, index) => {
        const severityIndicator = getSeverityIndicator(condition);
        const detailedAnalysis = getDetailedConditionAnalysis(condition);
        
        return `
        <div class="condition-card severity-${severityIndicator.level}">
            <div class="condition-header">
                <div class="condition-title-section">
                    <span class="condition-rank">#${index + 1}</span>
                    <div>
                        <h4>${condition.name}</h4>
                        <span class="condition-subtitle">Risk Score: ${condition.score} points | Evidence Level: ${getEvidenceLevel(condition.score)}</span>
                    </div>
                </div>
                <span class="confidence-badge confidence-${condition.confidence.toLowerCase()}">${condition.confidence} Confidence</span>
            </div>

            <div class="condition-body">
                <div class="clinical-reasoning">
                    <h5>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>&nbsp
                        Clinical Reasoning & Analysis
                    </h5>
                    <p>${condition.reasoning}</p>
                    <p class="detailed-reasoning">${detailedAnalysis.reasoning}</p>
                </div>

                <div class="contributing-factors">
                    <h5>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11L12 14L22 4" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
                        </svg>&nbsp
                        Contributing Factors (${condition.factors.length} identified)
                    </h5>
                    <ul>
                        ${condition.factors.map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                </div>

                <div class="clinical-implications">
                    <h5>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#2196F3" stroke-width="2"/>
                            <path d="M12 6V12L16 14" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
                        </svg>&nbsp
                        Clinical Implications
                    </h5>
                    <p><strong>Pathophysiology:</strong> ${detailedAnalysis.pathophysiology}</p>
                    <p><strong>Complications if Untreated:</strong> ${detailedAnalysis.complications}</p>
                    <p><strong>Action Timeline:</strong> ${detailedAnalysis.timeline}</p>
                </div>

                <div class="prognosis">
                    <h5>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 11.08V12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2" stroke="#43A047" stroke-width="2"/>
                            <path d="M22 4L12 14.01L9 11.01" stroke="#43A047" stroke-width="2" stroke-linecap="round"/>
                        </svg>&nbsp
                        Prognosis with Treatment
                    </h5>
                    <p>${detailedAnalysis.prognosis}</p>
                </div>
            </div>
        </div>
    `}).join('');
}

/**
 * Display diagnostic tests with detailed information
 */
function displayDiagnosticTests(tests, conditions) {
    const container = document.getElementById('diagnosticTests');
    
    if (tests.length === 0) {
        container.innerHTML = '<p class="no-findings">No additional diagnostic tests recommended at this time.</p>';
        return;
    }

    const testsByPriority = categorizeDiagnosticTests(tests, conditions);
    
    let html = '';
    
    if (testsByPriority.urgent.length > 0) {
        html += `
        <div class="test-category">
            <h4 class="test-category-title urgent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#E53935" stroke-width="2" />
                    <path d="M12 8V12M12 16H12.01" stroke="#E53935" stroke-width="2" stroke-linecap="round"/>
                </svg>
                🚨 Urgent Priority Tests
            </h4>
            <p class="category-description">Required within 24-48 hours</p>
            <div class="tests-list">
                ${testsByPriority.urgent.map(test => `
                <div class="test-item priority-urgent">
                    <span class="test-name">${test.name}</span>
                    <span class="test-purpose">${test.purpose}</span>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    }
    
    if (testsByPriority.routine.length > 0) {
        html += `
        <div class="test-category">
            <h4 class="test-category-title routine">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#FB8C00" stroke-width="2" />
                    <path d="M12 6V12L16 14" stroke="#FB8C00" stroke-width="2" stroke-linecap="round"/>
                </svg>
                🔬 Routine Priority Tests
            </h4>
            <p class="category-description">Schedule within 1-2 weeks</p>
            <div class="tests-list">
                ${testsByPriority.routine.map(test => `
                <div class="test-item priority-routine">
                    <span class="test-name">${test.name}</span>
                    <span class="test-purpose">${test.purpose}</span>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    }
    
    if (testsByPriority.followup.length > 0) {
        html += `
        <div class="test-category">
            <h4 class="test-category-title followup">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#43A047" stroke-width="2" />
                    <path d="M9 12L11 14L15 10" stroke="#43A047" stroke-width="2" stroke-linecap="round"/>
                </svg>
                📊 Follow-up & Monitoring Tests
            </h4>
            <p class="category-description">Ongoing monitoring</p>
            <div class="tests-list">
                ${testsByPriority.followup.map(test => `
                <div class="test-item priority-followup">
                    <span class="test-name">${test.name}</span>
                    <span class="test-purpose">${test.purpose}</span>
                </div>
                `).join('')}
            </div>
        </div>
        `;
    }
    
    container.innerHTML = html;
}

/**
 * Display comprehensive care pathways
 */
function displayCarePathways(pathways, patientData) {
    const container = document.getElementById('carePathways');
    
    if (pathways.length === 0) {
        container.innerHTML = '<p class="no-findings">No specific clinical management pathways required at this time.</p>';
        return;
    }

    container.innerHTML = pathways.map((pathway, index) => `
        <div class="pathway-card">
            <div class="pathway-header">
                <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3945 4.16454 19.8034 3.91848 19.19 3.91848C18.5766 3.91848 17.9855 4.16454 17.54 4.61L8.74 13.41C8.39689 13.7524 8.14526 14.1758 8.00998 14.6406C7.87471 15.1053 7.86019 15.5971 7.96798 16.0688L8.85998 20.01L12.8 19.12C13.2717 19.0122 13.7635 18.9977 14.2282 19.133C14.693 19.2683 15.1164 19.5199 15.4588 19.863L15.46 19.86L19.46 15.86C19.9055 15.4145 20.1515 14.8234 20.1515 14.21C20.1515 13.5966 19.9055 13.0055 19.46 12.56L20.84 4.61Z" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    💊 ${pathway.condition}
                </h4>
                <span class="pathway-badge">Pathway ${index + 1} of ${pathways.length}</span>
            </div>

            <div class="pathway-steps">
                ${pathway.steps.map((step, stepIndex) => {
                    const category = categorizeStep(step);
                    return `
                <div class="pathway-step ${category.class}">
                    <div class="step-number">${stepIndex + 1}</div>
                    <div class="step-content">
                        <div class="step-category">${category.label}</div>
                        <p>${step}</p>
                        <div class="step-timing">${getStepTiming(stepIndex, pathway.steps.length)}</div>
                    </div>
                </div>
            `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

/**
 * Display clinical notes
 */
function displayClinicalNotes(data, analysis) {
    const container = document.getElementById('clinicalNotes');
    const timestamp = new Date().toLocaleString();
    const dataQuality = assessDataQuality(data);

    container.innerHTML = `
        <div class="clinical-notes-content">
            <div class="notes-section">
                <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#2196F3" stroke-width="2"/>
                        <path d="M16 2V6M8 2V6M3 10H21" stroke="#2196F3" stroke-width="2"/>
                    </svg>&nbsp
                    Analysis Metadata
                </h4>
                <div class="metadata-grid">
                    <div class="metadata-item">
                        <span class="metadata-label">Analysis Timestamp:</span>
                        <span class="metadata-value">${timestamp}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">System Version:</span>
                        <span class="metadata-value">VitalPath v1.0.0</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Data Completeness:</span>
                        <span class="metadata-value">${dataQuality.completeness}%</span>
                    </div>
                </div>
            </div>

            <div class="notes-section">
                <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01" stroke="#FB8C00" stroke-width="2" stroke-linecap="round"/>
                        <path d="M10.29 3.86L1.82 18A2 2 0 003.64 21H20.36A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="#FB8C00" stroke-width="2"/>
                    </svg>&nbsp
                    Important Considerations
                </h4>
                <div class="considerations-grid">
                    <div class="consideration-item warning">
                        <div>
                            <strong>⚕️ Clinical Verification Required</strong>
                            <p>All findings require confirmation through comprehensive clinical assessment.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getUrgentSymptoms(symptoms) {
    const urgent = [];
    if (symptoms.includes('chest_pain')) urgent.push('Chest Pain');
    if (symptoms.includes('shortness_of_breath')) urgent.push('Shortness of Breath');
    return urgent;
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', interpretation: 'Below healthy weight', colorClass: 'warning-text', clinicalImpact: 'May require nutritional assessment' };
    if (bmi < 25) return { category: 'Normal', interpretation: 'Healthy weight', colorClass: 'success-text', clinicalImpact: 'Maintain current weight' };
    if (bmi < 30) return { category: 'Overweight', interpretation: 'Above healthy weight', colorClass: 'warning-text', clinicalImpact: '5-10% weight loss recommended' };
    if (bmi < 35) return { category: 'Obese Class I', interpretation: 'Moderate obesity', colorClass: 'danger-text', clinicalImpact: 'Intensive lifestyle intervention needed' };
    return { category: 'Obese Class II+', interpretation: 'Severe obesity', colorClass: 'danger-text', clinicalImpact: 'Consider bariatric evaluation' };
}

function getBPCategory(systolic, diastolic) {
    const result = { systolic: {}, diastolic: {}, overall: {} };
    
    if (systolic < 120) result.systolic = { category: 'Normal', interpretation: 'Optimal', colorClass: 'success-text' };
    else if (systolic < 130) result.systolic = { category: 'Elevated', interpretation: 'Borderline high', colorClass: 'warning-text' };
    else if (systolic < 140) result.systolic = { category: 'Stage 1 HTN', interpretation: 'Mild hypertension', colorClass: 'warning-text' };
    else if (systolic < 180) result.systolic = { category: 'Stage 2 HTN', interpretation: 'Moderate-severe hypertension', colorClass: 'danger-text' };
    else result.systolic = { category: 'Crisis', interpretation: 'Emergency', colorClass: 'danger-text' };
    
    if (diastolic < 80) result.diastolic = { category: 'Normal', interpretation: 'Optimal', colorClass: 'success-text' };
    else if (diastolic < 90) result.diastolic = { category: 'Stage 1', interpretation: 'Mild elevation', colorClass: 'warning-text' };
    else if (diastolic < 120) result.diastolic = { category: 'Stage 2', interpretation: 'Moderate-severe', colorClass: 'danger-text' };
    else result.diastolic = { category: 'Crisis', interpretation: 'Emergency', colorClass: 'danger-text' };
    
    if (systolic >= 180 || diastolic >= 120) {
        result.overall = { category: 'Hypertensive Crisis', recommendation: 'Emergency evaluation required', colorClass: 'danger-text', significance: 'Risk of acute end-organ damage' };
    } else if (systolic >= 140 || diastolic >= 90) {
        result.overall = { category: 'Stage 2 Hypertension', recommendation: 'Pharmacotherapy indicated', colorClass: 'danger-text', significance: 'Elevated cardiovascular risk' };
    } else if (systolic >= 130 || diastolic >= 80) {
        result.overall = { category: 'Stage 1 Hypertension', recommendation: 'Lifestyle modifications + consider medication', colorClass: 'warning-text', significance: 'Increased risk' };
    } else if (systolic >= 120) {
        result.overall = { category: 'Elevated', recommendation: 'Lifestyle modifications', colorClass: 'warning-text', significance: 'Monitor regularly' };
    } else {
        result.overall = { category: 'Normal', recommendation: 'Continue healthy habits', colorClass: 'success-text', significance: 'Optimal cardiovascular health' };
    }
    
    return result;
}

function getGlucoseCategory(glucose) {
    if (glucose < 100) return { category: 'Normal', interpretation: 'Healthy glucose', colorClass: 'success-text', clinicalImpact: 'Maintain current lifestyle' };
    if (glucose < 126) return { category: 'Prediabetes', interpretation: 'Impaired fasting glucose', colorClass: 'warning-text', clinicalImpact: 'Lifestyle intervention can prevent diabetes' };
    return { category: 'Diabetes Range', interpretation: 'Meets diagnostic threshold', colorClass: 'danger-text', clinicalImpact: 'Requires confirmation and management' };
}

function getLipidRisk(data) {
    const result = {};
    
    if (data.totalCholesterol < 200) result.totalCholesterol = { status: 'Desirable', interpretation: 'Optimal', colorClass: 'success-text' };
    else if (data.totalCholesterol < 240) result.totalCholesterol = { status: 'Borderline', interpretation: 'Moderate risk', colorClass: 'warning-text' };
    else result.totalCholesterol = { status: 'High', interpretation: 'Elevated risk', colorClass: 'danger-text' };
    
    if (data.ldl < 100) result.ldl = { status: 'Optimal', interpretation: 'Ideal level', colorClass: 'success-text' };
    else if (data.ldl < 130) result.ldl = { status: 'Near Optimal', interpretation: 'Acceptable', colorClass: 'success-text' };
    else if (data.ldl < 160) result.ldl = { status: 'Borderline High', interpretation: 'Lifestyle changes recommended', colorClass: 'warning-text' };
    else if (data.ldl < 190) result.ldl = { status: 'High', interpretation: 'Medication likely needed', colorClass: 'danger-text' };
    else result.ldl = { status: 'Very High', interpretation: 'Statin therapy recommended', colorClass: 'danger-text' };
    
    const hdlThreshold = data.gender === 'male' ? 40 : 50;
    if (data.hdl < hdlThreshold) result.hdl = { status: 'Low', interpretation: 'Risk factor', colorClass: 'danger-text', clinicalNote: 'Low HDL increases cardiovascular risk' };
    else if (data.hdl >= 60) result.hdl = { status: 'High', interpretation: 'Protective', colorClass: 'success-text', clinicalNote: 'Excellent cardioprotection' };
    else result.hdl = { status: 'Acceptable', interpretation: 'Adequate', colorClass: 'success-text', clinicalNote: 'Within normal range' };
    
    if (data.triglycerides < 150) result.triglycerides = { status: 'Normal', interpretation: 'Optimal', colorClass: 'success-text' };
    else if (data.triglycerides < 200) result.triglycerides = { status: 'Borderline', interpretation: 'Lifestyle modifications', colorClass: 'warning-text' };
    else if (data.triglycerides < 500) result.triglycerides = { status: 'High', interpretation: 'Increased risk', colorClass: 'danger-text' };
    else result.triglycerides = { status: 'Very High', interpretation: 'Pancreatitis risk', colorClass: 'danger-text' };
    
    const abnormalities = [
        data.totalCholesterol >= 240,
        data.ldl >= 160,
        data.hdl < hdlThreshold,
        data.triglycerides >= 200
    ].filter(Boolean).length;
    
    if (abnormalities === 0) {
        result.overallAssessment = 'Favorable lipid profile';
        result.clinicalRecommendation = 'Continue healthy lifestyle. Repeat in 5 years.';
    } else if (abnormalities === 1) {
        result.overallAssessment = 'Single lipid abnormality';
        result.clinicalRecommendation = 'Lifestyle changes recommended. Recheck in 3-6 months.';
    } else {
        result.overallAssessment = 'Multiple lipid abnormalities';
        result.clinicalRecommendation = 'Comprehensive management required. Consider statin therapy.';
    }
    
    return result;
}

function getSymptomSeverity(symptom) {
    if (['chest_pain', 'shortness_of_breath'].includes(symptom)) return { level: 'urgent', class: 'severe' };
    if (['headache', 'dizziness', 'blurred_vision'].includes(symptom)) return { level: 'moderate', class: 'moderate' };
    return { level: 'mild', class: 'mild' };
}

function formatSymptom(symptom) {
    return symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getSymptomCorrelation(symptoms) {
    if (symptoms.length === 0) return 'No symptoms reported';
    
    const diabetesSymptoms = ['frequent_urination', 'increased_thirst', 'blurred_vision', 'fatigue'].filter(s => symptoms.includes(s));
    const htnSymptoms = ['headache', 'dizziness'].filter(s => symptoms.includes(s));
    const cardiacSymptoms = ['chest_pain', 'shortness_of_breath'].filter(s => symptoms.includes(s));
    
    const correlation = [];
    if (diabetesSymptoms.length >= 2) correlation.push(`${diabetesSymptoms.length} diabetes-related symptoms`);
    if (htnSymptoms.length >= 1) correlation.push(`${htnSymptoms.length} hypertension-related symptom(s)`);
    if (cardiacSymptoms.length >= 1) correlation.push(`${cardiacSymptoms.length} cardiac symptom(s)`);
    
    return correlation.length > 0 ? correlation.join('; ') : 'Non-specific symptom pattern';
}

function getSymptomSignificance(symptoms) {
    if (symptoms.includes('chest_pain') || symptoms.includes('shortness_of_breath')) {
        return 'URGENT: Cardiac symptoms require immediate evaluation to rule out acute coronary syndrome';
    }
    if (symptoms.length >= 4) return 'Multiple symptoms suggest significant disease burden';
    if (symptoms.length >= 2) return 'Several symptoms may indicate underlying metabolic/cardiovascular dysfunction';
    return 'Mild symptom burden requiring monitoring';
}

function getSeverityIndicator(condition) {
    if (condition.confidence === 'High' && condition.score >= 5) return { level: 'critical', label: 'Critical Priority', icon: '🔴' };
    if (condition.confidence === 'High') return { level: 'high', label: 'High Priority', icon: '🟠' };
    if (condition.confidence === 'Medium' && condition.score >= 4) return { level: 'moderate', label: 'Moderate Priority', icon: '🟡' };
    if (condition.confidence === 'Medium') return { level: 'mild-moderate', label: 'Mild-Moderate Priority', icon: '🟡' };
    return { level: 'mild', label: 'Mild Priority', icon: '🟢' };
}

function getEvidenceLevel(score) {
    if (score >= 6) return 'Very Strong Evidence';
    if (score >= 5) return 'Strong Evidence';
    if (score >= 3) return 'Moderate Evidence';
    return 'Suggestive Evidence';
}

function getDetailedConditionAnalysis(condition) {
    const analyses = {
        'Type 2 Diabetes Risk': {
            reasoning: 'Chronic hyperglycemia results from insulin resistance and/or beta-cell dysfunction, leading to impaired glucose uptake by peripheral tissues.',
            pathophysiology: 'Progressive deterioration of pancreatic beta-cell function combined with peripheral insulin resistance leads to sustained hyperglycemia.',
            complications: 'Microvascular (retinopathy, nephropathy, neuropathy) and macrovascular (coronary artery disease, stroke, peripheral artery disease) complications. Risk of diabetic ketoacidosis in uncontrolled cases.',
            timeline: 'Initiate diagnostic workup within 1-2 weeks. Early intervention critical to prevent progression and complications.',
            prognosis: 'With proper management including lifestyle modification, glucose monitoring, and pharmacotherapy: HbA1c reduction of 1-2% achievable, 25-40% reduction in microvascular complications, improved quality of life and life expectancy.'
        },
        'Hypertension': {
            reasoning: 'Sustained elevation in arterial blood pressure increases cardiac workload and vascular stress, promoting atherosclerosis and end-organ damage.',
            pathophysiology: 'Multifactorial etiology including increased peripheral vascular resistance, sodium retention, sympathetic nervous system activation, and renin-angiotensin-aldosterone system dysregulation.',
            complications: 'Left ventricular hypertrophy, heart failure, stroke, chronic kidney disease, retinopathy, aortic dissection, and increased cardiovascular mortality.',
            timeline: 'Repeat measurements to confirm diagnosis. If confirmed Stage 2 HTN, initiate treatment within 1 month. Hypertensive crisis requires immediate intervention.',
            prognosis: 'Target BP <130/80 achievable in 80-90% of patients with appropriate therapy. Each 10 mmHg reduction in systolic BP reduces cardiovascular events by 20%, stroke by 27%, heart failure by 28%.'
        },
        'Dyslipidemia': {
            reasoning: 'Elevated atherogenic lipoproteins (LDL, VLDL) and/or reduced protective HDL cholesterol accelerate atherosclerotic plaque formation in arterial walls.',
            pathophysiology: 'Imbalance between lipid production, transport, and clearance leads to lipid accumulation in arterial intima, inflammatory response, and plaque development.',
            complications: 'Atherosclerotic cardiovascular disease including myocardial infarction, ischemic stroke, peripheral artery disease. Very high triglycerides (>500 mg/dL) increase acute pancreatitis risk.',
            timeline: 'Confirm with fasting lipid panel. If LDL ≥190 mg/dL or multiple risk factors present, initiate therapy within 1-2 months.',
            prognosis: 'Each 39 mg/dL (1 mmol/L) LDL reduction decreases major cardiovascular events by 22%. High-intensity statins achieve 30-50% LDL reduction. Benefits increase with duration of therapy.'
        },
        'Combined Cardiovascular Risk': {
            reasoning: 'Multiple concurrent cardiovascular risk factors have synergistic effects, exponentially increasing risk of major adverse cardiovascular events (MACE).',
            pathophysiology: 'Clustering of metabolic abnormalities (hypertension, dyslipidemia, insulin resistance, obesity) creates pro-inflammatory, pro-thrombotic state accelerating atherosclerosis.',
            complications: 'Coronary artery disease, myocardial infarction, stroke, heart failure, chronic kidney disease, peripheral artery disease, and premature cardiovascular mortality.',
            timeline: 'Calculate formal 10-year ASCVD risk score. High-risk patients (≥20%) require aggressive multi-factorial intervention within 1 month.',
            prognosis: 'Comprehensive risk factor management reduces cardiovascular events by 30-50%. Early intervention and sustained treatment adherence critical for optimal outcomes. Lifestyle modifications provide additive benefit to pharmacotherapy.'
        }
    };
    
    return analyses[condition.name] || {
        reasoning: 'Clinical assessment indicates risk factors requiring attention.',
        pathophysiology: 'Multiple contributing factors identified.',
        complications: 'May lead to disease progression if unaddressed.',
        timeline: 'Follow-up within 1-2 months recommended.',
        prognosis: 'Early intervention improves outcomes.'
    };
}

function categorizeDiagnosticTests(tests, conditions) {
    const highPriorityConditions = conditions.filter(c => c.confidence === 'High').map(c => c.name);
    const result = { urgent: [], routine: [], followup: [] };
    
    const testDetails = {
        'Hemoglobin A1C (HbA1c) - 3-month average glucose': {
            purpose: 'Gold standard for diabetes diagnosis and glycemic control',
            priority: 'urgent'
        },
        'Oral Glucose Tolerance Test (OGTT)': {
            purpose: 'Confirms impaired glucose tolerance and diabetes',
            priority: 'routine'
        },
        'Random plasma glucose test': {
            purpose: 'Quick screening for hyperglycemia',
            priority: 'routine'
        },
        'Lipid panel (comprehensive metabolic assessment)': {
            purpose: 'Comprehensive cholesterol and triglyceride analysis',
            priority: 'routine'
        },
        'Urinalysis for glycosuria and microalbuminuria': {
            purpose: 'Screen for diabetic kidney disease',
            priority: 'followup'
        },
        'Ambulatory Blood Pressure Monitoring (24-hour)': {
            purpose: 'Confirms hypertension diagnosis',
            priority: 'urgent'
        },
        'Electrocardiogram (ECG) to assess cardiac effects': {
            purpose: 'Detects hypertensive heart disease or ischemia',
            priority: 'urgent'
        },
        'Echocardiogram if end-organ damage suspected': {
            purpose: 'Cardiac structure and function assessment',
            priority: 'routine'
        },
        'Basic metabolic panel (electrolytes, creatinine)': {
            purpose: 'Assess kidney function before medications',
            priority: 'routine'
        },
        'Urinalysis to assess renal function': {
            purpose: 'Screen for proteinuria',
            priority: 'followup'
        },
        'Comprehensive lipid panel (fasting)': {
            purpose: 'Complete cholesterol analysis',
            priority: 'routine'
        },
        'Apolipoprotein B (ApoB) levels': {
            purpose: 'Advanced marker of atherogenic particles',
            priority: 'followup'
        },
        'Lipoprotein(a) [Lp(a)] if family history present': {
            purpose: 'Genetic cardiovascular risk factor',
            priority: 'followup'
        },
        'High-sensitivity C-reactive protein (hs-CRP)': {
            purpose: 'Inflammatory biomarker for CV risk',
            priority: 'followup'
        },
        'Thyroid function tests (TSH) to rule out secondary causes': {
            purpose: 'Exclude thyroid disorders',
            priority: 'routine'
        },
        'Liver function tests before considering statin therapy': {
            purpose: 'Baseline hepatic function',
            priority: 'routine'
        },
        'Coronary artery calcium (CAC) score': {
            purpose: 'Quantify coronary atherosclerosis',
            priority: 'routine'
        },
        'Carotid intima-media thickness (CIMT)': {
            purpose: 'Measure subclinical atherosclerosis',
            priority: 'followup'
        },
        'Ankle-brachial index (ABI)': {
            purpose: 'Screen for peripheral artery disease',
            priority: 'followup'
        },
        'High-sensitivity troponin if symptoms present': {
            purpose: 'Rule out acute coronary syndrome',
            priority: 'urgent'
        },
        'Exercise stress test or stress echocardiography': {
            purpose: 'Assess for inducible myocardial ischemia',
            priority: 'routine'
        },
        'Comprehensive metabolic panel': {
            purpose: 'Broad organ function screening',
            priority: 'routine'
        },
        'Lipid panel for cardiovascular risk assessment': {
            purpose: 'Standard dyslipidemia screening',
            priority: 'routine'
        }
    };
    
    tests.forEach(test => {
        const detail = testDetails[test] || { purpose: 'Clinical evaluation', priority: 'routine' };
        
        const testObj = {
            name: test,
            purpose: detail.purpose
        };
        
        if (highPriorityConditions.length > 0 && detail.priority === 'routine') {
            result.urgent.push(testObj);
        } else if (detail.priority === 'urgent') {
            result.urgent.push(testObj);
        } else if (detail.priority === 'routine') {
            result.routine.push(testObj);
        } else {
            result.followup.push(testObj);
        }
    });
    
    return result;
}

function categorizeStep(step) {
    const stepLower = step.toLowerCase();
    if (stepLower.includes('lifestyle') || stepLower.includes('diet') || stepLower.includes('exercise') || stepLower.includes('nutrition')) {
        return { class: 'step-lifestyle', label: '🥗 Lifestyle' };
    } else if (stepLower.includes('monitor') || stepLower.includes('follow-up')) {
        return { class: 'step-monitoring', label: '📊 Monitoring' };
    } else if (stepLower.includes('referral') || stepLower.includes('specialist')) {
        return { class: 'step-referral', label: '👨‍⚕️ Referral' };
    } else if (stepLower.includes('education') || stepLower.includes('train')) {
        return { class: 'step-education', label: '📚 Education' };
    }
    return { class: 'step-clinical', label: '💊 Clinical' };
}

function getStepTiming(index, total) {
    const percentage = index / total;
    if (percentage < 0.3) return '⏱️ Immediate (1-2 weeks)';
    if (percentage < 0.7) return '📅 Short-term (1-3 months)';
    return '🔄 Ongoing maintenance';
}

function assessDataQuality(data) {
    const requiredFields = ['age', 'gender', 'bmi', 'systolic', 'diastolic', 'glucose', 'totalCholesterol', 'ldl', 'hdl', 'triglycerides'];
    const providedFields = requiredFields.filter(field => data[field] !== null && data[field] !== undefined && data[field] !== '');
    const completeness = Math.round((providedFields.length / requiredFields.length) * 100);
    
    return {
        completeness: completeness,
        quality: completeness === 100 ? 'Excellent' : completeness >= 90 ? 'Good' : 'Fair',
        factorsAnalyzed: providedFields.length
    };
}