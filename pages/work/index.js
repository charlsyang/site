import Head from "next/head";
import styled from "styled-components";
import { getPublishedPostsData } from "../../utils/work";
import MasonryGrid, { SAMPLE_MEDIA } from "../../components/MasonryGrid";

export async function getStaticProps() {
  const allPostsData = getPublishedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function WorkIndex({ allPostsData }) {
  return (
    <>
      <Head>
        <title>Work – Charlsy Yang</title>
      </Head>
      <GridContainer>
        <MasonryGrid
          items={SAMPLE_MEDIA}
          columns={3}
          duration={40}
          direction="up"
        />
      </GridContainer>
    </>
  );
}

const GridContainer = styled.div`
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--color-bg-solid);
  padding: 0 0.6vw;
`;
