# GitHub Setup

This guide walks through pushing LinkJet.cc to GitHub.

## Prerequisites

- A GitHub account
- A GitHub personal access token or SSH key

## Step 1: Create the repository on GitHub

1. Go to https://github.com/new
2. Enter repository name: `linkjet.cc`
3. Set visibility: **Public** (recommended) or Private
4. Do **not** initialize with README, .gitignore, or license (the repo already has these)
5. Click **Create repository**

## Step 2: Push local repository

### Option A: HTTPS (token)

```bash
# Replace USERNAME with your GitHub username
git remote add origin https://github.com/USERNAME/linkjet.cc.git

# Push all commits
git push -u origin master
```

If prompted, use a GitHub personal access token as the password (not your login password).

Create a token at: https://github.com/settings/tokens/new (select `repo` scope)

### Option B: SSH

```bash
# Add your SSH key to GitHub first: https://github.com/settings/keys
git remote add origin git@github.com:USERNAME/linkjet.cc.git

# Push all commits
git push -u origin master
```

## Step 3: Verify

```bash
git log --oneline
# Should show 4 commits:
#   475d346 Add project configuration, assets, and design references
#   32e2199 Add QA validation, documentation, and deployment config
#   21aa488 Add core UI and client functionality
#   6ef84af Scaffold Next.js 16 project with design system
```

## Repository Contents

| Commit | Files |
|--------|-------|
| 1 | Scaffold: Next.js, TypeScript, Tailwind, design system (Button, Card, Input) |
| 2 | Core UI: header, hero, multi-step form, history, URL/slug validation |
| 3 | QA: 25 Playwright tests, 7 screenshots, validation report, docs |
| 4 | Config: CLAUDE.md, ESLint, assets, design reference images |
