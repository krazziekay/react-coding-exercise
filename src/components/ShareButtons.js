import React from 'react'
import { compose } from 'redux'
import injectSheet from 'react-jss'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { isFavouritedSelector } from '../selectors'
import { toggleFavouriteActionCreator } from '../actions'
import theme from '../style/theme'
import facebookIcon from '../icons/facebook.svg'
import twitterIcon from '../icons/twitter.svg'
import heartIcon from '../icons/heart.svg'
import emptyHeartIcon from '../icons/heart-o.svg'
import Icon from './Icon'
import map from 'lodash/map'
import color from 'color'
import { round } from '../helpers/math'
import detectIt from 'detect-it'

const popupWindowProps = url => ({
  url,
  onClick: e => {
    window.open(url, 'fbShareWindow', 'height=450, width=550, toolbar=0, menubar=0, directories=0, scrollbars=0')
    e.preventDefault()
  }
})

const ShareButtons = ({ children, classes, className, url, title, isFavourited, toggleFavourited, id }) => {
  const social = [{
    ...popupWindowProps(`https://facebook.com/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`),
    icon: facebookIcon,
    text: 'Facebook'
  }, {
    url: `https://twitter.com/share?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    icon: twitterIcon,
    text: 'Twitter'
  }]
  return <div className={className}>
    {map(social, ({ url, icon, text, onClick }) =>
      <a key={text} className={classes.socialLink} href={url} target='_blank' rel='noopener noreferrer' onClick={onClick}>
        <Icon className={classes.socialIcon} symbol={icon} />
        <span className='sr-only'>{text}</span>
      </a>
    )}
    <button className={classNames(classes.socialLink, classes.favouriteButton)} type='button' onClick={() => toggleFavourited(id)}>
      <span className={classNames(classes.favouriteIconHolder, isFavourited && classes.favouritedIconHolder, !isFavourited && classes.unfavouritedIconHolder)}>
        <Icon className={classNames(classes.favouriteIcon, classes.fullHeartIcon)} symbol={heartIcon} />
        <Icon className={classNames(classes.favouriteIcon, classes.emptyHeartIcon)} symbol={emptyHeartIcon} />
      </span>
    </button>
    {children}
  </div>
}

function mapStateToProps (state, { id }) {
  return {
    isFavourited: isFavouritedSelector(state, id)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleFavourited: id => dispatch(toggleFavouriteActionCreator(id))
  }
}

const em = px => round(px / 16) + 'em'

export default compose(
  connect(mapStateToProps, mapDispatchToProps),

  injectSheet({
    socialLink: {
      color: theme.colors.black,
      width: em(30),
      height: em(30),
      padding: 0,
      cursor: 'pointer',
      outline: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      transition: 'color 0.2s ease-out'
    },
    socialIcon: {
      width: em(16),
      height: em(16)
    },
    favouriteButton: {
      appearance: 'none', // override normalize
      backgroundColor: 'transparent',
      border: 0,
      color: theme.colors.primary,
      ...(detectIt.primaryInput === 'touch' ? undefined : {
        '&:hover': {
          '& > $favouritedIconHolder': {
            '& > $fullHeartIcon': {
              color: color(theme.colors.primary).fade(0.5).rgb().toString()
            }
          },
          '& > $unfavouritedIconHolder': {
            '& > $fullHeartIcon': {
              color: color(theme.colors.primary).fade(0.8).rgb().toString()
            }
          }
        }
      })
    },
    favouriteIconHolder: {
      display: 'block',
      position: 'relative',
      width: em(20),
      height: em(20)
    },
    favouritedIconHolder: {
      '& > $fullHeartIcon': {
        color: theme.colors.primary
      }
    },
    unfavouritedIconHolder: {},
    favouriteIcon: {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%'
    },
    fullHeartIcon: {
      color: color(theme.colors.primary).fade(1).rgb().toString()
    }
  })
)(ShareButtons)
