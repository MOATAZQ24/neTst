import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { 
  Network, 
  Brain, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Zap,
  Target,
  Globe,
  Shield,
  Settings
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Generate session ID for progress tracking
const getSessionId = () => {
  let sessionId = localStorage.getItem('ccna_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ccna_session_id', sessionId);
  }
  return sessionId;
};

const LandingPage = ({ onStartQuiz, onViewProgress }) => {
  const [stats, setStats] = useState({ total_quizzes: 0, average_score: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sessionId = getSessionId();
        const response = await axios.get(`${API}/progress/${sessionId}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Network className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">neTst</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" onClick={onViewProgress}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress
              </Button>
              <Button onClick={() => onStartQuiz('beginner')}>
                Start Quiz
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Master CCNA with 
                <span className="text-blue-600"> Interactive</span> Quizzes
              </h1>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                Comprehensive practice questions covering OSI Model, Subnetting, Routing Protocols, 
                and more. Track your progress and identify weak areas with our intelligent quiz system.
              </p>
              
              {/* Disclaimer on landing page */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 mt-0.5">
                    ⚠️ Note
                  </Badge>
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Practice Questions Only</p>
                    <p>
                      Questions are sourced from educational resources like IPCisco.com for practice purposes. 
                      This is not official Cisco exam content. Limited question bank - more content added regularly.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  onClick={() => onStartQuiz('beginner')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={onViewProgress}
                  className="px-8 py-4 text-lg"
                >
                  <Target className="h-5 w-5 mr-2" />
                  View Progress
                </Button>
              </div>
              
              {/* Stats */}
              {stats.total_quizzes > 0 && (
                <div className="flex items-center space-x-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total_quizzes}</div>
                    <div className="text-sm text-slate-600">Quizzes Taken</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.average_score}%</div>
                    <div className="text-sm text-slate-600">Average Score</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1506399558188-acca6f8cbf41" 
                alt="Network Infrastructure" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose NetworkPrep?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform is designed to help you master networking concepts through interactive learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Questions adapt to your skill level with beginner, intermediate, and advanced difficulty levels
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Monitor your performance, identify weak areas, and track improvement over time
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit mb-4">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Gamification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Compete with others on the leaderboard and earn achievements for your progress
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">CCNA Topics Covered</h2>
            <p className="text-xl text-slate-600">
              Comprehensive coverage of all essential networking concepts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "OSI Model", desc: "7-layer networking model fundamentals" },
              { icon: Network, title: "Subnetting", desc: "IP addressing and subnet calculations" },
              { icon: Settings, title: "Routing Protocols", desc: "RIP, OSPF, EIGRP, and BGP" },
              { icon: Shield, title: "Switching", desc: "VLANs, STP, and switch operations" },
              { icon: Target, title: "IP Addressing", desc: "IPv4, IPv6, and NAT concepts" },
              { icon: Zap, title: "Network Security", desc: "Security protocols and best practices" }
            ].map((topic, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <topic.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{topic.title}</h3>
                <p className="text-slate-600">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your CCNA Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have improved their networking skills with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onStartQuiz('beginner')}
              className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold"
            >
              Start First Quiz
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onViewProgress}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Network className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">NetworkPrep</span>
            </div>
            <p className="text-slate-400">
              © 2024 NetworkPrep. Master networking with confidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const QuizPage = ({ difficulty, onQuizComplete, onBackToHome }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const response = await axios.post(`${API}/quiz/start`, {
          difficulty_level: difficulty,
          question_count: 5
        });
        setQuiz(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error starting quiz:', error);
        setLoading(false);
      }
    };
    startQuiz();
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !loading && quiz && !showDisclaimer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, loading, quiz, showDisclaimer]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1] || null);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handleSubmitQuiz = async (finalAnswers = answers) => {
    try {
      const sessionId = getSessionId();
      const response = await axios.post(`${API}/quiz/submit`, {
        session_id: sessionId,
        quiz_id: quiz.id,
        answers: finalAnswers,
        time_taken: 600 - timeLeft
      });
      onQuizComplete(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setShowDisclaimer(false);
  };

  // Disclaimer Component
  const DisclaimerModal = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-amber-100 rounded-full w-fit mb-4">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Important Notice</CardTitle>
          <CardDescription className="text-lg">
            Before starting your CCNA practice quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  ⚠️ Disclaimer
                </Badge>
              </div>
            </div>
            <div className="mt-3 text-amber-800">
              <h3 className="font-semibold mb-2">Practice Questions Only</h3>
              <p className="mb-4">
                The questions in this quiz are practice-only and are collected from external educational resources, 
                including sites like <strong>IPCisco.com</strong> and other networking education platforms.
              </p>
              <p className="mb-4">
                <strong>This is NOT the official Cisco exam database.</strong> These questions are designed to help 
                you practice and understand networking concepts, but they may not reflect the exact format, 
                difficulty, or content of actual Cisco certification exams.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="text-blue-800">
              <h3 className="font-semibold mb-2">Question Bank Limitations</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>The number of available questions is currently limited</li>
                <li>Questions are being gradually added over time</li>
                <li>Repetition may occur if you take multiple quizzes</li>
                <li>Content is sourced from educational websites and study materials</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="text-green-800">
              <h3 className="font-semibold mb-2">How to Use This Platform</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Use these quizzes to practice and reinforce your knowledge</li>
                <li>Review explanations carefully to understand concepts</li>
                <li>Supplement with official Cisco study materials</li>
                <li>Track your progress to identify areas for improvement</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleStartQuiz}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              I Understand - Start Quiz
            </Button>
            <Button 
              variant="outline" 
              onClick={onBackToHome}
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showDisclaimer) {
    return <DisclaimerModal />;
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Quiz Loading Failed</h2>
            <p className="text-slate-600 mb-4">Unable to load quiz questions.</p>
            <Button onClick={onBackToHome}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBackToHome}>
                ← Back
              </Button>
              <Badge variant="secondary" className="capitalize">
                {difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                Practice Questions
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className={`font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-slate-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <span className="text-sm text-slate-500">
                {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{question.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                    selectedAnswer === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium text-slate-700 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setSelectedAnswer(answers[currentQuestion - 1] || null);
              }
            }}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ResultsPage = ({ results, onStartNewQuiz, onBackToHome }) => {
  const scoreColor = results.score >= 80 ? 'text-green-600' : 
                     results.score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="mb-8 text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              {results.score >= 80 ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h1>
            <div className={`text-6xl font-bold mb-4 ${scoreColor}`}>
              {Math.round(results.score)}%
            </div>
            <p className="text-slate-600 text-lg">
              You got {results.correct_answers} out of {results.total_questions} questions correct
            </p>
            <div className="flex justify-center items-center space-x-6 mt-6">
              <div className="text-center">
                <Clock className="h-5 w-5 text-slate-500 mx-auto mb-1" />
                <span className="text-sm text-slate-600">
                  {Math.floor(results.time_taken / 60)}:{(results.time_taken % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.results.map((result, index) => (
                <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-slate-900 flex-1">
                      {index + 1}. {result.question}
                    </h3>
                    {result.is_correct ? (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-4 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 ml-4 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {result.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          optIndex === result.correct_answer
                            ? 'bg-green-100 text-green-800'
                            : optIndex === result.user_answer && !result.is_correct
                            ? 'bg-red-100 text-red-800'
                            : 'text-slate-600'
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        {option}
                        {optIndex === result.user_answer && (
                          <span className="ml-2 text-xs">← Your answer</span>
                        )}
                        {optIndex === result.correct_answer && (
                          <span className="ml-2 text-xs">← Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-800">
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => onStartNewQuiz('beginner')} className="bg-blue-600 hover:bg-blue-700">
            Take Another Quiz
          </Button>
          <Button variant="outline" onClick={onBackToHome}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProgressPage = ({ onBackToHome }) => {
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionId = getSessionId();
        const [progressRes, leaderboardRes] = await Promise.all([
          axios.get(`${API}/progress/${sessionId}`),
          axios.get(`${API}/leaderboard`)
        ]);
        setProgress(progressRes.data);
        setLeaderboard(leaderboardRes.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
          <Button variant="outline" onClick={onBackToHome}>
            ← Back to Home
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Quiz History</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {progress?.total_quizzes || 0}
                  </div>
                  <p className="text-slate-600">Quizzes Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {progress?.average_score || 0}%
                  </div>
                  <p className="text-slate-600">Average Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Object.keys(progress?.topics_attempted || {}).length}
                  </div>
                  <p className="text-slate-600">Topics Explored</p>
                </CardContent>
              </Card>
            </div>

            {progress?.total_quizzes > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(progress.difficulty_progress || {}).map(([difficulty, count]) => (
                        <div key={difficulty}>
                          <div className="flex justify-between mb-1">
                            <span className="capitalize text-sm font-medium">{difficulty}</span>
                            <span className="text-sm text-slate-600">{count} quizzes</span>
                          </div>
                          <Progress value={(count / progress.total_quizzes) * 100} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Topic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(progress.topics_attempted || {}).map(([topic, count]) => (
                        <div key={topic}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium capitalize">
                              {topic.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-slate-600">{count} quizzes</span>
                          </div>
                          <Progress value={(count / progress.total_quizzes) * 100} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {progress?.recent_scores?.length > 0 ? (
                  <div className="space-y-4">
                    {progress.recent_scores.map((score, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <div className="font-medium">Score: {Math.round(score.score)}%</div>
                          <div className="text-sm text-slate-600 capitalize">
                            {score.difficulty} • {new Date(score.date).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge 
                          variant={score.score >= 80 ? "default" : score.score >= 60 ? "secondary" : "destructive"}
                        >
                          {score.score >= 80 ? "Excellent" : score.score >= 60 ? "Good" : "Needs Work"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-600 py-8">No quiz history yet. Take your first quiz to see results here!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with highest average scores (minimum 3 quizzes)</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {leaderboard.map((entry, index) => (
                      <div key={entry._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-amber-600' : 'bg-slate-500'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <div className="font-medium">Student #{entry._id.slice(-8)}</div>
                            <div className="text-sm text-slate-600">
                              {entry.total_quizzes} quizzes completed
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{entry.average_score}%</div>
                          <div className="text-sm text-slate-600">Best: {Math.round(entry.best_score)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-600 py-8">No leaderboard data yet. Complete more quizzes to appear here!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentDifficulty, setCurrentDifficulty] = useState('beginner');
  const [quizResults, setQuizResults] = useState(null);

  const handleStartQuiz = (difficulty) => {
    setCurrentDifficulty(difficulty);
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setCurrentPage('results');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
  };

  const handleViewProgress = () => {
    setCurrentPage('progress');
  };

  const handleStartNewQuiz = (difficulty) => {
    setCurrentDifficulty(difficulty);
    setQuizResults(null);
    setCurrentPage('quiz');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={
            <>
              {currentPage === 'landing' && (
                <LandingPage 
                  onStartQuiz={handleStartQuiz}
                  onViewProgress={handleViewProgress}
                />
              )}
              {currentPage === 'quiz' && (
                <QuizPage 
                  difficulty={currentDifficulty}
                  onQuizComplete={handleQuizComplete}
                  onBackToHome={handleBackToHome}
                />
              )}
              {currentPage === 'results' && quizResults && (
                <ResultsPage 
                  results={quizResults}
                  onStartNewQuiz={handleStartNewQuiz}
                  onBackToHome={handleBackToHome}
                />
              )}
              {currentPage === 'progress' && (
                <ProgressPage 
                  onBackToHome={handleBackToHome}
                />
              )}
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;