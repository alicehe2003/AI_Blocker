// Mapping of the words that deserve to be censored. 
const yuckyWords = {
    'AI' : 'AlmostIntelligent🤪',
    'ML' : 'MostlyLucky🍀',
    'Artificial Intelligence' : 'A☠️tificial Inte🤮ligence',
    'Machine Learning' : 'Machi🤖e L🦙earnin',
    'LLM' : 'LargeLemonMuffin🧁'
};

// Flag to prevent infinite loops during text replacement
let isReplacing = false;

// Wait for DOM to be ready before starting
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
    initializeExtension();
}

function initializeExtension() {
    // Start word replacement 
    replaceWords(); 
    observeChanges();
} 

// Replace words in text content
function replaceWordsInText(text) {
    // Split text into words while preserving separators 
    const words = text.split(/(\s+|[^\w\s]+)/); 

    for (let i = 0; i < words.length; i++) {
        const word = words[i]; 

        for (const [original, replacement] of Object.entries(yuckyWords)) {
            if (word.toLowerCase() === original.toLowerCase()) {
                words[i] = replacement; 
                break; 
            } 
        }
    }
    
    return words.join(''); 
}

// Replace words in all text nodes 
function replaceWords() {
    const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip script and style elements 
                if (node.parentElement.tagName === 'SCRIPT' ||
                    node.parentElement.tagName === 'STYLE' ||
                    node.parentElement.tagName === 'NOSCRIPT') {
                    return NodeFilter.FILTER_REJECT; 
                }
                return NodeFilter.FILTER_ACCEPT; 
            }
        },
        false
    ); 

    const textNodes = []; 
    let node; 

    // Collect all text nodes first 
    while (node = walker.nextNode()) {
        textNodes.push(node); 
    }

    // Replace text in collected nodes 
    textNodes.forEach(textNode => {
        const originalText = textNode.textContent; 
        const replacedText = replaceWordsInText(originalText); 
        if (originalText !== replacedText) {
            textNode.textContent = replacedText; 
        }
    }); 
}

// Observe DOM changes and replace words in new content 
function observeChanges() {
  const observer = new MutationObserver((mutations) => {
    // Prevent infinite loops
    if (isReplacing) return;
    
    isReplacing = true;
    
    mutations.forEach((mutation) => {
      // Handle added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Replace text in the new text node
          const originalText = node.textContent;
          const replacedText = replaceWordsInText(originalText);
          if (originalText !== replacedText) {
            node.textContent = replacedText;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Replace text in all text nodes within the new element
          const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: function(textNode) {
                if (textNode.parentElement.tagName === 'SCRIPT' || 
                    textNode.parentElement.tagName === 'STYLE' ||
                    textNode.parentElement.tagName === 'NOSCRIPT') {
                  return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
              }
            },
            false
          );
          
          const textNodes = [];
          let textNode;
          while (textNode = walker.nextNode()) {
            textNodes.push(textNode);
          }
          
          textNodes.forEach(textNode => {
            const originalText = textNode.textContent;
            const replacedText = replaceWordsInText(originalText);
            if (originalText !== replacedText) {
              textNode.textContent = replacedText;
            }
          });
        }
      });
    });
    
    // Reset the flag after a brief delay to allow for DOM settling
    setTimeout(() => {
      isReplacing = false;
    }, 10);
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
