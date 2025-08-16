/**
 * Blog functionality for loading and displaying blog posts
 * Handles post listing, search, filtering, and individual post rendering
 */

// Blog configuration
const BLOG_CONFIG = {
    postsDirectory: 'posts/',
    postsPerPage: 10,
    excerptLength: 200
};

// Store for blog data
let blogPosts = [];
let filteredPosts = [];
let currentPage = 1;

// Initialize blog functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (isBlogPage()) {
        initBlog();
    }
});

/**
 * Check if current page is a blog page
 * @returns {boolean}
 */
function isBlogPage() {
    return window.location.pathname.includes('/blog/') || 
           document.querySelector('.blog-posts') !== null;
}

/**
 * Initialize blog functionality
 */
async function initBlog() {
    try {
        showLoading();
        await loadBlogPosts();
        initSearchAndFilter();
        renderBlogPosts();
        renderSidebar();
        hideLoading();
    } catch (error) {
        console.error('Error initializing blog:', error);
        showError('Failed to load blog posts. Please try again later.');
    }
}

/**
 * Load blog posts from markdown files
 */
async function loadBlogPosts() {
    // Define available blog posts
    // In a real implementation, this could be generated automatically
    const postSlugs = [
        'welcome-to-my-blog',
        'my-coding-journey', 
        'web-development-tips'
    ];
    
    const posts = [];
    
    for (const slug of postSlugs) {
        try {
            const postData = await loadPost(slug);
            if (postData) {
                posts.push(postData);
            }
        } catch (error) {
            console.error(`Error loading post ${slug}:`, error);
        }
    }
    
    // Sort posts by date (newest first)
    blogPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredPosts = [...blogPosts];
}

/**
 * Load individual blog post
 * @param {string} slug - Post slug
 * @returns {Object|null} - Post data object
 */
async function loadPost(slug) {
    try {
        const response = await fetch(`${BLOG_CONFIG.postsDirectory}${slug}/README.md`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        const postData = parseMarkdownPost(markdown, slug);
        
        return postData;
    } catch (error) {
        console.error(`Error loading post ${slug}:`, error);
        return null;
    }
}

/**
 * Parse markdown post and extract metadata
 * @param {string} markdown - Raw markdown content
 * @param {string} slug - Post slug
 * @returns {Object} - Parsed post data
 */
function parseMarkdownPost(markdown, slug) {
    const post = {
        slug,
        title: '',
        date: '',
        category: '',
        tags: [],
        excerpt: '',
        content: '',
        readingTime: 0
    };
    
    // Extract frontmatter
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    let content = markdown;
    
    if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        content = markdown.replace(frontmatterMatch[0], '').trim();
        
        // Parse frontmatter
        const frontmatterLines = frontmatter.split('\n');
        frontmatterLines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                
                switch (key.trim()) {
                    case 'title':
                        post.title = value;
                        break;
                    case 'date':
                        post.date = value;
                        break;
                    case 'category':
                        post.category = value;
                        break;
                    case 'tags':
                        // Parse array format [tag1, tag2, tag3]
                        const tagsMatch = value.match(/\[(.*?)\]/);
                        if (tagsMatch) {
                            post.tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''));
                        }
                        break;
                    case 'excerpt':
                        post.excerpt = value;
                        break;
                }
            }
        });
    }
    
    // If no title found in frontmatter, extract from first heading
    if (!post.title) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            post.title = titleMatch[1];
        } else {
            post.title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    }
    
    // Generate excerpt if not provided
    if (!post.excerpt) {
        const textContent = content.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim();
        post.excerpt = textContent.substring(0, BLOG_CONFIG.excerptLength) + 
                      (textContent.length > BLOG_CONFIG.excerptLength ? '...' : '');
    }
    
    // Convert markdown to HTML
    post.content = parseMarkdown(content);
    
    // Calculate reading time (approximate)
    const wordCount = content.split(/\s+/).length;
    post.readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    
    return post;
}

/**
 * Initialize search and filter functionality
 */
function initSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.toLowerCase().trim();
            filterPosts(query);
        }, 300));
    }
}

/**
 * Filter posts based on search query
 * @param {string} query - Search query
 */
function filterPosts(query) {
    if (!query) {
        filteredPosts = [...blogPosts];
    } else {
        filteredPosts = blogPosts.filter(post => {
            return post.title.toLowerCase().includes(query) ||
                   post.excerpt.toLowerCase().includes(query) ||
                   post.category.toLowerCase().includes(query) ||
                   post.tags.some(tag => tag.toLowerCase().includes(query));
        });
    }
    
    currentPage = 1;
    renderBlogPosts();
}

/**
 * Render blog posts
 */
function renderBlogPosts() {
    const postsGrid = document.getElementById('posts-grid');
    if (!postsGrid) return;
    
    if (filteredPosts.length === 0) {
        postsGrid.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-search"></i>
                <h3>No posts found</h3>
                <p>Try adjusting your search terms or browse all posts.</p>
            </div>
        `;
        return;
    }
    
    const startIndex = (currentPage - 1) * BLOG_CONFIG.postsPerPage;
    const endIndex = startIndex + BLOG_CONFIG.postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    const postsHTML = postsToShow.map(post => createPostCard(post)).join('');
    postsGrid.innerHTML = postsHTML;
    
    // Add pagination if needed
    if (filteredPosts.length > BLOG_CONFIG.postsPerPage) {
        renderPagination();
    }
}

/**
 * Create HTML for a blog post card
 * @param {Object} post - Post data
 * @returns {string} - HTML string
 */
function createPostCard(post) {
    const formattedDate = formatDate(post.date);
    const tagsHTML = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
    
    return `
        <article class="post-card">
            <div class="post-meta">
                <span class="post-category">${post.category}</span>
                <span class="post-date">
                    <i class="fas fa-calendar"></i>
                    ${formattedDate}
                </span>
                <span class="post-reading-time">
                    <i class="fas fa-clock"></i>
                    ${post.readingTime} min read
                </span>
            </div>
            <h2 class="post-title">
                <a href="#" onclick="openPost('${post.slug}'); return false;">${post.title}</a>
            </h2>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">${tagsHTML}</div>
            <a href="#" onclick="openPost('${post.slug}'); return false;" class="read-more">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </article>
    `;
}

/**
 * Render blog sidebar
 */
function renderSidebar() {
    renderRecentPosts();
    renderCategories();
}

/**
 * Render recent posts in sidebar
 */
function renderRecentPosts() {
    const recentPostsContainer = document.getElementById('recent-posts');
    if (!recentPostsContainer) return;
    
    const recentPosts = blogPosts.slice(0, 5);
    const recentPostsHTML = recentPosts.map(post => `
        <div class="recent-post">
            <a href="#" onclick="openPost('${post.slug}'); return false;">
                ${post.title}
            </a>
            <small>${formatDate(post.date)}</small>
        </div>
    `).join('');
    
    recentPostsContainer.innerHTML = recentPostsHTML;
}

/**
 * Render categories in sidebar
 */
function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    if (!categoriesContainer) return;
    
    // Count posts by category
    const categoryCount = {};
    blogPosts.forEach(post => {
        const category = post.category || 'Uncategorized';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    const categoriesHTML = Object.entries(categoryCount).map(([category, count]) => `
        <a href="#" onclick="filterByCategory('${category}'); return false;" class="category-link">
            <span>${category}</span>
            <span class="category-count">${count}</span>
        </a>
    `).join('');
    
    categoriesContainer.innerHTML = categoriesHTML;
}

/**
 * Open individual blog post
 * @param {string} slug - Post slug
 */
function openPost(slug) {
    const post = blogPosts.find(p => p.slug === slug);
    if (!post) {
        showError('Post not found.');
        return;
    }
    
    // Create post modal or navigate to post page
    showPostModal(post);
}

/**
 * Show post in a modal
 * @param {Object} post - Post data
 */
function showPostModal(post) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'post-modal';
    modal.innerHTML = `
        <div class="post-modal-content">
            <div class="post-modal-header">
                <button class="post-modal-close" onclick="closePostModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="post-modal-body">
                <article class="post-content">
                    <header class="post-header">
                        <div class="post-meta">
                            <span class="post-category">${post.category}</span>
                            <span class="post-date">${formatDate(post.date)}</span>
                            <span class="post-reading-time">${post.readingTime} min read</span>
                        </div>
                        <h1 class="post-title">${post.title}</h1>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                        </div>
                    </header>
                    <div class="post-body">
                        ${post.content}
                    </div>
                </article>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        overflow-y: auto;
    `;
    
    const modalContent = modal.querySelector('.post-modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    `;
    
    const modalHeader = modal.querySelector('.post-modal-header');
    modalHeader.style.cssText = `
        position: sticky;
        top: 0;
        background: white;
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: flex-end;
        z-index: 1;
    `;
    
    const closeButton = modal.querySelector('.post-modal-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
        padding: 0.5rem;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalBody = modal.querySelector('.post-modal-body');
    modalBody.style.cssText = `
        padding: 0 2rem 2rem;
    `;
    
    // Add to document
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePostModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closePostModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

/**
 * Close post modal
 */
function closePostModal() {
    const modal = document.querySelector('.post-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

/**
 * Filter posts by category
 * @param {string} category - Category name
 */
function filterByCategory(category) {
    filteredPosts = blogPosts.filter(post => post.category === category);
    currentPage = 1;
    renderBlogPosts();
    
    // Update search input to show the filter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = `category:${category}`;
    }
}

/**
 * Format date string
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Show loading state
 */
function showLoading() {
    const postsGrid = document.getElementById('posts-grid');
    if (postsGrid) {
        postsGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading blog posts...</p>
            </div>
        `;
    }
}

/**
 * Hide loading state
 */
function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    const postsGrid = document.getElementById('posts-grid');
    if (postsGrid) {
        postsGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        `;
    }
}

// Make functions available globally for onclick handlers
window.openPost = openPost;
window.closePostModal = closePostModal;
window.filterByCategory = filterByCategory;

// Add styles for modal and other blog components
const blogStyles = document.createElement('style');
blogStyles.textContent = `
    .no-posts, .error-state {
        text-align: center;
        padding: 3rem;
        color: #6b7280;
    }
    
    .no-posts i, .error-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #d1d5db;
    }
    
    .error-state i {
        color: #ef4444;
    }
    
    .post-modal {
        animation: fadeIn 0.3s ease-out;
    }
    
    .post-modal-content {
        animation: slideInUp 0.3s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .post-content h1, .post-content h2, .post-content h3,
    .post-content h4, .post-content h5, .post-content h6 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: #1f2937;
    }
    
    .post-content p {
        margin-bottom: 1rem;
        line-height: 1.7;
    }
    
    .post-content pre {
        background-color: #f8fafc;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1rem 0;
        border: 1px solid #e2e8f0;
    }
    
    .post-content code {
        background-color: #f1f5f9;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-size: 0.875rem;
        color: #374151;
    }
    
    .post-content blockquote {
        border-left: 4px solid #3b82f6;
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
        color: #6b7280;
    }
    
    .post-content ul, .post-content ol {
        margin: 1rem 0;
        padding-left: 2rem;
    }
    
    .post-content li {
        margin-bottom: 0.5rem;
    }
    
    .post-header {
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 1rem;
        margin-bottom: 2rem;
    }
    
    .post-body img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1rem 0;
    }
`;

document.head.appendChild(blogStyles);
