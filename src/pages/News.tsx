import React from 'react';
import { useIndustry } from '../context/IndustryContext';
import { NewsArticle } from '../services/gemini';
import { motion } from 'motion/react';
import { ExternalLink, Calendar, Newspaper, ArrowUpRight } from 'lucide-react';

interface NewsProps {
  data: NewsArticle[];
  loading?: boolean;
}

export default function News({ data, loading }: NewsProps) {
  const { industry } = useIndustry();

  if (!industry) return null;

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="grid gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 shadow-air border border-white/50 dark:border-slate-700/50 animate-pulse flex flex-col md:flex-row gap-6">
               <div className="flex-1 space-y-4">
                 <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-32"></div>
                 <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-3/4"></div>
                 <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
               </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Newspaper className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No news found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">We couldn't find recent articles for this industry.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {data.map((article, index) => (
            <motion.a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="block bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 shadow-air hover:shadow-air-hover border border-white/50 dark:border-slate-700/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 dark:bg-violet-900/20 rounded-bl-[3rem] -mr-6 -mt-6 transition-all group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 duration-300"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-800">
                      {article.source || 'News'}
                    </span>
                    {article.date && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {article.snippet}
                  </p>
                </div>
                <div className="flex-shrink-0 self-start mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 dark:text-white group-hover:text-white" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
