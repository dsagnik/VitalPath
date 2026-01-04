/**
 * VitalPath - Clinical Reasoning Engine
 * Core logic for analyzing patient data and generating differential diagnosis
 */

/**
 * Main analysis function - runs all clinical rules
 * @param {Object} patientData - Complete patient data object
 * @returns {Object} Analysis results with conditions, tests, and pathways
 */
function analyzePatient(patientData) {
    // Array to store all detected conditions
    const detectedConditions = [];
    
    // Run each clinical rule
    const diabetesResult = assessDiabetesRisk(patientData);
    if (diabetesResult) {
        detectedConditions.push(diabetesResult);
    }
    
    const hypertensionResult = assessHypertension(patientData);
    if (hypertensionResult) {
        detectedConditions.push(hypertensionResult);
    }
    
    const dyslipidemiaResult = assessDyslipidemia(patientData);
    if (dyslipidemiaResult) {
        detectedConditions.push(dyslipidemiaResult);
    }
    
    const cvRiskResult = assessCardiovascularRisk(patientData);
    if (cvRiskResult) {
        detectedConditions.push(cvRiskResult);
    }
    
    // Sort conditions by confidence and score
    const sortedConditions = sortConditionsByPriority(detectedConditions);
    
    // Get relevant diagnostic tests
    const diagnosticTests = getDiagnosticTests(sortedConditions);
    
    // Get relevant care pathways
    const carePathways = getCarePathways(sortedConditions);
    
    return {
        conditions: sortedConditions,
        diagnosticTests: diagnosticTests,
        carePathways: carePathways,
        timestamp: new Date().toISOString()
    };
}

/**
 * Sort conditions by priority (confidence level and score)
 * @param {Array} conditions - Array of condition objects
 * @returns {Array} Sorted array of conditions
 */
function sortConditionsByPriority(conditions) {
    // Define confidence weights for sorting
    const confidenceWeights = {
        'High': 3,
        'Medium': 2,
        'Low': 1
    };
    
    // Sort by confidence weight (descending) then by score (descending)
    return conditions.sort((a, b) => {
        const weightDiff = confidenceWeights[b.confidence] - confidenceWeights[a.confidence];
        
        if (weightDiff !== 0) {
            return weightDiff;
        }
        
        // If confidence is the same, sort by score
        return b.score - a.score;
    });
}

/**
 * Calculate overall health risk summary
 * @param {Array} conditions - Array of detected conditions
 * @returns {Object} Risk summary object
 */
function calculateOverallRisk(conditions) {
    if (conditions.length === 0) {
        return {
            level: 'Low',
            message: 'No significant health risks identified based on current data. Patient presents with stable metabolic and cardiovascular parameters within acceptable clinical ranges.'
        };
    }
    
    const highConfidenceCount = conditions.filter(c => c.confidence === 'High').length;
    const mediumConfidenceCount = conditions.filter(c => c.confidence === 'Medium').length;
    
    if (highConfidenceCount >= 2) {
        return {
            level: 'High',
            message: 'Multiple high-confidence conditions detected requiring immediate clinical attention. Comprehensive evaluation and coordinated multidisciplinary management strategy recommended to address compounding risk factors and prevent disease progression.'
        };
    } else if (highConfidenceCount >= 1) {
        return {
            level: 'High',
            message: 'At least one high-priority condition identified meeting diagnostic criteria. Urgent clinical assessment, confirmatory testing, and initiation of evidence-based treatment protocol strongly recommended.'
        };
    } else if (mediumConfidenceCount >= 2) {
        return {
            level: 'Medium',
            message: 'Multiple moderate-risk conditions identified. Follow-up diagnostic testing recommended within 1-2 weeks to confirm findings. Early intervention with lifestyle modifications and possible pharmacotherapy may prevent progression to more severe disease states.'
        };
    } else {
        return {
            level: 'Low',
            message: 'Some health indicators warrant clinical attention and monitoring. Preventive measures including lifestyle modifications, regular follow-up, and risk factor management recommended to maintain optimal health status.'
        };
    }
}

/**
 * Generate clinical summary narrative
 * @param {Object} patientData - Patient data
 * @param {Object} analysis - Analysis results
 * @returns {String} Clinical summary text
 */
function generateClinicalSummary(patientData, analysis) {
    const age = patientData.age;
    const gender = patientData.gender;
    const conditionCount = analysis.conditions.length;
    
    let summary = `Comprehensive clinical analysis performed for ${age}-year-old ${gender} patient with `;
    
    if (conditionCount === 0) {
        summary += 'no significant health risks identified based on current vital signs and laboratory values. ';
        summary += 'Patient demonstrates stable metabolic and cardiovascular parameters within acceptable clinical ranges. ';
        summary += 'Recommendations include continuation of routine health maintenance with periodic screening as per age-appropriate guidelines. ';
        summary += 'Emphasis should be placed on preventive care strategies including healthy lifestyle habits, regular physical activity, and balanced nutrition to maintain current health status.';
    } else if (conditionCount === 1) {
        const condition = analysis.conditions[0];
        summary += `one significant area of clinical concern identified: ${condition.name} (${condition.confidence} confidence). `;
        summary += `Risk assessment reveals ${condition.factors.length} contributing factor${condition.factors.length > 1 ? 's' : ''} warranting targeted intervention. `;
        summary += 'Recommend focused diagnostic workup to confirm findings, followed by implementation of evidence-based treatment protocol. ';
        summary += 'Regular follow-up appointments advised to monitor response to interventions and adjust management strategy as clinically indicated.';
    } else {
        summary += `${conditionCount} distinct areas requiring clinical attention and comprehensive risk factor management. `;
        
        const highPriorityConditions = analysis.conditions
            .filter(c => c.confidence === 'High')
            .map(c => c.name);
        
        if (highPriorityConditions.length > 0) {
            summary += `High-priority conditions identified include: ${highPriorityConditions.join(', ')}. `;
            summary += 'These findings meet or approach diagnostic thresholds and require immediate clinical attention. ';
        }
        
        const mediumPriorityConditions = analysis.conditions
            .filter(c => c.confidence === 'Medium')
            .map(c => c.name);
        
        if (mediumPriorityConditions.length > 0) {
            summary += `Additionally, moderate-risk conditions include: ${mediumPriorityConditions.join(', ')}. `;
        }
        
        summary += 'Comprehensive risk factor management approach strongly recommended utilizing multidisciplinary care coordination. ';
        summary += 'Treatment strategy should address all identified conditions simultaneously to maximize therapeutic benefit and minimize cardiovascular event risk. ';
        summary += 'Patient education regarding disease processes, treatment adherence, and lifestyle modifications essential for optimal outcomes.';
    }
    
    return summary;
}