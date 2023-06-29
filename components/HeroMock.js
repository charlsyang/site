import styled from 'styled-components';
import Image from 'next/image'
import { QUERIES } from '../utils/constants';

export default function HeroMock({type, source}) {
    if (type == 'video') {
        return (
            <HeroMockWrapper type={type}>
                <VideoMock autoPlay loop muted draggable='false'>
                    <source src={source}/>
                </VideoMock>
            </HeroMockWrapper>
        )
    } else if (type == 'image') {
        return (
            <HeroMockWrapper>
                <img src={source} draggable='false'/>
            </HeroMockWrapper>
        )
    }
}


const HeroMockWrapper = styled.div`
    padding: ${props => props.type == 'video' ? '64px 72px' : '0' };
    margin: 40px 0 3rem 0;
    background-color: var(--color-bg-solid);

    @media ${QUERIES.phoneAndBelow} {
        padding: ${props => props.type == 'video' ? '16px 24px' : '0' };
        margin: 40px 0 56px 0;
    }
`

const VideoMock = styled.video`
    border-radius: 8px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    width: 100%;

    @media ${QUERIES.phoneAndBelow} {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
    }
`