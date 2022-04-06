import styled from 'styled-components';

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
  margin-top: var(--spacing-6x);
  margin-bottom: var(--spacing-6x);
`

const FigCaption = styled.figcaption`
  font-family: var(--font-sans);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-normal);
  color: var(--color-gray-600);
  margin-top: var(--spacing-2x);
`



