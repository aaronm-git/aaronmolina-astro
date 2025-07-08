import CMS from "decap-cms-app";
import { cmsConfig } from "./cms-config.js";

// Initialize CMS with the config object
CMS.init(cmsConfig);

// Optional: Register custom preview templates
// CMS.registerPreviewTemplate("pages", PagePreview);
// CMS.registerPreviewTemplate("posts", PostPreview);

console.log("DecapCMS initialized with JavaScript configuration");
