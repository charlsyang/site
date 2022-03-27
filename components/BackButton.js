import Link from 'next/link'
import styled from 'styled-components'
import { QUERIES } from '../utils/constants'

const BackButton = (props) => {
    const href = props.href;

    return (
        <Link href={href}>
            <Back {...props}>
                <LeftArrow>←</LeftArrow><BackText> Back</BackText>
            </Back>
        </Link>
    )
}

export default BackButton;

const Back = styled.a`
    height: var(--back-button-height);
    width: 6rem;
    display: flex;
    align-items: center;
    color: var(--color-gray-600);
    cursor: pointer;
    text-decoration: none;

    &:hover {
        color: var(--color-gray-900);
    }

    &:hover span:last-of-type {
        display: revert;
        transform: translateX(var(--spacing-1x));
        opacity: revert;
    }

    @media ${QUERIES.tabletAndBelow} {
        display: none;
    }
`

const LeftArrow = styled.span`
    font-weight: 320;
    font-size: var(--font-size-xl);
`

const BackText = styled.span`
    font-family: var(--font-sans);
    font-size: var(--font-size-m);
    margin-top: 2px;
    opacity: 0%;
    transition: transform 250ms, opacity 250ms;

    @media ${QUERIES.laptopAndBelow} {
        font-size: var(--font-size-m);
    }
`



