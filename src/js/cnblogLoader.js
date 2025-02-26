/**
 * 博客园快速美化框架
 * 通过简单配置即可实现博客风格的现代化改造
 */

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        themeStyle: 'nabo',
        darkMode: false,
        sidebarPosition: 'right',
        infiniteScroll: true,
        staticSrc: '',
        extCss: [],
        extJs: []
    };

    // 合并用户配置
    const config = Object.assign({}, defaultConfig, window.__BLOG_CONFIG__ || {});

    // 初始化方法
    function init() {
        // 加载主题样式
        loadThemeStyles();
        
        // 加载自定义脚本
        loadCustomScripts();
        
        // 应用主题设置
        applyThemeSettings();
        
        // 初始化功能
        initFeatures();
        
        console.log('博客园快速美化框架已加载!');
    }

    // 加载主题样式
    function loadThemeStyles() {
        // 加载基础样式
        loadCSS('css/base.css');
        
        // 加载主题样式
        loadCSS(`css/themes/${config.themeStyle}.css`);
        
        // 加载暗黑模式样式（如果启用）
        if (config.darkMode) {
            loadCSS('css/dark-mode.css');
            document.body.classList.add('dark-mode');
        }
        
        // 加载用户自定义样式
        if (Array.isArray(config.extCss)) {
            config.extCss.forEach(css => loadCSS(css, true));
        }
    }

    // 加载自定义脚本
    function loadCustomScripts() {
        // 加载功能脚本
        loadJS('js/features.js');
        
        // 加载用户自定义脚本
        if (Array.isArray(config.extJs)) {
            config.extJs.forEach(js => loadJS(js, true));
        }
    }

    // 应用主题设置
    function applyThemeSettings() {
        // 设置侧边栏位置
        document.body.classList.add(`sidebar-${config.sidebarPosition}`);
        
        // 设置主题样式类
        document.body.classList.add(`theme-${config.themeStyle}`);
    }

    // 初始化功能
    function initFeatures() {
        // 添加明暗模式切换按钮
        addDarkModeToggle();
        
        // 初始化无限滚动（如果启用）
        if (config.infiniteScroll) {
            initInfiniteScroll();
        }
        
        // 优化代码块显示
        enhanceCodeBlocks();
        
        // 添加回到顶部按钮
        addBackToTopButton();
    }

    // 加载CSS文件
    function loadCSS(path, isFullPath = false) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = isFullPath ? path : config.staticSrc + path;
        document.head.appendChild(link);
    }

    // 加载JavaScript文件
    function loadJS(path, isFullPath = false) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = isFullPath ? path : config.staticSrc + path;
        document.body.appendChild(script);
    }

    // 添加明暗模式切换按钮
    function addDarkModeToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'dark-mode-toggle';
        toggle.innerHTML = '<i class="fa fa-moon-o"></i>';
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // 保存用户偏好
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        document.body.appendChild(toggle);
    }

    // 初始化无限滚动
    function initInfiniteScroll() {
        // 实现博客列表无限滚动加载逻辑
        if (document.getElementById('mainContent')) {
            window.addEventListener('scroll', function() {
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const clientHeight = document.documentElement.clientHeight;
                
                // 当滚动到页面底部时加载更多内容
                if (scrollTop + clientHeight >= scrollHeight - 100) {
                    loadMorePosts();
                }
            });
        }
    }

    // 加载更多文章
    function loadMorePosts() {
        // 博客园分页加载实现
        // 此处简化，实际需根据博客园API或页面结构实现
        console.log('加载更多文章...');
    }

    // 增强代码块显示
    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        if (codeBlocks.length > 0) {
            // 为代码块添加复制按钮和语法高亮
            codeBlocks.forEach(block => {
                const container = document.createElement('div');
                container.className = 'code-block-container';
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-code-btn';
                copyBtn.innerHTML = '复制';
                copyBtn.addEventListener('click', () => {
                    const code = block.textContent;
                    navigator.clipboard.writeText(code).then(() => {
                        copyBtn.innerHTML = '已复制!';
                        setTimeout(() => {
                            copyBtn.innerHTML = '复制';
                        }, 2000);
                    });
                });
                
                block.parentNode.insertBefore(container, block);
                container.appendChild(block);
                container.appendChild(copyBtn);
            });
        }
    }

    // 添加回到顶部按钮
    function addBackToTopButton() {
        const btn = document.createElement('div');
        btn.className = 'back-to-top';
        btn.innerHTML = '<i class="fa fa-arrow-up"></i>';
        btn.style.display = 'none';
        
        window.addEventListener('scroll', () => {
            if (document.documentElement.scrollTop > 100 || document.body.scrollTop > 100) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(btn);
    }

    // 检测DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 