// The property name and type.
var propertyInfo = [
    ["alert", "function"],
    ["atob", "function"],
    ["blur", "function"],
    ["btoa", "function"],
    ["captureEvents", "function"],
    ["clearInterval", "function"],
    ["clearTimeout", "function"],
    ["close", "function"],
    ["confirm", "function"],
    ["find", "function"],
    ["focus", "function"],
    ["getComputedStyle", "function"],
    ["getMatchedCSSRules", "function"],
    ["getSelection", "function"],
    ["moveBy", "function"],
    ["moveTo", "function"],
    ["open", "function"],
    ["print", "function"],
    ["prompt", "function"],
    ["releaseEvents", "function"],
    ["resizeBy", "function"],
    ["resizeTo", "function"],
    ["scroll", "function"],
    ["scrollBy", "function"],
    ["scrollTo", "function"],
    ["setInterval", "function"],
    ["setTimeout", "function"],
    ["showModalDialog", "function"],
    ["stop", "function"],
    ["toString", "function"],

    ["Attr", "object"],
    ["CDATASection", "object"],
    ["CSSCharsetRule", "object"],
    ["CSSFontFaceRule", "object"],
    ["CSSImportRule", "object"],
    ["CSSMediaRule", "object"],
    ["CSSPageRule", "object"],
    ["CSSPrimitiveValue", "object"],
    ["CSSRule", "object"],
    ["CSSRuleList", "object"],
    ["CSSStyleDeclaration", "object"],
    ["CSSStyleRule", "object"],
    ["CSSStyleSheet", "object"],
    ["CSSValue", "object"],
    ["CSSValueList", "object"],
    ["CharacterData", "object"],
    ["Comment", "object"],
    ["Counter", "object"],
    ["DOMException", "object"],
    ["DOMImplementation", "object"],
    ["DOMParser", "object"],
    ["Document", "object"],
    ["DocumentFragment", "object"],
    ["DocumentType", "object"],
    ["Element", "object"],
    ["Entity", "object"],
    ["EntityReference", "object"],
    ["Event", "object"],
    ["EventException", "object"],
    ["HTMLAnchorElement", "object"],
    ["HTMLAppletElement", "object"],
    ["HTMLAreaElement", "object"],
    ["HTMLBRElement", "object"],
    ["HTMLBaseElement", "object"],
    ["HTMLBaseFontElement", "object"],
    ["HTMLBodyElement", "object"],
    ["HTMLButtonElement", "object"],
    ["HTMLCanvasElement", "object"],
    ["HTMLDListElement", "object"],
    ["HTMLDataListElement", "object"],
    ["HTMLDirectoryElement", "object"],
    ["HTMLDivElement", "object"],
    ["HTMLDocument", "object"],
    ["HTMLElement", "object"],
    ["HTMLEmbedElement", "object"],
    ["HTMLFieldSetElement", "object"],
    ["HTMLFontElement", "object"],
    ["HTMLFormElement", "object"],
    ["HTMLFrameElement", "object"],
    ["HTMLFrameSetElement", "object"],
    ["HTMLHRElement", "object"],
    ["HTMLHeadElement", "object"],
    ["HTMLHeadingElement", "object"],
    ["HTMLHtmlElement", "object"],
    ["HTMLIFrameElement", "object"],
    ["HTMLImageElement", "object"],
    ["HTMLInputElement", "object"],
    ["HTMLLIElement", "object"],
    ["HTMLLabelElement", "object"],
    ["HTMLLegendElement", "object"],
    ["HTMLLinkElement", "object"],
    ["HTMLMapElement", "object"],
    ["HTMLMarqueeElement", "object"],
    ["HTMLMenuElement", "object"],
    ["HTMLMetaElement", "object"],
    ["HTMLModElement", "object"],
    ["HTMLOListElement", "object"],
    ["HTMLObjectElement", "object"],
    ["HTMLOptGroupElement", "object"],
    ["HTMLOptionElement", "object"],
    ["HTMLParagraphElement", "object"],
    ["HTMLParamElement", "object"],
    ["HTMLPreElement", "object"],
    ["HTMLQuoteElement", "object"],
    ["HTMLScriptElement", "object"],
    ["HTMLSelectElement", "object"],
    ["HTMLStyleElement", "object"],
    ["HTMLTableCaptionElement", "object"],
    ["HTMLTableCellElement", "object"],
    ["HTMLTableColElement", "object"],
    ["HTMLTableElement", "object"],
    ["HTMLTableRowElement", "object"],
    ["HTMLTableSectionElement", "object"],
    ["HTMLTextAreaElement", "object"],
    ["HTMLTitleElement", "object"],
    ["HTMLUListElement", "object"],
    ["KeyboardEvent", "object"],
    ["MediaList", "object"],
    ["MouseEvent", "object"],
    ["MutationEvent", "object"],
    ["NamedNodeMap", "object"],
    ["Node", "object"],
    ["NodeFilter", "object"],
    ["NodeList", "object"],
    ["Notation", "object"],
    ["OverflowEvent", "object"],
    ["ProcessingInstruction", "object"],
    ["ProgressEvent", "object"],
    ["Range", "object"],
    ["RangeException", "object"],
    ["Rect", "object"],
    ["SVGAngle", "object"],
    ["SVGColor", "object"],
    ["SVGException", "object"],
    ["SVGGradientElement", "object"],
    ["SVGLength", "object"],
    ["SVGMarkerElement", "object"],
    ["SVGPaint", "object"],
    ["SVGPathSeg", "object"],
    ["SVGPreserveAspectRatio", "object"],
    ["SVGRenderingIntent", "object"],
    ["SVGTextContentElement", "object"],
    ["SVGTextPathElement", "object"],
    ["SVGTransform", "object"],
    ["SVGUnitTypes", "object"],
    ["StyleSheet", "object"],
    ["StyleSheetList", "object"],
    ["Text", "object"],
    ["TextEvent", "object"],
    ["UIEvent", "object"],
    ["WheelEvent", "object"],
    ["XMLDocument", "object"],
    ["XMLHttpRequest", "object"],
    ["XMLHttpRequestException", "object"],
    ["XMLSerializer", "object"],
    ["XPathEvaluator", "object"],
    ["XPathException", "object"],
    ["XPathResult", "object"],
    ["XSLTProcessor", "object"],
    ["onload", "object"],
    ["frames", "object"],
    ["parent", "object"],
    ["self", "object"],
    ["top", "object"],
    ["window", "object"],
    ["locationbar", "object"],
    ["menubar", "object"],
    ["personalbar", "object"],
    ["scrollbars", "object"],
    ["statusbar", "object"],
    ["toolbar", "object"],
    ["console", "object"],
    ["history", "object"],
    ["navigator", "object"],
    ["screen", "object"],
    ["clientInformation", "object"],
    ["document", "object"],
    ["location", "object"],
    ["onabort", "object"],
    ["onbeforeunload", "object"],
    ["onblur", "object"],
    ["onchange", "object"],
    ["onclick", "object"],
    ["ondblclick", "object"],
    ["onerror", "object"],
    ["onfocus", "object"],
    ["onkeydown", "object"],
    ["onkeypress", "object"],
    ["onkeyup", "object"],
    ["onmousedown", "object"],
    ["onmousemove", "object"],
    ["onmouseout", "object"],
    ["onmouseover", "object"],
    ["onmouseup", "object"],
    ["onmousewheel", "object"],
    ["onreset", "object"],
    ["onresize", "object"],
    ["onscroll", "object"],
    ["onsearch", "object"],
    ["onselect", "object"],
    ["onsubmit", "object"],
    ["onunload", "object"],
    ["opener", "object"],

    ["defaultStatus", "string"],
    ["defaultstatus", "string"],
    ["name", "string"],
    ["status", "string"],

    ["devicePixelRatio", "number"],
    ["innerHeight", "number"],
    ["innerWidth", "number"],
    ["length", "number"],
    ["outerHeight", "number"],
    ["outerWidth", "number"],
    ["pageXOffset", "number"],
    ["pageYOffset", "number"],
    ["screenLeft", "number"],
    ["screenTop", "number"],
    ["screenX", "number"],
    ["screenY", "number"],
    ["scrollX", "number"],
    ["scrollY", "number"],

    ["closed", "boolean"],
    ["offscreenBuffering", "boolean"],
];

// Also collect a list of only the property names.
var properties = [];
for (var i = 0; i < propertyInfo.length; ++i) {
    properties.push(propertyInfo[i][0]);
}
