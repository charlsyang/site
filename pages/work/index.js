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

export async function getStaticProps() {
    const allPostsData = getPublishedPostsData();
    return {
      props: {
        allPostsData
      }
    }
}

WorkIndex.theme = 'dark'

export default function WorkIndex({ allPostsData }) {
    return (
        <>
            <Head>
                <title>Work</title>
            </Head>
            <MaxWidthWrapper>
                <GridWrapper>
                    <Intro>
                        <Headline>
                            <p>Charlsy designs visual and interactive experience for products and brands.</p>
                            <p>He graduates in June 2023 and is looking for full-time product design roles.</p>
                        </Headline>
                        <CustomLink href='https://charlsy.notion.site/Charlsy-as-a-Designer-d60da6d266e3419b861e422a6a910a80'>
                            <Button>
                                <p>Charlsy as a designer</p>
                                <ButtonIcon>
                                    <ArrowUpRight size={16}/>
                                </ButtonIcon>
                            </Button>
                        </CustomLink>
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
                            <CustomLink href='https://read.cv/charlsy'>
                                <ReadCV>
                                    <p>read.cv</p>
                                    <ArrowUpRight size = {16}/>
                                </ReadCV>
                            </CustomLink>
                        </Experience>
                    </Intro>
                </GridWrapper>
                <SectionHeading>Selected Projects</SectionHeading>
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
            </MaxWidthWrapper>
        </>
    )
}

const Intro = styled.section`
    grid-column: 7 / -1;
    max-width: 28em;
    margin-bottom: 72px;

    & a {
        text-decoration: none;
    }
`


const Headline = styled.div`    
    margin-top: 10rem;
    margin-bottom: var(--spacing-3x);

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
    }

    & p {
        font-size: var(--font-size-l);
        line-height: 1.3;
        color: var(--color-gray-900);
    }

    & p+p {
        text-indent: 2em;
    }
`

const Button = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 6px 6px 6px 24px;
    border-radius: 6px;
    border: 1px solid var(--color-gray-300);
    cursor: pointer;
    background-color: #1E1E21;
    margin-bottom: var(--spacing-6x);
    color: var(--color-gray-600);
    transition: all var(--transition-slow);

    & p {
        font-size: var(--font-size-s);
        font-weight: var(--font-weight-normal);
    }

    &:hover {
        color: var(--color-gray-900);
        border: 1px solid var(--color-gray-600);
        transition: all var(--transition-default);
    }
`

const ButtonIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    background-color: var(--color-divider);
    border-radius: 3px;
`

const Experience = styled.section`
    display: flex;
    flex-direction: column;
`

const TableTitle = styled.p`
    font-weight: var(--font-weight-normal);
`

const Table = styled.table`
    margin: 8px 0;
`

const TableRow = styled.tr`
    border-bottom: 1px solid var(--color-divider);
    display: grid;
    grid-template-columns: 0.5fr 1fr 2fr;
    column-gap: 16px;
    padding: 6px 0;
    padding-right: 24px;

    font-weight: var(--font-weight-normal);
    color: var(--color-gray-600);
    

    &:first-of-type {
        border-top: 1px solid var(--color-divider);
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

const SectionHeading = styled.h2`
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-normal);
    margin-bottom: var(--spacing-3x);
`

const ProjectGrid = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* grid-template-rows: repeat(2, 1fr); */
    column-gap: 24px;
    row-gap: 48px;
`