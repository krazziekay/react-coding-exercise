import React from 'react'
import injectSheet from 'react-jss'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getEvents, getEventsError, isEventsReady } from '../selectors'
import Icon from './Icon'
import titleIcon from '../icons/vivid-angle-top-left.svg'
import theme from '../style/theme'
import Event from './Event'
import { ClipLoader } from 'react-spinners'

/**
 * Loader added
 * @param className
 * @returns {*}
 * @constructor
 */
const Loader = ({ className }) => <div className={className}>
  <ClipLoader
    sizeUnit={'px'}
    size={150}
    color={'#123abc'}
  />
</div>

const Events = ({ classes, ready, events, error }) => (
  <div className={classes.container}>
    <h3 className={classes.title}>
      <Icon className={classes.titleIcon} symbol={titleIcon} />
      Results: {events.length ? events.length : 'no'} events found
    </h3>
    {
      error ? <>
        <div className={classes.errorWrapper}>
          <h1>404</h1>
          <h2>Oops! This Page Could Not Be Found</h2>
          <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
          <a href='/'>Go To Homepage</a>
        </div>
      </> : <>
        {!ready && <Loader className={classes.loader} />}
        {ready && (
          <div className={classes.tilesWrapper}>
            <div className={classes.tiles}>
              {events.map(event => <Event key={event.id} className={classes.tile} content={event} />)}
            </div>
          </div>
        )}
      </>
    }
  </div>
)

const mapStateToProps = (state) => ({
  ready: isEventsReady(state),
  events: getEvents(state),
  error: getEventsError(state)
})

export default compose(
  connect(mapStateToProps),
  injectSheet({
    title: {
      paddingLeft: 20,
      position: 'relative'
    },
    titleIcon: {
      position: 'absolute',
      left: 0,
      top: 5
    },
    tilesWrapper: {
      margin: [0, 'auto'],
      maxWidth: theme.maxTileWidth,
      '@media (min-width: 768px)': {
        maxWidth: theme.maxTileWidth * 2 + theme.gutter
      },
      '@media (min-width: 1200px)': {
        maxWidth: theme.maxTileWidth * 3 + theme.gutter * 2
      }
    },
    tiles: {
      '@media (min-width: 768px)': {
        marginLeft: -theme.gutter / 2,
        marginRight: -theme.gutter / 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
      }
    },
    tile: {
      margin: [0, 'auto', theme.gutter],
      maxWidth: theme.maxTileWidth,
      '@media (min-width: 768px)': {
        marginLeft: theme.gutter / 2,
        marginRight: theme.gutter / 2,
        width: `calc(50% - ${theme.gutter}px)`
      },
      '@media (min-width: 1200px)': {
        width: `calc(${100 / 3}% - ${theme.gutter}px)`
      }
    },
    // CSS for loader
    loader: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    errorWrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 66px)',
      justifyContent: 'center',
      textAlign: 'center'
    }
  })
)(Events)
