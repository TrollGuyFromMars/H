document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('searchInput').addEventListener('input', handleSearch);

let elementsData = {};
let displayedElements = {};

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
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

    Object.keys(displayedElements).forEach(key => {
        const element = displayedElements[key];
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

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    displayedElements = Object.fromEntries(
        Object.entries(elementsData).filter(([key, value]) =>
            value[1].toLowerCase().includes(query)
        )
    );
    displayElements();
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
