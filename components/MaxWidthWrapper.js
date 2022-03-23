import styled from 'styled-components';

const MaxWidthWrapper = styled.div`
  position: relative;
  max-width: min(100%, calc(600px + 32px * 2));
  margin-left: auto;
  margin-right: auto;
  padding-left: 32px;
  padding-right: 32px;
`;

export default MaxWidthWrapper;