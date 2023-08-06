function hexToRgb(hex) {
    // Remove "#" if present
    hex = hex.replace("#", "");
  
    // Validate the hexadecimal color format
    const hexRegex = /^[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(hex)) {
      throw new Error("Invalid hexadecimal color format");
    }
  
    // Parse the individual components from the hex string
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
  
    return { r, g, b };
  }
  
  // Example usage:
  const hexColor = "#FFA500"; // Orange color in hexadecimal
  const rgbColor = hexToRgb(hexColor);
  console.log(`Hex: ${hexColor} -> RGB(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`);
  