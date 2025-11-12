#!/bin/bash

# Enhanced type generation with domain-specific entities and endpoints
set -e

echo "🧠 Analyse intelligente des patterns du fichier API..."

BASE_DIR="types/api"
TEMP_API_FILE="temp-api-full.ts"

# Nettoyer et préparer
rm -rf "$BASE_DIR"
mkdir -p "$BASE_DIR"

echo "📥 Génération du fichier API complet (temporaire)..."
npx openapi-typescript http://localhost:4000/docs-json -o "$TEMP_API_FILE"

echo "🔍 Extraction intelligente des domaines, types et endpoints..."
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

// === EXTRACTION DES SCHEMAS (TYPES) ===
const componentsSection = lines.slice(componentsStart, operationsStart);
const schemasStartLine = componentsSection.findIndex(line => line.includes('schemas: {'));
let schemasEndLine = schemasStartLine;
let braceCount = 0;

for (let i = schemasStartLine; i < componentsSection.length; i++) {
  const line = componentsSection[i];
  braceCount += (line.match(/\{/g) || []).length;
  braceCount -= (line.match(/\}/g) || []).length;
  
  if (braceCount === 0 && i > schemasStartLine) {
    schemasEndLine = i;
    break;
  }
}

const schemasContent = componentsSection.slice(schemasStartLine + 1, schemasEndLine).join('\n');
const schemaNames = [];
const schemaRegex = /^\s{8}([A-Za-z0-9_]+):\s*\{/gm;
let match;
while ((match = schemaRegex.exec(schemasContent)) !== null) {
  schemaNames.push(match[1]);
}

console.log(`📦 ${schemaNames.length} schemas détectés`);

// Grouper les schemas par domaine
const schemasByDomain = {};

schemaNames.forEach(name => {
  // Déterminer le domaine à partir du nom du schema
  let domain = null;
  
  // Pattern 1: XxxController → xxx
  const controllerMatch = name.match(/^([A-Z][a-z]+)(?:Controller|Dto|ResponseDto|QueryDto)/);
  if (controllerMatch) {
    domain = controllerMatch[1].toLowerCase();
  }
  
  // Pattern 2: Entités principales (User, Tag, Mixtape, etc.)
  const entityNames = {
    'User': 'users',
    'Profile': 'users',
    'Invitation': 'invitations',
    'Tag': 'tags',
    'Dj': 'djs',
    'Mixtape': 'mixtapes',
    'ImageFile': 'image-files',
    'AudioFile': 'audio-files',
    'MixSession': 'mix-sessions',
    'SessionTrack': 'mix-sessions',
  };
  
  if (entityNames[name]) {
    domain = entityNames[name];
  }
  
  // Pattern 3: SignIn, SignUp, etc. → auth
  if (name.match(/^(SignIn|SignUp|Refresh|Auth|ForgotPassword|ResetPassword)/)) {
    domain = 'auth';
  }
  
  // Pattern 4: Patterns composés
  if (name.includes('User') && !entityNames[name]) domain = 'users';
  if (name.includes('Tag') && !entityNames[name]) domain = 'tags';
  if (name.includes('Dj') && !entityNames[name]) domain = 'djs';
  if (name.includes('Mixtape') && !entityNames[name]) domain = 'mixtapes';
  if (name.includes('Invitation') && !entityNames[name]) domain = 'invitations';
  if (name.includes('Image')) domain = 'image-files';
  if (name.includes('Audio')) domain = 'audio-files';
  if (name.includes('Session')) domain = 'mix-sessions';
  
  // Stream patterns
  if (name.match(/(IceCast|AirTime|Events|Listeners|Progress|Stream)/)) {
    domain = 'stream';
  }
  
  if (domain) {
    if (!schemasByDomain[domain]) {
      schemasByDomain[domain] = [];
    }
    schemasByDomain[domain].push(name);
  }
});

console.log(`🎯 Schemas groupés par domaine:`);
Object.entries(schemasByDomain).forEach(([domain, schemas]) => {
  console.log(`   ${domain}: ${schemas.length} types`);
});

// === EXTRACTION DES ROUTES (PATHS) ===
const pathsSection = lines.slice(pathsStart, webhooksLine);
const routeGroups = {};

pathsSection.forEach((line, index) => {
  const routeMatch = line.match(/^\s*"\/([^/"]+)/);
  if (routeMatch) {
    let domain = routeMatch[1];
    
    // Mapping spéciaux
    if (domain === 'files') {
      if (line.includes('/files/audio')) domain = 'audio-files';
      else if (line.includes('/files/images')) domain = 'image-files';
      else domain = 'files';
    }
    
    if (!routeGroups[domain]) {
      routeGroups[domain] = { paths: [], operations: new Set(), routes: [] };
    }
    
    // Extraire la route complète
    const fullRouteMatch = line.match(/"([^"]+)"/);
    if (fullRouteMatch) {
      routeGroups[domain].routes.push(fullRouteMatch[1]);
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

console.log(`🛣️  Routes groupées par domaine:`);
Object.keys(routeGroups).forEach(domain => {
  const { paths, operations } = routeGroups[domain];
  console.log(`   ${domain}: ${paths.length} routes, ${operations.size} operations`);
});

// === GENERATION DES ENDPOINTS ===
function generateEndpoints(domain, routes) {
  const endpointsMap = {};
  const paramPattern = /\{([^}]+)\}/g;
  
  routes.forEach(route => {
    // Déterminer la clé de l'endpoint
    let key;
    
    // Pattern spéciaux par domaine
    if (domain === 'image-files' || domain === 'audio-files') {
      if (route.includes('/upload')) {
        key = 'UPLOAD';
      } else if (route.includes('/metadata/')) {
        key = 'METADATA';
      } else if (route.includes('/thumbnail')) {
        key = 'THUMBNAIL';
      } else if (route.match(/\/images\/[^/]+\/thumb\//)) {
        key = 'THUMB';
      } else if (route.match(/\/images\/[^/]+\/[^/]+$/)) {
        key = 'PUBLIC';
      } else if (route.match(/\/files\/(images|audio)\/\{[^}]+\}$/)) {
        key = 'BY_ID';
      } else if (route === `/files/${domain.replace('-files', '')}`) {
        key = 'BASE';
      } else {
        key = 'BASE';
      }
    } else if (route === `/${domain}`) {
      key = 'BASE';
    } else {
      // Extraire la partie après /{domain}/
      const suffix = route.replace(`/${domain}/`, '').replace(`/${domain}`, '');
      
      if (!suffix) {
        key = 'BASE';
      } else if (suffix.match(/^\{[^}]+\}$/)) {
        key = 'BY_ID';
      } else if (suffix.match(/^\{[^}]+\}\//)) {
        // Route avec ID puis sous-ressource
        const subResource = suffix
          .replace(/^\{[^}]+\}\//, '') // Enlever {id}/ du début
          .replace(/\{[^}]+\}/g, '')   // Enlever les autres params
          .replace(/\//g, '_')         // Remplacer / par _
          .replace(/-/g, '_')          // Remplacer - par _
          .replace(/^_+|_+$/g, '')     // Enlever _ au début/fin
          .toUpperCase();
        key = subResource || 'DETAIL';
      } else {
        // Route simple - nettoyer et formatter
        key = suffix
          .replace(/\{[^}]+\}/g, '') // Enlever les params
          .replace(/\//g, '_')       // Remplacer / par _
          .replace(/-/g, '_')        // Remplacer - par _
          .replace(/^_+|_+$/g, '')   // Enlever _ au début/fin
          .toUpperCase();
      }
    }
    
    // Générer la fonction
    const params = [];
    let paramMatch;
    
    while ((paramMatch = paramPattern.exec(route)) !== null) {
      params.push(paramMatch[1]);
    }
    
    // Gérer les clés dupliquées en ajoutant le nombre de params
    let finalKey = key;
    if (endpointsMap[key]) {
      // Si la clé existe déjà, ajouter un suffixe basé sur le nombre de params
      if (params.length > 1) {
        finalKey = `${key}_WITH_${params[params.length - 1].toUpperCase()}`;
      } else {
        finalKey = `${key}_DETAIL`;
      }
    }
    
    if (params.length === 0) {
      endpointsMap[finalKey] = `'${route}'`;
    } else {
      const funcParams = params.map(p => `${p}: string`).join(', ');
      const templateRoute = route.replace(/\{([^}]+)\}/g, '${$1}');
      endpointsMap[finalKey] = `(${funcParams}) => \`${templateRoute}\``;
    }
  });
  
  return endpointsMap;
}

// === GENERER LES FICHIERS PAR DOMAINE ===
const allDomains = new Set([...Object.keys(routeGroups), ...Object.keys(schemasByDomain)]);

allDomains.forEach(domain => {
  const safeDomainName = domain.replace(/-([a-z])/g, (_, l) => l.toUpperCase())
    .replace(/^([a-z])/, (_, l) => l.toUpperCase());
  
  const paths = routeGroups[domain]?.paths || [];
  const operations = routeGroups[domain]?.operations || new Set();
  const routes = routeGroups[domain]?.routes || [];
  const schemas = schemasByDomain[domain] || [];
  
  let content = `// Domain: ${domain}
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types';

`;

  // === PATHS ===
  if (paths.length > 0) {
    const domainPaths = paths.map(p => p.content.join('\n')).join('\n');
    
    content += `export interface ${safeDomainName}Paths {
${domainPaths}
}

`;
  }

  // === OPERATIONS ===
  if (operations.size > 0) {
    content += `// Operations for this domain
export type ${safeDomainName}Operations = ${Array.from(operations).map(op => `"${op}"`).join(' | ')};

`;
  }

  // === TYPES (SCHEMAS) ===
  if (schemas.length > 0) {
    content += `// ===== TYPES =====

`;
    schemas.forEach(schema => {
      content += `export type ${schema} = components['schemas']['${schema}'];\n`;
    });
    content += '\n';
  }

  // === ENDPOINTS ===
  if (routes.length > 0) {
    const endpoints = generateEndpoints(domain, routes);
    const endpointConstName = `${domain.toUpperCase().replace(/-/g, '_')}_ENDPOINTS`;
    
    content += `// ===== ENDPOINTS =====

export const ${endpointConstName} = {
${Object.entries(endpoints).map(([key, value]) => `  ${key}: ${value},`).join('\n')}
} as const;\n`;
  }

  // === HELPERS GENERIQUES pour le domaine 'base' ===
  if (domain === 'base') {
    content += `
// ===== GENERIC HELPERS =====

/**
 * Generic paginated response type based on BaseResponseDto
 * This extends the base response with typed data array
 * Use this instead of specific response types when you need a generic paginated list
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: Record<string, unknown>;
}
`;
  }

  fs.writeFileSync(path.join(BASE_DIR, `${domain}.types.ts`), content);
  console.log(`✅ ${domain}.types.ts → ${paths.length} routes, ${schemas.length} types`);
});

// === GLOBALS.TYPES.TS ===
const globalsContent = `// Global API types
// Contains the complete interfaces needed for openapi-fetch

${lines.slice(pathsStart, componentsStart).join('\n')}

${lines.slice(componentsStart, operationsStart).join('\n')}

${lines.slice(operationsStart).join('\n')}
`;

fs.writeFileSync(path.join(BASE_DIR, 'globals.types.ts'), globalsContent);
console.log(`✅ globals.types.ts créé`);

// === INDEX.TS ===
const indexContent = `// Modular API Types - Enhanced auto-generation
// Generated by analyzing actual API structure patterns

// Global types (full export for compatibility)
export type { components, paths, operations } from './globals.types';

// Domain-specific exports (paths, types, endpoints)
${Array.from(allDomains).sort().map(domain => `export * from './${domain}.types';`).join('\n')}
`;

fs.writeFileSync(path.join(BASE_DIR, 'index.ts'), indexContent);
console.log(`✅ index.ts créé avec ${allDomains.size} domaines`);

// === ENDPOINTS.TS (auto-generated API endpoints only) ===
// Filtrer uniquement les domaines qui ont des routes (donc des endpoints)
const domainsWithEndpoints = Array.from(allDomains).filter(domain => {
  const routes = routeGroups[domain]?.routes || [];
  return routes.length > 0;
}).sort();

const endpointsContent = `// API Endpoints - Auto-generated from OpenAPI specification
// This file is auto-generated by scripts/generate-types-enhanced.sh
// Do not edit this file directly. Changes will be overwritten.

${domainsWithEndpoints.map(domain => {
  const constName = `${domain.toUpperCase().replace(/-/g, '_')}_ENDPOINTS`;
  return `import { ${constName} } from './${domain}.types';`;
}).join('\n')}

/**
 * Aggregated API endpoints for all domains
 * Auto-generated from OpenAPI specification
 */
export const API_ENDPOINTS = {
${domainsWithEndpoints.map(domain => {
  const key = domain.toUpperCase().replace(/-/g, '_');
  const constName = `${key}_ENDPOINTS`;
  return `  ${key}: ${constName},`;
}).join('\n')}
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
`;

fs.writeFileSync(path.join(BASE_DIR, 'endpoints.ts'), endpointsContent);
console.log(`✅ endpoints.ts créé avec API_ENDPOINTS auto-générés (${domainsWithEndpoints.length} domaines avec routes)`);

EOF

# Nettoyer le fichier temporaire
rm -f "$TEMP_API_FILE"

echo ""
echo "🎉 Génération intelligente terminée !"
echo ""
echo "✨ Cette version améliorée génère:"
echo "   ✅ Paths par domaine"
echo "   ✅ Types (schemas) par domaine"
echo "   ✅ Endpoints constants par domaine"
echo "   ✅ types/api/endpoints.ts (auto-généré)"
echo ""
echo "📦 Structure: types/api/{domain}.types.ts contient tout pour chaque domaine"
echo "🎯 Import simplifié: import { Tag, TAGS_ENDPOINTS } from '~/types/api/tags.types'"
echo ""
