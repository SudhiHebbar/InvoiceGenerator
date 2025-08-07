import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const KeyboardShortcuts: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 h-10 w-10 rounded-full bg-card border border-border shadow-lg hover:bg-accent print-hide"
          aria-label="View keyboard shortcuts"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Add new row:</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Enter</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Print invoice:</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + P</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tab navigation:</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Reverse tab:</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift + Tab</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
