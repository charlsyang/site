import styled from 'styled-components';

export default function MediaRow({content, single, bg}) {
    return (
		<MediaRowWrapper isSingle={single}>
			{content.map((item, index) => {
					if (item.type == 'image' && item.caption !== undefined) {
						return (
                            <Figure key = {index}>
                                <Img src={item.source} bg={bg} draggable='false'/>
                                <FigCaption>{item.caption}</FigCaption>
                            </Figure>
                        );
					} else if (item.type == 'image') {
                        return <Figure key = {index}><Img src={item.source} bg={bg} draggable='false'/></Figure>
                    } else if (item.type == 'video') {
						return <Video key = {index}><video src={item.source} autoPlay loop muted draggable='false'/></Video>;
					}
			})}
		</MediaRowWrapper>
)
}


const MediaRowWrapper = styled.div`
    max-width: 1200px;
	display: flex;
	gap: 24px;
    margin: ${props => props.isSingle ? '4rem 0' : '0' };

    & img, video {
        width: 100%;
        display: block;
    }
`

const Figure = styled.figure`
    flex: 1;
`

const Img = styled.img`
    background-color: ${props => props.bg ? 'var(--color-block)' : 'none' };
`

const FigCaption = styled.figcaption`
    font-size: var(--font-size-s);
    color: var(--color-gray-600);
    margin-top: var(--spacing-2x);
    margin-bottom: var(--spacing-3x);
`

const Video = styled.div`
    flex: 1;
`
