import styled from 'styled-components';
import Image from 'next/image';

import AuraIcons from '../public/visuals/aura-icons.png';
import ClassicTypo from '../public/visuals/classic-typo.png';
import CreditCard from '../public/visuals/credit-card.png';
import Dialogue from '../public/visuals/dialogue.png';
import Care from '../public/visuals/personalized-care.png';
import ProductIcons from '../public/visuals/product-icons.png';
import AbstractIcons from '../public/visuals/research-principles-icons.png';
import RubrikSwag from '../public/visuals/rubrik-swag.png';
import SimCard from '../public/visuals/sim-card.png';
import SmartHome from '../public/visuals/smart-home.png';
import SmartMug from '../public/visuals/smart-mug.png';
import Timeline from '../public/visuals/timeline.png';

const CardHover = '/visuals/card-hover.mp4';
const LightDark = '/visuals/light-dark.mp4';
const Tide = '/visuals/tide.mp4';
const Todo = '/visuals/todo.mp4';


export default function Gallery() {
    return (
        <GalleryWrapper>
            <Column>
                <Image src={AbstractIcons} draggable='false'></Image>
                <Image src={CreditCard} draggable='false'></Image>
                <video src={LightDark} autoPlay loop muted draggable='false'/>
                <Image src={RubrikSwag} draggable='false'></Image>
                <video src={Tide} autoPlay loop muted draggable='false'/>
            </Column>
            <Column>
                <Image src={SmartMug} draggable='false'></Image>
                <video src={CardHover} autoPlay loop muted draggable='false'/>
                <video src={Todo} autoPlay loop muted draggable='false'/>
                <Image src={ProductIcons} draggable='false'></Image>
                <Image src={ClassicTypo} draggable='false'></Image>
            </Column>
            <Column>
                <Image src={Dialogue} draggable='false'></Image>
                <Image src={AuraIcons} draggable='false'></Image>
                <Image src={SmartHome} draggable='false'></Image>
                <Image src={SimCard} draggable='false'></Image>
                <Image src={Timeline} draggable='false'></Image>
                <Image src={Care} draggable='false'></Image>
            </Column>
        </GalleryWrapper>
    )
}

const GalleryWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-3x);

    & img, video {
        width: 100%;
        height: auto;
        border: 1px solid var(--color-divider);
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
    flex: 1;
`