import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

function CustomImg(props) {
    if (props.title !== undefined) {
      return (
        <Figure>
          <img src={props.src} alt={props.alt}/>
          <FigCaption>{props.title}</FigCaption>
        </Figure>
      );
    } else {
      return (
        <Figure>
          <img src={props.src} alt={props.alt}/>
        </Figure>
      );
    }
  }

export default CustomImg;


const Figure = styled.figure`
  margin: var(--spacing-4x) 0;
`

const FigCaption = styled.figcaption`
  font-family: var(--font-sans);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-muted);
  margin-top: var(--spacing-2x);

  @media ${QUERIES.tabletAndBelow} {
    font-size: var(--font-size-s);
    margin-top: var(--spacing-1x);
  }
`



