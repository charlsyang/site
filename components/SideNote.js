import styled from 'styled-components';
import { QUERIES } from "../utils/constants";

// Helper function to generate unique ID for `htmlFor` and `id`
let counter = 0;
const generateUniqueID = () => `sideNote_${counter++}`; 

export default function SideNote({children}) {
    const uniqueID = generateUniqueID();
    return (
        <>
            <Toggle id={uniqueID}/>
            <Sup htmlFor={uniqueID}/>
            <NoteContentWrapper> 
                <NoteContent>
                    <Parens> (Sidenote: </Parens>
                    {children}
                    <Parens>)</Parens>
                </NoteContent>
            </NoteContentWrapper>
        </>
    );
}

const Toggle = styled.input.attrs({ type: 'checkbox' })`
    display: none;
`

const Sup = styled.label`
    counter-increment: sidenote-counter;
    margin-left: 3px;
    position: relative;
    
    @media ${QUERIES.phoneAndBelow} {
        cursor: pointer;
        
        // Underline
        &:after {
            content: '';
            display: inline-block;
            width: 90%;
            height: 1.5px;
            background-color: var(--color-link-border);
            position: absolute;
            bottom: 2px;
            left: 50%;
            translate: -52% 0;
        }

        ${Toggle}:checked ~ &:after {
            display: none;
        }

    }
    
    &:before {
        content: '[' counter(sidenote-counter) ']';
        font-family: var(--font-sans);
        font-size: var(--font-size-xxs);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-muted);
        font-variant-numeric: tabular-nums;
        letter-spacing: 1px;
        vertical-align: 1px;
    }
`

const NoteContentWrapper = styled.small`
    position: absolute;
    left: 0;
    width: 49%;

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;

    @media ${QUERIES.phoneAndBelow} {
        display: none;

        ${Toggle}:checked ~ & {
            display: block;
            float: left;
            left: var(--spacing-1x);
            clear: both;
            position: relative;
            width: 95%;
            margin: 1rem 2.5%;
            vertical-align: baseline;
        }
    }

    // Line
    &:after {
        border-top: 1px solid var(--color-border);
        content: '';
        position: absolute;
        top: -0.7em;
        right: -0.5em;
        width: 16%;

        ${Sup}:hover ~ & {
            border-top: 1px solid var(--color-link-border);
        }

        @media ${QUERIES.tabletAndBelow} {
            grid-column: 1 / 5;
            display: none;
        }
    }
`

const Parens = styled.span`
    position: absolute;
    left: -99999px;
    opacity: 0;
`

const NoteContent = styled.span`
    font-size: var(--font-size-s);
    font-family: var(--font-serif);
    line-height: 1.4;
    grid-column: 3 / 6;
    translate: 0 -1.5em;

    @media ${QUERIES.tabletAndBelow} {
        grid-column: 1 / 5;
    }

    @media ${QUERIES.phoneAndBelow} {
        display: block;
        translate: revert;
    }

    // Number before the note
    &:before { 
        content: counter(sidenote-counter);
        font-family: var(--font-sans);
        font-size: var(--font-size-xxs);
        font-weight: var(--font-weight-normal);
        color: var(--color-text-muted);
        font-variant-numeric: tabular-nums;
        --marker-gap: var(--spacing-1x);
        padding-right: var(--marker-gap);
        margin-left: calc(-0.6em - var(--marker-gap));
    }    
`