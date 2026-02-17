import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import jsPDF from 'jspdf';

const ResultsPhase = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();

  const handleRestart = () => {
    dispatch({ type: 'RESTART_GAME' });
  };

  const percentage = Math.round((state.score / 20) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage === 100) return 'Perfect! 🎉';
    if (percentage >= 80) return 'Excellent! 🌟';
    if (percentage >= 60) return 'Good job! 👍';
    if (percentage >= 40) return 'Not bad! 💪';
    return 'Keep practicing! 📚';
  };

  const handleSaveResults = () => {
    const isDigitalMode = state.config?.drawingMode === 'digital';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPos = 15;

    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('I Draw I Guess - Results', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Game Info
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${new Date().toLocaleString()}`, 15, yPos);
    yPos += 5;
    pdf.text(`Difficulty: ${state.config?.difficulty || 'unknown'} | Mode: ${state.config?.drawingMode || 'unknown'}`, 15, yPos);
    yPos += 5;
    pdf.text(`Score: ${state.score}/20 (${percentage}%) - ${getScoreMessage()}`, 15, yPos);
    yPos += 10;

    // Add canvas image if digital mode
    if (isDigitalMode && state.canvasImage) {
      const imgWidth = pageWidth - 30;
      const imgHeight = (imgWidth * 480) / 600; // Maintain aspect ratio

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your Drawings', 15, yPos);
      yPos += 5;

      pdf.addImage(state.canvasImage, 'PNG', 15, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 10;

      // Add new page if needed
      if (yPos > pageHeight - 80) {
        pdf.addPage();
        yPos = 15;
      }
    }

    // Results Grid Title
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Answer Breakdown', 15, yPos);
    yPos += 8;

    // Draw results grid (4x5)
    const cellWidth = (pageWidth - 30) / 5;
    const cellHeight = 20;

    pdf.setFontSize(8);

    for (let i = 0; i < 20; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = 15 + col * cellWidth;
      const y = yPos + row * cellHeight;

      const result = state.results[i];
      const correctWord = state.words[i]?.text || '';

      // Cell background color
      if (result.isCorrect) {
        pdf.setFillColor(220, 252, 231); // green-100
        pdf.setDrawColor(34, 197, 94); // green-500
      } else {
        pdf.setFillColor(254, 226, 226); // red-100
        pdf.setDrawColor(239, 68, 68); // red-500
      }

      // Draw cell
      pdf.rect(x, y, cellWidth, cellHeight, 'FD');

      // Cell number
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`#${i + 1}`, x + 2, y + 5);

      // Status icon and correct word
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      const statusIcon = result.isCorrect ? '✓' : '✗';
      pdf.text(`${statusIcon} ${correctWord}`, x + 2, y + 10);

      // User answer if wrong
      if (!result.isCorrect) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(80, 80, 80);
        const userAnswer = result.input || '(empty)';
        const truncated = userAnswer.length > 15 ? userAnswer.slice(0, 15) + '...' : userAnswer;
        pdf.text(`You: ${truncated}`, x + 2, y + 15);
        pdf.setFontSize(8);
      }
    }

    // Save PDF
    pdf.save(`i-draw-i-guess-results-${timestamp}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Score Display */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t.results.scoreText.replace('{score}', state.score.toString()).replace('{total}', '20')}
          </h2>
          <div className={`text-6xl md:text-8xl font-bold ${getScoreColor()} mb-4`}>
            {state.score}/20
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
            {percentage}% {t.results.correct}
          </p>
          <p className="text-lg text-gray-600">{getScoreMessage()}</p>
        </div>

        {/* Comparison Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {t.results.correctAnswer}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.results.map((result, i) => {
              const correctWord = state.words[i]?.text || '';
              return (
                <div
                  key={i}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    result.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="text-xs font-semibold text-gray-500 mb-1">
                    #{i + 1}
                  </div>
                  <div className="font-bold text-gray-800 mb-1">
                    {result.isCorrect ? '✓' : '✗'} {correctWord}
                  </div>
                  {!result.isCorrect && (
                    <div className="text-sm text-gray-600">
                      {t.results.yourAnswer}:{' '}
                      <span className="italic">
                        {result.input || '(empty)'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <button
            onClick={handleSaveResults}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {t.results.downloadPDF}
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {t.results.playAgain}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPhase;
