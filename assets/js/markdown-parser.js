/**
 * Simple Markdown Parser
 * Converts markdown text to HTML
 * Supports common markdown syntax including headings, lists, links, code blocks, etc.
 */

/**
 * Parse markdown text to HTML
 * @param {string} markdown - Raw markdown text
 * @returns {string} - HTML string
 */
function parseMarkdown(markdown) {
    if (!markdown || typeof markdown !== 'string') {
        return '';
    }
    
    let html = markdown;
    
    // Process in order of precedence to avoid conflicts
    html = parseCodeBlocks(html);
    html = parseInlineCode(html);
    html = parseHeaders(html);
    html = parseBlockquotes(html);
    html = parseLists(html);
    html = parseLinks(html);
    html = parseImages(html);
    html = parseEmphasis(html);
    html = parseLineBreaks(html);
    html = parseParagraphs(html);
    
    return html.trim();
}

/**
 * Parse code blocks (```code```)
 * @param {string} text - Text to parse
 * @returns {string} - Text with code blocks converted to HTML
 */
function parseCodeBlocks(text) {
    // Multi-line code blocks with language specification
    text = text.replace(/```(\w+)?\n([\s\S]*?)\n```/g, function(match, language, code) {
        const lang = language ? ` class="language-${language}"` : '';
        const escapedCode = escapeHtml(code.trim());
        return `<pre><code${lang}>${escapedCode}</code></pre>`;
    });
    
    // Multi-line code blocks without language
    text = text.replace(/```\n([\s\S]*?)\n```/g, function(match, code) {
        const escapedCode = escapeHtml(code.trim());
        return `<pre><code>${escapedCode}</code></pre>`;
    });
    
    return text;
}

/**
 * Parse inline code (`code`)
 * @param {string} text - Text to parse
 * @returns {string} - Text with inline code converted to HTML
 */
function parseInlineCode(text) {
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
}

/**
 * Parse headers (# ## ### etc.)
 * @param {string} text - Text to parse
 * @returns {string} - Text with headers converted to HTML
 */
function parseHeaders(text) {
    return text.replace(/^(#{1,6})\s+(.+)$/gm, function(match, hashes, content) {
        const level = hashes.length;
        const id = generateHeaderId(content);
        return `<h${level} id="${id}">${content.trim()}</h${level}>`;
    });
}

/**
 * Generate ID for header
 * @param {string} text - Header text
 * @returns {string} - Generated ID
 */
function generateHeaderId(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
}

/**
 * Parse blockquotes (> text)
 * @param {string} text - Text to parse
 * @returns {string} - Text with blockquotes converted to HTML
 */
function parseBlockquotes(text) {
    return text.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
}

/**
 * Parse lists (- item or 1. item)
 * @param {string} text - Text to parse
 * @returns {string} - Text with lists converted to HTML
 */
function parseLists(text) {
    // Unordered lists
    text = text.replace(/^(\s*)-\s+(.+)$/gm, function(match, indent, content) {
        const level = indent.length / 2; // Assuming 2 spaces per level
        return `<li data-level="${level}">${content}</li>`;
    });
    
    // Ordered lists
    text = text.replace(/^(\s*)\d+\.\s+(.+)$/gm, function(match, indent, content) {
        const level = indent.length / 2;
        return `<li data-level="${level}" data-ordered="true">${content}</li>`;
    });
    
    // Wrap consecutive list items in ul/ol tags
    text = wrapListItems(text);
    
    return text;
}

/**
 * Wrap list items in appropriate ul/ol tags
 * @param {string} text - Text containing list items
 * @returns {string} - Text with wrapped lists
 */
function wrapListItems(text) {
    const lines = text.split('\n');
    const result = [];
    let inList = false;
    let listStack = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const listMatch = line.match(/<li data-level="(\d+)"(?: data-ordered="true")?>(.*)<\/li>/);
        
        if (listMatch) {
            const level = parseInt(listMatch[1]);
            const isOrdered = line.includes('data-ordered="true"');
            const content = listMatch[2];
            
            if (!inList) {
                // Start new list
                inList = true;
                listStack = [{ level, isOrdered }];
                result.push(isOrdered ? '<ol>' : '<ul>');
                result.push(`<li>${content}</li>`);
            } else {
                const currentList = listStack[listStack.length - 1];
                
                if (level === currentList.level && isOrdered === currentList.isOrdered) {
                    // Same level, same type
                    result.push(`<li>${content}</li>`);
                } else if (level > currentList.level) {
                    // Nested list
                    listStack.push({ level, isOrdered });
                    result.push(isOrdered ? '<ol>' : '<ul>');
                    result.push(`<li>${content}</li>`);
                } else {
                    // Close nested lists
                    while (listStack.length > 0 && listStack[listStack.length - 1].level >= level) {
                        const closingList = listStack.pop();
                        result.push(closingList.isOrdered ? '</ol>' : '</ul>');
                    }
                    
                    if (listStack.length === 0) {
                        // Start new list
                        listStack = [{ level, isOrdered }];
                        result.push(isOrdered ? '<ol>' : '<ul>');
                    }
                    result.push(`<li>${content}</li>`);
                }
            }
        } else {
            if (inList) {
                // Close all open lists
                while (listStack.length > 0) {
                    const closingList = listStack.pop();
                    result.push(closingList.isOrdered ? '</ol>' : '</ul>');
                }
                inList = false;
            }
            result.push(line);
        }
    }
    
    // Close any remaining open lists
    while (listStack.length > 0) {
        const closingList = listStack.pop();
        result.push(closingList.isOrdered ? '</ol>' : '</ul>');
    }
    
    return result.join('\n');
}

/**
 * Parse links ([text](url) or [text](url "title"))
 * @param {string} text - Text to parse
 * @returns {string} - Text with links converted to HTML
 */
function parseLinks(text) {
    // Links with title
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\s+"([^"]+)"\)/g, 
        '<a href="$2" title="$3">$1</a>');
    
    // Links without title
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Auto-links for URLs
    text = text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
    
    return text;
}

/**
 * Parse images (![alt](src) or ![alt](src "title"))
 * @param {string} text - Text to parse
 * @returns {string} - Text with images converted to HTML
 */
function parseImages(text) {
    // Images with title
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\s+"([^"]+)"\)/g, 
        '<img src="$2" alt="$1" title="$3">');
    
    // Images without title
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    return text;
}

/**
 * Parse emphasis (**bold**, *italic*, ~~strikethrough~~)
 * @param {string} text - Text to parse
 * @returns {string} - Text with emphasis converted to HTML
 */
function parseEmphasis(text) {
    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Strikethrough
    text = text.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    
    return text;
}

/**
 * Parse line breaks
 * @param {string} text - Text to parse
 * @returns {string} - Text with line breaks converted to HTML
 */
function parseLineBreaks(text) {
    // Two spaces at end of line = line break
    text = text.replace(/  \n/g, '<br>\n');
    
    // Two or more newlines = paragraph break
    text = text.replace(/\n{2,}/g, '\n\n');
    
    return text;
}

/**
 * Parse paragraphs
 * @param {string} text - Text to parse
 * @returns {string} - Text with paragraphs wrapped in <p> tags
 */
function parseParagraphs(text) {
    const lines = text.split('\n\n');
    const paragraphs = [];
    
    for (let line of lines) {
        line = line.trim();
        if (line) {
            // Don't wrap if it's already a block element
            if (isBlockElement(line)) {
                paragraphs.push(line);
            } else {
                paragraphs.push(`<p>${line}</p>`);
            }
        }
    }
    
    return paragraphs.join('\n\n');
}

/**
 * Check if text starts with a block element
 * @param {string} text - Text to check
 * @returns {boolean} - Whether text starts with block element
 */
function isBlockElement(text) {
    const blockTags = [
        '<h1', '<h2', '<h3', '<h4', '<h5', '<h6',
        '<p>', '<div', '<blockquote', '<pre', '<ul', '<ol', '<li',
        '<table', '<form', '<fieldset', '<address'
    ];
    
    return blockTags.some(tag => text.startsWith(tag));
}

/**
 * Escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    
    return text.replace(/[&<>"']/g, function(match) {
        return htmlEscapes[match];
    });
}

/**
 * Parse tables (| col1 | col2 |)
 * @param {string} text - Text to parse
 * @returns {string} - Text with tables converted to HTML
 */
function parseTables(text) {
    const lines = text.split('\n');
    const result = [];
    let inTable = false;
    let tableRows = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('|') && line.endsWith('|')) {
            // This is a table row
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            
            // Parse the row
            const cells = line.slice(1, -1).split('|').map(cell => cell.trim());
            tableRows.push(cells);
            
            // Check if next line is a separator (|---|---|)
            if (i + 1 < lines.length && lines[i + 1].trim().match(/^\|[\s\-\|]*\|$/)) {
                // Skip separator line
                i++;
            }
        } else {
            if (inTable) {
                // End of table, process it
                result.push(createTable(tableRows));
                inTable = false;
                tableRows = [];
            }
            result.push(line);
        }
    }
    
    // Handle table at end of text
    if (inTable) {
        result.push(createTable(tableRows));
    }
    
    return result.join('\n');
}

/**
 * Create HTML table from rows
 * @param {Array} rows - Array of row arrays
 * @returns {string} - HTML table
 */
function createTable(rows) {
    if (rows.length === 0) return '';
    
    let html = '<table>\n';
    
    // First row is header
    html += '<thead>\n<tr>\n';
    rows[0].forEach(cell => {
        html += `<th>${cell}</th>\n`;
    });
    html += '</tr>\n</thead>\n';
    
    // Remaining rows are body
    if (rows.length > 1) {
        html += '<tbody>\n';
        for (let i = 1; i < rows.length; i++) {
            html += '<tr>\n';
            rows[i].forEach(cell => {
                html += `<td>${cell}</td>\n`;
            });
            html += '</tr>\n';
        }
        html += '</tbody>\n';
    }
    
    html += '</table>';
    return html;
}

/**
 * Parse horizontal rules (--- or ***)
 * @param {string} text - Text to parse
 * @returns {string} - Text with horizontal rules converted to HTML
 */
function parseHorizontalRules(text) {
    text = text.replace(/^---+$/gm, '<hr>');
    text = text.replace(/^\*\*\*+$/gm, '<hr>');
    return text;
}

// Export the main parsing function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseMarkdown };
}
