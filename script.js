const wheel = document.querySelector('.wheel');
const spinBtn = document.querySelector('.spinBtn');
const numbers = document.querySelectorAll('.triangle span');
const triangleDivs = document.querySelectorAll('.triangle');
const selectedPromptText = document.getElementById('selectedPromptText');
const nameList = document.getElementById('nameList');
const container = document.querySelector('.container');

let usedPrompts = [];
let unusedPrompts = [];
let preSetNames = ['Nestor', 'Noemi', 'Trini', 'Alyssa', 'Oli', 'Ann', 'Vanessa'];
let availableNames = [...preSetNames];
let usedNames = [];

const backgroundImages = {
    Nestor: 'url("https://images.unsplash.com/photo-1580603474920-aa3332b2c40f?q=80&w=2815&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    Noemi: 'url("https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?q=80&w=3015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    Trini: 'url("https://wallpapers.com/images/featured/duck-px752pz3biq4fs4f.jpg")',
    Alyssa: 'url("https://i.pinimg.com/736x/6f/f5/de/6ff5dea23ec79b7dd84bed56cd744c64.jpg")',
    Oli: 'url("https://w0.peakpx.com/wallpaper/384/56/HD-wallpaper-so-beautiful-and-happy-panda-panda-brothers-amazing-animal.jpg")',
    Ann: 'url("https://images.unsplash.com/photo-1486365227551-f3f90034a57c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    Vanessa: 'url("https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
};

let value = Math.ceil(Math.random() * 3600); 

async function getPromptsFromChatGPT() {
    return [
        "What’s the most interesting thing you’ve learned this week?",
        "What’s the best piece of advice you’ve ever received and how has it impacted your life?",
        "What’s a talent you wish you had and why?",
        "What’s the most adventurous thing you’ve ever done and how did it change you?",
        "If you could meet any historical figure, who would it be and what would you ask them?",
        "Describe a skill you’ve always wanted to learn but haven’t yet. What’s holding you back?",
        "What’s the weirdest food combination you secretly love?",
        "If your pet could talk, what do you think they’d say about you?",
        "What’s the craziest thing on your bucket list?"
    ];
}

async function assignPrompts() {
    if (unusedPrompts.length === 0) {
        const prompts = await getPromptsFromChatGPT();
        unusedPrompts = prompts.filter(prompt => !usedPrompts.includes(prompt));
    }

    numbers.forEach((number, index) => {
        if (unusedPrompts.length === 0) {
            number.textContent = ''; // Clear if no prompts available
            return;
        }
    
        const randomIndex = Math.floor(Math.random() * unusedPrompts.length);
        const selectedPrompt = unusedPrompts[randomIndex];
        number.textContent = selectedPrompt; // Assign prompt to the segment
        number.setAttribute('title', selectedPrompt); // Tooltip for clarity
        unusedPrompts.splice(randomIndex, 1); // Remove used prompt
    
        // Reset triangle visuals and text size
        triangleDivs[index].classList.add('default-triangle');
        triangleDivs[index].classList.remove('selected-triangle', 'blacked-out', 'enlarged');
        number.classList.remove('large-text'); // Reset text size
    });
    
}

function selectRandomName() {
    if (availableNames.length === 0) {
        resetNames();
    }

    const randomNameIndex = Math.floor(Math.random() * availableNames.length);
    const selectedName = availableNames[randomNameIndex];

    highlightSelectedName(selectedName);

    changeBackgroundImage(selectedName);

    availableNames.splice(randomNameIndex, 1);
    usedNames.push(selectedName);
}

function changeBackgroundImage(selectedName) {
    const imageUrl = backgroundImages[selectedName];
    if (imageUrl) {
        document.body.style.backgroundImage = imageUrl;
    }
}

function highlightSelectedName(selectedName) {
    const nameElements = nameList.querySelectorAll('.name');
    
    nameElements.forEach((nameElement) => {
        if (nameElement.textContent === selectedName) {
            nameElement.classList.add('selected');
        } else {
            nameElement.classList.remove('selected');
        }
    });
}

spinBtn.onclick = function () {
    if (availableNames.length === 0) {
        alert("All staff members have been selected as huddle leaders. Resetting...");
        resetNames();
    }
    selectRandomName();

    let randomAngle = Math.ceil(Math.random() * 3600);
    value += randomAngle;
    wheel.style.transform = "rotate(" + value + "deg)";

    setTimeout(() => {
        const segmentAngle = 360 / numbers.length;
        const normalizedValue = value % 360;
        const selectedIndex = Math.floor((360 - normalizedValue + segmentAngle / 2) % 360 / segmentAngle);
        const selectedPrompt = numbers[selectedIndex].textContent;

        if (selectedPrompt) {
            selectedPromptText.textContent = `Prompt: ${selectedPrompt}`;
            triangleDivs[selectedIndex].classList.add('blacked-out');
            numbers[selectedIndex].textContent = '';

            enlargeUnselectedTriangles();
        } else {
            console.log("No prompt available for selection.");
        }

        if (usedPrompts.length === 8) {
            alert('All prompts have been used! Fetching new prompts...');
            usedPrompts = [];
            assignPrompts();
            selectedPromptText.textContent = 'None';
        }
    }, 5000);
};

function enlargeUnselectedTriangles() {
    const unselectedTriangles = Array.from(triangleDivs).filter(triangle => !triangle.classList.contains('blacked-out'));
    
    unselectedTriangles.forEach((triangle, index) => {
        triangle.classList.add('enlarged');
        console.log(triangle.classList);

        const textElement = numbers[index];
        if (textElement && textElement.textContent) {
            textElement.classList.add('large-text');
        }
    });
    triangleDivs.forEach(triangle => {
        triangle.classList.add('adjusted-height');
    });
}

function resetNames() {
    availableNames = [...preSetNames];
    usedNames = [];
    highlightSelectedName(null);
    container.style.backgroundImage = '';
}

assignPrompts();
