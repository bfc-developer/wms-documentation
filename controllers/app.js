const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

// Configure marked for better security and features
marked.setOptions({
  breaks: true,
  gfm: true
});

// Utility function to build file tree
const DOCS_DIR = path.join(__dirname, '../frontend', 'docs');

async function buildFileTree(dirPath, relativePath = '') {
  const items = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      // Ensure relative path uses forward slashes for URL matching
      const relPath = path.join(relativePath, entry.name).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        const children = await buildFileTree(fullPath, relPath);
        items.push({
          name: entry.name,
          type: 'directory',
          path: relPath,
          children: children
        });
      } else if (entry.name.endsWith('.md')) {
        items.push({
          name: entry.name,
          type: 'file',
          path: relPath
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return items.sort((a, b) => {
    // Directories first, then files, both alphabetically
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

const getFileTree = async (req, res) => {
  try {
    const tree = await buildFileTree(DOCS_DIR);
    res.json(tree);
  } catch (error) {
    console.error('Error building file tree:', error);
    res.status(500).json({ error: 'Failed to load document tree' });
  }
}

const getDocument = async (req, res) => {
  try {
    const docPath = req.params[0];
    const fullPath = path.join(DOCS_DIR, docPath);

    // Security check: ensure the path is within docs directory
    const resolvedPath = path.resolve(fullPath);
    const resolvedDocsDir = path.resolve(DOCS_DIR);

    if (!resolvedPath.startsWith(resolvedDocsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists and is a markdown file
    if (!docPath.endsWith('.md')) {
      return res.status(400).json({ error: 'Only markdown files are supported' });
    }

    const content = await fs.readFile(fullPath, 'utf8');
    const htmlContent = marked(content);

    res.json({
      path: docPath,
      content: content,
      html: htmlContent,
      lastModified: (await fs.stat(fullPath)).mtime
    });
  } catch (error) {
    console.log(error);
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Document not found' });
    } else {
      console.error('Error reading document:', error);
      res.status(500).json({ error: 'Failed to read document' });
    }
  }
}

const healthCheck = (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
}

const home = async (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'public', 'index.html'));
}

const getFile = async (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'public', 'index.html'));
}

module.exports = {
  getFileTree,
  getDocument,
  healthCheck,
  home,
  getFile
}