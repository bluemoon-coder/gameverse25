# OCR Implementation Guide for GameVerse '25

## Overview
This document outlines the implementation strategy for automated screenshot-based scoring using open-source OCR tools.

## Technology Stack

### Core OCR Tools
- **Tesseract OCR**: Primary OCR engine (Apache 2.0 License)
- **OpenCV**: Image preprocessing (BSD License)
- **Pillow/PIL**: Image handling (PIL License)

### Alternative Options
- **EasyOCR**: Deep learning-based OCR (Apache 2.0)
- **PaddleOCR**: Multilingual OCR (Apache 2.0)

## Implementation Steps

### 1. Server Setup
\`\`\`bash
# Install Tesseract OCR
# Ubuntu/Debian
sudo apt-get install tesseract-ocr

# macOS
brew install tesseract

# Install Python dependencies
pip install pytesseract opencv-python pillow
\`\`\`

### 2. Image Preprocessing Pipeline
\`\`\`python
import cv2
import numpy as np

def preprocess_image(image_path):
    # Read image
    img = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(thresh)
    
    # Resize for better OCR
    scale_percent = 200
    width = int(denoised.shape[1] * scale_percent / 100)
    height = int(denoised.shape[0] * scale_percent / 100)
    resized = cv2.resize(denoised, (width, height), interpolation=cv2.INTER_CUBIC)
    
    return resized
\`\`\`

### 3. Game-Specific Text Extraction

#### BGMI (Battlegrounds Mobile India)
\`\`\`python
import re

def extract_bgmi_results(text):
    # Pattern for kills: "Kills: 5" or "5 Kills"
    kills_pattern = r'(?:Kills?:?\s*)?(\d+)\s*Kills?'
    kills_match = re.search(kills_pattern, text, re.IGNORECASE)
    kills = int(kills_match.group(1)) if kills_match else 0
    
    # Pattern for placement: "#3" or "Rank 3" or "3rd Place"
    placement_pattern = r'(?:#|Rank\s+|Place\s+)?(\d+)(?:st|nd|rd|th)?'
    placement_match = re.search(placement_pattern, text, re.IGNORECASE)
    placement = int(placement_match.group(1)) if placement_match else 0
    
    return {'kills': kills, 'placement': placement}
\`\`\`

#### Free Fire
\`\`\`python
def extract_freefire_results(text):
    # Similar patterns to BGMI
    # Free Fire typically shows "Kills" and "Rank"
    kills_pattern = r'Kills?\s*:?\s*(\d+)'
    placement_pattern = r'Rank\s*:?\s*(\d+)'
    
    kills_match = re.search(kills_pattern, text, re.IGNORECASE)
    placement_match = re.search(placement_pattern, text, re.IGNORECASE)
    
    return {
        'kills': int(kills_match.group(1)) if kills_match else 0,
        'placement': int(placement_match.group(1)) if placement_match else 0
    }
\`\`\`

#### Clash Royale
\`\`\`python
def extract_clashroyale_results(text):
    # Clash Royale is win/loss based
    # Look for "Victory" or "Defeat"
    victory_pattern = r'Victory|Win|Won'
    defeat_pattern = r'Defeat|Loss|Lost'
    
    if re.search(victory_pattern, text, re.IGNORECASE):
        return {'placement': 1, 'kills': 0}
    elif re.search(defeat_pattern, text, re.IGNORECASE):
        return {'placement': 2, 'kills': 0}
    
    return {'placement': 0, 'kills': 0}
\`\`\`

### 4. Background Processing Worker

\`\`\`python
# Using a simple queue processor
import time
from supabase import create_client

def process_ocr_queue():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    while True:
        # Get pending items
        response = supabase.table('ocr_queue')\
            .select('*')\
            .eq('status', 'pending')\
            .limit(10)\
            .execute()
        
        for item in response.data:
            try:
                # Update status to processing
                supabase.table('ocr_queue')\
                    .update({'status': 'processing'})\
                    .eq('id', item['id'])\
                    .execute()
                
                # Get match result details
                result = supabase.table('match_results')\
                    .select('*, matches(game)')\
                    .eq('id', item['match_result_id'])\
                    .single()\
                    .execute()
                
                game_type = result.data['matches']['game']
                
                # Process screenshot
                extracted = process_screenshot(item['screenshot_url'], game_type)
                
                # Update OCR queue with results
                supabase.table('ocr_queue')\
                    .update({
                        'status': 'completed',
                        'extracted_data': extracted,
                        'processed_at': datetime.now().isoformat()
                    })\
                    .eq('id', item['id'])\
                    .execute()
                
                # Optionally auto-update match result if confidence is high
                if extracted.get('confidence', 0) > 0.9:
                    supabase.table('match_results')\
                        .update({
                            'kills': extracted['kills'],
                            'placement': extracted['placement']
                        })\
                        .eq('id', item['match_result_id'])\
                        .execute()
                
            except Exception as e:
                # Mark as failed
                supabase.table('ocr_queue')\
                    .update({
                        'status': 'failed',
                        'error_message': str(e)
                    })\
                    .eq('id', item['id'])\
                    .execute()
        
        # Wait before next iteration
        time.sleep(5)
\`\`\`

### 5. Deployment Options

#### Option A: Vercel Serverless Function
- Limited to 10-second execution time
- Good for simple OCR tasks
- May need to use external OCR API

#### Option B: Separate Worker Service
- Deploy on a VPS or container service
- Run continuous background worker
- Full control over OCR processing

#### Option C: Scheduled Jobs
- Use Vercel Cron Jobs
- Process queue periodically
- Good for non-real-time processing

## Accuracy Improvements

### 1. Region of Interest (ROI) Detection
- Train a model to detect specific UI elements
- Extract only relevant regions (kills counter, placement indicator)

### 2. Template Matching
- Store templates of common UI elements
- Use template matching to locate exact positions

### 3. Confidence Scoring
- Implement confidence thresholds
- Flag low-confidence results for manual review

### 4. Machine Learning Enhancement
- Train a custom model on game screenshots
- Use YOLO or similar for object detection
- Combine with OCR for better accuracy

## Current Implementation Status

**Phase 1 (Current)**: Manual verification by admins
- Teams upload screenshots
- Admins manually verify and approve results
- No automated OCR processing yet

**Phase 2 (Future)**: Semi-automated OCR
- OCR extracts data from screenshots
- Admins review and correct if needed
- Reduces manual work

**Phase 3 (Advanced)**: Fully automated
- High-confidence results auto-approved
- Only low-confidence results need review
- Real-time leaderboard updates

## Cost Analysis

All tools are open-source and free:
- Tesseract OCR: Free (Apache 2.0)
- OpenCV: Free (BSD)
- Python libraries: Free
- Server costs: Minimal (can run on basic VPS)

**Total licensing cost: $0**
