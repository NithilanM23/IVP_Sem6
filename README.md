# PulmoAI — Chest X-Ray Disease Prediction

PulmoAI is a course project developed for the **Image and Video Processing (IVP), Semester 6** course. The project explores the use of deep learning and explainable AI for detecting multiple thoracic diseases from chest X-ray images.

The repository combines:

- A Jupyter Notebook for exploratory data analysis and multi-label chest X-ray classification.
- A browser-based demonstration interface for uploading X-ray images and viewing prediction results.
- Grad-CAM visualizations to make model predictions more interpretable.

> **Important:** This project is intended for academic, research, and educational use only. It is not a medical diagnostic system and must not be used as a substitute for evaluation by a qualified healthcare professional.

## Project Overview

Chest radiographs can contain evidence of more than one condition at the same time. This project treats disease detection as a **multi-label classification** problem rather than assigning only one label to each image.

The notebook works with chest X-ray metadata containing findings such as:

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

The analysis includes label preparation, class-frequency analysis, imbalance handling with weighted loss, image transformations, dataset loading, and deep-learning model training/evaluation.

## Features

### Machine-learning workflow

- Exploratory analysis of chest X-ray metadata.
- Conversion of pipe-separated findings into binary multi-label targets.
- Analysis of patient attributes, image views, and pathology frequencies.
- Class-imbalance analysis using positive and negative label frequencies.
- Weighted loss calculation to reduce the effect of imbalanced labels.
- Image loading and preprocessing with PyTorch and Torchvision.
- Data augmentation using random rotation, resizing, tensor conversion, and normalization.
- GPU support when CUDA is available.

### Explainable-AI demonstration

The web interface presents a PulmoAI workflow with:

1. A landing page for the chest X-ray analysis system.
2. Drag-and-drop or file-browser upload support.
3. Image preview and file metadata.
4. An animated analysis workflow.
5. Original X-ray and Grad-CAM heatmap comparison.
6. Prediction, confidence, severity, and affected-area summaries.
7. A text-based report export option.

The current frontend demonstration uses **precomputed example results** for the bundled demo cases (`case1.png` through `case5.png`). It does not connect the browser directly to a live inference API.

## Repository Structure

```text
IVP_Sem6/
├── multi-label-chest-x-ray-classification.ipynb  # EDA and ML experimentation
├── index.html                                    # PulmoAI web interface
├── style.css                                     # Frontend styling and animations
├── script.js                                     # Demo interaction and result logic
├── images/                                       # X-ray and Grad-CAM assets
└── gradcam/                                      # Grad-CAM-related visualizations/assets
```

## Technologies Used

### Notebook and deep learning

- Python
- Jupyter Notebook
- NumPy
- Pandas
- Matplotlib
- Seaborn
- Plotly
- Pillow
- tqdm
- PyTorch
- Torchvision

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- SVG graphics
- Canvas-based particle animation

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NithilanM23/IVP_Sem6.git
cd IVP_Sem6
```

### 2. Run the web demonstration

The frontend is a static web application and does not require a build step.

You can either open `index.html` directly in a browser or start a local server:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

For the precomputed demo flow, use one of the supported example filenames:

```text
case1.png
case2.png
case3.png
case4.png
case5.png
```

The displayed result is selected by filename in `script.js`. Uploading another filename shows the demo's “No Precomputed Result” message.

### 3. Run the notebook

Create a Python environment and install the main dependencies:

```bash
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
pip install numpy pandas tqdm pillow seaborn matplotlib plotly torch torchvision jupyter
```

Start Jupyter:

```bash
jupyter notebook
```

Open `multi-label-chest-x-ray-classification.ipynb` and execute the cells in order.

> The notebook was originally prepared around a Kaggle-style dataset layout and references paths such as `../input/sample/sample_labels.csv`. To run it locally, download and organize the required chest X-ray images and label metadata, then update the dataset paths in the notebook.

## Methodology

The notebook follows this general workflow:

1. Load chest X-ray metadata and inspect the dataset.
2. Explore gender, age, view-position, and pathology distributions.
3. Convert the `Finding Labels` column into separate binary label columns.
4. Measure class imbalance across the disease categories.
5. Calculate positive and negative class weights.
6. Define a weighted multi-label loss function.
7. Build a PyTorch dataset and apply image transformations.
8. Train and evaluate a deep-learning classifier.
9. Use Grad-CAM-style visual explanations to identify image regions influencing predictions.

## Demo Results

The frontend contains illustrative precomputed cases, including examples labelled as:

- Edema
- Pneumonia
- Atelectasis
- Pulmonary Nodule
- Pleural Effusion

These values are part of the demonstration interface and should not be interpreted as validated clinical performance measurements.

## Limitations

- The repository does not currently include a production inference backend or model-serving API.
- The frontend uses filename-based, precomputed results for demonstration purposes.
- The full medical dataset is not included in the repository.
- Notebook dataset paths may require local configuration before execution.
- Training results depend on the dataset split, preprocessing, model configuration, hardware, and hyperparameters.
- Clinical deployment would require extensive validation, calibration, bias analysis, privacy controls, regulatory review, and expert oversight.

## Future Improvements

- Connect the web interface to a real PyTorch inference service.
- Add a reproducible `requirements.txt` or `environment.yml` file.
- Add explicit training, validation, and test scripts.
- Track metrics per disease, including AUROC, precision, recall, F1-score, and calibration.
- Add model checkpoints and configuration files where licensing permits.
- Improve Grad-CAM generation for the deployed model and validate explanations with domain experts.
- Add automated tests and continuous integration.
- Document the dataset source, licensing, preprocessing decisions, and experimental results.

## Academic Context

This repository was created as a **Semester 6 Image and Video Processing course project** to study chest X-ray analysis, multi-label image classification, class-imbalance handling, and explainable deep learning.

## License

No license has been specified for this repository yet. Until a license is added, the contents should be treated as **all rights reserved**. Add an appropriate open-source license if you want others to use, modify, or redistribute the project.
