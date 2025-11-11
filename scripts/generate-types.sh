#!/bin/bash

# Solution intelligente : parsing automatique par patterns réels
set -e

echo "🧠 Analyse intelligente des patterns du fichier API..."

BASE_DIR="types/api"
TEMP_API_FILE="temp-api-full.ts"

# Nettoyer et préparer
rm -rf "$BASE_DIR"
mkdir -p "$BASE_DIR"

echo "📥 Génération du fichier API complet (temporaire)..."
npx openapi-typescript http://localhost:4000/docs-json -o "$TEMP_API_FILE"

echo "🔍 Extraction des patterns automatique..."
node << 'EOF'
const fs = require('fs');
const path = require('path');

const BASE_DIR = 'types/api';
const TEMP_API_FILE = 'temp-api-full.ts';

// Lire le fichier complet
const content = fs.readFileSync(TEMP_API_FILE, 'utf8');
const lines = content.split('\n');

// Trouver les sections principales
const pathsStart = lines.findIndex(line => line.includes('export interface paths'));
const componentsStart = lines.findIndex(line => line.includes('export interface components'));
const operationsStart = lines.findIndex(line => line.includes('export interface operations'));
const webhooksLine = lines.findIndex(line => line.includes('export type webhooks'));

console.log(`📍 Sections trouvées:`);
console.log(`   paths: ${pathsStart}-${componentsStart-1}`);
console.log(`   components: ${componentsStart}-${operationsStart-1}`);
console.log(`   operations: ${operationsStart}-${lines.length}`);

// Analyser les routes pour extraire les domaines automatiquement
const pathsSection = lines.slice(pathsStart, webhooksLine);
const routeGroups = {};

pathsSection.forEach((line, index) => {
  const routeMatch = line.match(/^\s*"\/([^/"]+)/);
  if (routeMatch) {
    let domain = routeMatch[1];
    
    // Mapping spéciaux
    if (domain === 'files') {
      // Regarder la sous-route pour files/audio vs files/images
      const nextLine = pathsSection[index + 1] || '';
      if (line.includes('/files/audio')) domain = 'audio-files';
      else if (line.includes('/files/images')) domain = 'image-files';
      else domain = 'files';
    }
    
    if (!routeGroups[domain]) {
      routeGroups[domain] = { paths: [], operations: new Set() };
    }
    
    // Capturer tout le bloc de cette route
    let endIndex = index + 1;
    let braceCount = 0;
    let foundOpenBrace = false;
    
    for (let i = index; i < pathsSection.length; i++) {
      const currentLine = pathsSection[i];
      
      if (currentLine.includes('{')) {
        braceCount += (currentLine.match(/\{/g) || []).length;
        foundOpenBrace = true;
      }
      if (currentLine.includes('}')) {
        braceCount -= (currentLine.match(/\}/g) || []).length;
      }
      
      // Extraire les operations de cette route
      const opMatch = currentLine.match(/operations\["([^"]+)"\]/);
      if (opMatch) {
        routeGroups[domain].operations.add(opMatch[1]);
      }
      
      if (foundOpenBrace && braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
    
    routeGroups[domain].paths.push({
      route: line.trim(),
      content: pathsSection.slice(index, endIndex)
    });
  }
});

console.log(`🎯 Domaines détectés automatiquement:`);
Object.keys(routeGroups).forEach(domain => {
  const { paths, operations } = routeGroups[domain];
  console.log(`   ${domain}: ${paths.length} routes, ${operations.size} operations`);
});

// Générer les fichiers par domaine
Object.entries(routeGroups).forEach(([domain, { paths, operations }]) => {
  if (paths.length === 0) return;
  
  // Créer un nom valide TypeScript (camelCase)
  const safeDomainName = domain.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase()).replace(/^([a-z])/, (match, letter) => letter.toUpperCase());
  
  // Créer le fichier paths pour ce domaine
  const domainPaths = paths.map(p => p.content.join('\n')).join('\n');
  
  const domainContent = `// Domain: ${domain}
// Auto-generated from API structure analysis

import type { operations } from './globals.types';

export interface ${safeDomainName}Paths {
${domainPaths}
}

// Operations for this domain
export type ${safeDomainName}Operations = ${Array.from(operations).map(op => `"${op}"`).join(' | ')};

// Re-export individual operations  
${Array.from(operations).map(op => {
  const shortName = op.replace(/Controller_/, '').replace(/([A-Z])/g, '$1').replace(/^./, match => match.toUpperCase());
  return `export type ${shortName} = operations["${op}"];`;
}).join('\n')}
`;

  fs.writeFileSync(path.join(BASE_DIR, `${domain}.types.ts`), domainContent);
  console.log(`✅ ${domain}: ${paths.length} routes → ${domain}.types.ts`);
});

// Créer le fichier globals avec juste les types nécessaires
const globalsContent = `// Global API types
// Contains the complete interfaces needed for openapi-fetch

${lines.slice(pathsStart, componentsStart).join('\n')}

${lines.slice(componentsStart, operationsStart).join('\n')}

${lines.slice(operationsStart).join('\n')}
`;

fs.writeFileSync(path.join(BASE_DIR, 'globals.types.ts'), globalsContent);
console.log(`✅ globals.types.ts créé (complet pour openapi-fetch)`);

// Créer l'index intelligent
const indexContent = `// Modular API Types - Intelligent auto-detection
// Generated by analyzing actual API structure patterns

// Global types (full export for compatibility)
export type { components, paths, operations } from './globals.types';

// Domain-specific types (auto-detected)
${Object.keys(routeGroups).map(domain => `export * from './${domain}.types';`).join('\n')}
`;

fs.writeFileSync(path.join(BASE_DIR, 'index.ts'), indexContent);
console.log(`📄 index.ts créé avec ${Object.keys(routeGroups).length} domaines détectés`);

EOF

# Nettoyer le fichier temporaire
rm -f "$TEMP_API_FILE"

echo "🎉 Génération intelligente terminée !"
echo ""
echo "🧠 Cette approche:"
echo "   ✅ Détecte automatiquement les domaines par analyse des routes"
echo "   ✅ Aucune maintenance manuelle des noms de types"
echo "   ✅ S'adapte automatiquement aux changements d'API"
echo "   ✅ Préserve la compatibilité openapi-fetch"
echo ""
echo "📊 Résultat: Structure modulaire générée par intelligence artificielle ! 🤖"
