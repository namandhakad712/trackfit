# Fitting Part Overlays

This directory contains visual overlays for different types of track fittings that can be displayed on maps.

## Directory Structure

- `/clips` - Elastic rail clips and similar fastening components
- `/liners` - Liners used between rails and pads
- `/pads` - Rail pads and sleeper pads
- `/sleepers` - Concrete, wooden, and steel sleepers

## Image Naming Convention

Images follow the naming pattern: `{part-type}-{specific-model}.png`

## Usage

These images are used by the `FittingPartOverlay` component to display fitting locations on maps with appropriate visual indicators.

## Part Types

1. **Clips**
   - `rail-clip.png` - Standard elastic rail clip visualization
   
2. **Pads**
   - `rail-pad.png` - Rail pad placed between rail and sleeper
   
3. **Liners**
   - `liner.png` - Protective liner between pad and sleeper
   
4. **Sleepers**
   - `sleeper.png` - Concrete/wooden sleeper foundation

Each image is designed to be displayed at 32x32 pixels by default but can be scaled as needed.