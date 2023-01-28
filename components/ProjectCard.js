import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'

export default function ProjectCard({ slug, title, subtitle, type, cover }) {
    return (
        <Card>
            <Link href = {`/work/${slug}`}>
                <Image src={cover} width={588} height={419}/>
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
    --hover-area: 12px;
    
    padding: var(--hover-area);
    margin: calc(-1 * var(--hover-area));
    /* border-radius: 4px; */
    list-style-type: none;
    transition: background-color var(--transition-slow);

    & a {
        text-decoration: none;
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
    max-width: 30rem;
`

const Title = styled.span`
    color: var(--color-gray-900);
`

const ProjectType = styled.p`
    font-size: var(--font-size-xs);
    color: var(--color-gray-600);
`