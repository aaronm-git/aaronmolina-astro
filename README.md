# Astro + DecapCMS with JavaScript Configuration

This project integrates DecapCMS with Astro using a JavaScript configuration object instead of YAML files.

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   pnpm dev
   ```

3. **Access the CMS**:
   - Visit `http://localhost:4321/admin` to access the DecapCMS interface
   - The CMS is configured with JavaScript instead of YAML

## 📁 Project Structure

```
/
├── public/
│   └── images/              # Media uploads from CMS
├── src/
│   ├── content/
│   │   ├── pages/          # CMS-managed pages
│   │   └── posts/          # CMS-managed blog posts
│   ├── layouts/
│   │   └── main-layout.astro
│   ├── pages/
│   │   ├── index.astro     # Home page
│   │   ├── about.astro     # Example of using CMS content
│   │   └── admin.astro     # CMS admin interface
│   ├── scripts/
│   │   ├── cms.js          # DecapCMS initialization (browser-compatible)
│   │   └── cms-config.ts   # TypeScript configuration options
│   └── styles/
│       └── global.css
└── package.json
```

## 🎯 DecapCMS Configuration

The CMS is configured in `src/scripts/cms-config.ts` using TypeScript types, and initialized in `src/scripts/cms.js` for browser compatibility:

```javascript
const config = {
  backend: {
    name: 'git-gateway',
    branch: 'main'
  },
  media_folder: 'public/images',
  public_folder: '/images',
  collections: [
    // Pages collection
    {
      name: 'pages',
      label: 'Pages',
      folder: 'src/content/pages',
      // ... field configuration
    },
    // Blog posts collection
    {
      name: 'posts',
      label: 'Blog Posts',
      folder: 'src/content/posts',
      // ... field configuration
    }
  ]
};
```

## 📝 Content Management

### Collections Available:
- **Pages**: Static pages for your site
- **Blog Posts**: Blog posts with dates and tags

### Using CMS Content in Astro:
```astro
---
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';

const filePath = join(process.cwd(), 'src/content/pages/about.md');
const fileContent = await readFile(filePath, 'utf-8');
const [, frontmatter, content] = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const data = parse(frontmatter);
---

<h1>{data.title}</h1>
<div set:html={content} />
```

## 🔧 Key Features

- ✅ **No YAML Configuration**: Uses JavaScript objects for configuration
- ✅ **Git-based**: All content stored in your repository
- ✅ **Rich Editor**: Markdown editing with live preview
- ✅ **Media Management**: Upload and manage images
- ✅ **Astro Integration**: Seamless integration with Astro's build process
- ✅ **Tailwind CSS**: Styled with Tailwind CSS for beautiful UI

## 🌐 Deployment

To deploy your site with DecapCMS:

1. **Set up Git Gateway** (for Netlify):
   - Enable Git Gateway in your Netlify site settings
   - Configure authentication providers

2. **Build for production**:
   ```bash
   pnpm build
   ```

3. **Deploy**:
   - The `dist/` folder contains your built site
   - Make sure `/admin` route is accessible in production

## 📚 Usage Examples

### Creating a New Page
1. Go to `/admin`
2. Navigate to "Pages" collection
3. Click "New Page"
4. Fill in the title, description, and content
5. Save and publish

### Creating a Blog Post
1. Go to `/admin`
2. Navigate to "Blog Posts" collection
3. Click "New Blog Post"
4. Fill in all fields including date and tags
5. Save and publish

## 🛠️ Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm cms:dev` | Start local CMS backend server |

## 🔧 Troubleshooting

### "Buffer is not defined" Error

If you encounter a "Buffer is not defined" error when trying to save content in DecapCMS:

1. **Make sure you're using the latest version** of the polyfills in `src/pages/admin.astro`
2. **Start the local backend server** (if using local development):
   ```bash
   pnpm cms:dev
   ```
3. **Clear your browser cache** and refresh the admin page
4. **Check the browser console** for any additional error messages

### CMS Not Loading

If the CMS interface doesn't load:

1. **Verify the admin route** is accessible at `http://localhost:4321/admin`
2. **Check that all polyfills are loaded** in the browser console
3. **Ensure the CMS configuration** in `src/scripts/cms-config.ts` is correct
4. **Try running the local backend** with `pnpm cms:dev`

### Content Not Saving

If content isn't saving properly:

1. **Check your Git configuration** - make sure you have proper Git credentials set up
2. **Verify the backend branch** in `cms-config.ts` matches your repository's default branch
3. **Ensure you have write permissions** to the repository
4. **Check the network tab** in browser dev tools for any failed requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

```sh
pnpm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
