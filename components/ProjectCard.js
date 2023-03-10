import styled from 'styled-components'
import Link from 'next/link'
import { QUERIES } from '../utils/constants'

export default function ProjectCard({ slug, title, subtitle, type, cover }) {
    return (
        <Card>
            <Link href = {`/work/${slug}`}>
                <img src={cover}/>
                <Heading>
                    <Title>{title}</Title>
                    {'—' + subtitle} 
                </Heading>
                <ProjectType>{type.join(' / ')}</ProjectType>
            </Link>
        </Card>
    )
}

const Card = styled.li`
    --hover-area: 8px;
    
    padding: var(--hover-area);
    margin: calc(-1 * var(--hover-area));
    list-style-type: none;
    transition: background-color var(--transition-slow);
    border-radius: 4px;

    & a {
        text-decoration: none;
    }

    & img {
        height: auto;
    }

    &:hover {
        background-color: var(--color-divider);
        transition: background-color var(--transition-default);
    }
`

const Heading = styled.h3`
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-normal);
    color: var(--color-gray-600);
    line-height: 1.3;
    margin: var(--spacing-1x) 0;
    width: 80%;

    @media ${QUERIES.phoneAndBelow} {
        font-size: var(--font-size-s);
        width: auto;
    }
`

const Title = styled.span`
    color: var(--color-gray-900);
`

const ProjectType = styled.p`
    font-size: var(--font-size-xs);
    color: var(--color-gray-600);

    @media ${QUERIES.phoneAndBelow} {
        font-size: var(--font-size-xxs);
    }
`