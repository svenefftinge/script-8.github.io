import range from 'lodash/range'

const phraseLength = 32

const defaults = {
  phrase: {
    // notes: range(phraseLength).map(d => 0),
    notes: range(phraseLength).map(d => d),
    volumes: range(phraseLength).map(d => 0)
  }
}

export default defaults
