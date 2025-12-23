import styled from "styled-components";
import { QUERIES } from "../utils/constants";

export default function MediaRow({ content, single, bg }) {
  return (
    <MediaRowWrapper isSingle={single}>
      {content.map((item, index) => {
        if (item.type == "image" && item.caption !== undefined) {
          return (
            <Figure key={index}>
              <Img src={item.source} bg={bg} draggable="false" />
              <FigCaption>{item.caption}</FigCaption>
            </Figure>
          );
        } else if (item.type == "video" && item.caption !== undefined) {
          return (
            <Video key={index}>
              <video src={item.source} autoPlay loop muted draggable="false" />
              <FigCaption>{item.caption}</FigCaption>
            </Video>
          );
        } else if (item.type == "image") {
          return (
            <Figure key={index}>
              <Img src={item.source} bg={bg} draggable="false" />
            </Figure>
          );
        } else if (item.type == "video") {
          return (
            <Video key={index}>
              <video src={item.source} autoPlay loop muted draggable="false" />
            </Video>
          );
        }
      })}
    </MediaRowWrapper>
  );
}

const MediaRowWrapper = styled.div`
  max-width: 1200px;
  display: flex;
  gap: var(--spacing-3x);
  margin: ${(props) => (props.isSingle ? "4rem 0" : "0")};

  & img,
  video {
    width: 100%;
    display: block;
  }

  @media ${QUERIES.phoneAndBelow} {
    flex-direction: column;
    gap: var(--spacing-2x);
    margin: ${(props) => (props.isSingle ? "2rem 0" : "0")};
  }
`;

const Figure = styled.figure`
  flex: 1;
`;

const Img = styled.img`
  background-color: ${(props) => (props.bg ? "var(--color-bg-solid)" : "none")};
`;

const FigCaption = styled.figcaption`
  font-size: var(--font-size-s);
  color: var(--color-text-muted);
  margin-top: var(--spacing-2x);
  margin-bottom: var(--spacing-3x);
  line-height: 1.5;

  @media ${QUERIES.phoneAndBelow} {
    margin-top: var(--spacing-1x);
    font-size: var(--font-size-xs);
    margin-bottom: 0;
  }
`;

const Video = styled.div`
  flex: 1;
`;
