document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));

let elementsData = {};
let displayedElements = {};
const chunkSize = 1000; // Number of elements to process at a time

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                elementsData = JSON.parse(e.target.result);
                displayedElements = elementsData;
                displayElements();
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.onerror = function(e) {
            console.error('File reading error:', e);
        };
        reader.readAsText(file);
    }
}

function displayElements() {
    const elementsContainer = document.getElementById('elementsContainer');
    elementsContainer.innerHTML = '';
    let keys = Object.keys(displayedElements);
    renderElementsChunk(keys, 0);
}

function renderElementsChunk(keys, start) {
    const elementsContainer = document.getElementById('elementsContainer');
    const end = Math.min(start + chunkSize, keys.length);

    for (let i = start; i < end; i++) {
        const key = keys[i];
        const element = displayedElements[key];
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element';
        elementDiv.innerHTML = `<div>${element[0]}</div><div>${element[1]}</div>`;
        elementDiv.addEventListener('click', () => showGuide(key));
        elementsContainer.appendChild(elementDiv);
    }

    if (end < keys.length) {
        setTimeout(() => renderElementsChunk(keys, end), 0);
    }
}

function showGuide(elementKey) {
    const guideContainer = document.getElementById('guideContainer');
    guideContainer.innerHTML = '';
    generateGuide(elementKey, guideContainer);
    guideContainer.style.display = 'block';
}

function generateGuide(elementKey, container, step = 1) {
    const element = elementsData[elementKey];
    const guideStep = document.createElement('div');
    guideStep.className = 'guide-step';

    if (element[2] === 1) {
        guideStep.innerHTML = `<p>Step ${step}: ${element[1]} [Primary Element]</p>`;
    } else {
        const subStep1 = element[3];
        const subStep2 = element[4];
        guideStep.innerHTML = `<p>Step ${step}: ${elementsData[subStep1][1]} + ${elementsData[subStep2][1]} = ${element[1]}</p>`;
        container.appendChild(guideStep);
        generateGuide(subStep1, container, step + 1);
        generateGuide(subStep2, container, step + 1);
    }

    container.appendChild(guideStep);
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    displayedElements = Object.fromEntries(
        Object.entries(elementsData)
            .filter(([key, value]) => value[1].toLowerCase().includes(query))
            .sort((a, b) => a[1][1].localeCompare(b[1][1]))
    );
    displayElements();
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Load initial data if data.json exists
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        elementsData = data;
        displayedElements = data;
        displayElements();
    })
    .catch(error => console.error('Error loading initial data:', error));
