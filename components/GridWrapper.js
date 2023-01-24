import styled from 'styled-components';

const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 24px;
    row-gap: 0;
`

export default GridWrapper;