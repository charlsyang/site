import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// Load ABC Diatype font (OTF format)
const fontUrl = new URL(
  "../../public/fonts/ABCDiatypeEdu-Regular.otf",
  import.meta.url
);
const fontPromise = fetch(fontUrl).then((res) => res.arrayBuffer());

export default async function handler(req) {
  const fontData = await fontPromise;
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Charlsy Yang";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#F1F0EF",
          padding: "120px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 24 ? "64px" : "80px",
              fontWeight: 400,
              color: "#21201C",
              lineHeight: title.length > 24 ? "1.15" : "1",
              margin: 0,
              letterSpacing: "-0.02em",
              fontFamily: "ABC Diatype",
            }}
          >
            {title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: "10px" }}
            >
              <path
                d="M13.5004 11.638C19.5017 15.1551 9.00071 21.3104 9.00071 14.2758C9.00071 21.3104 -1.49852 15.1551 4.50097 11.638C-1.50032 15.1551 -1.50032 2.84493 4.50097 6.36191C-1.50032 2.84493 9.00071 -3.31041 9.00071 3.72418C9.00071 -3.31041 19.4999 2.84493 13.5004 6.36191C19.4999 2.84493 19.4999 15.1551 13.5004 11.638Z"
                fill="#E54D2E"
              />
            </svg>
            <p
              style={{
                fontSize: "32px",
                color: "#63635E",
                fontWeight: 400,
                fontFamily: "ABC Diatype",
                margin: 0,
              }}
            >
              charlsyang.com
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "ABC Diatype",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
