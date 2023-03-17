import styled from 'styled-components';
import GridWrapper from './GridWrapper';
import Image from 'next/image'
import PlaceholderImg from '../public/placeholder-pattern.svg'
import { QUERIES } from '../utils/constants';

export default function ProjectHead(props) {
    return (
        <Header>
        <GridWrapper>
            {/* <PlaceholderPattern src={PlaceholderImg}/>  */}
            <Metadata>
                <Heading>
                    <Title>{props.title}</Title>
                    <Subtitle>{props.subtitle}</Subtitle>
                </Heading>
                    <DataRoll>
                        <Timeline>
                            <SmallHead>Timeline</SmallHead>
                            <DataList>
                                <li>{props.timeline[0]}</li>
                                <li>{props.timeline[1]}</li>
                            </DataList>
                        </Timeline>
                        <Team>
                            <SmallHead>Team</SmallHead>
                            <DataList>
                                {props.team.map((member, index) => {
                                    return <li key = {index}>{member}</li>;
                                })}
                            </DataList>
                        </Team>
                        <Contribution>
                            <SmallHead>Contribution</SmallHead>
                            <DataList>
                                {props.contribution.map((contribution, index) => {
                                    return <li key = {index}>{contribution}</li>;
                                })}
                            </DataList>
                        </Contribution>
                    </DataRoll>
            </Metadata>
        </GridWrapper>
        </Header>
    )
}

const Header = styled.header`
    margin-top: 10rem;
    margin-bottom: 5rem;

    @media ${QUERIES.phoneAndBelow} {
        margin-bottom: 2rem;
    }
`

const PlaceholderPattern = styled(Image)`
     grid-column: 1 / 7;
`

const Metadata = styled.div`
    grid-column: 7 / -1;

    @media ${QUERIES.tabletAndBelow} {
        grid-column: 1 / -1;
    }
`

const Heading = styled.div`
    max-width: 24rem;
    margin-bottom: 72px;
    grid-column: 1 / 5;

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
        margin-bottom: 56px;
    }
`


const Title = styled.h1`
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-900);
    line-height: 1.25;
    margin-bottom: var(--spacing-1x);
    `

const Subtitle = styled.h2`
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-normal);
    color: var(--color-gray-600);
    line-height: 1.25;
`

const DataRoll = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-3x);
    padding-bottom: var(--spacing-2x);

    @media ${QUERIES.phoneAndBelow} {
        display: flex;
        gap: var(--spacing-5x);
        white-space: nowrap;
        overflow-x: auto;
    }
`

const Timeline = styled.div`
`

const Team = styled.div`
`

const Contribution = styled.div`
`

const DataList = styled.ul`
    display: flex;
    flex-direction: column;
    /* align-items: flex-start; */
    gap: var(--spacing-s);

    & li {
        line-height: 1.3;
    }
`

const SmallHead = styled.p`
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-normal);
    line-height: 1.3;
    color: var(--color-gray-600);
    margin-bottom: var(--spacing-1x);
`

