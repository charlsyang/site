module.exports = {
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