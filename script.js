document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements Selection
            const inputs = {
                subject: document.getElementById('subject'),
                action: document.getElementById('action'),
                context: document.getElementById('context'),
                style: document.getElementById('style'),
                camera_angle: document.getElementById('camera-angle'),
                camera_movement: document.getElementById('camera-movement'),
                lighting: document.getElementById('lighting'),
                quality: document.getElementById('quality'),
                negative_prompt: document.getElementById('negative_prompt')
            };
            const generatedPromptEl = document.getElementById('generated-prompt');
            const progressBar = document.getElementById('prompt-progress-bar');
            const analyzerTip = document.getElementById('analyzer-tip');
            const copyBtn = document.getElementById('copy-btn');
            const exampleBtn = document.getElementById('example-btn');
            const mixerBtn = document.getElementById('mixer-btn');
            const clearBtn = document.getElementById('clear-btn');
            const modal = document.getElementById('example-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const modalPromptEl = document.getElementById('modal-prompt');
            const modalAnalysisEl = document.getElementById('modal-analysis');
            const copyrightEl = document.getElementById('copyright');

            // --- DATA ---
            const mixerData = {
                subjects: ['An elephant with butterfly wings', 'A jet-powered medieval knight', 'A Victorian robot detective', 'An intergalactic sorceress queen', 'An astronaut cat in boots', 'A city made of clocks', 'An octopus chef', 'A ghost librarian', 'A garden statue that has come to life', 'A river of lava', 'A tree that grows crystal fruit', 'A skyscraper made of books', 'An origami dragon', 'A lighthouse in the middle of a desert'],
                actions: ['skateboarding on a rainbow highway', 'painting a masterpiece with light', 'solving a holographic mystery', 'gardening on asteroids', 'sailing a paper boat in a thunderstorm', 'building a sandcastle that reaches the clouds', 'telling stories to forest animals', 'organizing flying books', 'juggling miniature planets', 'conducting an orchestra of robots', 'breakdancing on a spiderweb'],
                contexts: ['in an infinite library', 'during a neon meteor shower', 'in an abandoned underwater city', 'at a cyberpunk music festival', 'on a floating castle above the clouds', 'in a space station overgrown with vegetation', 'inside a giant cuckoo clock', 'on a black sand beach with two suns', 'in a forest where the trees are made of crystal', 'in a bustling marketplace on Mars'],
                styles: ['in anime style', 'cinematic', 'in a vintage film style', 'in 3D animation style', 'in watercolor style', 'black and white', 'in slow motion']
            };

            const curatedMixes = [
                { subject: 'A miniature futuristic city inside a snow globe', action: 'with flying cars circulating and tiny people walking', context: 'being gently shaken by a giant hand, causing snow to fall', style: 'cinematic', camera_angle: 'a close-up shot of', camera_movement: 'with a slow zoom-out', lighting: 'soft, magical light from within the globe', quality: 'photorealistic, 8K, highly detailed', negative_prompt: 'blurry hand' },
                { subject: 'An ancient dragon made of constellations and stardust', action: 'flying majestically through the cosmos', context: 'passing by vibrant nebulas and distant galaxies', style: 'in 3D animation style', camera_angle: 'a wide shot of', camera_movement: 'panning from left to right', lighting: 'ethereal glow from the dragon and nebulas', quality: 'epic quality, vivid colors', negative_prompt: 'planets, asteroids' },
                { subject: 'An old watchmaker', action: 'putting the final touches on an ornate pocket watch that controls time', context: 'in his dusty, chaotic workshop filled with gears', style: 'in a vintage film style', camera_angle: 'an extreme close-up shot of', camera_movement: 'with a slow zoom-in', lighting: 'warm light from a single bulb, deep shadows', quality: 'sharp focus, film grain, nostalgic', negative_prompt: 'modern, clean' }
            ];

            const examples = [
                {
                    prompt: { subject: 'A lonely lighthouse', action: 'withstanding a violent storm', context: 'on a rocky coast at night', style: 'cinematic', camera_angle: 'a wide shot of', camera_movement: 'with a slow zoom-in', lighting: 'dramatic lightning flashes', quality: 'hyperrealistic, 8K', negative_prompt: 'calm sea' },
                    analysis: [
                        { part: 'Subject', text: 'Clearly defines the main focus of the scene.', color: '#4285F4' },
                        { part: 'Action', text: 'Creates tension and dynamism, telling a story.', color: '#EA4335' },
                        { part: 'Context', text: 'Establishes the environment and atmosphere.', color: '#34A853' },
                        { part: 'Camera', text: 'Combining a wide shot with a slow zoom creates a powerful cinematic effect.', color: '#FBBC05' },
                        { part: 'Details', text: 'Lighting and quality enhance realism and visual impact.', color: '#5f6368' }
                    ]
                },
                {
                    prompt: { subject: 'A floating flower market', action: 'bustling with vendors and customers', context: 'on a canal in a fantasy city at dawn', style: 'in watercolor style', camera_angle: 'a drone shot of', camera_movement: 'panning from left to right', lighting: 'soft morning light, vibrant colors', quality: 'dreamlike', negative_prompt: '' },
                    analysis: [
                        { part: 'Style', text: 'The "watercolor" style sets a unique, artistic visual aesthetic.', color: '#4285F4' },
                        { part: 'Subject/Action', text: 'The "bustling" description adds complexity and movement to the scene.', color: '#EA4335' },
                        { part: 'Context', text: 'The fantasy setting gives the AI creative freedom.', color: '#34A853' },
                        { part: 'Camera', text: 'A drone shot with a pan is perfect for revealing the scale and beauty of the market.', color: '#FBBC05' }
                    ]
                },
                {
                    prompt: { subject: 'A single drop of water', action: 'falling into a mirrored pond', context: 'in a minimalist environment', style: 'black and white', camera_angle: 'an extreme close-up shot of', camera_movement: '', lighting: 'focused studio light', quality: 'in slow motion, 4K', negative_prompt: 'color' },
                    analysis: [
                        { part: 'Minimalism', text: 'The simplicity of the subject and context forces focus on detail and action.', color: '#4285F4' },
                        { part: 'Technique', text: 'Combining "black and white" with "slow motion" creates immense dramatic impact.', color: '#EA4335' },
                        { part: 'Camera', text: 'The "extreme close-up" is essential for capturing the texture and impact of the drop.', color: '#FBBC05' },
                        { part: 'Negative', text: 'Ensures the black and white aesthetic is respected by removing any color.', color: '#5f6368' }
                    ]
                },
                 {
                    prompt: { subject: 'a cherry blossom flower', action: 'blooming, from bud to full flower', context: 'with a soft-focus Mount Fuji in the background', style: 'timelapse of', camera_angle: 'a close-up shot of', camera_movement: '', lighting: 'transition from morning to afternoon light', quality: 'highly detailed, realistic', negative_prompt: '' },
                    analysis: [
                        { part: 'Style', text: '"Timelapse" is the main command that dictates the video\'s format.', color: '#4285F4' },
                        { part: 'Action', text: 'The action "from bud to full flower" describes the process the timelapse must capture.', color: '#EA4335' },
                        { part: 'Context', text: 'Adding an iconic background ("Mount Fuji") enriches the scene without overpowering it.', color: '#34A853' },
                        { part: 'Lighting', text: 'Specifying the light transition makes the timelapse more dynamic and realistic.', color: '#FBBC05' }
                    ]
                }
            ];

            // --- CORE FUNCTIONS ---

            /**
             * Builds a prompt string from the provided prompt data object.
             * @param {object} promptData - An object containing the various parts of the prompt.
             * @returns {string} The fully constructed prompt string.
             */
            const buildPromptString = (promptData) => {
                let promptParts = [];
                const { subject, action, context, style, camera_angle, camera_movement, lighting, quality, negative_prompt } = promptData;

                let cameraPart = '';
                if (camera_angle && camera_movement) {
                    cameraPart = `${camera_angle}, ${camera_movement}, of`;
                } else if (camera_angle) {
                    cameraPart = camera_angle;
                } else if (camera_movement) {
                    cameraPart = camera_movement + ' of';
                }
                if (cameraPart) promptParts.push(cameraPart.replace(' of,', ','));

                if (style && style.startsWith('timelapse')) {
                     promptParts.push(style);
                     if (subject) promptParts.push(subject);
                } else {
                    if (subject) promptParts.push(subject);
                }

                if (action) promptParts.push(action);
                if (context) promptParts.push(context);
                if (lighting) promptParts.push(`with ${lighting} lighting`);

                if (style && !style.startsWith('timelapse')) {
                    promptParts.push(style);
                }

                if (quality) promptParts.push(quality);

                let finalPrompt = promptParts.filter(part => part && part.trim() !== '').join(', ');

                if (negative_prompt) {
                    finalPrompt += ` --no ${negative_prompt.replace(/,--no/g, ',')}`;
                }
                return finalPrompt;
            };

            /**
             * Analyzes the current prompt input fields and updates the progress bar and tips.
             */
            const analyzePrompt = () => {
                let score = 0;
                let tips = [];
                const weights = { subject: 20, action: 20, context: 20, style: 10, camera_angle: 10, camera_movement: 5, details: 10, negative: 5 };

                if (inputs.subject.value.trim()) {
                    score += weights.subject;
                    if (inputs.subject.value.length < 15) tips.push('Try a more descriptive subject.');
                } else {
                    tips.push('Add a subject to get started.');
                }

                if (inputs.action.value.trim()) score += weights.action;
                if (inputs.context.value.trim()) score += weights.context;
                if (inputs.style.value) score += weights.style;
                if (inputs.camera_angle.value) score += weights.camera_angle;
                if (inputs.camera_movement.value) score += weights.camera_movement;
                if (inputs.lighting.value.trim() || inputs.quality.value.trim()) score += weights.details;
                if (inputs.negative_prompt.value.trim()) score += weights.negative;

                progressBar.style.width = score + '%';
                progressBar.textContent = score > 10 ? `${score}%` : '';

                if (score < 40) progressBar.style.backgroundColor = '#EA4335';
                else if (score < 75) progressBar.style.backgroundColor = '#FBBC05';
                else progressBar.style.backgroundColor = '#34A853';

                if (tips.length > 0 && score < 100) {
                    analyzerTip.textContent = '💡 Tip: ' + tips[0];
                } else if (score > 0 && score < 100) {
                    analyzerTip.textContent = '👍 Good start! Add more details to refine your idea.';
                } else if (score >= 100) {
                    analyzerTip.textContent = '🏆 Excellent! This is a detailed and well-structured prompt.';
                } else {
                    analyzerTip.textContent = 'Fill in the fields to begin the analysis.';
                }
            };

            /**
             * Updates the displayed prompt based on the current values in the input fields.
             * It calls buildPromptString to construct the prompt and then updates the UI.
             */
            const updatePrompt = () => {
                const currentValues = {};
                for (const key in inputs) {
                    currentValues[key] = inputs[key].value;
                }
                const promptText = buildPromptString(currentValues);
                generatedPromptEl.textContent = promptText || 'Start filling out the fields above...';
                analyzePrompt();
            };

            /**
             * Populates the form fields with the provided prompt data and updates the prompt display.
             * @param {object} promptData - An object containing data for each input field.
             */
            const populateForm = (promptData) => {
                for (const key in inputs) {
                    inputs[key].value = promptData[key] || '';
                }
                updatePrompt();
            };

            // --- EVENT LISTENERS ---
            /**
             * Handles the DOMContentLoaded event. Initializes the form and sets up event listeners.
             */
            Object.values(inputs).forEach(input => {
                input.addEventListener('input', updatePrompt);
                input.addEventListener('change', updatePrompt);
            });

            /**
             * Handles the click event for the 'Mix Ideas' button.
             * Populates the form with either a curated or a randomly generated prompt.
             */
            mixerBtn.addEventListener('click', () => {
                if (Math.random() < 0.25) { // 25% chance of a spectacular mix
                    const spectacularPrompt = curatedMixes[Math.floor(Math.random() * curatedMixes.length)];
                    populateForm(spectacularPrompt);
                } else { // 75% chance of a random mix
                    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
                    const randomPrompt = {
                        subject: getRandom(mixerData.subjects),
                        action: getRandom(mixerData.actions),
                        context: getRandom(mixerData.contexts),
                        style: getRandom(mixerData.styles),
                        camera_angle: '', camera_movement: '', lighting: '', quality: '', negative_prompt: ''
                    };
                    populateForm(randomPrompt);
                }
            });

            /**
             * Handles the click event for the 'Analyze Example' button.
             * Displays a random example prompt and its analysis in a modal.
             */
            exampleBtn.addEventListener('click', () => {
                const example = examples[Math.floor(Math.random() * examples.length)];

                const promptText = buildPromptString(example.prompt);
                modalPromptEl.textContent = promptText;

                modalAnalysisEl.innerHTML = '';
                example.analysis.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'analysis-item';
                    itemEl.innerHTML = `<strong style="background-color:${item.color};">${item.part}</strong><p>${item.text}</p>`;
                    modalAnalysisEl.appendChild(itemEl);
});

                modal.classList.add('active');
            });

            const closeModal = () => modal.classList.remove('active');
            closeModalBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            /**
             * Handles the click event for the 'Copy' button.
             * Copies the generated prompt text to the clipboard.
             */
            copyBtn.addEventListener('click', () => {
                const textToCopy = generatedPromptEl.textContent;
                if (textToCopy && textToCopy !== 'Start filling out the fields above...') {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                    });
                }
            });

            /**
             * Handles the click event for the 'Clear All' button.
             * Clears all input fields and resets the prompt display.
             */
            clearBtn.addEventListener('click', () => {
                const emptyPrompt = { subject: '', action: '', context: '', style: '', camera_angle: '', camera_movement: '', lighting: '', quality: '', negative_prompt: ''};
                populateForm(emptyPrompt);
            });

            const setCopyright = () => {
                const year = new Date().getFullYear();
                copyrightEl.textContent = `© ${year} Ricardo Carvalho. All rights reserved.`;
            };

            // --- INITIALIZATION ---
            populateForm(examples[0].prompt); // Load the first, most comprehensive example on start
            setCopyright();
        });
