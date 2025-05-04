import styled from "styled-components";
import Link from "next/link";
import GridWrapper from "./GridWrapper";
import { QUERIES } from "../utils/constants";

export default function Contact({ children }) {
  return (
    <ContactWrapper>
      <Content>
        <Message>{children}</Message>
        <Link href="mailto:hi@charlsy.me">Let’s chat.</Link>
      </Content>
    </ContactWrapper>
  );
}

const ContactWrapper = styled(GridWrapper)`
  margin: 10rem 0 12rem 0;
  border-top: 1px solid var(--color-border);

  @media ${QUERIES.phoneAndBelow} {
    margin: 8rem 0 8rem 0;
  }
`;

const Content = styled.section`
  grid-column: 7 / -2;
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-normal);

  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    font-size: var(--font-size-m);
  }
`;

const Message = styled.p`
  color: var(--color-text-muted);
  line-height: 1.3;
  margin: 0;
  margin: 24px 0 8px 0;
`;
