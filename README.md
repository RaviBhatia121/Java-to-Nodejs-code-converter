
# Java to Node.js Converter

This project analyzes Java Spring Boot codebases and converts them to Node.js Express applications using OpenAI GPT-4.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your OpenAI API key in `.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

## Usage

Run the analyzer on the Java codebase:
```bash
node analyze.js
```

## What it does

1. **Scans** all Java files in `java-codebase/` recursively
2. **Categorizes** files as Controller, Service, DAO, Entity, or Other
3. **Analyzes** each file using GPT-4 to extract:
   - Class name and description
   - Methods and signatures
   - Complexity level
   - Internal dependencies
   - Spring annotations

4. **Converts** representative files (1 Controller, 1 Service, 1 DAO) to Node.js Express
5. **Saves** results in `output/` folder:
   - Converted `.js` files
   - `metadata.json` with analysis summary

## Output Structure

```
output/
├── actorcontroller.js      # Converted controller
├── someservice.js          # Converted service  
├── somedao.js             # Converted DAO
└── metadata.json          # Complete analysis metadata
```

## Features

- ✅ Recursive Java file scanning
- ✅ Intelligent file categorization
- ✅ GPT-4 powered code analysis
- ✅ Java to Node.js conversion
- ✅ Comprehensive error handling
- ✅ Detailed logging
- ✅ Configurable via environment variables

## Current Codebase

The analyzer will process the **Sakila Project** - a Spring Boot film rental application with:
- Film and actor browsing
- Customer management
- Owner admin functionality
- MySQL database integration

## Original Java Project

Based on the Sakila database schema, this Spring Boot application provides:
- **Controllers**: Handle REST endpoints for films, actors, customers
- **Services**: Business logic for rental operations
- **DAOs/Repositories**: Database access layer
- **Entities**: Film, Actor, Customer, etc.

The converted Node.js version will maintain the same functionality using Express.js patterns.
