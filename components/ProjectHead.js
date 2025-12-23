import styled from "styled-components";
import { QUERIES } from "../utils/constants";

export default function ProjectHead(props) {
  return (
    <Header>
      <Heading>
        <Title>{props.title}</Title>
        <Subtitle>{props.subtitle}</Subtitle>
      </Heading>
      <DataRoll>
        <div>
          <SmallHead>Timeline</SmallHead>
          <DataList>
            <li>{props.timeline[0]}</li>
            <li>{props.timeline[1]}</li>
          </DataList>
        </div>
        <div>
          <SmallHead>Team</SmallHead>
          <DataList>
            {props.team.map((member, index) => {
              return <li key={index}>{member}</li>;
            })}
          </DataList>
        </div>
        <div>
          <SmallHead>Contribution</SmallHead>
          <DataList>
            {props.contribution.map((contribution, index) => {
              return <li key={index}>{contribution}</li>;
            })}
          </DataList>
        </div>
      </DataRoll>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10rem;
  margin-bottom: 3rem;

  @media ${QUERIES.phoneAndBelow} {
    margin-bottom: 2rem;
  }
`;

const Heading = styled.div`
  width: 100%;
  max-width: 640px;
  margin-bottom: 72px;
  animation: onload-fade var(--duration-load) var(--ease-out) both;

  @media ${QUERIES.phoneAndBelow} {
    margin-bottom: 56px;
  }
`;

const Title = styled.h1`
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-base);
  line-height: 1.25;
  margin-bottom: var(--spacing-1x);
`;

const Subtitle = styled.h2`
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-muted);
  line-height: 1.25;
`;

const DataRoll = styled.div`
  width: 100%;
  max-width: 640px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3x);
  padding-bottom: var(--spacing-2x);
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-1);

  @media ${QUERIES.phoneAndBelow} {
    display: flex;
    gap: var(--spacing-5x);
    white-space: nowrap;
    overflow-x: auto;
    --gradient-size-start: var(--spacing-3x);
    --gradient-size-end: 20%;
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 var(--gradient-size-start),
      #000 calc(100% - var(--gradient-size-end)),
      transparent 100%
    );
    margin-left: -16px;
    padding-left: 16px;
    padding-right: 48px;
    padding-bottom: var(--spacing-4x);

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const DataList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);

  & li {
    font-weight: var(--font-weight-normal);
    line-height: 1.3;
  }
`;

const SmallHead = styled.p`
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-normal);
  line-height: 1.3;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-1x);
`;
