const wheel = document.querySelector('.wheel');
const spinBtn = document.querySelector('.spinBtn');
const numbers = document.querySelectorAll('.triangle span');
const triangleDivs = document.querySelectorAll('.triangle'); 
const selectedPromptText = document.getElementById('selectedPromptText');

let usedPrompts = []; 
let unusedPrompts = []; 
let value = Math.ceil(Math.random() * 3600); 

async function getPromptsFromChatGPT() {
    return [
        "What’s the most interesting thing you’ve learned this week?",
        "What’s the best piece of advice you’ve ever received and how has it impacted your life?",
        "Describe a futuristic city in 100 words.",
        "What’s the most adventurous thing you’ve ever done and how did it change you?",
        "If you could have dinner with any fictional character, who would it be and why?",
        "Describe a skill you’ve always wanted to learn but haven’t yet. What’s holding you back?",
        "Describe your ideal vacation destination.",
        "Give tips for staying productive while working from home."
    ]; 
}

async function assignPrompts() {
    if (unusedPrompts.length === 0) {
        const prompts = await getPromptsFromChatGPT();
        unusedPrompts = prompts.filter(prompt => !usedPrompts.includes(prompt));
    }

    numbers.forEach((number, index) => {
        if (unusedPrompts.length === 0) {
            number.textContent = ''; 
            return;
        }

        const randomIndex = Math.floor(Math.random() * unusedPrompts.length);
        const selectedPrompt = unusedPrompts[randomIndex];
        number.textContent = selectedPrompt;
        number.setAttribute('title', selectedPrompt);
        unusedPrompts.splice(randomIndex, 1); 

        
        triangleDivs[index].classList.add('default-triangle');
        triangleDivs[index].classList.remove('selected-triangle'); 
        triangleDivs[index].classList.remove('large-triangle'); 
    });
}


assignPrompts();


function enlargeUnselectedTriangles() {
    triangleDivs.forEach((triangle, index) => {
        if (!usedPrompts.includes(numbers[index].textContent) && numbers[index].textContent !== '') {
            triangle.classList.add('large-triangle'); 
            triangle.classList.remove('default-triangle'); 
        } else {
            triangle.classList.remove('large-triangle'); 
            triangle.classList.add('default-triangle'); 
        }
    });
}


spinBtn.onclick = function() {
    let randomAngle = Math.ceil(Math.random() * 3600); 
    value += randomAngle;
    wheel.style.transform = "rotate(" + value + "deg)";

    
    setTimeout(() => {
        const segmentAngle = 360 / numbers.length; 
        const normalizedValue = value % 360; 
        const selectedIndex = Math.floor((360 - normalizedValue + segmentAngle / 2) % 360 / segmentAngle); 

        const selectedPrompt = numbers[selectedIndex].textContent;

        
        selectedPromptText.textContent = selectedPrompt;

        console.log("Selected Prompt:", selectedPrompt); 

        
        if (selectedPrompt && !usedPrompts.includes(selectedPrompt)) {
            usedPrompts.push(selectedPrompt); 
            numbers[selectedIndex].textContent = ''; 
            numbers[selectedIndex].removeAttribute('title'); 
            
            
            triangleDivs[selectedIndex].classList.add('selected-triangle'); 
            triangleDivs[selectedIndex].classList.remove('default-triangle'); 
            triangleDivs[selectedIndex].classList.remove('large-triangle'); 
            
            
            enlargeUnselectedTriangles();
        } else {
            console.log("Prompt has already been used: ", selectedPrompt);
        }

        
        if (usedPrompts.length === 8) {
            alert('All prompts have been used! Fetching new prompts...');
            usedPrompts = []; 
            triangleDivs.forEach(triangle => {
                triangle.classList.remove('small-triangle'); 
                triangle.classList.remove('large-triangle');
                triangle.classList.remove('selected-triangle');
                triangle.classList.add('default-triangle'); 
            });
            assignPrompts(); 
            selectedPromptText.textContent = 'None';
        }
    }, 5000); 
};
