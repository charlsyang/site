import Head from "next/head";
import { getPublishedPostsData } from "../../utils/work";
import MasonryGrid from "../../components/MasonryGrid";
import visualsData from "../../data/visuals.json";

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
      <MasonryGrid items={visualsData} />
    </>
  );
}
