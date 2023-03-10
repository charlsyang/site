import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Head from 'next/head'
import styled from 'styled-components'
import GridWrapper from '../../components/GridWrapper'
import Link from 'next/link'
import { QUERIES } from '../../utils/constants'
import { getPublishedPostsData } from '../../utils/work'
import ProjectCard from '../../components/ProjectCard'
import { ArrowUpRight } from 'react-feather'
import CustomLink from '../../components/CustomLink'
import Contact from '../../components/Contact'
import Gallery from '../../components/Gallery'
import Balancer from 'react-wrap-balancer'

export async function getStaticProps() {
    const allPostsData = getPublishedPostsData();
    return {
      props: {
        allPostsData
      }
    }
}

// WorkIndex.theme = 'dark'

export default function WorkIndex({ allPostsData }) {
    return (
        <>
            <Head>
                <title>Work – Charlsy Yang</title>
            </Head>
            <MaxWidthWrapper>
                <GridWrapper>
                    <Intro>
                        <Headline>
                            <p>Charlsy designs visual and interactive experience for products and&nbsp;brands.</p>
                            <p>He cares deeply about quality and holds craftsmanship dear to&nbsp;heart.</p>
                        </Headline>
                        <Callout>
                            <p>Charlsy will graduate soon in June 2023 and is looking for full-time product design roles. Learn more about <Link href='https://charlsy.notion.site/Charlsy-as-a-Designer-d60da6d266e3419b861e422a6a910a80'>Charlsy as a designer</Link>.</p>   
                        </Callout>
                    </Intro>
                    <ContactLinks>
                        <div>
                            <p>Email</p>
                            <Link href='mailto:hi@charlsy.me'>hi@charlsy.me</Link>
                        </div>
                        <div>
                            <p>Resume</p>
                            <Link href='https://read.cv/charlsy'>read.cv/charlsy</Link>
                        </div>
                    </ContactLinks>
                    <Experience>
                        <TableTitle>Experience</TableTitle>
                        <Table>
                            <tbody>  {/* Added to avoid hydration failed error (caused by Next.js) */}
                            <TableRow>
                                <TdYear>2022</TdYear>   
                                <TdCompany>Rubrik</TdCompany>
                                <TdRole>Product Design Intern</TdRole>
                            </TableRow>
                            <TableRow>
                                <TdYear>2021</TdYear>   
                                <TdCompany>IDEO</TdCompany>
                                <TdRole>Interaction Design Intern</TdRole>
                            </TableRow>
                            <TableRow>
                                <TdYear>2020</TdYear>   
                                <TdCompany>Tide</TdCompany>
                                <TdRole>Product Design Intern</TdRole>
                            </TableRow>
                            <TableRow>
                                <TdYear>2019</TdYear>   
                                <TdCompany>NIO</TdCompany>
                                <TdRole>UI/UX Design Intern</TdRole>
                            </TableRow>
                            </tbody>
                        </Table>
                    </Experience>
                </GridWrapper>
                <Projects>
                    <SectionHeading>Projects</SectionHeading>
                    <ProjectGrid>
                        {allPostsData.map((project, index) => (
                            <ProjectCard
                                key = {index}
                                slug = {project.slug}
                                title = {project.title}
                                subtitle = {project.subtitle}
                                type = {project.type}
                                cover = {project.cover}
                            />
                        ))}
                    </ProjectGrid>
                </Projects>
                <Craft>
                    <GridWrapper>
                        <SectionHeading>Craft</SectionHeading>
                        <ReDream>
                            <Link href='https://youtu.be/ZVy1wVqHpH4'>
                                <video src='/visuals/redream-teaser.mp4' autoPlay loop muted draggable='false'/>
                                <MediaTitle>
                                    <p>ReDream: App Concept</p>
                                    <ArrowUpRight size={16}/>
                                </MediaTitle>
                            </Link>
                        </ReDream>
                    </GridWrapper>
                    <Gallery/>
                </Craft>
                <Contact>If you are looking for a designer to join your team, or simply interested in learning more about my work—</Contact>
            </MaxWidthWrapper>
        </>
    )
}

const Intro = styled.section`
    grid-column: 7 / -1;
    padding-top: 10rem;
    max-width: 33rem;

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
        padding-top: 8rem;
    }
`


const Headline = styled.div`    
    margin-bottom: var(--spacing-3x);

    & p {
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-xl);
        line-height: 1.3;
        color: var(--color-gray-900);
        
        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-l);
            hyphens: auto;
        }
    }

    & p+p {
        text-indent: 2em;
    }
`

const Callout = styled.div`
    padding: 16px 24px 14px 24px;
    border-radius: 6px;
    border: 1px solid var(--color-gray-100);
    background-color: var(--color-block);
    margin-bottom: calc(var(--spacing-1x) * 8);
    color: var(--color-article-body);

    & p {
        line-height: 1.3;
    }

    @media ${QUERIES.phoneAndBelow} {
        margin-bottom: calc(var(--spacing-1x) * 6);
    }
`

const ContactLinks = styled.div`
    grid-column: 7 /9;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);

    & p {
        color: var(--color-gray-600);
    }

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-bottom: var(--spacing-4x);
    }
`

const Experience = styled.section`
    display: flex;
    flex-direction: column;
    grid-column: -5 / -1;

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
    }
`

const TableTitle = styled.p`
    color: var(--color-gray-600);
    font-weight: var(--font-weight-normal);
`

const Table = styled.table`
    margin: 8px 0;
`

const TableRow = styled.tr`
    border-bottom: 1px solid var(--color-divider);
    display: grid;
    grid-template-columns: 0.5fr 1fr 2.5fr;
    column-gap: 16px;
    padding: 6px 0;
    padding-right: 24px;

    font-weight: var(--font-weight-normal);
    color: var(--color-gray-600);
    
    &:first-of-type {
        border-top: 1px solid var(--color-divider);
    }


    @media ${QUERIES.phoneAndBelow} {
        padding-right: 0;
    }
`

const TdYear = styled.td`
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    padding-top: 1px;
`

const TdCompany = styled.td`
    color: var(--color-gray-900);
`

const TdRole = styled.td`
`

const ReadCV = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 12px;
`

const Projects = styled.section`
    margin-top: 5rem;
    margin-bottom: 12rem;
    border-top: 1px solid var(--color-divider);
    padding-top: var(--spacing-2x);

    @media ${QUERIES.phoneAndBelow} {
        margin-bottom: 5rem;
    }
`

const SectionHeading = styled.h2`
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-normal);
    margin-bottom: var(--spacing-3x);

    @media ${QUERIES.phoneAndBelow} {
        font-size: var(--font-size-s);
        margin-bottom: var(--spacing-2x);
    }
`

const ProjectGrid = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
    column-gap: 24px;
    row-gap: 6rem;
    margin-top: calc(-1 * var(--spacing-6x));

    & li:first-of-type {
        grid-column: 1 / -1;
        margin-left: 25%;
    }

    & li:last-of-type {
        grid-column: 1 / -1;
        margin-right: 25%;
    }

    @media ${QUERIES.phoneAndBelow} {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-5x);
        margin-top: 0;

        & li:first-of-type {
            margin-left: calc(-1 * var(--hover-area));
        }

        & li:last-of-type {
            margin-right: calc(-1 * var(--hover-area));
        }
    }
`

const Craft = styled.section`
    border-top: 1px solid var(--color-divider);
    padding-top: var(--spacing-2x);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
`

const ReDream = styled.div`
    grid-column: 5 / -1;

    & video {
        width: 100%;
    }

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
    }
`

const MediaTitle = styled.div`
    display: flex;
    gap: var(--spacing-s);
    align-items: center;

    & svg {
        color: var(--color-gray-600);
    }
`