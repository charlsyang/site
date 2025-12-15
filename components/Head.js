import NextHead from "next/head";

const BASE_URL = "https://charlsyang.com";

const Head = ({ title, description, ogImage, path = "" }) => {
  const fullTitle = title ? `${title} — Charlsy Yang` : "Charlsy Yang";
  const fullUrl = `${BASE_URL}${path}`;
  const defaultDescription = description || "Design, writing, and thinking.";

  return (
    <NextHead>
      <title>{fullTitle}</title>
      <meta name="description" content={defaultDescription} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:url" content={fullUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </NextHead>
  );
};

export default Head;
