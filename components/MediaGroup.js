import styled from 'styled-components';

export default function MediaGroup({content}) {
    return (
		<MediaWrapper>
			{content.map((item) => {
					if (item.type == 'image' && item.caption !== undefined) {
						return (
                            <figure>
                                <img src={item.source}/>
                                <FigCaption>{item.caption}</FigCaption>
                            </figure>
                        );
					} else if (item.type == 'image') {
                        return <figure><img src={item.source}/></figure>
                    } else if (item.type == 'video') {
						return <video src={item.source} autoPlay loop muted draggable='false'/>;
					}
			})}
		</MediaWrapper>
)
}


const MediaWrapper = styled.div`
    max-width: 1200px;
	display: flex;
	gap: 24px;
    margin: 50px 0; 

    & img {
        width: 100%;
    }
`

const FigCaption = styled.figcaption`
    font-size: var(--font-size-s);
    color: var(--color-gray-600);
    margin-top: var(--spacing-2x);
`