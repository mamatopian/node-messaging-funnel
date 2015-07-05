{
  'targets': [
    {
      'target_name': 'dummy',
      'type': 'executable',
      'conditions': [
        ['OS=="linux"', {
          'sources': [
            'src/dummy.c'
          ],
          'link_settings': {
            'libraries': [
              ''
            ]
          }
        }],
        ['OS=="mac"', {
          'sources': [
            'src/dummy.c'
          ]
        }]
      ]
    }
  ]
}