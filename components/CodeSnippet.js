import { Highlight, themes, defaultProps } from "prism-react-renderer";
import styled from "styled-components";
import { QUERIES } from "../utils/constants";
import customTheme from "./CustomCodeTheme";

const CodeSnippet = ({ children }) => {
  const code = children.props.children;
  const language = children.props.className?.replace("language-", "").trim();

  return (
    <Highlight
      {...defaultProps}
      theme={customTheme}
      code={code}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <CodeWrapper>
          <Pre className={className} style={{ ...style }}>
            {tokens.slice(0, -1).map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </Pre>
        </CodeWrapper>
      )}
    </Highlight>
  );
};

export default CodeSnippet;

const CodeWrapper = styled.div`
  --code-margin: 20px;
  margin: 2em calc(var(--code-margin) * -1);

  @media ${QUERIES.phoneAndBelow} {
    margin: 1em 0;
  }
`;

const Pre = styled.pre`
  padding: var(--spacing-2x) var(--code-margin);
  border-radius: 4px;
  overflow: auto;
  line-height: 1.2;
  /* border: 1px solid var(--color-border); */ // too much? not sure

  & span {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    font-feature-settings: "ss11" 1, "ss12" 1;
  }
`;
