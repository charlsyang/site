import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

export default function MediaStack({children}) {
    return (
        <MediaStackWrapper>
            {children}
        </MediaStackWrapper>
    )
}

const MediaStackWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
    margin: 4rem 0;

    @media ${QUERIES.phoneAndBelow} {
        gap: var(--spacing-2x);
        margin: 2rem 0;
    }
`