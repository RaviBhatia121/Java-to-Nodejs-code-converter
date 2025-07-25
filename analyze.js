
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const JAVA_CODEBASE_PATH = './java-codebase';
const OUTPUT_PATH = './output';
const METADATA_FILE = path.join(OUTPUT_PATH, 'metadata.json');

// File categorization patterns
const FILE_PATTERNS = {
  controller: /controller/i,
  service: /service/i,
  dao: /(dao|repository)/i,
  entity: /(entity|model|pojo)/i,
  config: /config/i,
  util: /(util|helper)/i
};

// Logging utility
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level}: ${message}`);
}

// Error handling wrapper
async function withErrorHandling(fn, context) {
  try {
    return await fn();
  } catch (error) {
    log(`Error in ${context}: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Recursively find all Java files
async function findJavaFiles(dir) {
  const files = [];
  
  async function traverse(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await traverse(fullPath);
        } else if (entry.name.endsWith('.java')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      log(`Error reading directory ${currentDir}: ${error.message}`, 'WARN');
    }
  }
  
  await traverse(dir);
  return files;
}

// Categorize file based on path and content
function categorizeFile(filePath, content) {
  const fileName = path.basename(filePath).toLowerCase();
  const pathLower = filePath.toLowerCase();
  
  for (const [category, pattern] of Object.entries(FILE_PATTERNS)) {
    if (pattern.test(pathLower) || pattern.test(fileName)) {
      return category;
    }
  }
  
  // Check content for annotations
  if (content.includes('@Controller') || content.includes('@RestController')) {
    return 'controller';
  }
  if (content.includes('@Service')) {
    return 'service';
  }
  if (content.includes('@Repository') || content.includes('@Entity')) {
    return content.includes('@Entity') ? 'entity' : 'dao';
  }
  
  return 'other';
}

// Extract class information using OpenAI
async function analyzeJavaClass(filePath, content) {
  const prompt = `
Analyze this Java class and extract the following information in JSON format:

\`\`\`java
${content}
\`\`\`

Please provide:
{
  "className": "string",
  "description": "string - brief description of what this class does",
  "methods": [
    {
      "name": "string",
      "signature": "string - full method signature",
      "description": "string - what this method does",
      "returnType": "string",
      "parameters": ["string array of parameter types"]
    }
  ],
  "complexityLevel": "string - low/medium/high based on logic complexity",
  "internalDependencies": ["array of other classes this depends on"],
  "annotations": ["array of Spring/Java annotations used"],
  "category": "string - controller/service/dao/entity/other"
}

Focus on Spring Boot patterns, REST endpoints, database operations, and business logic.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a Java code analyzer. Analyze the provided Java class and return structured JSON data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
    });

    const result = JSON.parse(response.choices[0].message.content);
    log(`Analyzed class: ${result.className}`);
    return result;
  } catch (error) {
    log(`Error analyzing ${filePath}: ${error.message}`, 'ERROR');
    return {
      className: path.basename(filePath, '.java'),
      description: "Analysis failed",
      methods: [],
      complexityLevel: "unknown",
      internalDependencies: [],
      annotations: [],
      category: "other"
    };
  }
}

// Convert Java class to Node.js Express
async function convertToNodeJS(javaContent, classInfo, category) {
  const conversionPrompts = {
    controller: `
Convert this Java Spring Boot Controller to a Node.js Express.js controller.

Java code:
\`\`\`java
${javaContent}
\`\`\`

Class info: ${JSON.stringify(classInfo, null, 2)}

Requirements:
- Use Express.js router patterns
- Convert @RequestMapping/@GetMapping/@PostMapping to Express routes
- Handle request/response objects properly
- Include proper error handling and validation
- Add JSDoc comments for all functions
- Use async/await for database operations
- Follow RESTful conventions
- Include proper HTTP status codes

Return complete, production-ready Node.js code.
`,
    service: `
Convert this Java Spring Boot Service class to a Node.js service module.

Java code:
\`\`\`java
${javaContent}
\`\`\`

Class info: ${JSON.stringify(classInfo, null, 2)}

Requirements:
- Create a service module with exported functions
- Convert business logic to async/await patterns
- Include proper error handling and logging
- Add JSDoc comments
- Handle data validation
- Use modern JavaScript patterns
- Include proper module exports

Return complete, production-ready Node.js code.
`,
    dao: `
Convert this Java Spring Boot Repository/DAO to a Node.js data access module.

Java code:
\`\`\`java
${javaContent}
\`\`\`

Class info: ${JSON.stringify(classInfo, null, 2)}

Requirements:
- Create database access functions using a connection library
- Convert JPA methods to SQL queries or ORM calls
- Include proper error handling
- Add JSDoc comments
- Use async/await patterns
- Include connection management
- Add query validation

Return complete, production-ready Node.js code.
`
  };

  const prompt = conversionPrompts[category] || conversionPrompts.service;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in converting Java Spring Boot applications to Node.js Express applications. Provide complete, working code with proper error handling and documentation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
    });

    return response.choices[0].message.content;
  } catch (error) {
    log(`Error converting ${classInfo.className}: ${error.message}`, 'ERROR');
    return `// Conversion failed for ${classInfo.className}\n// Error: ${error.message}`;
  }
}

// Main analysis function
async function analyzeCodebase() {
  log('Starting codebase analysis...');
  
  // Ensure output directory exists
  await fs.mkdir(OUTPUT_PATH, { recursive: true });
  
  // Find all Java files
  const javaFiles = await withErrorHandling(
    () => findJavaFiles(JAVA_CODEBASE_PATH),
    'finding Java files'
  );
  
  log(`Found ${javaFiles.length} Java files`);
  
  const analysisResults = [];
  const categorizedFiles = {
    controller: [],
    service: [],
    dao: [],
    entity: [],
    other: []
  };
  
  // Analyze each Java file
  for (const filePath of javaFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const category = categorizeFile(filePath, content);
      const classInfo = await analyzeJavaClass(filePath, content);
      
      const result = {
        filePath,
        category,
        content,
        ...classInfo
      };
      
      analysisResults.push(result);
      categorizedFiles[category].push(result);
      
      log(`Categorized ${path.basename(filePath)} as ${category}`);
    } catch (error) {
      log(`Error processing ${filePath}: ${error.message}`, 'ERROR');
    }
  }
  
  // Convert representative files
  const conversions = [];
  const toConvert = [
    { type: 'controller', file: categorizedFiles.controller[0] },
    { type: 'service', file: categorizedFiles.service[0] },
    { type: 'dao', file: categorizedFiles.dao[0] }
  ];
  
  for (const { type, file } of toConvert) {
    if (file) {
      log(`Converting ${type}: ${file.className}`);
      const convertedCode = await convertToNodeJS(file.content, file, type);
      
      const outputFileName = `${file.className.toLowerCase()}.js`;
      const outputPath = path.join(OUTPUT_PATH, outputFileName);
      
      await fs.writeFile(outputPath, convertedCode);
      
      conversions.push({
        originalFile: file.filePath,
        convertedFile: outputPath,
        type,
        className: file.className
      });
      
      log(`Saved converted ${type} to ${outputFileName}`);
    } else {
      log(`No ${type} files found for conversion`, 'WARN');
    }
  }
  
  // Generate metadata
  const metadata = {
    analysis: {
      totalFiles: javaFiles.length,
      categorizedFiles: Object.keys(categorizedFiles).reduce((acc, key) => {
        acc[key] = categorizedFiles[key].length;
        return acc;
      }, {}),
      analysisDate: new Date().toISOString()
    },
    classes: analysisResults.map(({ content, ...rest }) => rest), // Exclude content for size
    conversions,
    summary: {
      controllers: categorizedFiles.controller.map(f => ({ className: f.className, methods: f.methods?.length || 0 })),
      services: categorizedFiles.service.map(f => ({ className: f.className, methods: f.methods?.length || 0 })),
      daos: categorizedFiles.dao.map(f => ({ className: f.className, methods: f.methods?.length || 0 }))
    }
  };
  
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
  log(`Saved metadata to ${METADATA_FILE}`);
  
  return metadata;
}

// Run the analysis
async function main() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    const results = await analyzeCodebase();
    
    log('Analysis completed successfully!');
    log(`Total files analyzed: ${results.analysis.totalFiles}`);
    log(`Controllers: ${results.analysis.categorizedFiles.controller}`);
    log(`Services: ${results.analysis.categorizedFiles.service}`);
    log(`DAOs: ${results.analysis.categorizedFiles.dao}`);
    log(`Conversions completed: ${results.conversions.length}`);
    
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  analyzeCodebase,
  findJavaFiles,
  categorizeFile,
  analyzeJavaClass,
  convertToNodeJS
};

// Run if called directly
if (require.main === module) {
  main();
}
