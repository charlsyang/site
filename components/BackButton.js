import Link from 'next/link'
import styled from 'styled-components'
import { QUERIES } from '../utils/constants'
import { ArrowLeft } from 'react-feather'

const BackButton = (props) => {
    const href = props.href;
    const text = props.text;

    return (
        <Link href={href} >
            <Back {...props}>
                <ArrowLeft size={20}/> <BackText>{text}</BackText>
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
        transition: transform var(--transition-fast), opacity var(--transition-fast);
    }

    @media ${QUERIES.tabletAndBelow} {
        display: none;
    }
`

const BackText = styled.span`
    font-family: var(--font-sans);
    font-size: var(--font-size-m);
    margin-top: 2px;
    opacity: 0%;
    transition: transform var(--transition-default), opacity var(--transition-default);

    @media ${QUERIES.laptopAndBelow} {
        font-size: var(--font-size-m);
    }
`


