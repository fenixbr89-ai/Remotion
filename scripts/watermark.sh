#!/bin/bash
# usage: watermark.sh in.mp4 out.mp4   — "Kayke.hs" travelling around the edges, one lap per 16s
in="$1"; out="$2"
F=/usr/share/fonts/opentype/inter/Inter-SemiBold.otf
[ -f "$F" ] || F=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
M=40
P="mod(t,16)/4"
X="if(lt($P,1), $M+($P)*(w-tw-2*$M), if(lt($P,2), w-tw-$M, if(lt($P,3), w-tw-$M-($P-2)*(w-tw-2*$M), $M)))"
Y="if(lt($P,1), $M, if(lt($P,2), $M+($P-1)*(h-th-2*$M), if(lt($P,3), h-th-$M, h-th-$M-($P-3)*(h-th-2*$M))))"
ffmpeg -v error -y -i "$in" -vf "drawtext=fontfile=$F:text='Kayke.hs':fontsize=34:fontcolor=white@0.55:shadowcolor=black@0.35:shadowx=2:shadowy=2:x='$X':y='$Y'" -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -c:a copy "$out"
