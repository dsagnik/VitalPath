/**
 * VitalPath - Form Handling & Navigation
 * Handles patient data input and form submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('patientForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    console.log('Form submitted'); // Debug log
    
    // Collect form data
    const patientData = collectFormData();
    
    console.log('Patient data collected:', patientData); // Debug log
    
    // Validate data
    if (!validatePatientData(patientData)) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    console.log('Data validated successfully'); // Debug log
    
    // Store data in sessionStorage for results page
    try {
        sessionStorage.setItem('patientData', JSON.stringify(patientData));
        console.log('Data saved to sessionStorage'); // Debug log
        
        // Navigate to results page
        window.location.href = 'results.html';
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error processing data. Please try again.');
    }
}

/**
 * Collect all form data into an object
 * @returns {Object} Patient data object
 */
function collectFormData() {
    // Collect symptoms as array
    const symptoms = [];
    document.querySelectorAll('input[name="symptoms"]:checked').forEach(checkbox => {
        symptoms.push(checkbox.value);
    });
    
    // Get values directly from form elements
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const bmi = document.getElementById('bmi').value;
    const systolic = document.getElementById('systolic').value;
    const diastolic = document.getElementById('diastolic').value;
    const glucose = document.getElementById('glucose').value;
    const totalCholesterol = document.getElementById('totalCholesterol').value;
    const ldl = document.getElementById('ldl').value;
    const hdl = document.getElementById('hdl').value;
    const triglycerides = document.getElementById('triglycerides').value;
    
    return {
        age: parseInt(age),
        gender: gender,
        bmi: parseFloat(bmi),
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        glucose: parseInt(glucose),
        totalCholesterol: parseInt(totalCholesterol),
        ldl: parseInt(ldl),
        hdl: parseInt(hdl),
        triglycerides: parseInt(triglycerides),
        symptoms: symptoms
    };
}

/**
 * Validate patient data
 * @param {Object} data - Patient data to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validatePatientData(data) {
    // Check required fields
    if (!data.age || isNaN(data.age) || !data.gender || !data.bmi || isNaN(data.bmi)) {
        console.log('Demographics validation failed');
        return false;
    }
    if (!data.systolic || isNaN(data.systolic) || !data.diastolic || isNaN(data.diastolic)) {
        console.log('Blood pressure validation failed');
        return false;
    }
    if (!data.glucose || isNaN(data.glucose) || !data.totalCholesterol || isNaN(data.totalCholesterol)) {
        console.log('Lab values validation failed');
        return false;
    }
    if (!data.ldl || isNaN(data.ldl) || !data.hdl || isNaN(data.hdl) || !data.triglycerides || isNaN(data.triglycerides)) {
        console.log('Lipid panel validation failed');
        return false;
    }
    
    // Validate ranges
    if (data.age < 18 || data.age > 120) {
        alert('Age must be between 18 and 120 years');
        return false;
    }
    if (data.bmi < 10 || data.bmi > 60) {
        alert('BMI must be between 10 and 60');
        return false;
    }
    if (data.systolic < 70 || data.systolic > 250) {
        alert('Systolic BP must be between 70 and 250 mmHg');
        return false;
    }
    if (data.diastolic < 40 || data.diastolic > 150) {
        alert('Diastolic BP must be between 40 and 150 mmHg');
        return false;
    }
    if (data.glucose < 50 || data.glucose > 400) {
        alert('Glucose must be between 50 and 400 mg/dL');
        return false;
    }
    if (data.totalCholesterol < 100 || data.totalCholesterol > 400) {
        alert('Total Cholesterol must be between 100 and 400 mg/dL');
        return false;
    }
    
    console.log('All validations passed');
    return true;
}