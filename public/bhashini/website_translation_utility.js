var currentScript = document.currentScript;
// var TRANSLATION_PLUGIN_API_KEY = currentScript.getAttribute('secretKey');
// var posX = currentScript.getAttribute("data-pos-x") || 100;
// var posY = currentScript.getAttribute("data-pos-y") || 5;
var defaultTranslatedLanguage = currentScript.getAttribute(
  "default-translated-language"
);
var languageListAttribute = currentScript.getAttribute(
  "translation-language-list"
);

var initialPreferredLanguage = currentScript.getAttribute("initial_preferred_language")

/**
* --------------------------------------------------------------------------
* Language Ordering Configuration
*
* This section reads the `language_order` attribute from the <script> tag
* used to include the plugin on the host website.
*
* Example usage in HTML or React:
*   <script src="./translation_with_feedback_url.js" language_order="en,hi,ta"></script>
*
* The attribute `language_order` defines the preferred display order of languages
* in the language dropdown menu. If not provided, languages will appear in their
* default order.
*
* The value should be a comma-separated list of language codes:
*   e.g., "en,hi,mr" → English, Hindi, Marathi shown at the top.
*
* Logic:
*   - `orderLanguageArr` stores the ordered list of language codes.
*   - The `getOrderedLanguages()` function (later in this file) reorders
*     the global `supportedTargetLangArr` accordingly.
*
* Dependencies:
*   - Uses `supportedTargetLangArr` to reorder UI display.
*   - Applied before rendering dropdown in `fetchTranslationSupportedLanguages()`.
* --------------------------------------------------------------------------
*/
// ------------------------------------------------------------------------------------------------------------------
var orderLanguageAttribute = currentScript.getAttribute("language_order");
var orderLanguageArr = [];
if (orderLanguageAttribute) {
  orderLanguageArr = orderLanguageAttribute.split(",").map(lang => lang.trim());
}
// ------------------------------------------------------------------------------------------------------------------
// Resolve base URL robustly even when the script src is relative (e.g., "/bhashini/...")
// or when currentScript is unavailable under certain loaders.
var __scriptSrc = (currentScript && currentScript.getAttribute && currentScript.getAttribute("src")) || "";
var TRANSLATION_PLUGIN_API_BASE_URL;
try {
  // If relative, resolve against window.location.origin
  TRANSLATION_PLUGIN_API_BASE_URL = new URL(__scriptSrc, window.location.origin).origin;
} catch (e) {
  TRANSLATION_PLUGIN_API_BASE_URL = window.location.origin;
}
// IMPORTANT: Use the official API host for translation/feedback endpoints.
// Local origin does not host these APIs and returns HTML (causing JSON parse errors).
TRANSLATION_PLUGIN_API_BASE_URL = "https://translation-plugin.bhashini.co.in";
var languageIconColor =
  currentScript.getAttribute("language-icon-color") || "#1D0A69";

// var TRANSLATION_PLUGIN_API_BASE_URL = "https://translation-plugin.bhashini.co.in/"
var mixedCode = currentScript.getAttribute("mixed-code") || false;
var languageDetection = currentScript.getAttribute("language-detection") || false;
var pageSourceLanguage = currentScript.getAttribute("page-source-language") || "en"
// Local asset path prefix for icons/css when self-hosted
var __assetPrefix = (currentScript && currentScript.getAttribute && currentScript.getAttribute("asset-path-prefix")) || "/bhashini";
var supportedTargetLangArr = [
  { code: "en", label: "English" },
  { code: "as", label: "Assamese (অসমীয়া)" },
  { code: "bn", label: "Bengali (বাংলা)" },
  { code: "brx", label: "Bodo (बड़ो)" },
  { code: "doi", label: "Dogri (डोगरी)" },
  { code: "gom", label: "Goan Konkani (गोवा कोंकणी)" },
  { code: "gu", label: "Gujarati (ગુજરાતી)" },
  { code: "hi", label: "Hindi (हिन्दी)" },
  { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
  { code: "ks", label: "Kashmiri (कश्मीरी)" },
  { code: "mai", label: "Maithili (मैथिली)" },
  { code: "ml", label: "Malayalam (മലയാളം)" },
  { code: "mni", label: "Manipuri (মণিপুরী)" },
  { code: "mr", label: "Marathi (मराठी)" },
  { code: "ne", label: "Nepali (नेपाली)" },
  { code: "or", label: "Odia (ଓଡ଼ିଆ)" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "sa", label: "Sanskrit (संस्कृत)" },
  { code: "sat", label: "Santali (संताली)" },
  { code: "sd", label: "Sindhi (سنڌي)" },
  { code: "ta", label: "Tamil (தமிழ்)" },
  { code: "te", label: "Telugu (తెలుగు)" },
  { code: "ur", label: "Urdu (اردو)" },
];

/**
 * --------------------------------------------------------------------------
 * Function: getOrderedLanguages(languageArray)
 *
 * Description:
 * Reorders the provided array of language objects (`languageArray`) based on
 * a preferred language code sequence defined in the global variable `orderLanguageArr`.
 *
 * This function ensures that preferred languages appear first in the dropdown,
 * while maintaining the order of all remaining languages afterward.
 *
 * Input:
 * - languageArray: Array of language objects with shape { code: string, label: string }
 *   Example:
 *     [
 *       { code: "hi", label: "Hindi" },
 *       { code: "en", label: "English" },
 *       ...
 *     ]
 *
 * Global Dependency:
 * - orderLanguageArr (e.g., ['en', 'hi', 'ta']) which is populated from the
 *   <script order_language="en,hi,ta"> tag attribute earlier in the script.
 *
 * Logic:
 * - Step 1: Create a shallow copy of the input array (`remainingLanguages`).
 * - Step 2: Loop through each code in `orderLanguageArr`:
 *     → If found in `remainingLanguages`, move it to `orderedLanguages`.
 *     → Remove it from `remainingLanguages` to prevent duplication.
 * - Step 3: Append the rest of the `remainingLanguages` to `orderedLanguages`.
 * - Step 4: Return the reordered array.
 *
 * Usage:
 * - Applied to `supportedTargetLangArr` before rendering the UI dropdown.
 *
 * Returns:
 * - A reordered array of languages.
 * --------------------------------------------------------------------------
 */
function getOrderedLanguages(languageArray) {
  if (orderLanguageArr.length === 0) {
    return languageArray;
  }

  const orderedLanguages = [];
  const remainingLanguages = [...languageArray];

  // First, add languages in the specified order
  orderLanguageArr.forEach(code => {
    const foundIndex = remainingLanguages.findIndex(lang => lang.code === code);
    if (foundIndex !== -1) {
      orderedLanguages.push(remainingLanguages[foundIndex]);
      remainingLanguages.splice(foundIndex, 1);
    }
  });

  // Then add remaining languages
  orderedLanguages.push(...remainingLanguages);

  return orderedLanguages;
}

supportedTargetLangArr = getOrderedLanguages(supportedTargetLangArr);
// ------------------------------------------------------------------------------------------------------------------

var CHUNK_SIZE = 25;

// Define translationCache object to store original text
var translationCache = {};

// Flag to track whether content has been translated initially
var isContentTranslated = false;

// Selected target language for translation
var selectedTargetLanguageCode =
  localStorage.getItem("preferredLanguage") || initialPreferredLanguage

// Retrieve translationCache from session storage if available
if (sessionStorage.getItem("translationCache")) {
  translationCache = JSON.parse(sessionStorage.getItem("translationCache"));
}

var cssLink = document.createElement("link");
cssLink.rel = "stylesheet";
// Point to self-hosted CSS to avoid 404s in local integration
cssLink.href = `${__assetPrefix}/website_translation_utility.css`;
// cssLink.href = `./plugin.css`;

// Append link to the head
document.head.appendChild(cssLink);

var selectedRating = 0;

var getPoweredByText = (lang) => {
  switch (lang) {
    case "kn":
      return "ಮೂಲಕ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ";
    case "te":
      return "ఆధారితం";
    default:
      return "Powered by";
  }
};

function toggleDropdown() {
  var dropdown = document.getElementById("bhashiniLanguageDropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";

  // Get measurements after showing the dropdown
  var dropdownHeight = dropdown.clientHeight;
  var dropdownWidth = dropdown.clientWidth;
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var dropdownRect = dropdown.getBoundingClientRect();

  // Handle vertical positioning
  var spaceBelow = windowHeight - dropdownRect.top;
  var spaceAbove = dropdownRect.top;

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdown.style.bottom = "100%";
    dropdown.style.top = "auto";
  } else {
    dropdown.style.top = "100%";
    dropdown.style.bottom = "auto";
  }

  // Handle horizontal positioning - check both left and right space
  var spaceRight = windowWidth - dropdownRect.left;
  var spaceLeft = dropdownRect.right;

  if (spaceRight < dropdownWidth && spaceLeft > spaceRight) {
    // Not enough space on right, and left has more space
    dropdown.style.right = "0";
    dropdown.style.left = "auto";
  } else {
    // Enough space on right, or right has more space than left
    dropdown.style.left = "0";
    dropdown.style.right = "auto";
  }

}

// Fetch supported translation languages
function fetchTranslationSupportedLanguages() {

  // false check commenting to test
  // if (window.__bhashiniLanguagesRendered) return;
  // window.__bhashiniLanguagesRendered = true;

  var targetLangSelectElement = document.getElementById(
    "bhashiniLanguageDropdown"
  );
  var brandingDiv = document.createElement("div");
  brandingDiv.setAttribute("class", "bhashini-branding");
  var poweredBy = document.createElement("span");
  poweredBy.textContent = getPoweredByText(selectedTargetLanguageCode);
  var bhashiniLogo = document.createElement("img");
  // Prefer local SVG to avoid initial 404s; fallback to CDN PNG
  bhashiniLogo.src = `${__assetPrefix}/bhashini-logo.svg`;
  bhashiniLogo.onerror = function () {
    this.onerror = null;
    this.src = `${TRANSLATION_PLUGIN_API_BASE_URL}/v3/bhashini-logo.png`;
  };
  bhashiniLogo.alt = "Bhashini Logo";

  // feedback button
  // if (selectedTargetLanguageCode !== "en") {
  var feedbackDiv = document.createElement("div");
  feedbackDiv.setAttribute("class", "bhashini-feedback-div");
  feedbackDiv.setAttribute("title", "Feedback");
  // feedbackButton.innerHTML = `<img src=${TRANSLATION_PLUGIN_API_BASE_URL}/v2/feedback.svg alt="feedback">`;
  var feedbackButton = document.createElement("button");
  feedbackButton.setAttribute("class", "bhashini-feedback-button ");
  feedbackButton.setAttribute("title", "Feedback");
  feedbackButton.addEventListener("click", function () {
    var feedbackModal = document.querySelector(".bhashini-feedback-modal");
    feedbackModal.style.display = "block";

    // document.getElementById("current-page-url").textContent =
    // window.location.href; // This single line updates the URL

  });
  feedbackButton.innerHTML = `<img src=${__assetPrefix}/feedback.svg alt="feedback" onerror="this.onerror=null;this.src='${TRANSLATION_PLUGIN_API_BASE_URL}/v3/feedback.svg'">`;
  // feedbackButton.innerHTML = `<img src= feedback.svg alt="feedback">`;
  feedbackDiv.appendChild(feedbackButton);
  brandingDiv.appendChild(feedbackDiv);

  // }

  brandingDiv.appendChild(poweredBy);
  brandingDiv.appendChild(bhashiniLogo);

  /**
 * --------------------------------------------------------------------------
 * Language Display Filter and Ordering Logic
 *
 * Description:
 * Determines the final list of languages (`languagesToShow`) to be displayed
 * in the translation dropdown. This process respects both the `order_language`
 * and `translation-language-list` attributes set in the <script> tag.
 *
 * Workflow:
 * 1. By default, `languagesToShow` is initialized with the full list:
 *      → `supportedTargetLangArr` (which may already be reordered).
 *
 * 2. If `translation-language-list` attribute is provided in the script tag:
 *      → The list is filtered to include only the specified languages.
 *      → e.g., <script translation-language-list="en,hi,ta">
 *
 * 3. For each language in the filtered or full list:
 *      → Create a clickable div element with accessibility roles and data attributes.
 *      → Set the first item as `selected` (default language).
 *      → Append all language options to the dropdown container.
 *
 * 4. Accessibility Support:
 *      → Adds keyboard support for language selection via `Enter` key.
 *
 * Example:
 * <script
 *   src="translation_with_feedback_url.js"
 *   order_language="en,hi,ta"
 *   translation-language-list="en,hi,ta,bn,ml"
 * ></script>
 *
 * This will:
 *   - Filter dropdown to only English, Hindi, Tamil, Bengali, Malayalam.
 *   - Reorder those so English, Hindi, Tamil appear first.
 *
 * Dependencies:
 *   - `supportedTargetLangArr` (may already be reordered).
 *   - `languageListAttribute` (optional, filters final list).
 * --------------------------------------------------------------------------
 */
  let languagesToShow = supportedTargetLangArr;

  // Step 1: Filter languages if `translation-language-list` attribute is present
  if (languageListAttribute) {
    const languageList = languageListAttribute.split(",").map(lang => lang.trim());
    languagesToShow = supportedTargetLangArr.filter(lang =>
      languageList.includes(lang.code)
    );
  }

  // Step 2: Render dropdown options (once, cleanly)
  targetLangSelectElement.innerHTML = ""; // clear before rendering
  languagesToShow.forEach((element, index) => {
    const option_element = document.createElement("div");
    option_element.setAttribute("class", "dont-translate language-option");
    option_element.setAttribute("data-value", element.code);
    option_element.setAttribute("tabindex", "0");
    option_element.setAttribute("role", "button");
    option_element.textContent = element.label;

    if (index === 0) {
      option_element.setAttribute("selected", "selected");
    }
    targetLangSelectElement.appendChild(option_element);

  });

  // console.log("targetLangSelectElement: ", targetLangSelectElement);

  // Step 3: Accessibility – keyboard support
  targetLangSelectElement.addEventListener("keydown", function (event) {
    const languageOption = event.target.closest(".language-option");
    if (languageOption && event.key === "Enter") {
      event.preventDefault();
      selectLanguage(languageOption.textContent);
    }
  });

  // ------------------------------------------------------------------------------------------------------------------
  targetLangSelectElement.appendChild(brandingDiv);

  // Add single event listener to parent container using event delegation
  // targetLangSelectElement.addEventListener("click", function (event) {
  //   var languageOption = event.target.closest(".language-option");
  //   if (languageOption) {
  //     selectLanguage(languageOption.textContent);
  //   }
  // });
  // Accessibility
  targetLangSelectElement.addEventListener("keydown", function (event) {
    const languageOption = event.target.closest(".language-option");
    if (languageOption && event.key === "Enter") {
      event.preventDefault();
      selectLanguage(languageOption.textContent);
    }
  }, { once: true });

  targetLangSelectElement.addEventListener("click", function (event) {
    const languageOption = event.target.closest(".language-option");
    if (languageOption) {
      selectLanguage(languageOption.textContent);
    }
  }, { once: true });
}

// Function to split an array into chunks of a specific size
function chunkArray(array, size) {
  var chunkedArray = [];
  for (var i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }
  return chunkedArray;
}

// Function to get all input and textArea element with placeholders

// Function to translate text chunks using custom API
async function translateTextChunks(chunks, target_lang) {


  if (pageSourceLanguage && pageSourceLanguage === target_lang) {
    // If the target language is the same as the page source language, return the original chunks
    return chunks.map((chunk) => ({ source: chunk, target: chunk }));
  }


  var payload = {
    // sourceLanguage: pageSourceLanguage,
    targetLanguage: target_lang,
    textData: chunks,
  };

  if (mixedCode === "true") {
    payload.mixed_code = true;
  }
  if (languageDetection === "true") {
    payload.languageDetection = true;
  }
  else {
    payload.sourceLanguage = pageSourceLanguage || "en";
  }


  try {
    var response = await fetch(
      `${TRANSLATION_PLUGIN_API_BASE_URL}/v2/translate-text`,
      {
        method: "POST",
        headers: {
          // 'auth-token': TRANSLATION_PLUGIN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    var data = await response.json();
    return data;
  } catch (error) {
    console.error("Error translating text:", error);
    return [];
  }
}

// Function to recursively traverse DOM tree and get text nodes while skipping elements with "dont-translate" class
// function getTextNodesToTranslate(rootNode) {
//   var translatableContent = [];

//   function isSkippableElement(node) {
//     return (
//       node.nodeType === Node.ELEMENT_NODE &&
//       (node.classList.contains("dont-translate") ||
//         node.classList.contains("bhashini-skip-translation") ||
//         node.tagName === "SCRIPT" ||
//         node.tagName === "STYLE" ||
//         node.tagName === "NOSCRIPT")
//     );
//   }




//   function traverseNode(node) {
//     // Skip the entire subtree if this is a skippable element
//     if (isSkippableElement(node)) {
//       return;
//     }

//     // Process this node
//     if (node.nodeType === Node.TEXT_NODE) {
//       var text = node.textContent;
//       var isNumeric = /^[\d.]+$/.test(text);
//       if (text && !isIgnoredNode(node) && !isNumeric) {
//         translatableContent.push({
//           type: "text",
//           node: node,
//           content: text,
//         });
//       }
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       if (node.hasAttribute("placeholder")) {
//         translatableContent.push({
//           type: "placeholder",
//           node: node,
//           content: node.getAttribute("placeholder"),
//         });
//       }
//       if (node.hasAttribute("title")) {
//         translatableContent.push({
//           type: "title",
//           node: node,
//           content: node.getAttribute("title"),
//         });
//       }

//       // Process all child nodes
//       for (let i = 0; i < node.childNodes.length; i++) {
//         traverseNode(node.childNodes[i]);
//       }
//     }
//   }

//   traverseNode(rootNode);
//   return translatableContent;
// }

// Function to recursively traverse DOM tree and get text nodes while skipping elements with "dont-translate" class
function getTextNodesToTranslate(rootNode) {
  const translatableContent = [];

  function isSkippableElement(node) {
    return (
      node.nodeType === Node.ELEMENT_NODE &&
      (node.classList.contains("dont-translate") ||
        node.classList.contains("bhashini-skip-translation") ||
        node.tagName === "SCRIPT" ||
        node.tagName === "STYLE" ||
        node.tagName === "NOSCRIPT")
    );
  }

  function isNodeOrAncestorsSkippable(node, maxLevels = 5) {
    let currentNode = node;
    let level = 0;

    while (currentNode && level < maxLevels) {
      if (isSkippableElement(currentNode)) {
        return true;
      }
      currentNode = currentNode.parentElement;
      level++;
    }

    return false;
  }

  function traverseNode(node) {
    // Handle the case when node is an array or object with node property
    if (Array.isArray(node)) {
      // Process each node in the array
      node.forEach(item => {
        // Check if it's an object with a node property (from nodesToTranslate structure)
        if (item && typeof item === 'object' && item.node) {
          traverseNode(item.node);
        } else {
          traverseNode(item);
        }
      });
      return;
    }

    // Check for valid DOM node
    if (!node || !node.nodeType) {
      console.log(`Invalid node received: ${node}`);
      return;
    }


    // Skip the entire subtree if this node or any of its ancestors are skippable
    if (isNodeOrAncestorsSkippable(node)) {
      return;
    }

    // Process this node
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const isNumeric = /^[\d.]+$/.test(text);
      if (text && !isIgnoredNode(node) && !isNumeric) {
        translatableContent.push({
          type: "text",
          node: node,
          content: text,
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.hasAttribute("placeholder")) {
        translatableContent.push({
          type: "placeholder",
          node: node,
          content: node.getAttribute("placeholder"),
        });
      }
      if (node.hasAttribute("title")) {
        translatableContent.push({
          type: "title",
          node: node,
          content: node.getAttribute("title"),
        });
      }

      // Process all child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseNode(node.childNodes[i]);
      }
    }
  }

  console.log("Starting traversal of root node:", rootNode);
  traverseNode(rootNode);
  return translatableContent;
}
function isIgnoredNode(node) {
  var emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
  var isValidGovtEmail = (email) => {
    var normalizedEmail = email
      .replace(/\[dot]/g, '.')
      .replace(/\[at]/g, '@');
    return emailRegex.test(normalizedEmail);
  }
  var nonEnglishRegex = /^[^A-Za-z0-9]+$/;
  var onlyNewLinesOrWhiteSpaceRegex = /^[\n\s\r\t]*$/;
  return (
    node.parentNode &&
    (node.parentNode.tagName === "STYLE" ||
      node.parentNode.tagName === "SCRIPT" ||
      node.parentNode.tagName === "NOSCRIPT" ||
      node.parentNode.classList.contains("dont-translate") ||
      node.parentNode.classList.contains("bhashini-skip-translation") ||
      emailRegex.test(node.textContent) || isValidGovtEmail(node.textContent) ||
      (((languageDetection !== "true") && pageSourceLanguage === "en") && nonEnglishRegex.test(node.textContent))) ||
    onlyNewLinesOrWhiteSpaceRegex.test(node.textContent)
  );
}





function selectLanguage(language) {
  // document.querySelector(".bhashini-dropdown-btn-text").textContent = language;
  document.getElementById("bhashiniLanguageDropdown").classList.remove("show");
  var selectedLang = supportedTargetLangArr.find(
    (lang) => lang.label === language
  );
  if (selectedLang) {
    onDropdownChange({ target: { value: selectedLang.code } });
  }
}

window.onclick = function (event) {
  if (!event.target.matches(".bhashini-dropdown-btn")) {
    var dropdowns = document.getElementsByClassName(
      "bhashini-dropdown-content"
    );
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

var handleCloseFeedbackModal = () => {
  var feedbackModal = document.querySelector(".bhashini-feedback-modal");
  feedbackModal.style.display = "none";
  var feedbackTextArea = document.querySelector(".feedback-textarea");
  feedbackTextArea.style.display = "none";
  selectedRating = 0;
  document.querySelectorAll(".star").forEach((star) => {
    star.classList.remove("selected");
  });
  var suggestedResponseCheckbox = document.getElementById(
    "suggested-feedback-checkbox"
  );
  suggestedResponseCheckbox.checked = false;
  var suggestedFeedbackContainer = document.querySelector(
    ".suggested-feedback-container"
  );
  suggestedFeedbackContainer.style.display = "none";
};

var handleFeedbackSubmission = async (rating, feedback, suggestedResponse) => {
  if (!rating) {
    showToast("Please provide rating");
    return;
  }
  if (rating <= 3 && !feedback) {
    showToast("Please describe your issue");
    return;
  }

  var suggestedResponseCheckbox = document.getElementById(
    "suggested-feedback-checkbox"
  );
  if (suggestedResponseCheckbox.checked && !suggestedResponse) {
    showToast("Please provide suggested response");
    return;
  }

  var submitButton = document.querySelector(".submit-feedback");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  var payload = {
    feedbackTimeStamp: Math.floor(new Date().getTime() / 1000),
    feedbackLanguage: "en",
    pipelineInput: {
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: {
              sourceLanguage: "en",
              targetLanguage: selectLanguage,
            },
            serviceId: "ai4bharat/indictrans-v2-all-gpu--t4",
          },
        },
      ],
      inputData: {
        input: [
          {
            source: "",
          },
        ],
        audio: [],
      },
    },
    pipelineOutput: {
      pipelineResponse: [
        {
          taskType: "translation",
          config: null,
          output: [
            {
              source: "",
              target: "",
            },
          ],
          audio: null,
        },
      ],
    },
    pipelineFeedback: {
      commonFeedback: [
        {
          question: "Are you satisfied with the pipeline response",
          feedbackType: "rating",
          rating: rating,
        },
        {
          question: "Describe your issue",
          feedbackType: "comment",
          comment: feedback,
        },
        {
          question: "Suggested Response",
          feedbackType: "comment",
          comment: suggestedResponse,
        },
      ],
    }
  };
  try {
    var res = await fetch(`${TRANSLATION_PLUGIN_API_BASE_URL}/v1/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    var data = await res.json();
    console.log(data);
    showToast("Feedback Submitted Successfully");
    submitButton.textContent = "Submit";
    submitButton.disabled = false;
    handleCloseFeedbackModal();
  } catch (err) {
    console.log(err);
    showToast("Error submitting feedback. Please try again later");
  }
};

var showFeedbackdiv = () => {
  var feedbackdiv = document.querySelector(".bhashini-feedback-div");
  feedbackdiv.style.visibility = "visible";
};

var hideFeedbackdiv = () => {
  var feedbackdiv = document.querySelector(".bhashini-feedback-div");
  feedbackdiv.style.visibility = "hidden";
};

var pluginContainer = document.querySelector(".bhashini-plugin-container");

// feedback button

// Create translation popup elements
var wrapperButton = document.createElement("div");
wrapperButton.setAttribute(
  "class",
  "dont-translate bhashini-skip-translation bhashini-dropdown"
);
wrapperButton.setAttribute("id", "bhashini-translation");
wrapperButton.setAttribute("title", "Translate this page!");
// wrapperButton.innerHTML = `<select class="translate-plugin-dropdown" id="translate-plugin-target-language-list"></select><img src=${TRANSLATION_PLUGIN_API_BASE_URL}/bhashini_logo.png alt="toggle translation popup">`;
wrapperButton.innerHTML = `
        <button class="bhashini-dropdown-btn">
          <div class="bhashini-dropdown-btn-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.125 3.735V12H12.91V3.735H11.815V2.67H15.685V3.735H14.125ZM8.47 2.52C9.25 2.52 9.845 2.715 10.255 3.105C10.675 3.495 10.885 3.985 10.885 4.575C10.885 5.005 10.77 5.395 10.54 5.745C10.32 6.085 9.99 6.355 9.55 6.555C9.11 6.755 8.56 6.865 7.9 6.885L7.825 5.835C8.505 5.815 8.985 5.695 9.265 5.475C9.555 5.255 9.7 4.96 9.7 4.59C9.7 4.23 9.58 3.97 9.34 3.81C9.11 3.65 8.84 3.57 8.53 3.57C8.16 3.57 7.825 3.62 7.525 3.72C7.225 3.82 6.905 3.955 6.565 4.125L6.19 3.09C6.45 2.95 6.77 2.82 7.15 2.7C7.54 2.58 7.98 2.52 8.47 2.52ZM11.05 8.73C11.05 9.19 10.945 9.575 10.735 9.885C10.525 10.195 10.24 10.425 9.88 10.575C9.53 10.725 9.13 10.8 8.68 10.8C8.11 10.8 7.58 10.66 7.09 10.38C6.61 10.1 6.15 9.655 5.71 9.045C5.28 8.435 4.855 7.64 4.435 6.66L5.5 6.27C5.79 6.98 6.09 7.595 6.4 8.115C6.72 8.625 7.06 9.02 7.42 9.3C7.78 9.57 8.165 9.705 8.575 9.705C8.955 9.705 9.265 9.62 9.505 9.45C9.745 9.27 9.865 8.985 9.865 8.595C9.865 8.115 9.7 7.7 9.37 7.35C9.04 7 8.64 6.68 8.17 6.39L9.055 6.345L9.7 6.21C9.84 6.33 9.995 6.475 10.165 6.645C10.335 6.815 10.47 6.985 10.57 7.155L10.645 7.44C10.775 7.63 10.875 7.83 10.945 8.04C11.015 8.25 11.05 8.48 11.05 8.73ZM11.29 6.75C11.77 6.75 12.185 6.715 12.535 6.645C12.885 6.565 13.295 6.44 13.765 6.27V7.35C13.335 7.54 12.945 7.665 12.595 7.725C12.255 7.785 11.88 7.815 11.47 7.815C11.32 7.815 11.145 7.805 10.945 7.785C10.745 7.755 10.555 7.725 10.375 7.695C10.205 7.655 10.08 7.62 10 7.59L9.295 6.75L9.385 6.525C9.675 6.595 9.98 6.65 10.3 6.69C10.62 6.73 10.95 6.75 11.29 6.75Z" fill=${languageIconColor}></path><path d="M19.63 22L18.426 18.906H14.464L13.274 22H12L15.906 11.962H17.04L20.932 22H19.63ZM18.048 17.786L16.928 14.762C16.9 14.6873 16.8533 14.552 16.788 14.356C16.7227 14.16 16.6573 13.9593 16.592 13.754C16.536 13.5393 16.4893 13.376 16.452 13.264C16.3773 13.5533 16.298 13.838 16.214 14.118C16.1393 14.3887 16.074 14.6033 16.018 14.762L14.884 17.786H18.048Z" fill="${languageIconColor}"></path></svg>
          </div>
        </button>
        <div class="bhashini-dropdown-content" id="bhashiniLanguageDropdown">
        </div>
    `;
pluginContainer.appendChild(wrapperButton);

var modal = document.createElement("div");
modal.setAttribute("class", "bhashini-feedback-modal");
modal.innerHTML = `
  <div class="bhashini-feedback-content">
    <div class="close-modal-container">
        <span class="close-modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <mask id="mask0_10985_128804" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
    <rect width="16" height="16" fill="#D9D9D9"/>
  </mask>
  <g mask="url(#mask0_10985_128804)">
    <path d="M3.11214 13.8657L2.1875 12.9411L7.10099 8.02758L2.1875 3.11409L3.11214 2.18945L8.02562 7.10294L12.9391 2.18945L13.8637 3.11409L8.95026 8.02758L13.8637 12.9411L12.9391 13.8657L8.02562 8.95221L3.11214 13.8657Z" fill="#424242"/>
  </g>
</svg>
        </span>
    </div>
      <div
        class="bhashini-feedback-form"
      >
      <div class="bhashini-feedback-star-container">
      <h2
      class= "bhashini-feedback-heading"
      >Rate this translation</h2>
      <div class="star-rating">
         <span class="star" data-value="1">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
            <path d="M13.0925 1.83921C13.8757 0.262891 16.1243 0.262888 16.9075 1.83921L19.8162 7.69337C20.1263 8.31759 20.7223 8.75057 21.4118 8.85265L27.8783 9.80991C29.6194 10.0677 30.3143 12.2063 29.0572 13.4382L24.3884 18.0136C23.8905 18.5014 23.6629 19.202 23.7789 19.8893L24.8667 26.3351C25.1596 28.0707 23.3404 29.3925 21.7803 28.5775L15.9861 25.5511C15.3683 25.2284 14.6317 25.2284 14.0139 25.5511L8.21972 28.5775C6.65956 29.3925 4.84036 28.0707 5.13328 26.3351L6.22111 19.8893C6.3371 19.202 6.10947 18.5014 5.61164 18.0136L0.942831 13.4382C-0.314316 12.2063 0.380554 10.0677 2.12174 9.80991L8.58821 8.85265C9.27772 8.75057 9.87367 8.31759 10.1838 7.69337L13.0925 1.83921Z" />
          </svg>
        </span>
          <span class="star" data-value="2">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
            <path d="M13.0925 1.83921C13.8757 0.262891 16.1243 0.262888 16.9075 1.83921L19.8162 7.69337C20.1263 8.31759 20.7223 8.75057 21.4118 8.85265L27.8783 9.80991C29.6194 10.0677 30.3143 12.2063 29.0572 13.4382L24.3884 18.0136C23.8905 18.5014 23.6629 19.202 23.7789 19.8893L24.8667 26.3351C25.1596 28.0707 23.3404 29.3925 21.7803 28.5775L15.9861 25.5511C15.3683 25.2284 14.6317 25.2284 14.0139 25.5511L8.21972 28.5775C6.65956 29.3925 4.84036 28.0707 5.13328 26.3351L6.22111 19.8893C6.3371 19.202 6.10947 18.5014 5.61164 18.0136L0.942831 13.4382C-0.314316 12.2063 0.380554 10.0677 2.12174 9.80991L8.58821 8.85265C9.27772 8.75057 9.87367 8.31759 10.1838 7.69337L13.0925 1.83921Z" />
          </svg>
        </span>
         <span class="star" data-value="3">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
            <path d="M13.0925 1.83921C13.8757 0.262891 16.1243 0.262888 16.9075 1.83921L19.8162 7.69337C20.1263 8.31759 20.7223 8.75057 21.4118 8.85265L27.8783 9.80991C29.6194 10.0677 30.3143 12.2063 29.0572 13.4382L24.3884 18.0136C23.8905 18.5014 23.6629 19.202 23.7789 19.8893L24.8667 26.3351C25.1596 28.0707 23.3404 29.3925 21.7803 28.5775L15.9861 25.5511C15.3683 25.2284 14.6317 25.2284 14.0139 25.5511L8.21972 28.5775C6.65956 29.3925 4.84036 28.0707 5.13328 26.3351L6.22111 19.8893C6.3371 19.202 6.10947 18.5014 5.61164 18.0136L0.942831 13.4382C-0.314316 12.2063 0.380554 10.0677 2.12174 9.80991L8.58821 8.85265C9.27772 8.75057 9.87367 8.31759 10.1838 7.69337L13.0925 1.83921Z" />
          </svg>
        </span>
          <span class="star" data-value="4">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
            <path d="M13.0925 1.83921C13.8757 0.262891 16.1243 0.262888 16.9075 1.83921L19.8162 7.69337C20.1263 8.31759 20.7223 8.75057 21.4118 8.85265L27.8783 9.80991C29.6194 10.0677 30.3143 12.2063 29.0572 13.4382L24.3884 18.0136C23.8905 18.5014 23.6629 19.202 23.7789 19.8893L24.8667 26.3351C25.1596 28.0707 23.3404 29.3925 21.7803 28.5775L15.9861 25.5511C15.3683 25.2284 14.6317 25.2284 14.0139 25.5511L8.21972 28.5775C6.65956 29.3925 4.84036 28.0707 5.13328 26.3351L6.22111 19.8893C6.3371 19.202 6.10947 18.5014 5.61164 18.0136L0.942831 13.4382C-0.314316 12.2063 0.380554 10.0677 2.12174 9.80991L8.58821 8.85265C9.27772 8.75057 9.87367 8.31759 10.1838 7.69337L13.0925 1.83921Z" />
          </svg>
        </span>
          <span class="star" data-value="5">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
            <path d="M13.0925 1.83921C13.8757 0.262891 16.1243 0.262888 16.9075 1.83921L19.8162 7.69337C20.1263 8.31759 20.7223 8.75057 21.4118 8.85265L27.8783 9.80991C29.6194 10.0677 30.3143 12.2063 29.0572 13.4382L24.3884 18.0136C23.8905 18.5014 23.6629 19.202 23.7789 19.8893L24.8667 26.3351C25.1596 28.0707 23.3404 29.3925 21.7803 28.5775L15.9861 25.5511C15.3683 25.2284 14.6317 25.2284 14.0139 25.5511L8.21972 28.5775C6.65956 29.3925 4.84036 28.0707 5.13328 26.3351L6.22111 19.8893C6.3371 19.202 6.10947 18.5014 5.61164 18.0136L0.942831 13.4382C-0.314316 12.2063 0.380554 10.0677 2.12174 9.80991L8.58821 8.85265C9.27772 8.75057 9.87367 8.31759 10.1838 7.69337L13.0925 1.83921Z" />
          </svg>
        </span>
      </div>
        </div>

       <!-- <div style="margin-top: 1rem;">
          <p> 
            <strong> Page URL: </strong> 
            <span id="current-page-url" style="text-decoration: underline;"> </span> 
          </p>
        </div> -->


     
      <textarea
      style = "display: none;"
        class="feedback-textarea"
      placeholder="Describe your issues here..."></textarea>
        <div class="suggested-feedback-container"
            style="display: none;"
        >
        <input type="checkbox" id="suggested-feedback-checkbox">

      <label for= "suggested-feedback-checkbox">Do you like to give feedback</label>
       

     
    <!-- <div style="margin-top: 1rem;">
      <span class="feedback-disclaimer">
       <strong style=" margin-right: 0.25rem;">Disclaimer:</strong>Please report any issues related to BHASHINI translated content only.
      </span>
     </div> -->


       <textarea
      style = "display: none;"
        class="feedback-suggested-feedback"
      placeholder="Suggested Feedback"></textarea>
        </div>
      <button class="submit-feedback">Submit</button>
      </div>
  </div>
`;

document.body.appendChild(modal);
console.log(document.querySelector(".close-modal"), "close");

// Close modal on click of close button
document.querySelector(".close-modal").addEventListener("click", () => {
  handleCloseFeedbackModal();
});

// Close modal when clicking outside the modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
var stars = document.querySelectorAll(".star");
// Star Rating Selection
stars.forEach((star, index) => {
  star.addEventListener("mouseenter", function () {
    highlightStars(index, "hovered");
  });

  star.addEventListener("mouseleave", function () {
    removeHoverEffect();
  });

  star.addEventListener("click", function () {
    selectedRating = index + 1; // Store the selected rating
    highlightStars(index, "selected");
    var textArea = document.querySelector(".feedback-textarea");
    var suggestedFeedbackContainer = document.querySelector(
      ".suggested-feedback-container"
    );
    if (selectedRating < 4) {
      textArea.style.display = "block";
      suggestedFeedbackContainer.style.display = "block";
      var suggestedFeedbackCheckbox = document.getElementById(
        "suggested-feedback-checkbox"
      );
      suggestedFeedbackCheckbox.addEventListener("change", function () {
        var suggestedFeedback = document.querySelector(
          ".feedback-suggested-feedback"
        );
        if (this.checked) {
          suggestedFeedback.style.display = "block";
        } else {
          suggestedFeedback.style.display = "none";
        }
      });
    } else {
      textArea.style.display = "none";
      suggestedFeedbackContainer.style.display = "none";
    }
  });
});

function highlightStars(index, className) {
  stars.forEach((s, i) => {
    if (i <= index) {
      s.classList.add(className);
    } else {
      s.classList.remove(className);
    }
  });
}

function removeHoverEffect() {
  stars.forEach((s) => s.classList.remove("hovered"));
}
wrapperButton.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  toggleDropdown()

});

var submitFeedbackButton = document.querySelector(".submit-feedback");
submitFeedbackButton.addEventListener("click", () => {
  var feedbackText = document.querySelector(".feedback-textarea").value;
  var suggestedResponse = document.querySelector(
    ".feedback-suggested-feedback"
  ).value;
  handleFeedbackSubmission(selectedRating, feedbackText, suggestedResponse);
});

// Fetch supported translation languages
fetchTranslationSupportedLanguages();




async function translateElementText(element, target_lang) {
  var promises = [];
  var textNodes = getTextNodesToTranslate(element);
  if (textNodes.length > 0) {
    var textContentArray = textNodes.map((node, index) => {
      var id = `translation-${Date.now()}-${index}`;
      // Store original text in session storage
      if (node.parentNode) {
        node.parentNode.setAttribute("data-translation-id", id);
      }
      return { text: node.content, id, node };
    });
    var textChunks = chunkArray(textContentArray, CHUNK_SIZE);

    // Create an array to hold promises for each chunk translation
    var textNodePromises = textChunks.map(async (chunk) => {
      var texts = chunk.map(({ text }) => text);
      // if (target_lang === "en") {
      //         return;
      // }
      var translatedTexts = await translateTextChunks(texts, target_lang);
      chunk.forEach(({ node }, index) => {
        var translatedText = translatedTexts[index].target || texts[index];

        if (node.type === "text") {
          node.node.nodeValue = translatedText;
        }
        if (node.type === "value") {
          node.node.value = translatedText;
        }
        if (node.type === "placeholder") {
          node.node.placeholder = translatedText;
        }
        if (node.type === "title") {
          node.node.setAttribute("title", translatedText);
        }
      });
    });
    promises.push(textNodePromises);

    await Promise.all(promises);
  }
}
var nodesToTranslate = []; // Array to store nodes and their associated language codes
var debounceTimer = null;
var DEBOUNCE_DELAY = 250

function translateElementTextNodes(node, targetLangCode) {
  nodesToTranslate.push({ node, targetLangCode });

  // If we've reached 25 nodes, translate immediately.
  if (nodesToTranslate.length >= 25) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    translateElementText([...nodesToTranslate], targetLangCode);
    nodesToTranslate = [];
    return; // exit early to avoid setting a new timer below
  }

  // If no timer is currently active, set one for the first node.
  if (!debounceTimer) {
    debounceTimer = setTimeout(() => {
      translateElementText([...nodesToTranslate], targetLangCode);
      nodesToTranslate = [];
      debounceTimer = null;
    }, DEBOUNCE_DELAY);
  }
}

// Create a new MutationObserver
var observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.target.innerHTML) {
      // If a new element is added, replaced, or changed, translate its text nodes
      // var targetLang = document.getElementById("translate-plugin-target-language-list").value;
      if (selectedTargetLanguageCode) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            translateElementTextNodes(node, selectedTargetLanguageCode);
          }
        });
      }
    }
  });
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// check if isSelectedLangEnglish is present in sessionStorage
var isSelectedLang = sessionStorage.getItem("selectedLang");
if (isSelectedLang) {
  sessionStorage.removeItem("selectedLang");
  defaultTranslatedLanguage = null;
}

/**
 * Check if the defaultTranslatedLanguage is present and not equal to "en", then set the language to the defaultTranslatedLanguage
 * Otherwise, set the language to the preferred language stored in localStorage
 */


var languageToUse =
  defaultTranslatedLanguage && defaultTranslatedLanguage !== "en"
    ? defaultTranslatedLanguage
    : localStorage.getItem("preferredLanguage") || initialPreferredLanguage
if (languageToUse) {
  selectedTargetLanguageCode = languageToUse;
  // document.getElementById("translate-plugin-target-language-list").value =
  //   languageToUse;
  isContentTranslated = true;
  translateAllTextNodes(languageToUse);
}


// var languageToUse =
//   defaultTranslatedLanguage && defaultTranslatedLanguage !== "en"
//     ? defaultTranslatedLanguage
//     : localStorage.getItem("preferredLanguage");
// if (languageToUse) {
//   selectedTargetLanguageCode = languageToUse;
//   // document.getElementById("translate-plugin-target-language-list").value =
//   //   languageToUse;
//   isContentTranslated = true;
//   translateAllTextNodes(languageToUse);
// }

// Function to handle dropdown change
function onDropdownChange(event) {
  var selectedValue = event.target.value;
  isContentTranslated = true;
  sessionStorage.setItem("selectedLang", selectedValue);
  localStorage.setItem("preferredLanguage", selectedValue);
  // Perform translation for the selected language
  // translateAllTextNodes(selectedValue);
  window.location.reload();
}

// Function to show a toast messages
function showToast(message) {
  var toast = document.createElement("div");
  toast.className = "bhashini-toast";
  toast.textContent = message;
  toast.setAttribute("aria-label", message);
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("visible");
    toast.classList.add("bhashini-skip-translation");
  }, 100);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Function to restore translations from session storage
// function restoreTranslations() {
//   var textNodes = getTextNodesToTranslate(document.body);
//   textNodes.forEach((node) => {
//     var id = node.parentNode.getAttribute("data-translation-id");
//     if (id && translationCache[id]) {
//       node.nodeValue = translationCache[id];
//     }
//   });
//   fetchTranslationSupportedLanguages();
// }

// Function to translate all text nodes in the document
async function translateAllTextNodes(target_lang) {
  var promises = [];
  var textNodes = getTextNodesToTranslate(document.body);
  if (textNodes.length > 0) {
    var textContentArray = textNodes.map((node, index) => {
      var id = `translation-${Date.now()}-${index}`;
      // Store original text in session storage
      translationCache[id] = node.content;
      if (node.parentNode) {
        node.parentNode.setAttribute("data-translation-id", id);
      }
      return { text: node.content, id, node };
    });
    var textChunks = chunkArray(textContentArray, CHUNK_SIZE);

    // Create an array to hold promises for each chunk translation
    var textNodePromises = textChunks.map(async (chunk) => {
      var texts = chunk.map(({ text }) => text);
      // if (target_lang === "en") {
      //         return;
      // }
      var translatedTexts = await translateTextChunks(texts, target_lang);
      chunk.forEach(({ node }, index) => {
        var translatedText = translatedTexts[index].target || texts[index];

        if (node.type === "text") {
          node.node.nodeValue = translatedText;
        }
        if (node.type === "value") {
          node.node.value = translatedText;
        }
        if (node.type === "placeholder") {
          node.node.placeholder = translatedText;
        }
        if (node.type === "title") {
          node.node.setAttribute("title", translatedText);
        }
      });
    });
    promises.push(textNodePromises);

    // Wait for all translations to compvare

    await Promise.all(promises);

    // var targetLangSelectElement = document.getElementById(
    //   "translate-plugin-target-language-list"
    // );
    // Check if the targetLangSelectElement exists
    // if (targetLangSelectElement) {
    //   // Loop through each option element
    //   Array.from(targetLangSelectElement.options).forEach((option) => {
    //     // Check if the value is not "en", not equal to target_lang, and not an empty string
    //     if (option.value === target_lang) {
    //       // Keep the default selected option if it's the target language
    //       option.selected = true;
    //     }
    //   });
    // } else {
    //   console.error("Target language select element not found.");
    // }
    const preferredLanguage = localStorage.getItem("preferredLanguage");

    if (preferredLanguage === "as") {
      showToast(
        `এই পৃষ্ঠাটো ভাষিণীৰ এআই-চালিত মডেল ব্যৱহাৰ কৰি অনুবাদ কৰা হৈছে। উৎসৰ বিষয়বস্তু ইংৰাজীত আছে। অনুবাদ সম্পৰ্কীয় যিকোনো প্ৰশ্নৰ বাবে, অনুগ্ৰহ কৰি ceo-dibd@digitalindia.gov.inত যোগাযোগ কৰক।`
      );
    } else if (preferredLanguage === "bn") {
      showToast(
        `এই পৃষ্ঠাটি ভাষিণীর এআই-পরিচালিত মডেল ব্যবহার করে অনুবাদ করা হয়েছে। উৎস বিষয়বস্তু ইংরেজিতে রয়েছে। অনুবাদ সম্পর্কিত যে কোনও প্রশ্নের জন্য, দয়া করে যোগাযোগ করুন এখানে ceo-dibd@digitalindia.gov.in`
      );
    } else if (preferredLanguage === "brx") {
      showToast(
        `बे पेजखौ भासिनीनि ए.आइ.-पावार मडेलफोरखौ बाहायनानै राव दानस्लायनाय जादों। फुंखा आयदाफोरा इंराजियाव दं। राव दानस्लायनायजों सोमोन्दो थानाय जायखिजाया सोंनायनि थाखाय, अन्नानै ceo-dibd@digitalindia.gov.in आव सोमोन्दो खालाम।`
      );
    } else if (preferredLanguage === "doi") {
      showToast(
        `इस सफे दा अनुवाद भाशिनी दे एआई-संचालत माडलें दा इस्तेमाल करियै कीता गेदा ऐ। स्रोत समग्गरी अंग्रेज़ी च ऐ। अनुवादै कन्नै सरबंधत कुसै बी सोआलै आस्तै, कृपा करियै ceo-dibd@digitalindia.gov.in कन्नै राबता करो।`
      );
    } else if (preferredLanguage === "gu") {
      showToast(
        `આ પૃષ્ઠનું ભાષાંતર ભાષિણીના એ.આઈ. સંચાલિત મોડેલોનો ઉપયોગ કરીને કરવામાં આવ્યું છે. સ્રોત સામગ્રી અંગ્રેજીમાં છે. અનુવાદ સંબંધિત કોઈપણ પ્રશ્નો માટે, કૃપા કરીને ceo-dibd@digitalindia.gov.in નો સંપર્ક કરો.`
      );
    } else if (preferredLanguage === "hi") {
      showToast(
        `इस पृष्ठ का अनुवाद भाषिणी के ए. आई.-संचालित मॉडल का उपयोग करके किया गया है। स्रोत सामग्री अंग्रेजी में है। अनुवाद से संबंधित किसी भी प्रश्न के लिए, कृपया ceo-dibd@digitalindia.gov.in से संपर्क करें।`
      );
    } else if (preferredLanguage === "kn") {
      showToast(
        `ಈ ಪುಟವನ್ನು ಭಾಷಿಣಿಯ ಎಐ-ಚಾಲಿತ ಮಾದರಿಗಳನ್ನು ಬಳಸಿ ಅನುವಾದಿಸಲಾಗಿದೆ. ಮೂಲ ವಿಷಯವು ಇಂಗ್ಲಿಷ್ನಲ್ಲಿದೆ. ಯಾವುದೇ ಅನುವಾದ-ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ, ದಯವಿಟ್ಟು ceo-dibd@digitalindia.gov.in ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.`
      );
    } else if (preferredLanguage === "mai") {
      showToast(
        `एहि पृष्ठक अनुवाद भाषिणीक एआइ-सञ्चालित मॉडलक उपयोग करैत कयल गेल अछि। स्रोत सामग्री अङ्ग्रेजीमे अछि। अनुवादसँ सम्बन्धित कोनो प्रश्नक लेल कृपया ceo-dibd@digitalindia.gov.in सँ सम्पर्क करू।`
      );
    } else if (preferredLanguage === "ml") {
      showToast(
        `ഭാഷിണിയുടെ എഐ പവേഡ് മോഡലുകൾ ഉപയോഗിച്ചാണ് ഈ പേജ് വിവർത്തനം ചെയ്തിരിക്കുന്നത്. ഉറവിട ഉള്ളടക്കം ഇംഗ്ലീഷിലാണ്. വിവർത്തനവുമായി ബന്ധപ്പെട്ട എന്തെങ്കിലും ചോദ്യങ്ങൾക്ക് ദയവായി ceo-dibd@digitalindia.gov.in-മായി ബന്ധപ്പെടുക.`
      );
    } else if (preferredLanguage === "mr") {
      showToast(
        `हे पृष्ठ भाषिणीच्या ए. आय.-संचालित मॉडेल्सचा वापर करून अनुवादित केले गेले आहे. स्त्रोत मजकूर इंग्रजीत आहे. भाषांतराशी संबंधित कोणत्याही प्रश्नांसाठी, कृपया ceo-dibd@digitalindia.gov.in शी संपर्क साधा`
      );
    } else if (preferredLanguage === "ne") {
      showToast(
        `यो पृष्ठ भासिनीको एआई-संचालित मोडेलहरू प्रयोग गरेर अनुवाद गरिएको छ। स्रोत सामग्री अङ्ग्रेजीमा छ। कुनै पनि अनुवाद-सम्बन्धित प्रश्नहरूका लागि, कृपया ceo-dibd@digitalindia.gov.in मा सम्पर्क गर्नुहोस्।`
      );
    } else if (preferredLanguage === "or") {
      showToast(
        `ଏହି ପୃଷ୍ଠାଟିକୁ 'ଭାଷିଣୀ'ର ଏ.ଆଇ.-ଚାଳିତ ମଡେଲ୍‌ ବ୍ୟବହାର କରି ଅନୁବାଦ କରାଯାଇଛି। ମୂଳ ବିଷୟବସ୍ତୁ ଇଂରାଜୀରେ ଅଛି । ଅନୁବାଦ ସମ୍ବନ୍ଧୀୟ ଯେକୌଣସି ପ୍ରଶ୍ନ ପାଇଁ, ଦୟାକରି ceo-dibd@digitalindia.gov.in ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ ।`
      );
    } else if (preferredLanguage === "pa") {
      showToast(
        `ਇਸ ਪੰਨੇ ਦਾ ਅਨੁਵਾਦ ਭਾਸ਼ਣੀ ਦੇ ਏਆਈ-ਸੰਚਾਲਿਤ ਮਾਡਲਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਕੀਤਾ ਗਿਆ ਹੈ।  ਸਰੋਤ ਸਮੱਗਰੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੈ।  ਕਿਸੇ ਵੀ ਅਨੁਵਾਦ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲਾਂ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ceo-dibd@digitalindia.gov.in 'ਤੇ ਸੰਪਰਕ ਕਰੋ।`
      );
    } else if (preferredLanguage === "sa") {
      showToast(
        `अस्य पृष्ठस्य अनुवादः भशिन्याः ए. ऐ.-शक्तियुक्तानि प्रतिरूपाणि उपयुज्य कृतः अस्ति। मूलविषयः आङ्ग्लभाषायाम् अस्ति। अनुवादसम्बद्धानां प्रश्नानां कृते कृपया ceo-dibd@digitalindia.gov.in सम्पर्कं करोतु।`
      );
    } else if (preferredLanguage === "sat") {
      showToast(
        `ᱱᱚᱣᱟ ᱯᱮᱡᱽ ᱫᱚ ᱵᱷᱟᱥᱤᱱᱤ ᱨᱮᱭᱟᱜ ᱮ ᱟᱭᱼᱯᱟᱣᱟᱨᱰ ᱢᱚᱰᱮᱞ ᱵᱮᱵᱷᱟᱨ ᱠᱟᱛᱮᱫ ᱛᱚᱨᱡᱚᱢᱟ ᱟᱠᱟᱱᱟ ᱾ ᱯᱷᱮᱰᱟᱛ ᱠᱚᱱᱴᱮᱱᱴ ᱫᱚ ᱤᱝᱜᱽᱞᱤᱥᱛᱮ ᱢᱮᱱᱟᱜᱼᱟ ᱾ ᱛᱚᱨᱡᱚᱢᱟ ᱤᱫᱤ ᱠᱟᱛᱮᱫ ᱡᱟᱦᱟᱱ ᱵᱟᱰᱟᱭ ᱞᱟᱹᱜᱤᱫ, ᱫᱟᱭᱟ ᱠᱟᱛᱮᱫ ceo-dibd@digitalindia.gov.in ᱥᱟᱶ ᱡᱳᱜᱟᱡᱳᱜᱽ ᱢᱮ ᱾ `
      );
    } else if (preferredLanguage === "ta") {
      showToast(
        `இந்தப் பக்கம் பாஷிணியின் செயற்கை நுண்ணறிவுடன் இயங்கும் மாதிரிகளைப் பயன்படுத்தி மொழிபெயர்க்கப்பட்டுள்ளது. மூல உள்ளடக்கம் ஆங்கிலத்தில் உள்ளது. மொழிபெயர்ப்பு தொடர்பான கேள்விகளுக்கு, தயவுசெய்து ceo-dibd@digitalindia.gov.in ஐ தொடர்பு கொள்ளவும்.`
      );
    } else if (preferredLanguage === "te") {
      showToast(
        `ఈ పేజీ భాషిణి యొక్క ఏఐ-ఆధారిత నమూనాలను ఉపయోగించి అనువదించబడింది. మూలం ఆంగ్లంలో ఉంది. అనువాదానికి సంబంధించిన ఏవైనా ప్రశ్నల కోసం, దయచేసి ceo-dibd@digitalindia.gov.in ను సంప్రదించండి.`
      );
    } else if (preferredLanguage === "ur") {
      showToast(
        `اس صفحے کا ترجمہ بھاشینی کے اے آئی سے چلنے والے ماڈلز کا استعمال کرتے ہوئے کیا گیا ہے۔ اصل مواد انگریزی میں ہے۔ ترجمے سے متعلق کسی بھی سوال کے لیے، براہ کرم ceo-dibd@digitalindia.gov.in سے رابطہ کریں۔`
      );
    } else if (preferredLanguage === "mni") {
      showToast(
        `ꯃꯁꯤꯒꯤ ꯆꯦꯐꯣꯡ ꯑꯁꯤ ꯚꯥꯁꯤꯅꯤꯒꯤ ꯑꯦ. ꯑꯥꯏ. ꯅ ꯆꯂꯥꯏꯕ ꯃꯣꯗꯦꯜꯁꯤꯡ ꯁꯤꯖꯤꯟꯅꯗꯨꯅ ꯍꯟꯗꯣꯛꯈ꯭ꯔꯦ ꯫ ꯁꯣꯔꯁꯀꯤ ꯃꯆꯥꯛ ꯑꯁꯤ ꯏꯪꯂꯤꯁꯇ ꯂꯩ ꯫ ꯍꯟꯗꯣꯛꯄꯒ ꯃꯔꯤ ꯂꯩꯅꯕ ꯆꯤꯡꯅꯕ ꯑꯃꯍꯦꯛꯇꯒꯤꯗꯃꯛ, ꯆꯥꯟꯕꯤꯗꯨꯅ ceo-dibd@digitalindia.gov.in ꯗ ꯀꯣꯟꯇꯦꯛ ꯇꯧꯕꯤꯌꯨ`
      );
    } else if (preferredLanguage === "sd") {
      showToast(
        `ھن صفحی جو ترجمو ڀاسنی جی ای-پاور ماڊل استعمال ڪندی ڪیو ویو آھی ذریعو مواد انگریزی ۾ آھی ترجمی سان لاڳاپیل ڪنھن بہ سوال لاء، مہربانی ڪری ceo-dibd@digitalindia.gov.in سان رابطو ڪریو`
      );
    } else if (preferredLanguage === "gom") {
      showToast(
        `भाशिनीचो एआय- संचालित मॉडेल वापरून ह्या पानाचें भाशांतर केलां. स्रोत मजकूर इंग्लीश भाशेंत आसा. भाशांतरा संबंदीत खंयच्याय प्रस्नां खातीर, उपकार करून ceo-dibd@digitalindia.gov.in कडेन संपर्क सादचो.`
      );
    } else if (preferredLanguage === "ks") {
      showToast(
        `امہِ صفُک ترجُمہٕ چھُ باشنی ہنٛد اے آیۍ پاور ماڈل استعمال کٔرتھ کرنہٕ آمُت۔ ماخذُک مواد چھُ انگریزی پٲٹھۍ۔ کُنہِ تہِ ترجمس مُتعلِق سوالَن باپتھ کٔرِو مہربٲنی کٔرِتھ ceo-dibd@digitalindia.gov.in پٮ۪ٹھ رٲبطہٕ۔`
      );
    } else {
      // No toast
    }
  }
}

// Store translationCache in session storage
sessionStorage.setItem("translationCache", JSON.stringify(translationCache));

// Function to adjust widget position based on device width
var adjustWidgetPosition = () => {
  var wrapperButton = document.getElementById("bhashini-translation");
  if (window.innerWidth <= 768) {
    // Position for mobile devices
    wrapperButton.style.left = `calc(100vw - ${wrapperButton.offsetWidth + 10
      }px)`;
    wrapperButton.style.bottom = `10px`;
  } else if (window.innerWidth <= 1024) {
    // Position for tabvar devices
    wrapperButton.style.left = `calc(100vw - ${wrapperButton.offsetWidth + 20
      }px)`;
    wrapperButton.style.bottom = `20px`;
  }
};

// CSS for toast message
var toastStyles = `
    .bhashini-toast {
        position: fixed;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s ease, bottom 0.3s ease;
        z-index: 10000;
    }
    .bhashini-toast.visible {
        opacity: 1;
        bottom: 40px;
    }
`;

var styleSheet = document.createElement("style");
styleSheet.innerText = toastStyles;
document.head.appendChild(styleSheet);
