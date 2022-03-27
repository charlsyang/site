import NextHead from 'next/head'

const Head = ({title, description}) => {
        return (
            <NextHead>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            </NextHead>
        )
}

export default Head