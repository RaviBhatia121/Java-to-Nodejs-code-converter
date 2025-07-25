require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");

// ✅ OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const JAVA_FOLDER = path.join(__dirname, "java-codebase");
const OUTPUT_FOLDER = path.join(__dirname, "output");
const METADATA_FILE = path.join(OUTPUT_FOLDER, "metadata.json");

// ✅ Recursive scan for Java files
function getJavaFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJavaFiles(filePath));
    } else if (file.endsWith(".java")) {
      results.push(filePath);
    }
  });
  return results;
}

// ✅ Categorize using path & annotations
function categorizeJavaFile(content, filePath) {
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.includes("/controller/")) return "controller";
  if (lowerPath.includes("/service/")) return "service";
  if (
    lowerPath.includes("/respositories/") ||
    lowerPath.includes("/repository/") ||
    lowerPath.includes("dao")
  )
    return "dao";

  if (content.includes("@RestController") || content.includes("@Controller"))
    return "controller";
  if (content.includes("@Service")) return "service";
  if (content.includes("@Repository") || content.includes("DAO")) return "dao";

  return "other";
}

// ✅ Prompt builders
function buildControllerPrompt(javaContent) {
  return `
You are an expert in converting Java Spring Boot controllers into Node.js Express controllers.

Requirements:
- Use Express Router.
- Validate path params (parseInt and isNaN).
- Return proper JSON error messages (400 invalid, 404 not found, 500 internal error).
- Assume a repository module (e.g., actorRepo) with matching functions.
- Add JSDoc comments.
- Export router.

Java controller:
${javaContent}
`;
}

function buildServicePrompt(javaContent) {
  return `
You are an expert in converting Java Spring services to Node.js modules.

Convert this Java service into a Node.js module with equivalent functions, using async/await and proper error handling. Add JSDoc comments.

Java service:
${javaContent}
`;
}

function buildDaoPrompt(javaContent) {
  return `
You are an expert in converting Java Spring Data repositories to Node.js data-access modules.

Convert this Java repository/DAO into a Node.js module with equivalent functions. Use async/await. Add JSDoc comments.

Java DAO:
${javaContent}
`;
}

// ✅ Analyze a single file for metadata
function analyzeJavaFile(content, filePath, type) {
  // simple class name extraction
  const classMatch = content.match(/class\s+(\w+)/);
  const className = classMatch
    ? classMatch[1]
    : path.basename(filePath, ".java");

  // extract methods (basic)
  const methodRegex = /public\s+([a-zA-Z0-9_<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)/g;
  const methods = [];
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    methods.push({
      name: match[2],
      signature: match[0],
      returnType: match[1],
      parameters: match[3] ? match[3].split(",").map((p) => p.trim()) : [],
      description: "Auto-generated description",
    });
  }

  return {
    filePath,
    category: type,
    className,
    description:
      type === "controller"
        ? "Controller class converted from Java."
        : type === "service"
          ? "Service class converted from Java."
          : type === "dao"
            ? "DAO/Repository class converted from Java."
            : "Other Java class",
    methods,
    complexityLevel:
      methods.length > 10 ? "high" : methods.length > 3 ? "medium" : "low",
    internalDependencies: [],
    annotations: [],
  };
}

// ✅ Convert with LLM
async function convertJavaFile(filePath, type) {
  const content = fs.readFileSync(filePath, "utf8");
  let prompt;

  if (type === "controller") {
    prompt = buildControllerPrompt(content);
  } else if (type === "service") {
    prompt = buildServicePrompt(content);
  } else if (type === "dao") {
    prompt = buildDaoPrompt(content);
  } else {
    console.log(`Skipping ${filePath} (type ${type})`);
    return null;
  }

  console.log(`🔄 Converting ${path.basename(filePath)} as ${type}...`);
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o", // use your accessible model
      messages: [
        {
          role: "system",
          content:
            "You are a senior backend engineer helping with code conversion.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    const convertedCode = response.data.choices[0].message.content;
    const outFile = path.join(
      OUTPUT_FOLDER,
      path.basename(filePath, ".java").toLowerCase() + ".js",
    );
    fs.writeFileSync(outFile, convertedCode, "utf8");
    console.log(`✅ Converted file written to ${outFile}`);

    return {
      originalFile: filePath,
      convertedFile: outFile,
      type,
      className: path.basename(filePath, ".java"),
    };
  } catch (err) {
    console.error(`❌ Conversion failed for ${filePath}`);
    console.error(err.response?.data || err.message);
    return null;
  }
}

// ✅ Main runner
(async () => {
  if (!fs.existsSync(OUTPUT_FOLDER)) fs.mkdirSync(OUTPUT_FOLDER);

  const files = getJavaFiles(JAVA_FOLDER);
  console.log(`Found ${files.length} Java files.`);

  const metadata = {
    analysis: {
      totalFiles: files.length,
      categorizedFiles: { controller: 0, service: 0, dao: 0, other: 0 },
      analysisDate: new Date().toISOString(),
    },
    classes: [],
    conversions: [],
    summary: {
      controllers: [],
      services: [],
      daos: [],
    },
  };

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const type = categorizeJavaFile(content, file);
    metadata.analysis.categorizedFiles[type] =
      (metadata.analysis.categorizedFiles[type] || 0) + 1;

    console.log(`➡️ Processing ${path.basename(file)} detected as ${type}`);

    const analysisEntry = analyzeJavaFile(content, file, type);
    metadata.classes.push(analysisEntry);

    const conversionResult = await convertJavaFile(file, type);
    if (conversionResult) {
      metadata.conversions.push(conversionResult);

      // summary details
      if (type === "controller") {
        metadata.summary.controllers.push({
          className: analysisEntry.className,
          methods: analysisEntry.methods.length,
        });
      } else if (type === "service") {
        metadata.summary.services.push({
          className: analysisEntry.className,
          methods: analysisEntry.methods.length,
        });
      } else if (type === "dao") {
        metadata.summary.daos.push({
          className: analysisEntry.className,
          methods: analysisEntry.methods.length,
        });
      }
    }
  }

  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2), "utf8");
  console.log(`📦 Metadata written to ${METADATA_FILE}`);
  console.log("🎉 Conversion process complete.");
})();
