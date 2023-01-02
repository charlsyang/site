module.exports = {
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: true,
  },

  async headers() {
    return [
      {
        source: '/fonts/ABCDiatypeVariable.woff2',
        headers: [
          {
            key: 'Cache-control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]
  },
}