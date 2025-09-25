        const quizData = [
            { question: "What does HTML stand for?", choices: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Tool Multi-Language"], correctAnswer: "Hyper Text Markup Language" },
            { question: "Which of the following is a CSS pre-processor?", choices: ["Python", "Sass", "C++", "HTML"], correctAnswer: "Sass" },
            { question: "What is the primary function of JavaScript?", choices: ["Styling web pages", "Creating database schemas", "Adding interactivity to web pages", "Server-side logic"], correctAnswer: "Adding interactivity to web pages" },
            { question: "What is the correct way to declare a constant variable in JavaScript?", choices: ["let x = 10;", "var x = 10;", "const x = 10;", "x = 10;"], correctAnswer: "const x = 10;" },
            { question: "What is the term for a CSS rule that applies to a specific element by its ID?", choices: ["Class selector", "Universal selector", "Type selector", "ID selector"], correctAnswer: "ID selector" }
        ];

        let currentQuestionIndex = 0;
        let score = 0;
        let selectedChoice = null;
        let answeredQuestions = [];
        let timer;
        let timeLeft = 10;
        const totalQuestions = quizData.length;

        // DOM elements
        const quizScreen = document.getElementById('quiz-screen');
        const resultsScreen = document.getElementById('results-screen');
        const questionCounter = document.getElementById('question-counter');
        const questionEl = document.getElementById('question');
        const answerChoicesEl = document.getElementById('answer-choices');
        const submitBtn = document.getElementById('submit-btn');
        const nextBtn = document.getElementById('next-btn');
        const finalScoreEl = document.getElementById('final-score');
        const resultsSummaryEl = document.getElementById('results-summary');
        const restartBtn = document.getElementById('restart-btn');
        const themeSwitcher = document.getElementById('theme-switcher');
        const timerEl = document.getElementById('timer');
        const progressBar = document.getElementById('progress-bar');

        // GSAP Animations
        function animateIn(element) {
            gsap.fromTo(element, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
        }
        
        function animateQuestionChange() {
            gsap.fromTo(questionEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
            gsap.fromTo(answerChoicesEl.children, { x: -50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.3 });
        }

        function animateResults() {
            gsap.fromTo(resultsScreen, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
            gsap.fromTo(finalScoreEl, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.5, ease: "elastic.out(1, 0.3)" });
            gsap.fromTo(resultsSummaryEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.3, delay: 1 });
        }
        
        // Function to shuffle an array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Timer Logic
        function startTimer() {
            clearInterval(timer);
            timeLeft = 10;
            timerEl.textContent = `Time: ${timeLeft}s`;
            timer = setInterval(() => {
                timeLeft--;
                timerEl.textContent = `Time: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                }
            }, 1000);
        }

        // Progress Bar Logic
        function updateProgressBar() {
            const progress = ((currentQuestionIndex) / totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Main Quiz Logic
        function loadQuestion() {
            if (currentQuestionIndex < totalQuestions) {
                // Reset state for new question
                selectedChoice = null;
                submitBtn.disabled = true;
                nextBtn.disabled = true;

                const currentQuestion = quizData[currentQuestionIndex];
                
                // Shuffle choices
                const shuffledChoices = [...currentQuestion.choices];
                shuffleArray(shuffledChoices);

                questionEl.textContent = currentQuestion.question;
                questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
                answerChoicesEl.innerHTML = '';
                
                shuffledChoices.forEach(choice => {
                    const choiceElement = document.createElement('div');
                    choiceElement.classList.add('answer-choice', 'bg-gray-100', 'dark:bg-gray-700', 'border-2', 'border-gray-300', 'dark:border-gray-600', 'rounded-xl', 'p-4', 'font-medium', 'text-gray-800', 'dark:text-gray-200', 'cursor-pointer', 'text-left', 'hover:bg-gray-200', 'dark:hover:bg-gray-600', 'transition-all', 'duration-300', 'transform', 'hover:scale-105');
                    choiceElement.textContent = choice;
                    choiceElement.addEventListener('click', () => {
                        handleChoiceSelection(choiceElement);
                    });
                    answerChoicesEl.appendChild(choiceElement);
                });

                updateProgressBar();
                animateQuestionChange();
                startTimer();
            } else {
                showResults();
            }
        }

        function handleChoiceSelection(choiceElement) {
            // Remove 'selected' class from all choices
            Array.from(answerChoicesEl.children).forEach(el => el.classList.remove('selected'));
            
            selectedChoice = choiceElement;
            choiceElement.classList.add('selected');
            submitBtn.disabled = false;
        }

        function handleSubmit() {
            clearInterval(timer);
            const currentQuestion = quizData[currentQuestionIndex];
            const isCorrect = selectedChoice && (selectedChoice.textContent === currentQuestion.correctAnswer);
            
            // Highlight answers and record results
            Array.from(answerChoicesEl.children).forEach(choice => {
                choice.style.pointerEvents = 'none';
                if (choice.textContent === currentQuestion.correctAnswer) {
                    choice.classList.add('correct');
                } else if (choice === selectedChoice) {
                    choice.classList.add('incorrect');
                }
            });

            // If a choice was selected
            if (selectedChoice) {
                if (isCorrect) {
                    score++;
                }
            }

            // Record the user's answer for the summary
            answeredQuestions.push({
                question: currentQuestion.question,
                yourAnswer: selectedChoice ? selectedChoice.textContent : 'No answer',
                correctAnswer: currentQuestion.correctAnswer,
                isCorrect: isCorrect
            });

            submitBtn.disabled = true;
            nextBtn.disabled = false;
        }

        function handleNext() {
            currentQuestionIndex++;
            if (currentQuestionIndex < totalQuestions) {
                loadQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            quizScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
            finalScoreEl.textContent = `${score} / ${totalQuestions}`;
            
            resultsSummaryEl.innerHTML = '';
            answeredQuestions.forEach(item => {
                const summaryItem = document.createElement('li');
                summaryItem.classList.add('summary-item', 'flex', 'items-start', 'bg-gray-100', 'dark:bg-gray-700', 'rounded-xl', 'p-4', 'shadow-sm', 'transition-all', 'duration-300', 'hover:shadow-md');
                summaryItem.classList.add(item.isCorrect ? 'correct' : 'incorrect');

                const icon = document.createElement('span');
                icon.classList.add('icon', 'text-2xl', 'mr-4', 'w-6', 'text-center');
                icon.textContent = item.isCorrect ? '✅' : '❌';
                
                const content = document.createElement('div');
                content.classList.add('content');
                
                const questionText = document.createElement('p');
                questionText.classList.add('font-bold', 'mb-1', 'text-gray-800', 'dark:text-gray-200');
                questionText.textContent = item.question;
                
                const yourAnswerText = document.createElement('p');
                yourAnswerText.classList.add('text-sm', 'text-gray-600', 'dark:text-gray-400');
                yourAnswerText.textContent = `Your Answer: ${item.yourAnswer}`;
                
                const correctAnswerText = document.createElement('p');
                correctAnswerText.classList.add('text-sm', 'text-gray-600', 'dark:text-gray-400');
                correctAnswerText.textContent = `Correct Answer: ${item.correctAnswer}`;
                
                content.appendChild(questionText);
                content.appendChild(yourAnswerText);
                if (!item.isCorrect) {
                    content.appendChild(correctAnswerText);
                }
                
                summaryItem.appendChild(icon);
                summaryItem.appendChild(content);
                resultsSummaryEl.appendChild(summaryItem);
            });
            
            animateResults();
        }

        function handleRestart() {
            currentQuestionIndex = 0;
            score = 0;
            answeredQuestions = [];
            shuffleArray(quizData);
            
            resultsScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            
            loadQuestion();
            animateIn(quizScreen);
        }

        // Event Listeners
        submitBtn.addEventListener('click', handleSubmit);
        nextBtn.addEventListener('click', handleNext);
        restartBtn.addEventListener('click', handleRestart);

        themeSwitcher.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            themeSwitcher.innerHTML = isDarkMode ? '🌙' : '☀️';
        });

        // Initial load
        window.onload = function() {
            shuffleArray(quizData);
            loadQuestion();
            animateIn(quizScreen);
        };