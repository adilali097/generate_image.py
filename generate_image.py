# generate_image.py
import sys
import json
from PIL import Image, ImageDraw, ImageFont

def generate_image(prompt):
    # For the sake of this example, we'll generate a simple text-based image
    # Replace this with actual LLaMA image generation logic if needed

    img = Image.new('RGB', (512, 512), color=(73, 109, 137))
    d = ImageDraw.Draw(img)
    
    # Load a font
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except IOError:
        font = ImageFont.load_default()

    # Add text to image
    d.text((10, 10), prompt, fill=(255, 255, 0), font=font)
    
    # Save the image
    img_path = 'generated_image.png'
    img.save(img_path)

    return img_path

if __name__ == "__main__":
    # Expecting input in the form of JSON from stdin
    input_data = json.loads(sys.stdin.read())
    prompt = input_data.get("prompt", "No prompt provided")
    
    # Generate the image
    image_path = generate_image(prompt)
    
    # Output the result
    output = {"image_path": image_path}
    print(json.dumps(output))
