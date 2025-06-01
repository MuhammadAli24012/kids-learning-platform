import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { 
  ArrowLeft, 
  Star, 
  Trophy, 
  Timer, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Heart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import type { Game } from '../types';

export default function GamePlayPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Sample math questions for the game
  const [questions] = useState([
    { question: "What is 5 + 3?", answers: [6, 7, 8, 9], correct: 2 },
    { question: "What is 12 - 4?", answers: [6, 7, 8, 9], correct: 2 },
    { question: "What is 3 × 4?", answers: [10, 11, 12, 13], correct: 2 },
    { question: "What is 15 ÷ 3?", answers: [3, 4, 5, 6], correct: 2 },
    { question: "What is 7 + 6?", answers: [11, 12, 13, 14], correct: 2 }
  ]);

  useEffect(() => {
    loadGame();
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, [gameId]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('failed');
    }
  }, [timeLeft, gameState]);

  const loadGame = async () => {
    try {
      const response = await fetch('/data/games.json');
      const data = await response.json();
      const foundGame = data.games.find((g: Game) => g.id === gameId);
      
      if (foundGame) {
        setGame(foundGame);
      } else {
        toast.error('Game not found');
        navigate('/games');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      toast.error('Failed to load game');
      navigate('/games');
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 100);
      toast.success('Correct! +100 XP');
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Game completed
        completeGame();
      }
    } else {
      setLives(lives - 1);
      toast.error('Try again!');
      
      if (lives <= 1) {
        setGameState('failed');
      } else {
        setSelectedAnswer(null);
      }
    }
  };

  const completeGame = () => {
    setGameState('completed');
    setShowConfetti(true);
    
    // Update user progress
    if (user && game) {
      const newProgress = {
        ...user.progress,
        totalXP: (user.progress?.totalXP || 0) + game.xpReward + score,
        gamesCompleted: (user.progress?.gamesCompleted || 0) + 1,
        level: Math.floor(((user.progress?.totalXP || 0) + game.xpReward + score) / 1000) + 1
      };
      
      updateUser({ progress: newProgress });
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };

  const resetGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowConfetti(false);
  };

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/games')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Games</span>
        </Button>

        <div className="flex items-center space-x-4">
          {/* Lives */}
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`h-5 w-5 ${i < lives ? 'text-red-500 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full">
            <Timer className="h-4 w-4 text-blue-600" />
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              {score} XP
            </span>
          </div>
        </div>
      </motion.div>

      {/* Game Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{game.title}</h1>
            <p className="text-purple-100">{game.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{game.xpReward} XP</div>
            <div className="text-purple-200">Reward</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-3" />
        </div>
      </motion.div>

      {gameState === 'playing' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          key={currentQuestion}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-lg font-semibold ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                    }`}
                  >
                    {answer}
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 shadow-xl text-center">
            <CardContent className="p-12">
              {gameState === 'completed' ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
                  </motion.div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Congratulations! 🎉
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      You completed the game!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {score + game.xpReward}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total XP</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {questions.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Questions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {lives}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Lives Left</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Play Again</span>
                    </Button>
                    <Button
                      onClick={() => navigate('/games')}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      More Games
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <XCircle className="h-24 w-24 text-red-500 mx-auto" />
                  </motion.div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Game Over! 😔
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      Don't worry, practice makes perfect!
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Final Score: {score} XP
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      You answered {currentQuestion} out of {questions.length} questions correctly
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center space-x-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Try Again</span>
                    </Button>
                    <Button
                      onClick={() => navigate('/games')}
                      variant="outline"
                    >
                      Back to Games
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Game Instructions */}
      {gameState === 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                How to Play:
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Select the correct answer to each math question</li>
                <li>• You have {lives} lives - be careful!</li>
                <li>• Complete all questions before time runs out</li>
                <li>• Earn XP for each correct answer</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
