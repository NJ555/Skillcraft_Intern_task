// Quiz state
const quizState = {
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    timer: null,
    timeLeft: 30,
    userAnswers: [],
    questionHistory: [],
    usedQuestionIds: new Set(),
    weakTopics: {}
};

// DOM Elements
const elements = {
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    currentScore: document.getElementById('current-score'),
    currentQuestion: document.getElementById('current-question'),
    streakCount: document.getElementById('streak-count'),
    timeLeft: document.getElementById('time-left'),
    timer: document.getElementById('timer'),
    questionNumber: document.getElementById('question-number'),
    questionCategory: document.getElementById('question-category'),
    questionDifficulty: document.getElementById('question-difficulty'),
    explanation: document.getElementById('explanation'),
    explanationText: document.getElementById('explanation-text'),
    nextBtn: document.getElementById('next-btn'),
    prevBtn: document.getElementById('prev-btn'),
    submitBtn: document.getElementById('submit-btn'),
    resultContainer: document.getElementById('result-container'),
    finalScore: document.getElementById('final-score'),
    performanceMessage: document.getElementById('performance-message'),
    restartBtn: document.getElementById('restart-btn'),
    quizContent: document.getElementById('quiz-content'),
    weakTopics: document.getElementById('weak-topics')
};

// Initialize the quiz
function initQuiz() {
    quizState.currentQuestionIndex = 0;
    quizState.score = 0;
    quizState.streak = 0;
    quizState.userAnswers = [];
    quizState.timeLeft = 30;
    quizState.weakTopics = {};
    
    // Reset UI
    elements.currentScore.textContent = '0';
    elements.streakCount.textContent = '0';
    elements.currentQuestion.textContent = '1';
    elements.resultContainer.style.display = 'none';
    elements.quizContent.style.display = 'block';
    elements.submitBtn.style.display = 'none';
    elements.prevBtn.disabled = true;
    
    // Generate unique questions
    generateQuestions();
    
    // Load first question
    loadQuestion();
    
    // Start timer for first question
    startTimer();
}

// Generate unique questions that haven't been used recently
function generateQuestions() {
    quizState.questionHistory = [];
    
    // Create a pool of available questions
    let availableQuestions = [...questionBank];
    
    // Select 10 unique questions
    for (let i = 0; i < 10; i++) {
        if (availableQuestions.length === 0) {
            // Reset pool if we've used all questions
            availableQuestions = questionBank.filter(q => !quizState.usedQuestionIds.has(q.id));
            
            // If still no questions, clear used ids
            if (availableQuestions.length === 0) {
                quizState.usedQuestionIds.clear();
                availableQuestions = [...questionBank];
            }
        }
        
        // Select random question from available pool
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];
        
        // Add to history and mark as used
        quizState.questionHistory.push(selectedQuestion);
        quizState.usedQuestionIds.add(selectedQuestion.id);
        
        // Remove from available pool
        availableQuestions.splice(randomIndex, 1);
    }
}

// Load current question
function loadQuestion() {
    const question = quizState.questionHistory[quizState.currentQuestionIndex];
    
    // Update UI
    elements.questionText.textContent = question.question;
    elements.questionNumber.textContent = quizState.currentQuestionIndex + 1;
    elements.questionCategory.textContent = question.category;
    elements.questionDifficulty.textContent = question.difficulty;
    elements.questionDifficulty.className = `difficulty ${question.difficulty}`;
    
    // Clear previous options
    elements.optionsContainer.innerHTML = '';
    
    // Create new options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', () => selectOption(optionElement, index));
        elements.optionsContainer.appendChild(optionElement);
    });
    
    // Update progress
    elements.currentQuestion.textContent = quizState.currentQuestionIndex + 1;
    
    // Hide explanation
    elements.explanation.style.display = 'none';
    
    // Reset timer
    resetTimer();
}

// Select an option
function selectOption(optionElement, optionIndex) {
    // Clear any previous selections
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Mark selected option
    optionElement.classList.add('selected');
    
    // Enable next button
    elements.nextBtn.disabled = false;
    
    // Store user's selection
    quizState.userAnswers[quizState.currentQuestionIndex] = optionIndex;
}

// Move to next question
function nextQuestion() {
    // Check if answer is correct
    checkAnswer();
    
    // Move to next question
    quizState.currentQuestionIndex++;
    
    // If last question, show submit button
    if (quizState.currentQuestionIndex === quizState.questionHistory.length - 1) {
        elements.nextBtn.style.display = 'none';
        elements.submitBtn.style.display = 'block';
    }
    
    // Enable previous button
    elements.prevBtn.disabled = false;
    
    // Load next question
    loadQuestion();
}

// Move to previous question
function prevQuestion() {
    // Move to previous question
    quizState.currentQuestionIndex--;
    
    // If first question, disable previous button
    if (quizState.currentQuestionIndex === 0) {
        elements.prevBtn.disabled = true;
    }
    
    // Show next button
    elements.nextBtn.style.display = 'block';
    elements.submitBtn.style.display = 'none';
    
    // Load previous question
    loadQuestion();
    
    // Restore selection if exists
    if (quizState.userAnswers[quizState.currentQuestionIndex] !== undefined) {
        const optionIndex = quizState.userAnswers[quizState.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        if (options[optionIndex]) {
            options[optionIndex].classList.add('selected');
        }
    }
}

// Check current answer
function checkAnswer() {
    const currentQuestion = quizState.questionHistory[quizState.currentQuestionIndex];
    const selectedOption = quizState.userAnswers[quizState.currentQuestionIndex];
    
    if (selectedOption === undefined) return;
    
    const options = document.querySelectorAll('.option');
    
    // Mark correct and incorrect answers
    options.forEach((option, index) => {
        if (index === currentQuestion.answer) {
            option.classList.add('correct');
        } else if (index === selectedOption && selectedOption !== currentQuestion.answer) {
            option.classList.add('incorrect');
        }
    });
    
    // Update score if correct
    if (selectedOption === currentQuestion.answer) {
        quizState.score += 10;
        quizState.streak++;
        
        // Update UI
        elements.currentScore.textContent = quizState.score;
        elements.streakCount.textContent = quizState.streak;
        
        // Track strong topic
        if (!quizState.weakTopics[currentQuestion.category]) {
            quizState.weakTopics[currentQuestion.category] = { correct: 0, total: 0 };
        }
        quizState.weakTopics[currentQuestion.category].correct++;
        quizState.weakTopics[currentQuestion.category].total++;
    } else {
        quizState.streak = 0;
        elements.streakCount.textContent = '0';
        
        // Track weak topic
        if (!quizState.weakTopics[currentQuestion.category]) {
            quizState.weakTopics[currentQuestion.category] = { correct: 0, total: 0 };
        }
        quizState.weakTopics[currentQuestion.category].total++;
    }
    
    // Show explanation
    elements.explanationText.textContent = currentQuestion.explanation;
    elements.explanation.style.display = 'block';
    
    // Disable option selection
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

// Submit quiz
function submitQuiz() {
    // Check last answer
    checkAnswer();
    
    // Stop timer
    clearInterval(quizState.timer);
    
    // Calculate final score
    const finalScore = quizState.score;
    const maxScore = quizState.questionHistory.length * 10;
    
    // Update result UI
    elements.finalScore.textContent = `${finalScore}/${maxScore}`;
    
    // Performance message
    const percentage = (finalScore / maxScore) * 100;
    let message;
    if (percentage >= 90) {
        message = "Outstanding! You're a DSA expert!";
    } else if (percentage >= 70) {
        message = "Excellent! You have strong DSA fundamentals.";
    } else if (percentage >= 50) {
        message = "Good job! With a bit more practice, you'll master DSA.";
    } else {
        message = "Keep practicing! Review these topics to improve.";
    }
    elements.performanceMessage.textContent = message;
    
    // Show weak topics
    generateWeakTopics();
    
    // Show results
    elements.resultContainer.style.display = 'block';
    elements.quizContent.style.display = 'none';
}

// Generate weak topics analysis
function generateWeakTopics() {
    // Clear existing topics
    elements.weakTopics.innerHTML = '<h3><i class="fas fa-exclamation-triangle"></i> Areas for Improvement</h3>';
    
    // Calculate performance per topic
    const topicPerformance = [];
    
    for (const [topic, data] of Object.entries(quizState.weakTopics)) {
        const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        topicPerformance.push({ topic, score });
    }
    
    // Sort by worst performance
    topicPerformance.sort((a, b) => a.score - b.score);
    
    // Show top 3 weak topics
    const topWeakTopics = topicPerformance.slice(0, 3);
    
    if (topWeakTopics.length === 0) {
        elements.weakTopics.innerHTML += '<p>No significant weak areas detected! Great job!</p>';
        return;
    }
    
    topWeakTopics.forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.innerHTML = `
            <div class="topic-name">${topic.topic}</div>
            <div class="topic-score">${100 - topic.score}%</div>
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${100 - topic.score}%`;
        
        progressBar.appendChild(progressFill);
        
        elements.weakTopics.appendChild(topicItem);
        elements.weakTopics.appendChild(progressBar);
    });
}

// Timer functions
function startTimer() {
    clearInterval(quizState.timer);
    quizState.timeLeft = 30;
    elements.timeLeft.textContent = quizState.timeLeft;
    
    quizState.timer = setInterval(() => {
        quizState.timeLeft--;
        elements.timeLeft.textContent = quizState.timeLeft;
        
        if (quizState.timeLeft <= 0) {
            clearInterval(quizState.timer);
            // Auto move to next question
            if (quizState.currentQuestionIndex < quizState.questionHistory.length - 1) {
                nextQuestion();
            } else {
                submitQuiz();
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(quizState.timer);
    startTimer();
}

// Event listeners
elements.nextBtn.addEventListener('click', nextQuestion);
elements.prevBtn.addEventListener('click', prevQuestion);
elements.submitBtn.addEventListener('click', submitQuiz);
elements.restartBtn.addEventListener('click', initQuiz);

// Initialize quiz on page load
window.addEventListener('DOMContentLoaded', initQuiz);