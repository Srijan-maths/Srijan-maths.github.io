/**
 * Main Application Orchestrator
 */
document.addEventListener("DOMContentLoaded", () => {
  const paperEngine = new PaperGenerator();
  let activeTimer = null;

  // DOM Containers
  const viewModeSelect = document.getElementById("view-mode-select");
  const viewPracticeConfig = document.getElementById("view-practice-config");
  const viewMockConfig = document.getElementById("view-mock-config");
  const viewExamArea = document.getElementById("view-exam-area");
  const viewResults = document.getElementById("view-results");

  // --- NAVIGATION HELPERS ---
  function hideAllViews() {
    [viewModeSelect, viewPracticeConfig, viewMockConfig, viewExamArea, viewResults].forEach(v => {
      if (v) v.style.display = "none";
    });
  }

  // --- MODE SELECTION ---
  document.getElementById("btn-choose-practice").addEventListener("click", () => {
    hideAllViews();
    viewPracticeConfig.style.display = "block";
  });

  document.getElementById("btn-choose-mock").addEventListener("click", () => {
    hideAllViews();
    viewMockConfig.style.display = "block";
  });

  // --- START PRACTICE MODE ---
  document.getElementById("btn-start-practice").addEventListener("click", () => {
    const selectedTopics = Array.from(document.querySelectorAll('.practice-topic-cb:checked')).map(cb => cb.value);
    const questionCount = parseInt(document.getElementById("practice-q-count").value, 10);
    const startDiff = parseFloat(document.getElementById("practice-diff").value);
    const isAdaptive = document.getElementById("practice-adaptive").checked;

    if (selectedTopics.length === 0) {
      alert("Please select at least one syllabus topic.");
      return;
    }

    appState.reset();
    appState.mode = "practice";
    appState.currentDifficulty = startDiff;
    appState.isAdaptive = isAdaptive;

    appState.paper = paperEngine.generatePracticePaper({
      topics: selectedTopics,
      difficultyMin: startDiff,
      difficultyMax: startDiff,
      questionCount
    });

    hideAllViews();
    viewExamArea.style.display = "block";
    renderQuestion(0);
  });

  // --- START MOCK TEST ---
  document.getElementById("btn-start-mock").addEventListener("click", () => {
    const selectedTopics = Array.from(document.querySelectorAll('.mock-topic-cb:checked')).map(cb => cb.value);
    const durationHours = parseFloat(document.getElementById("mock-duration").value);

    if (selectedTopics.length === 0) {
      alert("Please select at least one syllabus topic.");
      return;
    }

    appState.reset();
    appState.mode = "mock";

    appState.paper = paperEngine.generateMockTest({
      topics: selectedTopics,
      durationHours
    });

    hideAllViews();
    viewExamArea.style.display = "block";

    // Setup Timer
    activeTimer = new ExamTimer(
      appState.paper.durationSeconds,
      (remaining) => {
        document.getElementById("timer-display").innerText = ExamTimer.formatTime(remaining);
      },
      () => {
        alert("Time is up! Submitting your test automatically.");
        submitFinalPaper();
      }
    );
    activeTimer.start();

    renderQuestion(0);
  });

  // --- QUESTION RENDERER ---
  function renderQuestion(index) {
    appState.currentIndex = index;
    const question = appState.paper.questions[index];
    const container = document.getElementById("question-display-card");

    const isPractice = appState.mode === "practice";
    const existingAnswer = appState.userAnswers[index] || "";
    const isAlreadyAnswered = appState.results[index] !== undefined;

    let html = `
      <div class="q-header">
        <span>Question ${index + 1} of ${appState.paper.questions.length}</span>
        <span class="badge">${question.subtopic} | Diff: ${question.minDifficulty.toFixed(1)}</span>
      </div>
      <div class="q-body" id="q-math-content">${question.question}</div>
      <div class="q-input-group">
        <input type="text" id="user-answer-input" value="${existingAnswer}" ${isAlreadyAnswered && isPractice ? 'disabled' : ''} placeholder="Enter exact answer..." />
        ${!isAlreadyAnswered || !isPractice ? `<button id="btn-submit-ans" class="btn-primary">Submit Answer</button>` : ''}
      </div>
    `;

    if (isPractice && isAlreadyAnswered) {
      const res = appState.results[index];
      html += `
        <div class="solution-box ${res.isCorrect ? 'correct' : 'incorrect'}">
          <h4>${res.isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
          <p><strong>Correct Answer:</strong> $${question.answer}$</p>
          <hr/>
          <div id="solution-math">${question.solution}</div>
        </div>
      `;
    }

    container.innerHTML = html;
    MathRenderer.render(container);

    // Bind Answer Submission
    const submitBtn = document.getElementById("btn-submit-ans");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const val = document.getElementById("user-answer-input").value;
        appState.userAnswers[index] = val;

        if (isPractice) {
          const evalRes = AnswerChecker.verify(val, question.answer, question.answerType);
          appState.results[index] = evalRes;

          // Adaptive Difficulty Calculation
          if (appState.isAdaptive) {
            appState.adaptiveHistory.push(evalRes.isCorrect);
            appState.currentDifficulty = DifficultyEngine.calculateNextDifficulty(
              appState.currentDifficulty,
              appState.adaptiveHistory,
              evalRes.isCorrect
            );
          }
          renderQuestion(index);
        } else {
          // Mock mode: advance to next or re-render
          if (index + 1 < appState.paper.questions.length) {
            renderQuestion(index + 1);
          } else {
            alert("Answer recorded. You can navigate between questions or click 'Finish Test'.");
          }
        }
      });
    }

    // Nav Controls
    renderNavControls();
  }

  function renderNavControls() {
    const navContainer = document.getElementById("exam-nav-buttons");
    const total = appState.paper.questions.length;
    const curr = appState.currentIndex;

    let html = `
      <button ${curr === 0 ? 'disabled' : ''} id="btn-prev-q">Previous</button>
      <button ${curr === total - 1 ? 'disabled' : ''} id="btn-next-q">Next</button>
    `;

    if (appState.mode === "mock" || curr === total - 1) {
      html += `<button id="btn-finish-test" class="btn-danger">Finish & Submit</button>`;
    }

    navContainer.innerHTML = html;

    if (document.getElementById("btn-prev-q")) {
      document.getElementById("btn-prev-q").onclick = () => renderQuestion(curr - 1);
    }
    if (document.getElementById("btn-next-q")) {
      document.getElementById("btn-next-q").onclick = () => renderQuestion(curr + 1);
    }
    if (document.getElementById("btn-finish-test")) {
      document.getElementById("btn-finish-test").onclick = () => submitFinalPaper();
    }
  }

  function submitFinalPaper() {
    if (activeTimer) activeTimer.stop();

    appState.isSubmitted = true;
    let correctCount = 0;

    appState.paper.questions.forEach((q, idx) => {
      const userAns = appState.userAnswers[idx] || "";
      const evalRes = AnswerChecker.verify(userAns, q.answer, q.answerType);
      appState.results[idx] = evalRes;
      if (evalRes.isCorrect) correctCount++;
    });

    hideAllViews();
    viewResults.style.display = "block";

    const total = appState.paper.questions.length;
    const percentage = ((correctCount / total) * 100).toFixed(1);

    const resContainer = document.getElementById("results-display-card");
    resContainer.innerHTML = `
      <h2>Performance Summary</h2>
      <div class="stats-grid">
        <div class="stat-card"><h3>${correctCount} / ${total}</h3><p>Score</p></div>
        <div class="stat-card"><h3>${percentage}%</h3><p>Accuracy</p></div>
      </div>
      <button id="btn-review-solutions" class="btn-primary" style="margin-top: 20px;">View Full Solutions</button>
    `;

    document.getElementById("btn-review-solutions").onclick = () => {
      hideAllViews();
      viewExamArea.style.display = "block";
      appState.mode = "practice"; // Switch view mode to practice to reveal solutions
      renderQuestion(0);
    };
  }
});
