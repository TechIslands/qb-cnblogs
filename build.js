/**
 * 博客园快速美化框架构建脚本
 * 用于处理源文件并生成最终的发布文件
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const child_process = require('child_process');

// 配置
const config = {
    srcDir: './src',
    distDir: './dist',
    cssDir: 'css',
    jsDir: 'js',
    version: '1.0.0'
};

// 确保目录存在
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 复制目录
function copyDirectory(source, destination) {
    ensureDirectoryExists(destination);
    const files = fs.readdirSync(source);
    
    for (const file of files) {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);
        
        const stats = fs.statSync(sourcePath);
        
        if (stats.isDirectory()) {
            copyDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}

// 压缩JS文件
async function minifyJS(inputFile, outputFile) {
    const code = fs.readFileSync(inputFile, 'utf8');
    try {
        const result = await minify(code, {
            compress: {
                drop_console: false,
                drop_debugger: true
            },
            mangle: true,
            output: {
                comments: false
            }
        });
        
        fs.writeFileSync(outputFile, result.code);
        console.log(`✅ JS压缩完成: ${outputFile}`);
    } catch (error) {
        console.error(`❌ JS压缩失败: ${inputFile}`, error);
    }
}

// 压缩CSS文件
function minifyCSS(inputFile, outputFile) {
    const css = fs.readFileSync(inputFile, 'utf8');
    try {
        const result = new CleanCSS({ 
            level: 2,
            format: 'keep-breaks'
        }).minify(css);
        
        fs.writeFileSync(outputFile, result.styles);
        console.log(`✅ CSS压缩完成: ${outputFile}`);
    } catch (error) {
        console.error(`❌ CSS压缩失败: ${inputFile}`, error);
    }
}

// 合并文件
function concatFiles(files, outputFile) {
    let content = '';
    
    for (const file of files) {
        content += fs.readFileSync(file, 'utf8') + '\n';
    }
    
    fs.writeFileSync(outputFile, content);
    console.log(`✅ 文件合并完成: ${outputFile}`);
}

// 主构建函数
async function build() {
    try {
        console.log('🚀 开始构建...');
        
        // 创建输出目录
        ensureDirectoryExists(config.distDir);
        ensureDirectoryExists(path.join(config.distDir, config.cssDir));
        ensureDirectoryExists(path.join(config.distDir, config.jsDir));
        ensureDirectoryExists(path.join(config.distDir, config.cssDir, 'themes'));
        
        // 处理CSS文件
        console.log('📦 正在处理CSS文件...');
        
        // 复制并压缩基础CSS
        const baseCssPath = path.join(config.srcDir, config.cssDir, 'base.css');
        const outputBaseCssPath = path.join(config.distDir, config.cssDir, 'base.min.css');
        minifyCSS(baseCssPath, outputBaseCssPath);
        
        // 处理暗黑模式CSS
        const darkModeCssPath = path.join(config.srcDir, config.cssDir, 'dark-mode.css');
        const outputDarkModeCssPath = path.join(config.distDir, config.cssDir, 'dark-mode.min.css');
        minifyCSS(darkModeCssPath, outputDarkModeCssPath);
        
        // 处理主题CSS
        const themesDir = path.join(config.srcDir, config.cssDir, 'themes');
        const themesOutputDir = path.join(config.distDir, config.cssDir, 'themes');
        const themeFiles = fs.readdirSync(themesDir);
        
        for (const themeFile of themeFiles) {
            if (themeFile.endsWith('.css')) {
                const themeInputPath = path.join(themesDir, themeFile);
                const themeOutputPath = path.join(themesOutputDir, themeFile.replace('.css', '.min.css'));
                minifyCSS(themeInputPath, themeOutputPath);
            }
        }
        
        // 处理JS文件
        console.log('📦 正在处理JS文件...');
        
        // 合并features.js和cnblogLoader.js
        const jsFiles = [
            path.join(config.srcDir, config.jsDir, 'features.js'),
            path.join(config.srcDir, config.jsDir, 'cnblogLoader.js')
        ];
        
        const combinedJsPath = path.join(config.distDir, 'temp_combined.js');
        concatFiles(jsFiles, combinedJsPath);
        
        // 压缩合并后的JS
        const outputJsPath = path.join(config.distDir, config.jsDir, 'cnblogLoader.min.js');
        await minifyJS(combinedJsPath, outputJsPath);
        
        // 清理临时文件
        fs.unlinkSync(combinedJsPath);
        
        // 生成版本信息文件
        const versionInfo = {
            version: config.version,
            buildTime: new Date().toISOString(),
            buildNumber: Math.floor(Date.now() / 1000)
        };
        
        fs.writeFileSync(
            path.join(config.distDir, 'version.json'),
            JSON.stringify(versionInfo, null, 2)
        );
        
        console.log('✨ 构建完成!');
    } catch (error) {
        console.error('❌ 构建失败:', error);
        process.exit(1);
    }
}

// 执行构建
build(); 