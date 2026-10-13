# PulmoAI: Explainable Multi-Label Chest X-Ray Disease Prediction

## Abstract

PulmoAI is an academic project developed as part of the **Image and Video Processing (IVP) course in Semester 6**. The project investigates the application of deep learning to chest radiograph analysis, with emphasis on **multi-label disease classification**, class-imbalance handling, and explainable artificial intelligence.

The repository contains a Jupyter Notebook for exploratory data analysis and model development, together with a browser-based interface for presenting chest X-ray predictions and Grad-CAM-based visual explanations.

> **Medical disclaimer:** This project is intended solely for academic, research, and educational purposes. It is not a certified medical device and must not be used to provide, confirm, or replace a clinical diagnosis. Medical decisions should always be made by qualified healthcare professionals.

## 1. Introduction

A single chest X-ray may exhibit signs of more than one thoracic condition. Accordingly, this project formulates disease prediction as a **multi-label classification problem**, where an image can be associated with multiple findings simultaneously rather than being assigned to only one class.

The project uses chest X-ray metadata containing radiological findings such as:

- Atelectasis
- Cardiomegaly
- Consolidation
- Edema
- Effusion
- Emphysema
- Fibrosis
- Hernia
- Infiltration
- Mass
- Nodule
- Pleural thickening
- Pneumonia
- Pneumothorax

The analysis covers metadata exploration, label transformation, class-frequency analysis, weighted-loss design, image preprocessing, dataset construction, and deep-learning-based classification.

## 2. Project Objectives

The primary objectives of this project are to:

1. Study the characteristics of chest X-ray metadata and disease-label distributions.
2. Formulate chest radiograph disease prediction as a multi-label classification task.
3. Investigate the effect of class imbalance on model learning.
4. Apply weighted loss functions to improve the treatment of underrepresented findings.
5. Develop an image-processing and deep-learning workflow using PyTorch.
6. Explore Grad-CAM-based visual explanations for model predictions.
7. Present predictions and explanations through an accessible browser interface.

## 3. Methodology

The project follows the workflow below:

1. Load and inspect chest X-ray metadata.
2. Perform exploratory analysis of patient attributes, image views, and finding frequencies.
3. Convert the pipe-separated `Finding Labels` field into independent binary target columns.
4. Quantify positive and negative class frequencies for each pathology.
5. Calculate class weights to address label imbalance.
6. Define a weighted multi-label loss function.
7. Construct a custom PyTorch dataset for loading and transforming images.
8. Apply image preprocessing and augmentation, including rotation, resizing, tensor conversion, and normalization.
9. Train and evaluate a deep-learning classifier.
10. Generate Grad-CAM-style visualizations to identify image regions associated with predictions.

## 4. Repository Contents

```text
IVP_Sem6/
├── multi-label-chest-x-ray-classification.ipynb  # EDA, preprocessing, and ML workflow
├── index.html                                    # Chest X-ray analysis interface
├── style.css                                     # Interface styling and visual effects
├── script.js                                     # Client-side interaction and result rendering
├── images/                                       # X-ray and visualization assets
└── gradcam/                                      # Grad-CAM visualization assets
```

## 5. Key Components

### 5.1 Exploratory Data Analysis and Classification Notebook

The notebook provides the main computational workflow for the project. It includes:

- Loading and inspecting chest X-ray label metadata.
- Analysis of patient gender, age, and view-position distributions.
- Construction of binary labels for individual pathologies.
- Visualization of disease prevalence and label imbalance.
- Calculation of positive and negative class frequencies.
- Implementation of a weighted loss function.
- Custom dataset and data-loader preparation using PyTorch.
- Image transformation and normalization.
- Model training and evaluation components.

### 5.2 Explainable-AI Interface

The web interface is designed to communicate the analysis workflow and present model outputs in a structured format. It includes:

- Chest X-ray image upload through file browsing or drag and drop.
- Image preview and file-information display.
- Analysis progress visualization.
- Side-by-side comparison of the original image and Grad-CAM heatmap.
- Prediction, confidence score, severity, and affected-area fields.
- Textual explanation of the predicted finding.
- Export of a text-based analysis report.

The included JavaScript currently uses predefined result mappings for the available image cases. A production deployment would replace these mappings with calls to a trained model through an inference service.

## 6. Technologies and Libraries

### Machine Learning and Image Processing

- Python
- Jupyter Notebook
- NumPy
- Pandas
- Pillow
- tqdm
- Matplotlib
- Seaborn
- Plotly
- PyTorch
- Torchvision

### Web Interface

- HTML5
- CSS3
- Vanilla JavaScript
- SVG graphics
- HTML Canvas API

## 7. Installation and Execution

### 7.1 Clone the Repository

```bash
git clone https://github.com/NithilanM23/IVP_Sem6.git
cd IVP_Sem6
```

### 7.2 Run the Web Interface

The web interface is composed of static HTML, CSS, JavaScript, and image assets. It does not require a separate build system.

To serve the files locally using Python:

```bash
python -m http.server 8000
```

Open the following address in a browser:

```text
http://localhost:8000
```

The interface supports the image cases referenced by `script.js`, including `case1.png` through `case5.png`, provided that the corresponding assets are available in the expected directories.

### 7.3 Run the Jupyter Notebook

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
```

Install the required packages:

```bash
pip install numpy pandas tqdm pillow seaborn matplotlib plotly torch torchvision jupyter
```

Launch Jupyter Notebook:

```bash
jupyter notebook
```

Open `multi-label-chest-x-ray-classification.ipynb` and execute the cells sequentially.

> The notebook was prepared using a Kaggle-style dataset layout and refers to paths such as `../input/sample/sample_labels.csv`. For local execution, download the required dataset separately, arrange the files according to the expected structure, and update the paths in the notebook where necessary.

## 8. Dataset Considerations

The notebook expects chest X-ray images and corresponding metadata containing image identifiers and finding labels. The complete medical dataset is not included in this repository.

Before using any dataset, verify:

- The dataset license and permitted uses.
- The provenance and quality of the labels.
- Patient privacy and de-identification requirements.
- The suitability of the dataset for the intended academic experiment.
- Potential demographic and institutional biases.

## 9. Limitations

- The repository does not currently contain a production model-serving backend.
- The browser interface is not connected to a live inference endpoint.
- The full chest X-ray dataset is not stored in the repository.
- The notebook may require path adjustments and dependency-version compatibility fixes.
- Reported metrics and interface values should not be interpreted as clinically validated performance.
- Results may vary according to dataset composition, train-validation split, preprocessing, model architecture, hardware, and hyperparameters.
- Clinical deployment would require external validation, calibration, fairness analysis, privacy safeguards, regulatory review, and continuous monitoring.

## 10. Future Scope

Potential extensions of this work include:

- Connecting the interface to a trained PyTorch inference API.
- Adding reproducible dependency files such as `requirements.txt` or `environment.yml`.
- Separating training, validation, testing, and inference code into maintainable modules.
- Reporting per-pathology AUROC, precision, recall, F1-score, sensitivity, specificity, and calibration.
- Adding model checkpoints and experiment configuration files where licensing permits.
- Improving Grad-CAM generation and comparing explanations across model architectures.
- Evaluating model performance across demographic and acquisition subgroups.
- Adding automated tests, documentation, and continuous integration.
- Recording dataset citations, preprocessing decisions, experimental settings, and final results.

## 11. Academic Context

This repository was developed as a **Semester 6 Image and Video Processing course project**. It combines image analysis, machine learning, deep neural networks, class-imbalance mitigation, and explainable AI to study the automated analysis of chest radiographs.

## 12. License

No open-source license has been specified for this repository. Until a license is added, the contents should be considered **all rights reserved**. If reuse, modification, or redistribution is intended, add an appropriate license to the repository.
