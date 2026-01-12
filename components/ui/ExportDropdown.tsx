
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Download, FileText, FileType, Loader2, ChevronDown } from 'lucide-react';
import React from 'react';

interface ExportDropdownProps {
  onExportPDF: () => void;
  onExportDOCX: () => void;
  isExporting: boolean;
  className?: string; // To override trigger button styles
  variant?: 'glow' | 'glass' | 'outline'; // Added outline
  label?: string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  onExportPDF, 
  onExportDOCX, 
  isExporting,
  className = '',
  variant = 'glass',
  label = 'Export'
}) => {
  
  let baseStyles = "";
  if (variant === 'glow') {
    baseStyles = "glow-button px-4 py-2 sm:px-6 flex items-center gap-1 sm:gap-2 disabled:opacity-70 disabled:cursor-wait text-white";
  } else if (variant === 'outline') {
    baseStyles = "px-3 py-1.5 sm:px-4 rounded-xl border border-white/10 glass-panel hover:bg-white/15 text-white/80 hover:text-white transition-all flex items-center gap-1 sm:gap-2";
  } else {
    baseStyles = "flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm";
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={isExporting}>
        <button className={`${baseStyles} ${className} outline-none`}>
          {isExporting ? (
             <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          ) : (
             <Download className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="min-w-0 truncate">{isExporting ? 'Exporting...' : label}</span>
          {!isExporting && <ChevronDown className="w-3 h-3 ml-1 opacity-70 flex-shrink-0" />}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="min-w-[160px] bg-[#1a1a1a] border border-white/10 rounded-xl p-1 shadow-xl z-[100] text-white animate-in fade-in zoom-in-95 duration-100"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item 
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
            onSelect={onExportPDF}
          >
            <div className="p-1 rounded bg-red-500/10">
              <FileType className="w-4 h-4 text-red-400" />
            </div>
            <span>Export as PDF</span>
          </DropdownMenu.Item>
          
          <DropdownMenu.Item 
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
            onSelect={onExportDOCX}
          >
            <div className="p-1 rounded bg-blue-500/10">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <span>Export as DOCX</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
