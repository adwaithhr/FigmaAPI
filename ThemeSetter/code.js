figma.showUI(__html__,{width:350,height:350})

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

    function rgbToHsl(r, g, b) {
        // Ensure the input RGB values are within the valid range (0 to 255)
        r = Math.min(255, Math.max(0, r)) / 255;
        g = Math.min(255, Math.max(0, g)) / 255;
        b = Math.min(255, Math.max(0, b)) / 255;
      
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
      
        if (max === min) {
          h = s = 0; // achromatic (gray)
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          
          h /= 6;
        }
      
        // Convert HSL values to degrees and percentage
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
      
        return { h, s, l };
      }

      function hslToRgb(h, s, l) {
        // Convert HSL values to the range 0 to 1
        h = h % 360 / 360;
        s = Math.min(100, Math.max(0, s)) / 100;
        l = Math.min(100, Math.max(0, l)) / 100;
      
        if (s === 0) {
          // If saturation is 0, the color is grayscale
          const grayValue = Math.round(l * 255);
          return { r: grayValue, g: grayValue, b: grayValue };
        }
      
        const hueToRgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
      
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
      
        const r = Math.round(hueToRgb(p, q, h + 1 / 3)*255);
        const g = Math.round(hueToRgb(p, q, h)*255);
        const b = Math.round(hueToRgb(p, q, h - 1 / 3)*255);
      
        return { r, g, b };
      }
    figma.ui.onmessage = (msg) => {
        if (msg.type === "applyColor"){
            let allElements = figma.currentPage.selection
            console.log(allElements)
            if (allElements==0)
            {
                figma.closePlugin('No elements selected')
                return
            }
            // let allElements = figma.currentPage.selection
            // figma.currentPage.selection = allElements
            function isRectangleEllipseText(element) {
                return (
                  element.type === "RECTANGLE" ||
                  element.type === "ELLIPSE" ||
                  element.type === "TEXT" ||
                  element.type === "FRAME" ||
                  element.type === "GROUP" ||
                  element.type === "LINE"
                );
              }
        
        
            function selectElementsWithinFrame(frameNode) {
                // Check if the provided node is a frame
                if (frameNode.type === "FRAME") {
                    const elementsWithinFrame = frameNode.children;
                    if (frameNode.layoutMode !== "NONE")
                    {
                        const elementsWithinAutoLayout = frameNode.children;

                        if (elementsWithinAutoLayout.length > 0) {
                        // Clear the current selection (optional)
                            figma.currentPage.selection = [];

                            // Select elements within the Auto Layout
                            elementsWithinAutoLayout.forEach((element) => {
                                element.selected = true;
                            });
                        }
                    }   
                    if (elementsWithinFrame.length > 0) {
                        // Clear the current selection (optional)
                        figma.currentPage.selection = [];
              
                    // Select elements within the frame
                    elementsWithinFrame.forEach((element) => {
                        if(element.type === "FRAME")
                            selectElementsWithinFrame(element)
                        if(element.type === "GROUP")
                            selectElementsWithinGroup(element)
                        fillColor(element);
                    });
                  }
                }
            }
            function selectElementsWithinGroup(groupNode) {

                if (groupNode.type === "GROUP") {
                  const elementsWithinGroup = groupNode.children;
              
                  if (elementsWithinGroup.length > 0) {
                    // Clear the current selection (optional)
                    figma.currentPage.selection = [];
              
                    // Select elements within the group
                    elementsWithinGroup.forEach((element) => {
                        if(element.type === "FRAME")
                            selectElementsWithinFrame(element)
                        if(element.type === "GROUP")
                            selectElementsWithinGroup(element)
                        fillColor(element);
                    });
                  }
                }
            }
          function newFill(){
              const currentPage = figma.currentPage;
              let allElements = currentPage.children
              figma.currentPage.selection = allElements
              const filteredElements = allElements.filter(isRectangleEllipseText);
              filteredElements.forEach((element) => {  
                  if(element.type === "FRAME")
                      selectElementsWithinFrame(element)
                  else if(element.type === "GROUP")
                      selectElementsWithinGroup(element)
                  else
                      fillColor(element);
                });
          }
          function fillColor(element){
              if (element.fills && element.fills.length > 0 && element.fills[0].type === "SOLID") {
                  const Hex = hexToRgb(msg.color)
                  const applyColor = {r: Hex.r,g: Hex.g,b: Hex.b};
                  console.log(applyColor)
                  const currentColor = element.fills[0].color
                  console.log(currentColor)
                  const currentHSL = rgbToHsl(currentColor.r*255,currentColor.g*255,currentColor.b*255)
                  console.log(currentHSL)
                  const hslColor = rgbToHsl(applyColor.r,applyColor.g,applyColor.b)
                  console.log(hslColor)
                  const inter = {h: hslColor.h,s: currentHSL.s,l: currentHSL.l}
                  console.log(inter)
                  const rgbColor = hslToRgb(inter.h,inter.s,inter.l)
                  console.log(rgbColor)
                  const newColor = { 
                      r: rgbColor.r/255,
                      g: rgbColor.g/255,
                      b: rgbColor.b/255, 
                  };
                // Update the fill color with the new color
                element.fills = [{ type: "SOLID", color: newColor }];
              };
          }
          newFill()
        }
    }
