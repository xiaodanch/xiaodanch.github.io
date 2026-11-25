---
title: 'Homebrew 安装 Claude Code 网络超时的解决办法'
date: 2026-11-25
permalink: /posts/2026/11/claude-code-download-timeout/
typora-copy-images-to: ../images/posts
description: "手动下载安装包放入 Homebrew 缓存，绕过 downloads.claude.ai 超时"
tags:
  - macOS
  - Homebrew
  - Claude Code
  - 踩坑
---

## 问题

用 Homebrew 安装 Claude Code：

```bash
brew install --cask claude-code
```

卡在下载阶段，反复超时：

```text
curl: (28) Failed to connect to downloads.claude.ai port 443 after 75004 ms: Couldn't connect to server
Warning: Problem : timeout. Will retry in 1 seconds. 3 retries left.
...
Error: Download failed on Cask 'claude-code' with message:
Download failed: https://downloads.claude.ai/claude-code-releases/2.1.325/darwin-arm64/claude
```

`downloads.claude.ai` 连不上，但包本身可以手动下载到。

## 解决：把下载好的文件放进 Homebrew 缓存

前提：已经通过浏览器或代理下载好了对应版本的文件 `claude`（macOS arm64）。

```bash
# 1. 查看 Homebrew 期望的缓存文件路径
brew --cache --cask claude-code
# => ~/Library/Caches/Homebrew/downloads/<sha256>--claude

# 2. 把手动下载的文件放到这个路径
mv ~/Downloads/claude "$(brew --cache --cask claude-code)"

# 3. 重新安装，Homebrew 会直接使用缓存
brew install --cask claude-code

# 4. 验证
claude --version
```

关键点：

* 缓存文件名是 `<URL 的 sha256>--claude`，必须用 `brew --cache --cask claude-code` 输出的路径，不能自己起名。
* Homebrew 会校验文件的 sha256。如果报 checksum mismatch，说明下载的文件不完整或版本不对，重新下载即可。
* 校验通过后安装很快，不会再走网络。

装好后如果 `which claude` 找不到，说明 Homebrew 的 bin 目录不在 PATH 里，在 `.zshrc` 中补上（Apple Silicon 默认是 `/opt/homebrew/bin`）：

```bash
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

之后 `which claude` 就能正常定位到了。

## 备选方案

如果拿不到 cask 的缓存路径，也可以跳过 Homebrew，直接手动安装二进制：

```bash
mkdir -p ~/.local/bin
mv ~/Downloads/claude ~/.local/bin/claude
chmod +x ~/.local/bin/claude
claude --version
```
