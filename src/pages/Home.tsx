import React, { useState, useEffect } from 'react';
import { useIndustry } from '../context/IndustryContext';
import { getIndustryInsights, getIndustryNews, getIndustryQuiz, Insight, NewsArticle, QuizQuestion } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Search, Lightbulb, Loader2, LayoutDashboard, Newspaper, BrainCircuit, Globe, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import News from './News';
import Quiz from './Quiz';

type Tab = 'insights' | 'news' | 'quiz';

const COUNTRIES = [
  "World", "United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "France", "Japan", "China", "Brazil", "Singapore", "UAE"
];

export default function Home() {
  const { industry, setIndustry, geo, setGeo } = useIndustry();
  const [inputValue, setInputValue] = useState('');
  
  // Data States
  const [insights, setInsights] = useState<Insight[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('insights');
  const [loadingMessage, setLoadingMessage] = useState('');

  const loadingMessages = [
    "Consulting the digital oracle...",
    "Gathering intelligence from the ether...",
    "Convincing the AI to share its secrets...",
    "Reading the entire internet (briefly)...",
    "Connecting the dots...",
    "Brewing some fresh insights...",
    "Decoding the matrix...",
    "Asking the experts (virtual ones)..."
  ];

  // Rotate loading messages
  useEffect(() => {
    if (loading) {
      // Pick random start
      const getRandomMsg = (exclude?: string) => {
        const available = loadingMessages.filter(msg => msg !== exclude);
        return available[Math.floor(Math.random() * available.length)];
      };

      setLoadingMessage(getRandomMsg());

      const interval = setInterval(() => {
        setLoadingMessage(prev => getRandomMsg(prev));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // If we already have an industry in context (e.g. navigated back), fetch insights if empty
  useEffect(() => {
    if (industry && insights.length === 0 && !loading) {
      handleSearch(industry, geo);
    }
    if (industry) {
        setInputValue(industry);
        setHasSearched(true);
    }
  }, []);

  const handleSearch = async (term: string, selectedGeo: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setLoadingNews(true);
    setLoadingQuiz(true);
    setIndustry(term);
    setGeo(selectedGeo);
    setHasSearched(true);
    setActiveTab('insights');
    
    // Reset data
    setInsights([]);
    setNews([]);
    setQuiz([]);
    
    try {
      // Fetch Insights (Blocking)
      const insightsPromise = getIndustryInsights(term, selectedGeo)
        .then(data => setInsights(data));

      // Fetch News (Background)
      getIndustryNews(term, selectedGeo)
        .then(data => setNews(data))
        .catch(err => console.error("News fetch failed", err))
        .finally(() => setLoadingNews(false));

      // Fetch Quiz (Background)
      getIndustryQuiz(term, selectedGeo)
        .then(data => setQuiz(data))
        .catch(err => console.error("Quiz fetch failed", err))
        .finally(() => setLoadingQuiz(false));

      // Wait only for insights to show the dashboard
      await insightsPromise;
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue, geo);
  };

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = LucideIcons[iconName] || Lightbulb;
    return <Icon className="w-6 h-6 text-violet-600 dark:text-white" />;
  };

  if (!hasSearched && !industry) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl shadow-air border border-white/50 dark:border-slate-700/50">
            <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          Master Any <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400">Industry</span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl leading-relaxed">
          AI-powered intelligence, curated news, and interactive quizzes. <br className="hidden md:block"/>
          Everything you need to become an insider, instantly.
        </p>
        
        <form onSubmit={onSubmit} className="w-full max-w-2xl relative flex flex-col md:flex-row gap-4 p-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-[2rem] shadow-air hover:shadow-air-hover transition-all duration-300">
           <div className="relative flex-shrink-0 md:w-1/3 group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
             </div>
             <select
               value={geo}
               onChange={(e) => setGeo(e.target.value)}
               className="w-full h-14 pl-11 pr-8 text-lg font-medium rounded-[1.5rem] border-transparent bg-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-violet-100 dark:focus:border-slate-600 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
             >
               {COUNTRIES.map(c => (
                 <option key={c} value={c} className="dark:bg-slate-900">{c}</option>
               ))}
             </select>
           </div>
           
           <div className="relative flex-grow group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter an industry (e.g., Fintech)..."
              className="w-full h-14 pl-6 pr-14 text-lg font-medium rounded-[1.5rem] border-transparent bg-white dark:bg-slate-800 shadow-sm focus:border-violet-100 dark:focus:border-slate-600 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'insights', label: 'Insights', icon: LayoutDashboard },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
  ];

  return (
    <div className="space-y-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">Report</span>
             <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">{geo}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {industry}
          </h2>
        </div>
        <button 
          onClick={() => {
            setHasSearched(false);
            setIndustry('');
            setInsights([]);
            setNews([]);
            setQuiz([]);
            setInputValue('');
          }}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-md transition-all duration-200"
        >
          <Search className="w-4 h-4" />
          New Search
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-24 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none md:static">
        <div className="flex p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-sm w-full md:w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                relative flex-1 md:flex-none flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300
                ${activeTab === tab.id 
                  ? 'text-violet-700 dark:text-violet-300 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}
              `}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32">
             <div className="relative">
               <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
               <div className="relative bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-air mb-6">
                 <Loader2 className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-spin" />
               </div>
             </div>
             <p className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">Uncovering Hidden Gems</p>
             <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium animate-pulse">{loadingMessage}</p>
           </div>
        ) : (
          <div className="relative">
            {/* Insights Tab */}
            <div className={activeTab === 'insights' ? 'block' : 'hidden'}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 shadow-air hover:shadow-air-hover border border-white/50 dark:border-slate-700/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/5 to-blue-500/5 dark:from-violet-500/10 dark:to-blue-500/10 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-150 duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-50 to-white dark:from-slate-800 dark:to-slate-900 border border-violet-100 dark:border-slate-700 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-violet-200 dark:group-hover:border-violet-800 transition-all duration-300">
                          {getIcon(insight.icon)}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800 px-3 py-1.5 rounded-full">
                          Insight 0{index + 1}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors leading-tight">
                        {insight.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {insight.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* News Tab */}
            <div className={activeTab === 'news' ? 'block' : 'hidden'}>
              <News data={news} loading={loadingNews} />
            </div>

            {/* Quiz Tab */}
            <div className={activeTab === 'quiz' ? 'block' : 'hidden'}>
              <Quiz data={quiz} loading={loadingQuiz} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
