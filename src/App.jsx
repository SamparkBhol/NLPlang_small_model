import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NlpPlaygroundPage from '@/pages/NlpPlaygroundPage';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Moon, Sun, MessageSquare as MessageSquareText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { toast } = useToast();
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem('theme');
    return localTheme || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    toast({
      title: "Welcome to NLPLang Playground!",
      description: "A custom environment for NLP exploration.",
      duration: 3000,
    });
  }, [toast]);

  return (
    <Router>
      <div className="flex flex-col h-screen antialiased bg-background text-foreground transition-colors duration-300">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <MessageSquareText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground tracking-tight">NLPLang</h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'light' ? (
                    <motion.div
                      key="moon"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<NlpPlaygroundPage />} />
          </Routes>
        </main>
        
        <footer className="p-4 border-t border-border bg-background/80 text-center text-xs text-muted-foreground">
          NLPLang Playground © {new Date().getFullYear()} - Custom NLP Environment
        </footer>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;