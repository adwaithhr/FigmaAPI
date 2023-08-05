function runPlugin()
{
    let selectedElements = figma.currentPage.selection
    console.log(selectedElements)
    // if (selectedElements==0)
    // {
    //     figma.closePlugin('No elements selected')
    //     return
    // }
    // let allElements = figma.currentPage.findAll()
    // figma.currentPage.selection = allElements
    function newFill(){
        let allElements = figma.currentPage.findAll()
        figma.currentPage.selection = allElements
        allElements.forEach((element) => {  
            // Check if the element has a fill property and is a solid color fill
            if (element.fills && element.fills.length > 0 && element.fills[0].type === "SOLID") {
                const currentColor = element.fills[0].color;
                console.log(currentColor)
                const newColor = {
                    r: Math.min(0.83200, 1),
                    g: Math.min(0.63, 1),
                    b: Math.min(0.722, 1),
                    // a: currentColor.a
                  };
              // Update the fill color with the new color
              element.fills = [{ type: "SOLID", color: newColor }];
            }
          });
    }
    newFill()
    figma.closePlugin()
}

runPlugin()
