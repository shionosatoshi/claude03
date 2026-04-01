# Plan: Nano Banana Prompt Workflow Execution

## Task Overview
Generate slide image generation prompts for a team building training presentation using the nano-banana-prompt-workflow skill.

## Input Content
Slide content about "Teamwork Importance" with 4 sections:
1. What is teamwork
2. Benefits
3. Practice methods
4. Summary

## Workflow Steps

### Step 1: Create Marp Slide File
- Create Marp-formatted Markdown file following `texttoslide.md` rules
- Include frontmatter: `marp: true`, `theme: default`, `paginate: true`
- Structure slides with proper `---` separators
- Use `#` or `##` for titles
- Use bullet points for content
- Output location: `C:\Users\sunfi\nano-banana-workspace\iteration-1\eval-3\with_skill\outputs\`

### Step 2: Execute Python Conversion Script
- Run `scripts/marp_to_prompts.py` with the created Marp file
- Script will:
  - Parse the Marp file by splitting on `---`
  - Extract titles from each slide
  - Generate individual prompt files using the template
  - Create timestamped output directory
  - Save prompts as `01_タイトル.md`, `02_タイトル.md`, etc.

### Step 3: Verify and Report
- Confirm all prompt files were created
- Report:
  - Output directory location
  - Number of prompts generated
  - File listing
  - Prompt template details (16:9, 2K, blue theme, black cat character)

## Expected Output
- Marp slide file: `teamwork_training_slides.md`
- Prompts directory: `prompts/YYYY-MM-DD_HH-SS/`
- Individual prompt files (5 total: title slide + 4 content slides)

## Design Specifications (from skill)
- Aspect ratio: 16:9
- Resolution: 2K
- Background: White
- Text: Black
- Main color: Blue
- Style: Flat colors
- Character: Cute black cat
- Props: Wine, books, notebook (as needed)
