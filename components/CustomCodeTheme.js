let customTheme = {
	plain: {
	  color: "var(--color-text-article)",
	  backgroundColor: "var(--color-bg-solid)",
	  fontFamily: "var(--font-mono)",
      fontWeight: "var(--font-weight-normal)",
	  fontSize: "var(--font-size-s)",
      lineHeight: "1.45"
	},
	styles: [
	  {
		types: ["comment"],
		style: {
		  color: "var(--color-text-muted)",
		  fontStyle: "italic",
		},
	  },
	  {
		types: ["variable", "tag", "keyword", "property"],
		style: {
		  color: "var(--color-theme)",
		},
	  },
	  {
		types: ["punctuation", "operator"],
		style: {
		  color: "var(--color-text-faint)",
		},
	  },
      {
		types: ["changed", "deleted", "inserted", "attr-name"],
		style: {
		  color: "var(--color-text-article)",
		  fontStyle: "italic",
		},
	  },
	],
  };
  
  // Other classes:
  // "string", "url", "number", "builtin", "char", "constant", "function", "selector", "doctype", "class-name", "boolean", "namespace"
  
  export default customTheme;