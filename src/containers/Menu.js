import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import equal from 'deep-equal'
import _ from 'lodash'
import actions, { saveGist, fetchToken } from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import { parseGistGame } from '../reducers/game.js'
import { extractGistSprites } from '../reducers/sprites.js'
import { extractGistPhrases } from '../reducers/phrases.js'
import { extractGistChains } from '../reducers/chains.js'
import { extractGistSongs } from '../reducers/songs.js'

const mapStateToProps = ({
  gist,
  game,
  sfxs,
  sprites,
  phrases,
  chains,
  songs,
  token,
  screen,
  nextAction
}) => ({
  showNew: _.includes(
    [
      screenTypes.CODE,
      screenTypes.SONG,
      screenTypes.CHAIN,
      screenTypes.PHRASE,
      screenTypes.SPRITE
    ],
    screen
  ),
  screen,
  gist,
  game,
  sfxs,
  sprites,
  phrases,
  chains,
  songs,
  token,
  nextAction
})

const mapDispatchToProps = dispatch => ({
  clearNextAction: () => dispatch(actions.clearNextAction()),
  fetchToken: token => dispatch(fetchToken(token)),
  newGame: screen => dispatch(actions.newGame(screen)),
  saveGist: ({ game, sfxs, token, gist, sprites, phrases, chains, songs }) =>
    dispatch(
      saveGist({ game, sfxs, token, gist, sprites, phrases, chains, songs })
    ),
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction))
})

class Menu extends Component {
  constructor (props) {
    super(props)

    this.onSaveClick = this.onSaveClick.bind(this)
    this.onNewClick = this.onNewClick.bind(this)
    this.save = this.save.bind(this)
    window.script8.handleCode = props.fetchToken
  }

  componentDidUpdate () {
    const { token, nextAction, clearNextAction } = this.props
    if (token.value && nextAction === 'save') {
      clearNextAction()
      this.save()
    }
  }

  save () {
    const {
      token,
      game,
      saveGist,
      gist,
      sfxs,
      sprites,
      phrases,
      chains,
      songs
    } = this.props
    saveGist({ token, game, sfxs, sprites, phrases, chains, songs, gist })
  }

  onNewClick () {
    this.props.newGame(this.props.screen)
  }

  onSaveClick () {
    const { token, setNextAction } = this.props

    // If we're not logged in,
    if (!token.value) {
      // remind ourselves to save next,
      setNextAction('save')

      // and log in.
      window.open(
        `https://github.com/login/oauth/authorize?client_id=${
          process.env.REACT_APP_CLIENT_ID
        }&scope=gist`,
        'popup',
        'width=600,height=700'
      )
    } else {
      // If we are logged in, save.
      this.save()
    }
  }

  render () {
    const {
      screen,
      gist,
      token,
      game,
      sprites,
      phrases,
      chains,
      songs,
      showNew
    } = this.props

    // If the game isn't equal to the gist,
    // set flag to dirty.
    const gistGame = parseGistGame(gist.data)
    const gistSprites = extractGistSprites(gist.data)
    const gistPhrases = extractGistPhrases(gist.data)
    const gistChains = extractGistChains(gist.data)
    const gistSongs = extractGistSongs(gist.data)
    const dirtyGame = !equal(gistGame, game)
    const dirtySprites = !equal(gistSprites, sprites)
    const dirtyPhrases = !equal(gistPhrases, phrases)
    const dirtyChains = !equal(gistChains, chains)
    const dirtySongs = !equal(gistSongs, songs)
    const dirty =
      dirtyGame || dirtyPhrases || dirtyChains || dirtySongs || dirtySprites
    const isFetching = gist.isFetching || token.isFetching

    const gistLogin = _.get(gist, 'data.owner.login', null)
    const currentLogin = _.get(token, 'user.login', null)

    const newButton = showNew ? (
      <button
        key='1'
        disabled={isFetching}
        className='button'
        onClick={this.onNewClick}
      >
        New
      </button>
    ) : null

    // If the gist is not empty, AND:
    //  - the gistLogin is null (gist was created anonymously),
    //  - or the gistLogin does not match currentLogin (gist wasn't created by us),
    // show CLONE.
    // Otherwise show SAVE.
    const saveText =
      !_.isEmpty(gist) && (gistLogin === null || gistLogin !== currentLogin)
        ? 'clone'
        : 'save'

    return screen === screenTypes.HELP
      ? []
      : [
        newButton,
        <button
          key='2'
          disabled={isFetching}
          className='button'
          onClick={this.onSaveClick}
        >
          {saveText}
          <span className={classNames({ invisible: !dirty })}>*</span>
        </button>
      ]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
