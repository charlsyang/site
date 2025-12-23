import Head from "../components/Head";
import styled from "styled-components";
import MasonryGrid, { SAMPLE_MEDIA } from "../components/MasonryGrid";

// ============================================
// Playground Page
// ============================================

export default function Playground() {
  return (
    <>
      <Head title="Playground" />
      <Main>
        <Header>
          <Title>Charlsy Yang</Title>
          <Subtitle>Software designer.</Subtitle>
        </Header>
        <GridArea>
          <MasonryGrid
            items={SAMPLE_MEDIA}
            rows={3}
            duration={40}
            direction="left"
          />
        </GridArea>
      </Main>
    </>
  );
}

Playground.noLayout = true;

// ============================================
// Page Styles
// ============================================

const Main = styled.main`
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 1rem;
`;

const Header = styled.header`
  flex: 0 0 33.333%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-family: var(--font-sans);
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-m);
  color: var(--color-text-base);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: var(--font-size-m);
  color: var(--color-text-muted);
  max-width: 400px;
  margin: 0;
`;

const GridArea = styled.div`
  flex: 0 0 66.666%;
  min-height: 0;
  margin-right: 3rem;
`;
