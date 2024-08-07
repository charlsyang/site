import styled from 'styled-components';
import { QUERIES } from '../utils/constants'

const MaxWidthWrapper = styled.div`
  position: relative;
  max-width: min(100%, calc(1200px + 40px * 2));
  margin-left: auto;
  margin-right: auto;
  padding-left: 40px;
  padding-right: 40px;

  @media ${QUERIES.phoneAndBelow} {
    padding-left: var(--spacing-2x);
    padding-right: var(--spacing-2x);
  }
`;

export default MaxWidthWrapper;