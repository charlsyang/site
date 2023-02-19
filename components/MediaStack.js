import styled from 'styled-components';

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
`