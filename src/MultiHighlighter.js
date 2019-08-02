/* @flow */
import { findAll } from 'highlight-words-core'
import PropTypes from 'prop-types'
import { createElement } from 'react'
import memoizeOne from 'memoize-one'

MultiHighlighter.propTypes = {
  activeClassName: PropTypes.string,
  activeIndex: PropTypes.number,
  activeStyle: PropTypes.object,
  autoEscape: PropTypes.bool,
  className: PropTypes.string,
  findChunks: PropTypes.func,
  classGroups: PropTypes.string,
  highlightStyle: PropTypes.object,
  highlightTag: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.string
  ]),
  sanitize: PropTypes.func,
  searchWords: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.instanceOf(RegExp)
    ])
  ).isRequired,
  textToHighlight: PropTypes.string.isRequired,
  unhighlightClassName: PropTypes.string,
  unhighlightStyle: PropTypes.object
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function MultiHighlighter ({
  activeClassName = '',
  activeIndex = -1,
  activeStyle,
  autoEscape,
  caseSensitive = false,
  className,
  findChunks,
  classGroups = '',
  highlightStyle = {},
  highlightTag = 'mark',
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightClassName = '',
  unhighlightStyle,
  ...rest
}) {
  let chunks_array = Array(textToHighlight.length);
  chunks_array.fill('', 0, -1)

  const highlightClasses = classGroups.split(',')
  const searchWordsGroup = searchWords

  for(let i=searchWordsGroup.length - 1;i >= 0;i--){
    searchWords = searchWordsGroup[i];
    const chunks_ = findAll({
      autoEscape,
      caseSensitive,
      findChunks,
      sanitize,
      searchWords,
      textToHighlight
    });

    for(let j=0;j<chunks_.length;j++){
      let chunk = chunks_[j]
      for(let k=chunk.start;k<chunk.end;k++){
        if(chunk.highlight)
          chunks_array[k] = highlightClasses[i]
      }
    }
  }

  let chunks = []

  let start_point = 0
  let end_point = start_point + 1
  while(end_point < chunks_array.length && start_point < chunks_array.length){
    end_point = start_point + 1
    let prev_class = chunks_array[start_point]

    while(chunks_array[end_point] === prev_class && end_point < chunks_array.length){
      end_point++;
    }
    let mini_chunk = {
      start: start_point,
      end: end_point,
      class: (chunks_array[start_point]?chunks_array[start_point]:'')
    }
    chunks.push(mini_chunk)
    start_point = end_point;
  }

  const HighlightTag = highlightTag
  let highlightIndex = -1
  let highlightClassNames = ''
  let highlightStyles

  const lowercaseProps = object => {
    const mapped = {}
    for (let key in object) {
      mapped[key.toLowerCase()] = object[key]
    }
    return mapped
  }
  const memoizedLowercaseProps = memoizeOne(lowercaseProps)

  return createElement('span', {
    className,
    ...rest,
    children: chunks.map((chunk, index) => {
      const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start)
      if (chunk.class.length > 0) {
        highlightIndex++

        let highlightClass
        if (typeof chunk.class === 'object') {
          if (!caseSensitive) {
            highlightClass = memoizedLowercaseProps(chunk.class)
            highlightClass = chunk.class[text.toLowerCase()]
          } else {
            highlightClass = chunk.class[text]
          }
        } else {
          highlightClass = chunk.class
        }
        const isActive = highlightIndex === +activeIndex

        highlightClassNames = `${highlightClass} ${isActive ? activeClassName : ''}`
        highlightStyles = isActive === true && activeStyle != null
          ? Object.assign({}, highlightStyle, activeStyle)
          : highlightStyle

        const props = {
          children: text,
          className: highlightClassNames,
          key: index,
          style: highlightStyles
        }

        // Don't attach arbitrary props to DOM elements; this triggers React DEV warnings (https://fb.me/react-unknown-prop)
        // Only pass through the highlightIndex attribute for custom components.
        if (typeof HighlightTag !== 'string') {
          props.highlightIndex = highlightIndex
        }

        return createElement(HighlightTag, props)
      } else {
        return createElement('span', {
          children: text,
          className: unhighlightClassName,
          key: index,
          style: unhighlightStyle
        })
      }
    })
  })
}
