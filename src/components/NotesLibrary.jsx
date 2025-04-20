'use client';

import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const documents = [
  {
    name: "Applied Notes ST2",
    file: "APPLIED ST2 NOTES.pdf",
  },
 
];

export default function NotesLibrary() {
    const handleOpen = (file) => {
        const link = document.createElement('a');
        link.href = '/' + encodeURIComponent(file);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.type = 'application/pdf';
        link.click();
      };
      


  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">
            📚 Notes Subject PDFs
          </h1>
          
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc, index) => (
              <Card 
                key={index}
                className="group backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-white/10">
                      <FileText className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {doc.name}
                      </h2>
                      <p className="text-white/60 text-sm mt-1">PDF Document</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button
                    onClick={() => handleOpen(doc.file)}
                    variant="ghost"
                    className="text-white hover:text-cyan-300 hover:bg-white/10"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  <Button
                    onClick={() => handleOpen(doc.file)}
                    className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white border-none"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
