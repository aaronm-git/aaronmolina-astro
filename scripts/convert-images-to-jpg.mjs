import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import sharp from 'sharp';

const projectRoot = process.cwd();

const TARGET_DIRS = [path.join(projectRoot, 'public', 'images'), path.join(projectRoot, 'src', 'images')];

const EXCLUDE_DIRS = [
  path.join(projectRoot, 'dist'),
  path.join(projectRoot, 'node_modules'),
  path.join(projectRoot, '.git'),
  path.join(projectRoot, 'src', 'favicon_io'), // keep favicons as-is
];

const TEXT_SEARCH_DIRS = [path.join(projectRoot, 'src'), path.join(projectRoot, 'public')];

const TEXT_EXTS = new Set(['.astro', '.md', '.mdx', '.js', '.mjs', '.ts', '.tsx', '.json', '.yml', '.yaml', '.css', '.txt']);

const RASTER_EXTS = new Set(['.png', '.webp', '.jpg', '.jpeg', '.avif', '.tif', '.tiff']);

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function isInsideDir(filePath, dirPath) {
  const rel = path.relative(dirPath, filePath);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function shouldExclude(filePath) {
  return EXCLUDE_DIRS.some(d => isInsideDir(filePath, d) || filePath === d);
}

function timestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function moveFilePreserveDirs(srcAbs, destAbs) {
  await ensureDir(path.dirname(destAbs));
  await fs.rename(srcAbs, destAbs);
}

async function writeJpegFromInput(inputAbs, outputAbs, { quality }) {
  await ensureDir(path.dirname(outputAbs));
  const img = sharp(inputAbs, { failOn: 'none' });
  const meta = await img.metadata();

  // Flatten transparency onto a background for JPEG.
  // If alpha is present, we default to white background.
  const pipeline = meta.hasAlpha ? img.flatten({ background: '#ffffff' }) : img;

  await pipeline.jpeg({ quality, mozjpeg: true }).toFile(outputAbs);
  return { hadAlpha: Boolean(meta.hasAlpha) };
}

async function collectTargetImages() {
  const patterns = TARGET_DIRS.map(d => toPosix(path.join(d, '**/*')));
  const entries = await fg(patterns, { onlyFiles: true, dot: false, followSymbolicLinks: false });
  return entries.filter(p => !shouldExclude(p) && RASTER_EXTS.has(path.extname(p).toLowerCase()));
}

function buildReferenceVariants(fromAbs, toAbs) {
  const relFrom = toPosix(path.relative(projectRoot, fromAbs));
  const relTo = toPosix(path.relative(projectRoot, toAbs));

  // Common forms used in this repo:
  // - /images/foo.png
  // - images/foo.png
  // - src/images/foo.png
  // - public/images/foo.png
  // - @/images/foo.png
  const publicFrom = relFrom.startsWith('public/') ? `/${relFrom.slice('public/'.length)}` : null;
  const publicTo = relTo.startsWith('public/') ? `/${relTo.slice('public/'.length)}` : null;

  const srcFrom = relFrom.startsWith('src/') ? relFrom.slice('src/'.length) : null;
  const srcTo = relTo.startsWith('src/') ? relTo.slice('src/'.length) : null;

  const variants = [];

  // Exact relative paths from root
  variants.push([relFrom, relTo]);

  // Public-served absolute paths
  if (publicFrom && publicTo) {
    variants.push([publicFrom, publicTo]);
    variants.push([publicFrom.slice(1), publicTo.slice(1)]); // without leading slash
  }

  // src-relative
  if (srcFrom && srcTo) {
    variants.push([srcFrom, srcTo]);
    variants.push([`@/${srcFrom}`, `@/${srcTo}`]);
  }

  // De-dupe
  const seen = new Set();
  return variants.filter(([a, b]) => {
    const key = `${a}=>${b}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return a !== b;
  });
}

async function collectTextFiles() {
  const patterns = TEXT_SEARCH_DIRS.map(d => toPosix(path.join(d, '**/*')));
  const entries = await fg(patterns, { onlyFiles: true, dot: false, followSymbolicLinks: false });
  return entries.filter(p => !shouldExclude(p)).filter(p => TEXT_EXTS.has(path.extname(p).toLowerCase()));
}

function applyReplacements(content, replacements) {
  let out = content;
  for (const [from, to] of replacements) {
    // Use split/join to avoid regex escaping issues and keep it literal.
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

async function main() {
  const backupDirName = `old-images-jpg-conversion-${timestamp()}`;
  const backupRoot = path.join(projectRoot, backupDirName);

  const quality = Number(process.env.JPG_QUALITY || 85);
  if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
    throw new Error(`Invalid JPG_QUALITY: ${process.env.JPG_QUALITY} (must be 1..100)`);
  }

  console.log(`Backup dir: ${backupDirName}`);
  console.log(`Quality: ${quality}`);

  const images = await collectTargetImages();
  console.log(`Found ${images.length} images to process in: ${TARGET_DIRS.map(d => path.relative(projectRoot, d)).join(', ')}`);

  const conversions = [];
  const alphaInputs = [];

  for (const inputAbs of images) {
    const ext = path.extname(inputAbs).toLowerCase();
    const dir = path.dirname(inputAbs);
    const base = path.basename(inputAbs, ext);
    const desiredOutAbs = path.join(dir, `${base}.jpg`);

    // If it's already .jpg and not .jpeg, we can leave it.
    if (ext === '.jpg') continue;

    let outAbs = desiredOutAbs;
    if (await fileExists(outAbs)) {
      // Collision: keep both by suffixing with original extension.
      outAbs = path.join(dir, `${base}-from${ext.replace('.', '-')}.jpg`);
    }

    // Move original into backup root before writing output
    const relFrom = path.relative(projectRoot, inputAbs);
    const backupAbs = path.join(backupRoot, relFrom);
    await moveFilePreserveDirs(inputAbs, backupAbs);

    const { hadAlpha } = await writeJpegFromInput(backupAbs, outAbs, { quality });
    if (hadAlpha) alphaInputs.push(toPosix(relFrom));

    conversions.push({ fromAbs: inputAbs, toAbs: outAbs });
    console.log(`Converted: ${toPosix(path.relative(projectRoot, inputAbs))} -> ${toPosix(path.relative(projectRoot, outAbs))}`);
  }

  // Build replacement list (longest-first to avoid partial replacements)
  const replacements = [];
  for (const { fromAbs, toAbs } of conversions) {
    replacements.push(...buildReferenceVariants(fromAbs, toAbs));
  }
  replacements.sort((a, b) => b[0].length - a[0].length);

  const textFiles = await collectTextFiles();
  let updatedFiles = 0;

  for (const fileAbs of textFiles) {
    const before = await fs.readFile(fileAbs, 'utf8');
    const after = applyReplacements(before, replacements);
    if (after !== before) {
      await fs.writeFile(fileAbs, after, 'utf8');
      updatedFiles++;
    }
  }

  console.log(`Updated references in ${updatedFiles} text files.`);
  if (alphaInputs.length) {
    console.log(`NOTE: ${alphaInputs.length} inputs had transparency and were flattened onto white for JPG:`);
    for (const p of alphaInputs) console.log(` - ${p}`);
  }

  console.log('Done.');
  console.log(`If everything looks good, you can delete the backup folder: ${backupDirName}`);
}

await main();
