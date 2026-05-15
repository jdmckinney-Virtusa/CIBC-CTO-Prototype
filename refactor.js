const fs = require('fs');

function globalRefactor(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Colors
  content = content.replace(/bg-white/g, 'bg-[var(--cibc-bg-primary)]');
  content = content.replace(/bg-gray-50/g, 'bg-[var(--cibc-bg-secondary)]');
  content = content.replace(/bg-gray-100/g, 'bg-[var(--cibc-bg-secondary)]');
  content = content.replace(/bg-gray-200/g, 'bg-[var(--cibc-border-primary)]');
  
  content = content.replace(/border-gray-100/g, 'border-[var(--cibc-border-primary)]');
  content = content.replace(/border-gray-200/g, 'border-[var(--cibc-border-primary)]');
  content = content.replace(/border-gray-300/g, 'border-[var(--cibc-border-secondary)]');
  
  content = content.replace(/text-gray-400/g, 'text-[var(--cibc-text-disabled)]');
  content = content.replace(/text-gray-500/g, 'text-[var(--cibc-text-secondary)]');
  content = content.replace(/text-gray-600/g, 'text-[var(--cibc-text-secondary)]');
  content = content.replace(/text-gray-700/g, 'text-[var(--cibc-text-primary)]');
  content = content.replace(/text-gray-900/g, 'text-[var(--cibc-text-primary)]');
  
  content = content.replace(/text-green-600/g, 'cibc-text-success');
  content = content.replace(/text-green-700/g, 'cibc-text-success-deep');
  content = content.replace(/bg-green-50/g, 'bg-[var(--cibc-success-bg)]');
  
  content = content.replace(/text-\[#BC0000\]/g, 'text-[var(--cibc-text-error)]');
  content = content.replace(/text-red-600/g, 'text-[var(--cibc-text-error)]');
  
  content = content.replace(/text-[#6B46C1]/g, 'text-[var(--cibc-burgundy)]');
  content = content.replace(/bg-\[#6B46C1\]/g, 'bg-[var(--cibc-burgundy)]');
  content = content.replace(/text-purple-600/g, 'text-[var(--cibc-burgundy)]');
  content = content.replace(/text-purple-700/g, 'text-[var(--cibc-burgundy-dark)]');
  content = content.replace(/border-purple-600/g, 'border-[var(--cibc-burgundy)]');
  content = content.replace(/bg-purple-600/g, 'bg-[var(--cibc-burgundy)]');
  content = content.replace(/bg-purple-50/g, 'bg-[var(--cibc-burgundy-bg)]');
  content = content.replace(/text-blue-600/g, 'text-[var(--cibc-info)]');
  
  // Headers
  content = content.replace(/className="[^"]*?(px-8 py-6 border-b[^"]*?flex[^"]*?)"/g, 'className="$1 cibc-header"');
  content = content.replace(/className="[^"]*?(px-8 py-5 border-b[^"]*?flex[^"]*?)"/g, 'className="$1 cibc-header"');
  
  // Primary buttons
  content = content.replace(/className="([^"]*?)text-white([^"]*?)cursor-pointer([^"]*?)"/g, 'className="$1 cibc-btn-primary $3"');
  content = content.replace(/className="([^"]*?)text-white([^"]*?)"/g, (match, p1, p2) => {
    if (match.includes('bg-[#BC0000]') || match.includes('primary-purple')) {
      return `className="${p1} cibc-btn-primary ${p2}"`;
    }
    return match;
  });

  // Secondary buttons
  content = content.replace(/className="([^"]*?border border-gray-300[^"]*?hover:bg-gray-50[^"]*?)"/g, 'className="$1 cibc-btn-secondary"');
  
  fs.writeFileSync(filePath, content);
}

const files = [
  'src/components/MainWorkspace.tsx',
  'src/components/AccountsWorkspace.tsx',
  'src/components/ScenarioComparisonModal.tsx',
  'src/components/AICopilot.tsx'
];

files.forEach(globalRefactor);
console.log('Refactoring complete');
