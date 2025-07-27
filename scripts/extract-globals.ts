import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

// === PATTERNS DE CATEGORISATION DES TYPES ===
const ENTITY_NAMES = ['User', 'Invitation', 'Profile', 'Image', 'Dj', 'Tag', 'Mixtape']
const CRUD_DTO_PATTERN = /^(Create|Update|Add)[A-Z].*Dto$/
const AUTH_DTO_NAMES = ['SignInDto', 'SignUpDto', 'RefreshTokenDto', 'ForgotPasswordDto', 'ResetPasswordDto']
const AUTH_DTO_PATTERN = new RegExp(`^(${AUTH_DTO_NAMES.join('|')})$`)
const CRUD_DTO_EXCLUDE_AUTH_PATTERN = new RegExp(
  `^(${AUTH_DTO_NAMES.map((n) => n.replace('Dto', '')).join('|')})[A-Z].*Dto$`,
)
const LIST_RESPONSE_PATTERN = /ListResponseDto$/
const RESPONSE_PATTERN = /ResponseDto$/
const STREAMING_PATTERN = /(IceCast|AirTime|Events|Listeners|Progress)[A-Za-z0-9]*Dto$/
const STREAMING_EXTRAS = ['EventsResponseDto', 'ListenersResponseDto', 'ProgressResponseDto']

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GENERATED_PATH = path.resolve(__dirname, '../types/api-generated.d.ts')
const OUTPUT_PATH = path.resolve(__dirname, '../types/api.d.ts')

const generated = fs.readFileSync(GENERATED_PATH, 'utf-8')

const header = `// Passerelle pour exposer globalement les types générés de l'API Nina.fm
// Ce fichier importe les types du fichier généré et les rend disponibles globalement

import type { components, operations, paths } from './api-generated'

declare global {

  // ===== TYPES PRINCIPAUX DE L'API =====
  type ApiComponents = components
  type ApiSchemas = components['schemas']
  type ApiOperations = operations
  type ApiPaths = paths
`

// Extraction robuste des noms de types dans schemas: { ... }
const schemasStart = generated.indexOf('schemas: {')
if (schemasStart === -1) throw new Error('Bloc schemas: { ... } introuvable dans api-generated.d.ts')
let braceCount = 0
let i = schemasStart + 'schemas: {'.length
let end = i
for (; i < generated.length; i++) {
  if (generated[i] === '{') braceCount++
  if (generated[i] === '}') {
    if (braceCount === 0) {
      end = i
      break
    }
    braceCount--
  }
}
const schemasBlock = generated.slice(schemasStart + 'schemas: {'.length, end)
const keyRegex = /^\s*([A-Za-z0-9_]+):/gm
const typeNames = Array.from(schemasBlock.matchAll(keyRegex)).map((m) => m[1])
const uniqueTypeNames = Array.from(new Set(typeNames)).sort()

// Catégorisation par pattern de nommage
const sections = [
  {
    title: '// ===== ENTITÉS PRINCIPALES =====',
    filter: (name: string) => ENTITY_NAMES.includes(name),
    doc: {
      User: 'Utilisateur avec profil',
      Invitation: 'Invitation utilisateur',
      Profile: 'Profil utilisateur',
      Image: 'Image avec métadonnées',
      Dj: 'DJ',
      Tag: 'Tag avec couleur',
      Mixtape: 'Mixtape avec relations',
    } as Record<string, string>,
  },
  {
    title: '// ===== DTOs DE CRÉATION/MISE À JOUR =====',
    filter: (name: string) => CRUD_DTO_PATTERN.test(name) && !CRUD_DTO_EXCLUDE_AUTH_PATTERN.test(name),
    doc: {} as Record<string, string>,
  },
  {
    title: "// ===== DTOs D'AUTHENTIFICATION =====",
    filter: (name: string) => AUTH_DTO_PATTERN.test(name),
    doc: {} as Record<string, string>,
  },
  {
    title: '// ===== RÉPONSES DE LISTE =====',
    filter: (name: string) => LIST_RESPONSE_PATTERN.test(name),
    doc: {} as Record<string, string>,
  },
  {
    title: '// ===== RÉPONSES INDIVIDUELLES =====',
    filter: (name: string) => RESPONSE_PATTERN.test(name) && !LIST_RESPONSE_PATTERN.test(name),
    doc: {} as Record<string, string>,
  },
  {
    title: '// ===== TYPES DE STREAMING =====',
    filter: (name: string) => STREAMING_PATTERN.test(name) || STREAMING_EXTRAS.includes(name),
    doc: {} as Record<string, string>,
  },
]

// Génération des lignes par section
function jsdoc(name: string, doc: Record<string, string>) {
  if (doc && doc[name]) return `  /**\n   * ${doc[name]}\n   */\n`
  return ''
}

let body = ''

for (const section of sections) {
  body += `\n  ${section.title}\n\n`
  const filtered = uniqueTypeNames.filter(section.filter)
  for (const name of filtered) {
    body += jsdoc(name, section.doc)
    body += `  type ${name} = ApiSchemas['${name}']\n\n`
  }
}

const output = `${header}${body}}\n\nexport {}\n`

fs.writeFileSync(OUTPUT_PATH, output, 'utf-8')
console.log('types/api.d.ts synchronisé avec api-generated.d.ts (pattern custom)')
