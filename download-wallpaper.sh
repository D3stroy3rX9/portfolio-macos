#!/bin/bash
# Download the Lake Tahoe wallpaper for the macOS Portfolio
# Run this from the portfolio-macos directory:
#   chmod +x download-wallpaper.sh && ./download-wallpaper.sh

echo "Downloading Lake Tahoe wallpaper..."
curl -sL -o public/wallpaper.jpg \
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=3840&q=90&fit=crop" \
  || curl -sL -o public/wallpaper.jpg \
  "https://4kwallpapers.com/images/wallpapers/lake-tahoe-united-3840x2160-4494.jpg" \
  || echo "Auto-download failed. Please manually save your wallpaper as public/wallpaper.jpg"

if [ -f public/wallpaper.jpg ]; then
  echo "✓ Wallpaper saved to public/wallpaper.jpg"
  echo "  Run 'npm run dev' to see it in action!"
else
  echo ""
  echo "Manual steps:"
  echo "  1. Save your wallpaper image as: public/wallpaper.jpg"
  echo "  2. Run: npm run dev"
fi
