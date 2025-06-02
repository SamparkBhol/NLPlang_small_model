import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Smile, Frown, Meh, FileText, RefreshCw, Sparkles, SearchCode, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const nlpTools = [
  { id: 'summarize', name: 'Summarize Text', icon: Wand2, color: 'bg-primary hover:bg-primary/90 text-primary-foreground' },
  { id: 'sentiment', name: 'Analyze Sentiment', icon: Sparkles, color: 'bg-accent hover:bg-accent/90 text-accent-foreground' },
  { id: 'keywords', name: 'Extract Keywords', icon: SearchCode, color: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground' },
];

const NlpPlaygroundPage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState(nlpTools[0]);
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
  const { toast } = useToast();

  const handleProcessText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setOutputText(''); 

    await new Promise(resolve => setTimeout(resolve, 1500));

    let result = '';
    const toolId = activeTool.id;

    if (toolId === 'summarize') {
      result = `Mock Summary: The input text discusses various interesting points. It begins by mentioning '${inputText.substring(0, 20)}...' and concludes with an insightful remark. This is a simulated summary.`;
      if (inputText.length < 50) result = `Mock Summary: The text is quite short. Original: "${inputText}"`;
    } else if (toolId === 'sentiment') {
      const sentiments = ['Positive', 'Neutral', 'Negative'];
      const mockSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      let icon = <Meh className="inline-block mr-2 h-5 w-5" />;
      if (mockSentiment === 'Positive') icon = <Smile className="inline-block mr-2 h-5 w-5 text-green-500" />;
      if (mockSentiment === 'Negative') icon = <Frown className="inline-block mr-2 h-5 w-5 text-red-500" />;
      result = <p>{icon}Mock Sentiment: <strong>{mockSentiment}</strong>. This is a simulated analysis.</p>;
    } else if (toolId === 'keywords') {
      const words = inputText.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(Boolean);
      const uniqueWords = [...new Set(words)];
      const mockKeywords = uniqueWords.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, uniqueWords.length));
      result = `Mock Keywords: ${mockKeywords.join(', ') || 'No distinct keywords found in short text.'}. This is simulated.`;
    }

    setOutputText(result);
    setIsLoading(false);
    toast({
      title: `Processing Complete: ${activeTool.name}`,
      description: "Mock results are displayed below.",
    });
  };
  
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    toast({ title: "Cleared", description: "Input and output fields have been cleared." });
  };

  const selectTool = (tool) => {
    setActiveTool(tool);
    setIsToolSelectorOpen(false);
    setOutputText(''); // Clear output when tool changes
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } },
  };

  return (
    <motion.div 
      className="flex flex-col h-full max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6 relative">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-3">
          <Button 
            onClick={() => setIsToolSelectorOpen(!isToolSelectorOpen)} 
            variant="outline" 
            className="w-full sm:w-auto justify-between min-w-[200px] text-lg py-3 h-auto"
            aria-expanded={isToolSelectorOpen}
            aria-haspopup="true"
          >
            <span className="flex items-center">
              {React.createElement(activeTool.icon, { className: "mr-2 h-5 w-5"})}
              {activeTool.name}
            </span>
            {isToolSelectorOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
          <div className="flex gap-2">
            <Button 
              onClick={handleProcessText} 
              disabled={isLoading}
              className={cn("w-full sm:w-auto text-lg py-3 h-auto", activeTool.color)}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileText className="mr-2 h-5 w-5" />}
              Process Text
            </Button>
            <Button 
              onClick={handleClear} 
              disabled={isLoading}
              variant="outline"
              className="w-full sm:w-auto text-lg py-3 h-auto"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Clear
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isToolSelectorOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10 p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
            >
              {nlpTools.map(tool => (
                <Button
                  key={tool.id}
                  variant={activeTool.id === tool.id ? "default" : "ghost"}
                  onClick={() => selectTool(tool)}
                  className={cn("w-full justify-start text-md py-3 h-auto", activeTool.id === tool.id && tool.color)}
                >
                  <tool.icon className="mr-2 h-5 w-5" />
                  {tool.name}
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[300px] sm:min-h-[400px]">
        <div className="flex flex-col">
          <label htmlFor="inputText" className="text-sm font-medium text-muted-foreground mb-1">Input Text</label>
          <Textarea
            id="inputText"
            placeholder={`Enter text to process with "${activeTool.name}"...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 resize-none text-base p-4 border-input focus:ring-primary focus:border-primary bg-background/70 rounded-lg shadow-inner"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="outputText" className="text-sm font-medium text-muted-foreground mb-1">Output / Result</label>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center bg-muted/30 border border-dashed border-border rounded-lg p-4"
              >
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Processing with {activeTool.name}...</p>
                <p className="text-xs text-muted-foreground">This is a mock API call, please wait.</p>
              </motion.div>
            ) : outputText ? (
              <motion.div
                key="output"
                initial={{ opacity: 0, y:10 }}
                animate={{ opacity: 1, y:0 }}
                exit={{ opacity: 0 }}
                className="flex-1 prose prose-sm sm:prose-base max-w-none dark:prose-invert text-foreground bg-muted/30 p-4 rounded-lg shadow-inner overflow-auto"
              >
                {typeof outputText === 'string' ? <p>{outputText}</p> : outputText}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center bg-muted/20 border border-dashed border-border rounded-lg p-4 text-center"
              >
                <Info className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Results will appear here after processing.</p>
                <p className="text-xs text-muted-foreground mt-1">Select a tool, enter text, and click "Process Text".</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NlpPlaygroundPage;