# 部署说明（永久托管）

航碳智脑站点采用双保险托管：**Netlify 主站** + **GitHub Pages 永久备份**。

## 1. 本地构建

```bash
# Netlify 主站构建（根路径）
npm run build          # 输出到 dist/

# GitHub Pages 备份构建（相对路径，适合子路径部署）
npm run build -- --base=./ --outDir dist-gh-pages
# 构建后需复制 index.html 为 404.html（SPA 回退）：
#   copy dist-gh-pages\index.html dist-gh-pages\404.html
```

## 2. Netlify 主站（重新上线 / 永久保留）

1. 用 **Chrome 或 Edge**（不要用 VS Code 内嵌浏览器）打开：https://app.netlify.com/drop
2. 点击 **"Log in with GitHub"**，授权 Netlify
3. 把 `D:\航碳智脑\dist` 文件夹拖进页面
4. 站点即永久归你的账号（不会过期）。在 Site settings 可：
   - 绑定自定义域名
   - 连接 GitHub 仓库实现自动部署

## 3. GitHub Pages 永久备份

构建产物已推送到 `gh-pages` 分支。只需启用一次：

1. 打开仓库：https://github.com/Li-Yao916/hangtan-zhinao
2. **Settings → Pages**
3. **Source** 选择 **"Deploy from a branch"** → 分支选 **`gh-pages`** → 目录选 **`/ (root)`** → Save
4. 访问地址：`https://Li-Yao916.github.io/hangtan-zhinao/`

> 已包含 `404.html`（SPA 回退），深层链接（如 `/dashboard/routes`）可直接访问。
> 以后更新站点：重新构建 `dist-gh-pages`，推送到 `gh-pages` 分支即可。

## 4. 源码永久备份

源码已托管于 GitHub：`https://github.com/Li-Yao916/hangtan-zhinao`（main 分支）。
改动后记得 `git push origin main`。

## 注意事项

- 本机 Git 仓库配置了 `http.sslverify=false`（网络环境 SSL 证书问题导致），其他机器如需推送请自行处理证书或恢复校验。
- 前端为纯静态 React 应用（无后端 API），可部署到任意静态托管平台。
