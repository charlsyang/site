import styled from 'styled-components';
import Image from 'next/image'

export default function HeroMock({type, source}) {
    if (type == 'video') {
        return (
            <HeroMockWrapper>
                <VideoMock autoPlay loop muted draggable='false'>
                    <source src={source}/>
                </VideoMock>
            </HeroMockWrapper>
        )
    } else if (type == 'image') {
        return (
            <HeroMockWrapper>
                <Image src={source} draggable='false'/>
            </HeroMockWrapper>
        )
    }
}


const HeroMockWrapper = styled.div`
    padding: 64px 72px;
    margin: 40px 0 72px 0;
    background-color: var(--color-divider);
`

const VideoMock = styled.video`
    border-radius: 8px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    width: 100%;
`