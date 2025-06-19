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

            // Data for Mixer and Examples
            const mixerData = {
                subjects: ['An elephant with butterfly wings', 'A medieval knight', 'A robot detective', 'A sorceress queen', 'An astronaut cat'],
                actions: ['skateboarding', 'painting a masterpiece', 'solving a mystery', 'gardening on the moon', 'sailing a paper boat'],
                contexts: ['in a library made of candy', 'during a neon thunderstorm', 'in an underwater city', 'at a 1970s music festival', 'on a floating castle'],
                styles: ['in anime style', 'cinematic', 'in a vintage film style', 'in 3D animation style']
            };

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
                }
            ];

            // Core Functions
            const analyzePrompt = () => {
                let score = 0;
                let tips = [];

                if (inputs.subject.value.trim()) {
                    score += 20;
                    if (inputs.subject.value.length < 15) tips.push('Try a more descriptive subject.');
                } else {
                    tips.push('Add a subject to get started.');
                }

                if (inputs.action.value.trim()) score += 20;
                if (inputs.context.value.trim()) score += 20;
                if (inputs.style.value) score += 10;
                if (inputs.camera_angle.value) score += 10;
                if (inputs.camera_movement.value) score += 5;
                if (inputs.lighting.value.trim() || inputs.quality.value.trim()) score += 10;
                if (inputs.negative_prompt.value.trim()) score += 5;

                progressBar.style.width = score + '%';
                progressBar.textContent = score > 10 ? `${score}%` : '';

                if (score < 40) progressBar.style.backgroundColor = '#EA4335';
                else if (score < 75) progressBar.style.backgroundColor = '#FBBC05';
                else progressBar.style.backgroundColor = '#34A853';

                if (tips.length > 0) {
                    analyzerTip.textContent = '💡 Tip: ' + tips[0];
                } else if (score > 0 && score < 100) {
                    analyzerTip.textContent = '👍 Good start! Add more details to refine your idea.';
                } else if (score === 100) {
                    analyzerTip.textContent = '🏆 Excellent! This is a detailed and well-structured prompt.';
                } else {
                    analyzerTip.textContent = 'Fill in the fields to begin the analysis.';
                }
            };

            const updatePrompt = () => {
                let promptParts = [];
                const cameraAngle = inputs.camera_angle.value.trim();
                const cameraMovement = inputs.camera_movement.value.trim();
                const subjectValue = inputs.subject.value.trim();
                const styleValue = inputs.style.value.trim();

                if (styleValue.startsWith('timelapse')) {
                    let timelapsePrompt = styleValue;
                    if (subjectValue) {
                        // Ensure "of" is present before subject if style doesn't end with it
                        if (!timelapsePrompt.endsWith(' of') && !timelapsePrompt.includes(' of ')) {
                            timelapsePrompt += ' of';
                        }
                        timelapsePrompt += ` ${subjectValue}`;
                    }
                    promptParts.push(timelapsePrompt);
                } else {
                    // Handle camera and subject for non-timelapse styles
                    let cameraSubjectCombined = '';

                    if (cameraAngle) {
                        cameraSubjectCombined = cameraAngle; // e.g., "a close-up shot of" or "an aerial view"
                        if (cameraMovement) {
                            // Remove trailing " of" from cameraAngle if present, as movement will follow
                            if (cameraSubjectCombined.endsWith(' of')) {
                                cameraSubjectCombined = cameraSubjectCombined.substring(0, cameraSubjectCombined.length - 3).trim();
                            }
                            cameraSubjectCombined += `, ${cameraMovement}`; // e.g., "a close-up shot, panning from left to right"
                        }
                    } else if (cameraMovement) {
                        cameraSubjectCombined = cameraMovement; // e.g., "panning from left to right"
                    }

                    if (subjectValue) {
                        if (cameraSubjectCombined) {
                            // If there's camera info, ensure "of" is correctly placed before subject
                            if (!cameraSubjectCombined.endsWith(' of') && !cameraSubjectCombined.includes(' of ')) {
                                cameraSubjectCombined += ' of';
                            }
                            cameraSubjectCombined += ` ${subjectValue}`;
                        } else {
                            // No camera info, just the subject
                            cameraSubjectCombined = subjectValue;
                        }
                    } else {
                        // No subject, but there might be camera info that needs "of"
                        if (cameraSubjectCombined && !cameraSubjectCombined.endsWith(' of') && !cameraSubjectCombined.includes(' of ')) {
                             // e.g. "an aerial view" should become "an aerial view of"
                             // e.g. "a close-up shot" should become "a close-up shot of"
                            if(cameraAngle && !cameraAngle.endsWith(' of') && (cameraMovement === '' || (cameraMovement && !cameraMovement.endsWith(' of')))) {
                                cameraSubjectCombined += ' of';
                            } else if (cameraMovement && !cameraMovement.endsWith(' of') && (cameraAngle === '' || (cameraAngle && !cameraAngle.endsWith(' of')) )) {
                                // This case might be less common if movements usually imply "of something"
                                // but good to be safe.
                                 cameraSubjectCombined += ' of';
                            }
                        }
                    }

                    if (cameraSubjectCombined) {
                        // Clean up any potential "of of" or leading/trailing spaces/commas
                        let finalPart = cameraSubjectCombined.replace(/ of of/g, ' of').trim();
                        if (finalPart.endsWith(',')) {
                            finalPart = finalPart.substring(0, finalPart.length -1);
                        }
                        promptParts.push(finalPart);
                    }
                }

                if (inputs.action.value) promptParts.push(inputs.action.value);
                if (inputs.context.value) promptParts.push(inputs.context.value);
                if (inputs.lighting.value) promptParts.push(`with ${inputs.lighting.value} lighting`);

                if (inputs.style.value && !inputs.style.value.startsWith('timelapse')) {
                    promptParts.push(inputs.style.value);
                }

                if (inputs.quality.value) promptParts.push(inputs.quality.value);

                let finalPrompt = promptParts.filter(part => part.trim() !== '').join(', ');

                if (inputs.negative_prompt.value) {
                    finalPrompt += ` --no ${inputs.negative_prompt.value.replace(/,--no/g, ',')}`;
                }

                generatedPromptEl.textContent = finalPrompt || 'Start filling out the fields above...';
                analyzePrompt();
            };

            // Event Listeners
            Object.values(inputs).forEach(input => {
                input.addEventListener('input', updatePrompt);
                input.addEventListener('change', updatePrompt);
            });

            mixerBtn.addEventListener('click', () => {
                const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
                inputs.subject.value = getRandom(mixerData.subjects);
                inputs.action.value = getRandom(mixerData.actions);
                inputs.context.value = getRandom(mixerData.contexts);
                inputs.style.value = getRandom(mixerData.styles);
                inputs.camera_angle.value = '';
                inputs.camera_movement.value = '';
                inputs.lighting.value = '';
                inputs.quality.value = '';
                inputs.negative_prompt.value = '';
                updatePrompt();
            });

            exampleBtn.addEventListener('click', () => {
                const example = examples[Math.floor(Math.random() * examples.length)];

                let promptText = [
                    example.prompt.camera_angle, example.prompt.camera_movement, 'of', example.prompt.subject, example.prompt.action, example.prompt.context, `with ${example.prompt.lighting} lighting`, example.prompt.style, example.prompt.quality
                ].filter(Boolean).join(', ').replace('of,','').replace(', with', ' with');

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

            copyBtn.addEventListener('click', () => {
                const textToCopy = generatedPromptEl.textContent;
                if (textToCopy && textToCopy !== 'Start filling out the fields above...') {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                    });
                }
            });

            clearBtn.addEventListener('click', () => {
                Object.values(inputs).forEach(input => {
                    if(input.tagName === 'SELECT') input.selectedIndex = 0;
                    else input.value = '';
                });
                updatePrompt();
            });

            const setCopyright = () => {
                const year = new Date().getFullYear();
                copyrightEl.textContent = `© ${year} Ricardo Carvalho. All rights reserved.`;
            };

            // Initial calls
            updatePrompt();
            setCopyright();
        });
