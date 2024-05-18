document.getElementById('fileInput').addEventListener('change', handleFileUpload);

let elementsData = {};

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            elementsData = JSON.parse(e.target.result);
            displayElements();
        };
        reader.readAsText(file);
    }
}

function displayElements() {
    const elementsContainer = document.getElementById('elementsContainer');
    elementsContainer.innerHTML = '';

    Object.keys(elementsData).forEach(key => {
        const element = elementsData[key];
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element';
        elementDiv.innerHTML = `<div>${element[0]}</div><div>${element[1]}</div>`;
        elementDiv.addEventListener('click', () => showGuide(key));
        elementsContainer.appendChild(elementDiv);
    });
}

function showGuide(elementKey) {
    const guideContainer = document.getElementById('guideContainer');
    const element = elementsData[elementKey];

    if (element[2] === 1) {
        guideContainer.innerHTML = `<h2>${element[1]}</h2><p>This is a primary element.</p>`;
    } else {
        guideContainer.innerHTML = `<h2>${element[1]}</h2><p>Combination:</p><p>${elementsData[element[3]][1]} + ${elementsData[element[4]][1]}</p>`;
    }

    guideContainer.style.display = 'block';
}

// Load initial data if data.json exists
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        elementsData = data;
        displayElements();
    })
    .catch(error => console.error('Error loading initial data:', error));
