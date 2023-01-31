import styled from 'styled-components';
import GridWrapper from './GridWrapper';
import Image from 'next/image'
import PlaceholderImg from '../public/placeholder-pattern.svg'

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
                <Timeline>
                    <SmallHead>Timeline</SmallHead>
                    <p>{props.timeline[0]}</p>
                    <p>{props.timeline[1]}</p>
                </Timeline>
                <Team>
                    <SmallHead>Team</SmallHead>
                    <ul>
                        {props.team.map((member, index) => {
                            return <li key = {index}>{member}</li>;
                        })}
                    </ul>
                </Team>
                <Contribution>
                    <SmallHead>Contribution</SmallHead>
                    <ul>
                        {props.contribution.map((contribution, index) => {
                            return <li key = {index}>{contribution}</li>;
                        })}
                    </ul>
                </Contribution>
            </Metadata>
        </GridWrapper>
        </Header>
    )
}

const Header = styled.header`
    margin-top: 200px;
    margin-bottom: 72px;
`

const PlaceholderPattern = styled(Image)`
     grid-column: 1 / 7;
     
`

const Metadata = styled.div`
    grid-column: 7 / -1;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 24px;
    align-content: center;
`

const Heading = styled.div`
    margin-bottom: 72px;
    grid-column: 1 / 5;
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

const Timeline = styled.div`
    grid-column: 1 / 3;

    & p {
        white-space: pre;
    }
`

const Team = styled.div`
    grid-column: 3 / 5;
`

const Contribution = styled.div`
    grid-column: 5 / 7;
`

const SmallHead = styled.p`
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-normal);
    line-height: 1.2;
    color: var(--color-gray-600);
    margin-bottom: var(--spacing-1x);
`

