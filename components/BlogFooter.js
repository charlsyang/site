import styled from "styled-components";
import GridWrapper from "./GridWrapper";
import { QUERIES } from "../utils/constants";

export default function BlogFooter({readNextPosts}) {
    return (
        <FooterWrapper>
          <FooterHeading>Continue Reading</FooterHeading>
          <ReadNextList>
            {readNextPosts.map(({title, date, slug}) => (
              <ReadNextListItem key={slug}>
                <a href={`/blog/${slug}`}>{title}</a>
                <time>{date}</time>
                {/* <Date dateString={date}/> */}
              </ReadNextListItem>
            ))}
          </ReadNextList>
        </FooterWrapper>
    )
}


const FooterWrapper = styled(GridWrapper)`
  border-top: 1px solid var(--color-border);
  margin-bottom: 140px;
`

const FooterHeading = styled.h1`
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  color: var(--color-text-base);
  grid-column: 3 / 6;
  padding-top: 10px;
`

const ReadNextList = styled.ul`
  grid-column: 7 / -1;
`

const ReadNextListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border);

  font-size: var(--font-size-m);

  & time {
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
    /* font-size: var(--font-size-s); */
  }
`
