# Media: what is real and what is generated

This is version 3 of the mydealermn.com redesign ("Lake Country": glassmorphism x Minnesota lake country). It uses
two kinds of imagery. Keep them apart when you edit the site.

## 1. My Dealer's own media (real)

- `assets/photos/`: My Dealer's own photographs of the Bayport store (outside views, the build-out, the
  finished floor, the parking lot, the restroom), the poster frame of the brand film, and the four thumbnails of
  the Potamentary film linked from the company page. Names are kept from the live site. One large photo
  (`parking-after.webp`) was re-encoded as WebP at quality 80 to lighten it; nothing else was changed.
- `assets/media/my-dealer-comes-to-life.mp4` and `-mobile.mp4`: My Dealer's own brand film (the dealer character
  comes to life). It stays the home hero film, as on the live site.
- `assets/brand/`: My Dealer's logo files. `dealer-cut.png` is the logo character cut from the client's own logo
  with the outside black made transparent.

Alt text for these files is in `src/content/images.json` (`photos`, `media`). Where the live site already had alt
text, it is reused.

## 2. Generated media (AI-generated, illustrative)

Every file in `assets/generated/`, plus `assets/media/loop-smoke.mp4`, `loop-smoke-sm.mp4` and `loop-smoke.jpg`,
is **AI-generated and illustrative**. None of them is a photograph or recording of My Dealer's store, staff,
customers, products or brands, and none stands in for one. They are mood and category illustrations.

All generated imagery follows the same rules: no people, faces, hands or bodies; no smoking, vaping or eating; no
text, letters, numbers, labels, logos or brand marks (jars, cans and the vape device are blank); no candy, party or
luxury cues. The lake, pines, birch, stars and cabin props are a generic lake-country mood: no picture shows or
stands for a real place, and none is a view of the town or river where My Dealer's store is.

### Stills (model family: FLUX1.1 [pro] ultra, run on fal.ai)

Version 3 regenerated ten of the eleven stills in the Lake Country mood, keeping their ids, files and proportions.
The photographs are product still lifes at blue hour: weathered dock and cabin wood, pine, birch, wool, speckled
blue camp enamelware and banded agate pebbles, with a calm lake and pine shoreline blurred behind and a warm lantern
or lamp accent. The drawings are black-ink engravings with lake-country accents (pine boughs, a small star, water
ripple lines). `g-smoke` is kept from version 1.

| id | aspect | what it depicts |
|---|---|---|
| `g-bud-macro` | 16:9 | Macro of a frosty cured cannabis flower bud with orange pistils on a weathered, frosted grey surface, beside a pine sprig and a polished banded agate pebble, with a lantern glowing in front of a blurred lake at blue hour |
| `g-deli-jars` | 3:2 | Three open, blank clear glass jars of cured flower on a weathered cabin table by a window, beside a red and black buffalo check wool blanket and a pine cone; a blurred lake and pines outside |
| `g-prerolls` | 3:2 | Three empty paper pre-roll cones, two with white filter tips, on a speckled blue and white enamel camp plate on a pale wooden board beside a pine twig, with a blurred lake behind |
| `g-edibles` | 3:2 | Square amber gummies in a small speckled blue enamel camp bowl on a grey wool blanket, beside a pine cone and a birch log, with a blurred lake through a window |
| `g-vape` | 3:2 | An unbranded matte black all-in-one vape device with a small amber oil window on a wet dark stone, beside two banded agate pebbles, with a blurred lake at blue hour |
| `g-beverage` | 3:2 | Three blank, unlabelled matte drink cans (pale blue, silver, pine green) with condensation on a weathered wooden dock beside a lantern, with a blurred lake and pine shoreline |
| `g-smoke` | 16:9 | Wisps of pale smoke on near-black with a faint warm glow (a texture, kept from version 1) |
| `s-leaf` | 4:5 | Engraving-style ink drawing of a cannabis fan leaf inside an open wreath of pine boughs tied with a small bow, with a small star above, on white |
| `s-bud` | 4:5 | Engraving-style ink drawing of a cannabis flower bud on its stem among serrated leaves, standing in water ripple rings under a small four-point star and sparkles, on white |
| `s-jar` | 4:5 | Engraving-style ink drawing of an empty apothecary jar with a domed lid and a knob, beside a pine sprig, with a small four-point star above, on white |
| `s-hat` | 1:1 | Engraving-style ink drawing of an empty fedora with folded aviator sunglasses on its brim, on a short wooden dock plank above water ripple lines (no face, no person), on white |

The four engravings were cleaned after generation: converted to neutral grey, the paper flattened to pure white (so
they blend cleanly onto light and dark backgrounds), and the three tall ones cropped to 4:5. Nothing was drawn into
or removed from them.

### Motion (model family: Kling 3.0 Turbo image-to-video, run on Higgsfield)

`loop-smoke.mp4` (1920 px wide) and `loop-smoke-sm.mp4` (900 px wide) are a 10-second silent loop: the
`g-smoke` still animated into drifting smoke with a slow camera push, then played forward and in reverse so the
end meets the start without a jump. `loop-smoke.jpg` is its first frame, used as the poster. Version 3 keeps it as
it is.

## 3. How the AI label is embedded

- JPEG stills in `assets/generated/` and the poster `assets/media/loop-smoke.jpg`: an XMP packet in an APP1
  segment with the IPTC digital source type `trainedAlgorithmicMedia`
  (`http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`), written by `tools/ai-label.mjs`
  (re-embedded on the engravings after their clean-up).
- The WebP variants the build makes from them (`/assets/img/<id>-<width>.webp`): the same XMP packet, attached
  with `webpmux`. Every `<img>` of a generated image also carries `data-ai="generated"`.
- The MP4 loops: the `comment` and `description` container tags state that the clip is AI-generated illustrative
  motion and carry the same IPTC digital source type URI.
- Check any file with `node tools/ai-label.mjs verify <file or folder>`.

The prompt, seed and request id of every generated still and clip are kept in the project's generation record
with the source files.
