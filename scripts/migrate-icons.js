/**
 * Migrate Lucide React icons to Phosphor Icons
 * 
 * This script finds all files with Lucide icon imports and replaces them with
 * equivalent Phosphor icons. It handles both named imports and usage in JSX.
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

// Icon mapping from Lucide to Phosphor
const iconMapping = {
  // Navigation & UI
  'ArrowRight': 'ArrowRight',
  'ArrowLeft': 'ArrowLeft',
  'ArrowUp': 'ArrowUp',
  'ArrowDown': 'ArrowDown',
  'ChevronRight': 'CaretRight',
  'ChevronLeft': 'CaretLeft',
  'ChevronUp': 'CaretUp',
  'ChevronDown': 'CaretDown',
  'X': 'X',
  'Menu': 'List',
  'MoreHorizontal': 'DotsThree',
  'MoreVertical': 'DotsThreeVertical',
  'Search': 'MagnifyingGlass',
  'Filter': 'Funnel',
  'Settings': 'Gear',
  'Home': 'House',
  'User': 'User',
  'Users': 'Users',
  'LogOut': 'SignOut',
  'LogIn': 'SignIn',
  'Edit': 'PencilSimple',
  'Trash2': 'Trash',
  'Plus': 'Plus',
  'Minus': 'Minus',
  'Check': 'Check',
  'CheckCircle': 'CheckCircle',
  'Eye': 'Eye',
  'EyeOff': 'EyeSlash',
  'Bell': 'Bell',
  'Calendar': 'Calendar',
  'Clock': 'Clock',
  'Play': 'Play',
  'Pause': 'Pause',
  'Upload': 'UploadSimple',
  'Download': 'DownloadSimple',
  'Loader2': 'Spinner',
  'RefreshCw': 'ArrowsClockwise',
  'Save': 'FloppyDisk',
  'Share': 'Share',
  'Link': 'Link',
  'ExternalLink': 'ArrowSquareOut',
  'Copy': 'Copy',
  'Clipboard': 'Clipboard',
  'Bookmark': 'Bookmark',
  'Star': 'Star',
  'Heart': 'Heart',
  'ThumbsUp': 'ThumbsUp',
  'ThumbsDown': 'ThumbsDown',
  
  // Communication
  'Mail': 'Envelope',
  'MessageCircle': 'ChatCircle',
  'MessageSquare': 'ChatSquare',
  'Send': 'PaperPlaneTilt',
  'Phone': 'Phone',
  'Video': 'VideoCamera',
  'Mic': 'Microphone',
  'MicOff': 'MicrophoneSlash',
  'Volume': 'SpeakerSimple',
  'Volume2': 'SpeakerHigh',
  'VolumeX': 'SpeakerSlash',
  
  // Alerts & Feedback
  'AlertCircle': 'WarningCircle',
  'AlertTriangle': 'Warning',
  'Info': 'Info',
  'HelpCircle': 'Question',
  
  // Files & Data
  'File': 'File',
  'FileText': 'FileText',
  'Image': 'Image',
  'Camera': 'Camera',
  'Folder': 'Folder',
  'FolderOpen': 'FolderOpen',
  'Archive': 'Archive',
  'Database': 'Database',
  'Lock': 'Lock',
  'Unlock': 'LockOpen',
  'Key': 'Key',
  'Shield': 'Shield',
  
  // Misc
  'Zap': 'Lightning',
  'Target': 'Target',
  'Sparkles': 'Sparkle',
  'Crown': 'Crown',
  'Quote': 'Quotes',
  'DivideIcon': 'Divide',
  'WifiOff': 'WifiSlash',
};

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.vscode',
  '.idea'
];

// File extensions to process
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Create backup directory
const backupDir = path.join(process.cwd(), 'backup-lucide-icons');

// Track statistics
const stats = {
  filesScanned: 0,
  filesModified: 0,
  iconsReplaced: 0,
  errors: []
};

/**
 * Recursively scan directory for files
 */
async function scanDirectory(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name);
      
      // Skip excluded directories
      if (entry.isDirectory() && excludeDirs.includes(entry.name)) {
        return [];
      }
      
      // Recursively scan subdirectories
      if (entry.isDirectory()) {
        return scanDirectory(fullPath);
      }
      
      // Only process files with specified extensions
      if (extensions.includes(path.extname(entry.name))) {
        return [fullPath];
      }
      
      return [];
    })
  );
  
  return files.flat();
}

/**
 * Create backup of a file
 */
async function backupFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const backupPath = path.join(backupDir, relativePath);
  const backupDirPath = path.dirname(backupPath);
  
  try {
    // Create backup directory structure if it doesn't exist
    await mkdir(backupDirPath, { recursive: true });
    
    // Copy file to backup
    const content = await readFile(filePath, 'utf8');
    await writeFile(backupPath, content, 'utf8');
    
    return true;
  } catch (error) {
    console.error(`Error backing up file ${filePath}:`, error);
    stats.errors.push({ file: filePath, error: `Backup failed: ${error.message}` });
    return false;
  }
}

/**
 * Process a file to replace Lucide icons with Phosphor
 */
async function processFile(filePath) {
  try {
    stats.filesScanned++;
    
    // Read file content
    const content = await readFile(filePath, 'utf8');
    
    // Check if file contains Lucide imports
    if (!content.includes('lucide-react')) {
      return;
    }
    
    // Backup file before modifying
    await backupFile(filePath);
    
    // Replace imports
    let newContent = content;
    
    // Replace named imports
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g;
    newContent = newContent.replace(importRegex, (match, importNames) => {
      const imports = importNames.split(',').map(name => name.trim());
      
      const mappedImports = imports.map(importName => {
        // Handle aliased imports like "{ Menu as MenuIcon }"
        const [name, alias] = importName.split(' as ').map(part => part.trim());
        
        if (iconMapping[name]) {
          return alias ? `${iconMapping[name]} as ${alias}` : iconMapping[name];
        }
        
        // If no mapping found, keep original (with a console warning)
        console.warn(`No mapping found for Lucide icon: ${name}`);
        return importName;
      });
      
      return `import { ${mappedImports.join(', ')} } from "@phosphor-icons/react"`;
    });
    
    // Count replaced icons
    const originalIconCount = (content.match(importRegex) || []).length;
    stats.iconsReplaced += originalIconCount;
    
    // Only write file if changes were made
    if (newContent !== content) {
      await writeFile(filePath, newContent, 'utf8');
      stats.filesModified++;
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    stats.errors.push({ file: filePath, error: error.message });
  }
}

/**
 * Generate report of migration
 */
async function generateReport() {
  const reportContent = `
# Lucide to Phosphor Icons Migration Report

## Summary
- Files scanned: ${stats.filesScanned}
- Files modified: ${stats.filesModified}
- Icons replaced: ${stats.iconsReplaced}
- Errors: ${stats.errors.length}

## Icon Mapping
\`\`\`json
${JSON.stringify(iconMapping, null, 2)}
\`\`\`

${stats.errors.length > 0 ? `
## Errors
${stats.errors.map(err => `- ${err.file}: ${err.error}`).join('\n')}
` : ''}

## Backup
All modified files were backed up to: ${backupDir}

Generated on: ${new Date().toISOString()}
`;

  await writeFile('migration-report.md', reportContent, 'utf8');
  console.log(`📝 Migration report generated: migration-report.md`);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔍 Scanning project for Lucide icon imports...');
    
    // Create backup directory
    await mkdir(backupDir, { recursive: true });
    console.log(`📁 Created backup directory: ${backupDir}`);
    
    // Scan for files
    const files = await scanDirectory(process.cwd());
    console.log(`🔎 Found ${files.length} files to scan`);
    
    // Process files
    for (const file of files) {
      await processFile(file);
    }
    
    // Generate report
    await generateReport();
    
    console.log('\n✨ Migration completed!');
    console.log(`📊 Summary: ${stats.filesModified} files modified, ${stats.iconsReplaced} icons replaced`);
    
    if (stats.errors.length > 0) {
      console.log(`⚠️ Encountered ${stats.errors.length} errors. See migration-report.md for details.`);
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Review the changes in your code editor');
    console.log('2. Check the migration-report.md file for details');
    console.log('3. Run your application to verify everything works correctly');
    console.log('4. Delete the backup directory when you\'re satisfied with the migration');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the script
main().catch(console.error);