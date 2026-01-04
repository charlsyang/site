import Head from "../components/Head";
import styled from "styled-components";
import MasonryGrid, { SAMPLE_MEDIA } from "../components/MasonryGrid";
import { Button } from "../components/Button";
import Icon from "../components/Icon";

// ============================================
// Playground Page
// ============================================

export default function Playground() {
  return (
    <>
      <Head title="Playground" />
      <Main>
        <Sidebar>
          <Header>
            <Title>Charlsy Yang</Title>
            <Subtitle>Software designer.</Subtitle>
          </Header>

          {/* Button Testing Section */}
          <TestingSection>
            <SectionTitle>Button Component</SectionTitle>

            {/* Sizes */}
            <TestGroup>
              <TestLabel>Sizes</TestLabel>
              <ButtonRow>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </ButtonRow>
            </TestGroup>

            {/* Variants */}
            <TestGroup>
              <TestLabel>Variants</TestLabel>
              <ButtonRow>
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="elevated">Elevated</Button>
              </ButtonRow>
            </TestGroup>

            {/* Icon + Text */}
            <TestGroup>
              <TestLabel>Icon + Text</TestLabel>
              <ButtonRow>
                <Button startIcon={<Icon name="fix" />}>Shuffle</Button>
                <Button endIcon={<Icon name="arrowUpRight" />}>
                  Learn more
                </Button>
                <Button
                  startIcon={<Icon name="play" />}
                  endIcon={<Icon name="arrowUpRight" />}
                >
                  Watch
                </Button>
              </ButtonRow>
            </TestGroup>

            {/* Icon Only */}
            <TestGroup>
              <TestLabel>Icon Only</TestLabel>
              <ButtonRow>
                <Button iconOnly icon={<Icon name="play" />} size="sm" />
                <Button iconOnly icon={<Icon name="pause" />} size="md" />
                <Button iconOnly icon={<Icon name="fix" />} size="lg" />
              </ButtonRow>
            </TestGroup>

            {/* Variants with Icons */}
            <TestGroup>
              <TestLabel>Variants + Icons</TestLabel>
              <ButtonRow>
                <Button variant="default" startIcon={<Icon name="fix" />}>
                  Shuffle
                </Button>
                <Button variant="secondary" startIcon={<Icon name="fix" />}>
                  Shuffle
                </Button>
                <Button variant="elevated" startIcon={<Icon name="fix" />}>
                  Shuffle
                </Button>
              </ButtonRow>
            </TestGroup>

            {/* Icon Only Variants */}
            <TestGroup>
              <TestLabel>Icon Only Variants</TestLabel>
              <ButtonRow>
                <Button
                  iconOnly
                  icon={<Icon name="play" />}
                  variant="default"
                />
                <Button
                  iconOnly
                  icon={<Icon name="pause" />}
                  variant="secondary"
                />
                <Button
                  iconOnly
                  icon={<Icon name="fix" />}
                  variant="elevated"
                />
              </ButtonRow>
            </TestGroup>
          </TestingSection>
        </Sidebar>

        <GridArea>
          <MasonryGrid items={SAMPLE_MEDIA} />
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

const Sidebar = styled.aside`
  flex: 0 0 33.333%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-family: var(--font-sans);
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-m);
  color: var(--color-text-base);
  margin: 0;
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

// Testing Section Styles
const TestingSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-s);
  color: var(--color-text-base);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const TestGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TestLabel = styled.span`
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;
