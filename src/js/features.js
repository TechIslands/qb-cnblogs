/**
 * 博客园快速美化框架 - 扩展功能
 * 包含额外的交互功能实现
 */

(function() {
    'use strict';

    // 在全局对象上暴露API
    window.qbCnblogs = window.qbCnblogs || {};
    
    /**
     * 目录生成功能
     * 自动为博文生成目录导航
     */
    function generateToc() {
        const articleBody = document.querySelector('.post .postBody') || document.querySelector('#cnblogs_post_body');
        if (!articleBody) return;
        
        // 查找所有标题元素
        const headings = articleBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length < 3) return; // 标题太少不需要生成目录
        
        // 创建目录容器
        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-container';
        tocContainer.innerHTML = '<div class="toc-title">目录</div><div class="toc-content"></div>';
        
        const tocContent = tocContainer.querySelector('.toc-content');
        const tocItems = [];
        
        // 处理每个标题
        headings.forEach((heading, index) => {
            // 为每个标题添加ID
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
            
            const level = parseInt(heading.tagName.substr(1), 10);
            const text = heading.textContent;
            
            // 创建目录项
            const tocItem = document.createElement('div');
            tocItem.className = `toc-item toc-level-${level}`;
            tocItem.style.paddingLeft = `${(level - 1) * 15}px`;
            tocItem.innerHTML = `<a href="#${heading.id}">${text}</a>`;
            
            tocContent.appendChild(tocItem);
            tocItems.push(tocItem);
            
            // 为标题添加点击事件
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', () => {
                window.location.hash = heading.id;
            });
        });
        
        // 添加目录到文章开头
        articleBody.insertBefore(tocContainer, articleBody.firstChild);
        
        // 添加滚动高亮功能
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            
            // 找到当前可见的标题
            let currentHeadingIndex = -1;
            headings.forEach((heading, index) => {
                if (heading.offsetTop - 100 <= scrollTop) {
                    currentHeadingIndex = index;
                }
            });
            
            // 高亮当前目录项
            tocItems.forEach((item, index) => {
                if (index === currentHeadingIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    }
    
    /**
     * 图片灯箱功能
     * 点击图片时显示大图
     */
    function enableLightbox() {
        const articleContent = document.querySelector('.post .postBody') || document.querySelector('#cnblogs_post_body');
        if (!articleContent) return;
        
        const images = articleContent.querySelectorAll('img');
        if (images.length === 0) return;
        
        // 创建灯箱元素
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-container">
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-close">&times;</div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        
        // 为每个图片添加点击事件
        images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                lightboxImage.src = img.src;
                lightboxCaption.textContent = img.alt || '';
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // 关闭灯箱
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    /**
     * 代码高亮优化
     * 增强代码块样式和交互
     */
    function enhanceCodeHighlight() {
        const codeBlocks = document.querySelectorAll('pre code');
        if (codeBlocks.length === 0) return;
        
        codeBlocks.forEach(block => {
            // 在代码块上方添加语言标识
            const parentPre = block.parentNode;
            const language = block.className.match(/language-(\w+)/) || ['', ''];
            
            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `
                <span class="code-language">${language[1] || 'code'}</span>
                <span class="code-copy">复制</span>
            `;
            
            parentPre.insertBefore(header, block);
            
            // 添加复制功能
            const copyButton = header.querySelector('.code-copy');
            copyButton.addEventListener('click', () => {
                const code = block.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.textContent = '已复制';
                    setTimeout(() => {
                        copyButton.textContent = '复制';
                    }, 2000);
                });
            });
            
            // 添加行号
            const lines = block.textContent.split('\n');
            if (lines.length > 1) {
                const lineNumbers = document.createElement('div');
                lineNumbers.className = 'line-numbers';
                
                for (let i = 1; i <= lines.length; i++) {
                    const lineNumber = document.createElement('span');
                    lineNumber.className = 'line-number';
                    lineNumber.textContent = i;
                    lineNumbers.appendChild(lineNumber);
                }
                
                parentPre.classList.add('with-line-numbers');
                parentPre.insertBefore(lineNumbers, block);
            }
        });
    }
    
    /**
     * 博客统计功能
     * 显示文章字数、阅读时间等统计信息
     */
    function addPostStats() {
        const articleBody = document.querySelector('.post .postBody') || document.querySelector('#cnblogs_post_body');
        if (!articleBody) return;
        
        // 获取文章内容
        const content = articleBody.textContent;
        const wordCount = content.replace(/\s+/g, '').length;
        const readingTime = Math.ceil(wordCount / 400); // 假设阅读速度为每分钟400字
        
        // 创建统计信息容器
        const statsContainer = document.createElement('div');
        statsContainer.className = 'post-stats';
        statsContainer.innerHTML = `
            <span class="post-stats-item">
                <i class="fa fa-file-text-o"></i> 字数统计: ${wordCount} 字
            </span>
            <span class="post-stats-item">
                <i class="fa fa-clock-o"></i> 阅读时间: 约 ${readingTime} 分钟
            </span>
        `;
        
        // 获取文章头部信息
        const postHeader = document.querySelector('.postTitle') || document.querySelector('.post-title');
        if (postHeader) {
            postHeader.parentNode.insertBefore(statsContainer, postHeader.nextSibling);
        } else {
            articleBody.insertBefore(statsContainer, articleBody.firstChild);
        }
    }
    
    /**
     * 文章分享功能
     * 添加社交媒体分享按钮
     */
    function addSharingButtons() {
        const postMeta = document.querySelector('.postDesc') || document.querySelector('.post-meta');
        if (!postMeta) return;
        
        const pageTitle = encodeURIComponent(document.title);
        const pageUrl = encodeURIComponent(window.location.href);
        
        const sharingContainer = document.createElement('div');
        sharingContainer.className = 'post-sharing';
        sharingContainer.innerHTML = `
            <span class="sharing-label">分享到: </span>
            <a href="https://service.weibo.com/share/share.php?url=${pageUrl}&title=${pageTitle}" target="_blank" class="sharing-item weibo">
                <i class="fa fa-weibo"></i>
            </a>
            <a href="https://connect.qq.com/widget/shareqq/index.html?url=${pageUrl}&title=${pageTitle}" target="_blank" class="sharing-item qq">
                <i class="fa fa-qq"></i>
            </a>
            <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" class="sharing-item twitter">
                <i class="fa fa-twitter"></i>
            </a>
        `;
        
        postMeta.appendChild(sharingContainer);
    }
    
    // 暴露公共API
    window.qbCnblogs.features = {
        generateToc: generateToc,
        enableLightbox: enableLightbox,
        enhanceCodeHighlight: enhanceCodeHighlight,
        addPostStats: addPostStats,
        addSharingButtons: addSharingButtons
    };
    
    // 初始化所有功能
    function init() {
        generateToc();
        enableLightbox();
        enhanceCodeHighlight();
        addPostStats();
        addSharingButtons();
    }
    
    // 检测DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 