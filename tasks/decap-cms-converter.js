import yaml from "js-yaml";
import fs from "fs";
import path from "path";

// Function to parse TypeScript config manually
function parseTsConfig(content) {
  const configMatch = content.match(
    /export const cmsConfig: CmsConfig = ({[\s\S]*});/
  );
  if (!configMatch) {
    throw new Error("Could not find cmsConfig export in TypeScript file");
  }
  const configString = configMatch[1];
  const configFunction = new Function(`
    return ${configString};
  `);
  return configFunction();
}

// Function to convert the TypeScript config to YAML
export function convertTsConfigToYaml(done) {
  try {
    const tsConfigPath = path.join(process.cwd(), "cms-config.ts");
    const tsContent = fs.readFileSync(tsConfigPath, "utf8");
    const config = parseTsConfig(tsContent);
    const yamlContent = yaml.dump(config, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });
    const outputPath = path.join("public", "admin", "config.yml");
    fs.writeFileSync(outputPath, yamlContent, "utf8");
    console.log(
      "✅ Successfully converted TypeScript config to YAML and updated config.yml"
    );
    done();
  } catch (error) {
    console.error("❌ Error converting config:", error);
    done(error);
  }
}
