import styled from 'styled-components';
import ProjectCard from './ProjectCard';
import GridWrapper from './GridWrapper';
import { QUERIES } from '../utils/constants';

export default function NextProject({allPostsData, currentProjectSlug}) {
    const currentProjectIndex = allPostsData.findIndex(project => project.slug == currentProjectSlug);
    const nextProjectIndex = currentProjectIndex + 1;
    const maxIndex = allPostsData.length - 1;

    if (nextProjectIndex <= maxIndex) {
        var nextProject = allPostsData[nextProjectIndex];
    } else {
        var nextProject = allPostsData[0];
    };

    return (
        <NextProjectWrapper>
            <Heading>Up Next</Heading>
            <NextProjectList>
                <ProjectCard
                    slug = {nextProject.slug}
                    title = {nextProject.title}
                    subtitle = {nextProject.subtitle}
                    type = {nextProject.type}
                    cover = {nextProject.cover}
                />
            </NextProjectList>
        </NextProjectWrapper>
    )
}

const NextProjectWrapper = styled(GridWrapper)`
    margin-bottom: 8rem;
`

const Heading = styled.h4`
    grid-column: 1 / 4;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-600);
    text-transform: uppercase;
    letter-spacing: 1px;

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
        font-size: var(--font-size-xxs);
        margin-bottom: var(--spacing-2x);
    }
`

const NextProjectList = styled.ul`
    grid-column: 7 / -1;

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
    }
`