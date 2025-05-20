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

            // Regex to split by spaces and newlines, keeping the delimiters
            const segments = text.split(/(\s+)/); 

            segments.forEach(segment => {
                if (segment.length === 0) return;

                // Check if it's a whitespace segment
                if (segment.match(/^\s+$/)) {
                    outputText.appendChild(document.createTextNode(segment));
                    return;
                }

                const span = document.createElement('span');
                span.innerText = segment;
                
                // Check for Arabic characters in the segment
                let containsArabic = false;
                for (let i = 0; i < segment.length; i++) {
                    const charCode = segment.charCodeAt(i);
                    if ((charCode >= 0x0600 && charCode <= 0x06FF) ||
                        (charCode >= 0x0750 && charCode <= 0x077F) ||
                        (charCode >= 0x08A0 && charCode <= 0x08FF) ||
                        (charCode >= 0xFB50 && charCode <= 0xFDFF) ||
                        (charCode >= 0xFE70 && charCode <= 0xFEFF)) {
                        containsArabic = true;
                        break;
                    }
                }
                
                if (containsArabic) {
                    span.dir = 'rtl';
                } else {
                    span.dir = 'ltr';
                }
                outputText.appendChild(span);
            });

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
});
