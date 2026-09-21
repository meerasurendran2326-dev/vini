import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from rembg import remove, new_session

input_image_path = r"C:\Users\Admin\.gemini\antigravity\brain\cd032d60-6291-4ab1-b6ec-2f23d3838190\.user_uploaded\media_1789980700315.jpg"
output_png_path = r"C:\Users\Admin\OneDrive - Raibal (FPO)\Desktop\vini\public\images\ring-cutout.png"
output_webp_path = r"C:\Users\Admin\OneDrive - Raibal (FPO)\Desktop\vini\public\images\ring-cutout.webp"

def process_ring():
    print("Loading image...")
    img = Image.open(input_image_path).convert("RGBA")

    # Step 1: Remove background with rembg model isnet-general-use or u2net
    print("Removing background using rembg (isnet-general-use)...")
    try:
        session = new_session("isnet-general-use")
        cutout = remove(img, session=session, alpha_matting=True)
    except Exception as e:
        print("isnet-general-use failed, falling back to default u2net:", e)
        cutout = remove(img, alpha_matting=True)

    # Step 1b: Crop tightly to non-transparent bounding box + 4% padding
    bbox = cutout.getbbox()
    if bbox:
        width, height = cutout.size
        pad_x = int(width * 0.04)
        pad_y = int(height * 0.04)
        left = max(0, bbox[0] - pad_x)
        top = max(0, bbox[1] - pad_y)
        right = min(width, bbox[2] + pad_x)
        bottom = min(height, bbox[3] + pad_y)
        cutout = cutout.crop((left, top, right, bottom))

    # Step 2: Quality Enhancement
    # 2a. Desaturate orange/brown warm wood reflections to cool sterling silver
    arr = np.array(cutout, dtype=np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    # Convert RGB to Luminance (grayscale silver intensity)
    gray = 0.299 * r + 0.587 * g + 0.114 * b

    # Cool sterling silver tinting (blend 80% grayscale + 20% original for black gem highlights)
    r_cool = np.where(r > 40, gray * 0.95 + 10, r)
    g_cool = np.where(g > 40, gray * 0.98 + 10, g)
    b_cool = np.where(b > 40, gray * 1.05 + 15, b)

    arr[:, :, 0] = np.clip(r_cool, 0, 255)
    arr[:, :, 1] = np.clip(g_cool, 0, 255)
    arr[:, :, 2] = np.clip(b_cool, 0, 255)

    cutout_cool = Image.fromarray(arr.astype(np.uint8), "RGBA")

    # 2b. Raise Contrast slightly for crisp metallic depth
    contrast_enhancer = ImageEnhance.Contrast(cutout_cool)
    cutout_enhanced = contrast_enhancer.enhance(1.25)

    # 2c. Upscale to at least 2400px width with High Quality Lanczos filter
    target_width = 2400
    w_orig, h_orig = cutout_enhanced.size
    aspect = h_orig / w_orig
    target_height = int(target_width * aspect)
    
    print(f"Upscaling from {w_orig}x{h_orig} to {target_width}x{target_height}...")
    cutout_hd = cutout_enhanced.resize((target_width, target_height), Image.Resampling.LANCZOS)

    # 2d. Sharpen metal edges
    cutout_sharp = cutout_hd.filter(ImageFilter.UnsharpMask(radius=1.5, percent=130, threshold=3))

    # Ensure output directories exist
    os.makedirs(os.path.dirname(output_png_path), exist_ok=True)

    # Export PNG & WebP
    print("Saving PNG cutout...")
    cutout_sharp.save(output_png_path, "PNG", compress_level=6)

    print("Saving WebP cutout...")
    cutout_sharp.save(output_webp_path, "WEBP", quality=95)

    print(f"DONE! Exported {target_width}px wide PNG and WebP at:")
    print(" -", output_png_path)
    print(" -", output_webp_path)

if __name__ == "__main__":
    process_ring()
