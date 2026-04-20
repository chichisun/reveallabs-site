#!/usr/bin/env bash
#
# Build intermission.mp4 from the 7 Higgsfield clips.
# Pipeline: trim → B&W grade → film grain → vignette → crossfade chain → loop bookends → export.
#
# Timeline (matches gameplan C-4, adjusted from 8 to 7 clips after 2a/2b consolidation):
#   1a (2.5s) → 1b (2.0s) → 5 (2.5s) → 2 (2.5s) → 3 (2.0s) → 4 (3.0s) → 6 (2.5s)
# All transitions 0.3s crossfade except 3→4 which uses smoothright for a whip-slide feel.
# 0.3s fade-in from black at start + 0.3s fade-to-black at end → invisible loop seam.
#
# Final duration: ~15.2s
# Output: design/video-final/intermission.mp4

set -euo pipefail

CLIPS="/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-clips"
OUT="/Users/kase/Desktop/Reveal LLC/reveallabs-site/design/video-final"

cd "$CLIPS"

# Per-clip filter: trim + 24fps + scale to 1080p + consistent B&W grade + grain + vignette.
# Saturation=0 forces B&W in case any clip came out with residual color.
GRADE="fps=24,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black,eq=contrast=1.12:brightness=-0.02:saturation=0,noise=alls=10:allf=t+u,vignette=PI/5"

ffmpeg -y \
  -i 1a.mp4 -i 1b.mp4 -i 5.mp4 -i 2.mp4 -i 3.mp4 -i 4.mp4 -i 6.mp4 \
  -filter_complex "
    [0:v]trim=0:2.5,setpts=PTS-STARTPTS,${GRADE}[v0];
    [1:v]trim=0:2.0,setpts=PTS-STARTPTS,${GRADE}[v1];
    [2:v]trim=0:2.5,setpts=PTS-STARTPTS,${GRADE}[v2];
    [3:v]trim=0:2.5,setpts=PTS-STARTPTS,${GRADE}[v3];
    [4:v]trim=0:2.0,setpts=PTS-STARTPTS,${GRADE}[v4];
    [5:v]trim=0:3.0,setpts=PTS-STARTPTS,${GRADE}[v5];
    [6:v]trim=0:2.5,setpts=PTS-STARTPTS,${GRADE}[v6];
    [v0][v1]xfade=transition=fade:duration=0.3:offset=2.2[x01];
    [x01][v2]xfade=transition=fade:duration=0.3:offset=3.9[x012];
    [x012][v3]xfade=transition=fade:duration=0.3:offset=6.1[x0123];
    [x0123][v4]xfade=transition=fade:duration=0.3:offset=8.3[x01234];
    [x01234][v5]xfade=transition=smoothright:duration=0.3:offset=10.0[x012345];
    [x012345][v6]xfade=transition=fade:duration=0.3:offset=12.7[prefade];
    [prefade]fade=in:st=0:d=0.3:color=black,fade=out:st=14.9:d=0.3:color=black[final]
  " \
  -map "[final]" \
  -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -r 24 \
  -movflags +faststart \
  -an \
  "$OUT/intermission.mp4"

echo "---"
echo "intermission.mp4 built. Extracting poster frame..."

# Extract poster frame at t=1s (inside the wok toss)
ffmpeg -y -i "$OUT/intermission.mp4" -ss 1 -vframes 1 -q:v 3 "$OUT/intermission-poster.jpg"

echo "---"
echo "Done. Files:"
ls -la "$OUT/"
