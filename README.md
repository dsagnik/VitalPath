# VitalPath - Clinical Decision Support System

![VitalPath Logo](assets/icons/vital.svg)

## 🏥 Overview

VitalPath is a clinical decision support system designed to assist healthcare professionals in identifying metabolic and cardiovascular risks. It analyzes patient vitals, laboratory values, and symptoms to provide differential diagnoses, suggest diagnostic tests, and recommend care pathways.

**Important**: VitalPath is a supportive clinical tool and does not replace professional medical judgment.

🔗 **Deployment Link** - https://dsagnik.github.io/VitalPath

## 🎯 Features

- **Differential Diagnosis**: Ranked list of potential conditions with confidence levels
- **Clinical Reasoning**: Transparent, explainable decision logic based on standard medical guidelines
- **Diagnostic Test Recommendations**: Suggested tests to confirm or rule out identified conditions
- **Care Pathways**: High-level management recommendations for detected conditions
- **Professional UI**: Clean, modern interface designed for clinical use

## 🩺 Supported Conditions

VitalPath currently evaluates risk for:

1. **Type 2 Diabetes Risk** - Based on fasting glucose, BMI, age, and symptoms
2. **Hypertension** - Based on blood pressure readings and risk factors
3. **Dyslipidemia** - Based on lipid panel results (total cholesterol, LDL, HDL, triglycerides)
4. **Combined Cardiovascular Risk** - Multi-factorial assessment of cardiovascular disease risk

## 📁 Project Structure

```
VitalPath/
│
├── index.html                    # Patient data input interface
├── results.html                  # Diagnostic results dashboard
│
├── /assets/
│   ├── /css/
│   │   └── style.css             # Global styling
│   │
│   ├── /js/
│   │   ├── app.js                # Form handling & navigation
│   │   ├── engine.js             # Clinical reasoning engine
│   │   ├── rules.js              # Disease rules & thresholds
│   │   ├── knowledge.js          # Diagnostic tests & care pathways
│   │   └── results-display.js    # Results page rendering & UI logic
│   │
│   └── /icons/
│       └── vital.svg             # Application logo
│
├── /docs/
│   └── clinical-assumptions.md
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend or API keys required
- No dependencies or frameworks needed

### Installation

1. Clone or download the repository
2. Open `index.html` in your web browser
3. That's it! No build process or compilation needed

### Usage

1. **Input Patient Data**: On the main page, enter patient demographics, vital signs, laboratory values, and symptoms
2. **Analyze**: Click "Analyze Health Risk" to process the data
3. **Review Results**: View ranked conditions, contributing factors, suggested tests, and care pathways
4. **Start New Analysis**: Click "New Analysis" to evaluate another patient

## 🧠 Clinical Logic

### Rule-Based Decision System

VitalPath uses deterministic, rule-based logic inspired by established clinical guidelines:

- **ADA (American Diabetes Association)** - Diabetes diagnostic criteria
- **AHA/ACC (American Heart Association/American College of Cardiology)** - Hypertension guidelines
- **NCEP ATP III** - Cholesterol guidelines
- **WHO** - BMI classifications

### Confidence Levels

Each condition is assigned a confidence level based on the strength and number of clinical indicators:

- **High Confidence**: Multiple strong clinical indicators present, meets diagnostic criteria
- **Medium Confidence**: Several risk factors identified, further testing recommended
- **Low Confidence**: Some risk factors present, monitor and address through lifestyle modifications

### Scoring System

Each clinical rule assigns points based on:
- Severity of abnormal values
- Number of risk factors present
- Presence of relevant symptoms
- Age and demographic factors

Conditions are ranked by confidence level and total score.

## 🎨 Design Philosophy

VitalPath features a clean, professional interface designed for clinical settings:

- **Color Palette**: Soft medical gradient (light blue → teal) for a calm, trustworthy appearance
- **Layout**: Card-based sections with clear typography and ample white space
- **Visual Elements**: Subtle medical-themed background elements (stethoscope, heart monitor)
- **Accessibility**: High contrast, readable fonts, semantic HTML

## ⚠️ Limitations & Disclaimers

- **Not a Diagnostic Tool**: VitalPath is for educational and decision support purposes only
- **No Treatment Recommendations**: Does not provide specific drug names or dosages
- **Requires Clinical Judgment**: All findings must be verified by qualified healthcare professionals
- **Single-Time Assessment**: Does not track patient data over time
- **Limited Conditions**: Only evaluates 4 specific conditions; many other diagnoses may be possible
- **No Backend**: Data is processed locally and not stored permanently

## 🔒 Privacy & Data Security

- All patient data is processed locally in the browser
- No data is transmitted to external servers
- Data is stored temporarily in browser sessionStorage
- Data is cleared when the browser tab is closed
- No patient data is logged or retained

## 📚 Clinical References

1. American Diabetes Association. Standards of Medical Care in Diabetes—2024
2. 2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults
3. NCEP ATP III Guidelines for Cholesterol Management
4. World Health Organization BMI Classifications

## 🛠️ Technical Stack

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with modern gradient backgrounds and flexbox/grid layouts
- **Vanilla JavaScript** - All logic, no frameworks or libraries
- **sessionStorage API** - Temporary data persistence between pages

## 🔮 Future Enhancements

Potential additions for future versions:
- Export results as PDF reports
- Comparison of values against patient history
- Integration with EHR systems
- Additional condition assessments (kidney disease, metabolic syndrome)
- Multi-language support
- ASCVD risk calculator integration

## 👥 Contributors

Made with ❤️ by **Sagnik & Sarmin**

## 📄 License

This project is developed for educational and research purposes. 

## 🙏 Acknowledgments

- Clinical guidelines from ADA, AHA/ACC, NCEP, and WHO
- Medical professionals who provided feedback on clinical accuracy
- Healthcare UI/UX best practices from leading health tech platforms

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Demo Ready ✅
