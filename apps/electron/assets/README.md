# OpenClaw Electron App Assets

This directory contains placeholder icon files for the Electron application.

## Icon Files

The following placeholder icon files are included:

- **icon-mac.icns** - macOS application icon (placeholder)
- **icon-win.ico** - Windows application icon (placeholder)
- **icon-linux.png** - Linux application icon (placeholder, 512x512 PNG)

## Replacing Icons

Before building production releases, replace these placeholder icons with branded OpenClaw icons:

### macOS (.icns)
Convert a 1024x1024 PNG to .icns format using:
```bash
# Install iconutil (comes with Xcode)
mkdir icon.iconset
sips -z 16 16 source.png --out icon.iconset/icon_16x16.png
sips -z 32 32 source.png --out icon.iconset/icon_16x16@2x.png
# ... repeat for all sizes
iconutil -c icns icon.iconset -o icon-mac.icns
```

Or use online converters like https://cloudconvert.com/png-to-icns

### Windows (.ico)
Convert a 256x256 PNG to .ico format using:
```bash
# Using ImageMagick
convert source.png -define icon:auto-resize=256,128,64,48,32,16 icon-win.ico
```

Or use online converters like https://convertio.co/png-ico/

### Linux (.png)
Use a 512x512 PNG file directly. Higher resolution icons (1024x1024) are also acceptable.

## Icon Design Guidelines

- Use a square canvas (1:1 aspect ratio)
- Include sufficient padding to prevent clipping
- Test icons at multiple sizes to ensure readability
- Consider platform-specific design conventions:
  - macOS: Rounded square with subtle gradients
  - Windows: More vibrant, can have transparency
  - Linux: Clean, scalable vector-based designs work best

## Current Placeholders

The current placeholder icons are simple geometric shapes for testing purposes only.
They are **not suitable for production use**.
