document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');

// Function to determine character type (simplified)
function getCharDir(char) {
    const charCode = char.charCodeAt(0);
    // Arabic characters
    if ((charCode >= 0x0600 && charCode <= 0x06FF) || 
        (charCode >= 0x0750 && charCode <= 0x077F) ||
        (charCode >= 0x08A0 && charCode <= 0x08FF) ||
        (charCode >= 0xFB50 && charCode <= 0xFDFF) ||
        (charCode >= 0xFE70 && charCode <= 0xFEFF)) {
        return 'rtl';
    } 
    // Latin characters
    else if ((charCode >= 0x0041 && charCode <= 0x005A) || // A-Z
               (charCode >= 0x0061 && charCode <= 0x007A)) { // a-z
        return 'ltr';
    } 
    // Numbers, spaces, and common punctuation are treated as neutral
    // They will adhere to the direction of the surrounding text or the overall block direction.
    // More specific handling for punctuation might be needed if issues persist.
    else if ((charCode >= 0x0030 && charCode <= 0x0039) || // Numbers
              char.match(/\s/)) { // Whitespace
        return 'neutral';
    }
    // Default for other characters (e.g., less common punctuation, symbols)
    // This might need adjustment based on observed issues. For now, group with LTR.
    return 'ltr'; 
}

document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');

    if (inputText && outputText) {
        inputText.addEventListener('input', () => {
            const text = inputText.value;
            outputText.innerHTML = ''; // Clear previous output

            if (text.length === 0) {
                outputText.style.direction = 'rtl'; // Default for empty
                inputText.style.direction = 'rtl'; // Default for empty input area
                return;
            }

            // Preserve overall direction based on first strong char for the container
            // This helps with overall alignment of lines if they are all one script.
            const firstChar = text.charCodeAt(0);
            if ((firstChar >= 0x0600 && firstChar <= 0x06FF) || 
                (firstChar >= 0x0750 && firstChar <= 0x077F) ||
                (firstChar >= 0x08A0 && firstChar <= 0x08FF) ||
                (firstChar >= 0xFB50 && firstChar <= 0xFDFF) ||
                (firstChar >= 0xFE70 && firstChar <= 0xFEFF)) {
                outputText.style.direction = 'rtl';
            } else {
                outputText.style.direction = 'ltr';
            }

            // New Segmentation Logic Starts Here:
            let currentSegment = "";
            let currentDir = ""; // This will hold the determined direction ('ltr' or 'rtl') of the current segment

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                let charDirType = getCharDir(char); // 'rtl', 'ltr', or 'neutral'

                if (currentDir === "") { // Initializing for the very first character
                    currentSegment += char;
                    if (charDirType !== 'neutral') {
                        currentDir = charDirType;
                    }
                    // If first char is neutral, currentDir remains empty, will be set by next non-neutral
                    // or defaults to outputText.style.direction at span creation.
                } else if (charDirType === currentDir || charDirType === 'neutral') {
                    // Character continues current direction or is neutral
                    currentSegment += char;
                    if (currentDir === '' && charDirType !== 'neutral') { 
                        // This happens if the segment started with neutral chars
                        currentDir = charDirType;
                    }
                } else {
                    // Direction has changed (e.g., from rtl to ltr or vice-versa)
                    // Finalize and append the previous segment
                    if (currentSegment) {
                        const span = document.createElement('span');
                        span.innerText = currentSegment;
                        // If currentDir is still not set (e.g. all-neutral segment), use outputText's direction
                        span.dir = currentDir || outputText.style.direction || 'rtl'; 
                        outputText.appendChild(span);
                    }
                    // Start new segment
                    currentSegment = char;
                    currentDir = charDirType === 'neutral' ? '' : charDirType; // Reset currentDir if new char is neutral
                }
            }

            // Append the very last segment
            if (currentSegment) {
                const span = document.createElement('span');
                span.innerText = currentSegment;
                span.dir = currentDir || outputText.style.direction || 'rtl';
                outputText.appendChild(span);
            }
            // New Segmentation Logic Ends Here.

            // Ensure the textarea itself also allows for mixed text input without going haywire
            // by setting its direction based on the first character typed,
            // or allowing the browser to handle it with 'auto'.
            if (text.length > 0) {
                const firstCharTyped = text.charCodeAt(0);
                 if ((firstCharTyped >= 0x0600 && firstCharTyped <= 0x06FF)) { // Simplified check for Arabic
                    inputText.style.direction = 'rtl';
                } else if ((firstCharTyped >= 0x0041 && firstCharTyped <= 0x005A) || (firstCharTyped >= 0x0061 && firstCharTyped <= 0x007A)) { // Basic Latin
                    inputText.style.direction = 'ltr';
                } else {
                    // For other characters (numbers, symbols), 'auto' might be best or stick to current
                    // Or, let it be, as CSS already has a default.
                    // inputText.style.direction = 'auto'; // Or keep as is from CSS
                }
            } else {
                // This case is already handled by the initial check for text.length === 0
                // inputText.style.direction = 'rtl'; // Default for empty input area
            }
        });
    } else {
        console.error('Input or output element not found!');
    }

    // Font size controls
    const increaseFontBtn = document.getElementById('increaseFontBtn');
    const decreaseFontBtn = document.getElementById('decreaseFontBtn');
    let currentFontSize = 18; // Initial font size, matching CSS

    if (outputText && increaseFontBtn && decreaseFontBtn) {
        const updateFontSize = () => {
            outputText.style.fontSize = `${currentFontSize}px`;
        };

        increaseFontBtn.addEventListener('click', () => {
            currentFontSize += 2;
            updateFontSize();
        });

        decreaseFontBtn.addEventListener('click', () => {
            if (currentFontSize > 8) { // Set a minimum font size
                currentFontSize -= 2;
                updateFontSize();
            }
        });

        // Initialize font size
        updateFontSize();
    } else {
        console.error('Font control buttons or outputText element not found!');
    }
});
