import latinize from 'latinize'
import React, { Component } from 'react'
import MultiHighlighter from './MultiHighlighter'
import styles from './MultiHighlighter.example.css'

export default class MultiHighlighterExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: 'and or the',
      textToHighlight: `When in the Course of human events it becomes necessary for one people to dissolve the political bands which have connected them with another and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.`,
      activeIndex: -1,
      caseSensitive: false,
      tableRows:[
        {
          searchWords: ["dog", "cat", "mouse"],
          class: "red",
          case_sensitive: false
        },
        {
          searchWords: ["the", "is"],
          class: "yellow",
          case_sensitive: false
        }
      ]
    }
  }

  process_keywords(){
    return this.state.tableRows.map((tableRow)=>{
      return tableRow.searchWords
    })
  }

  process_classes(){
    let classes = this.state.tableRows.map((tableRow)=>{
      return tableRow.class
    })

    return classes.join(',')
  }

  handleRowChange = (e) => {
    let idx = e.target.id
    let column = e.target.name
    let new_value = e.target.value

    let newtableRows = this.state.tableRows

    if(column == 'searchWords'){
      new_value = new_value.split(',').map((word)=>{
        return word.trim()
      })
    }
    
    newtableRows[idx][column] = new_value

    this.setState({ tableRows: newtableRows });
  };

  handleAddRow = () => {
    this.setState({
      tableRows: this.state.tableRows.concat([{
        searchWords: [],
        class: "",
        case_sensitive: false
      }])
    });
  };

  handleRemoveRow = idx => () => {
    this.setState({
      tableRows: this.state.tableRows.filter((s, sidx) => idx !== sidx)
    });
  };

  render () {
    const { ...props } = this.props
    const { activeIndex, caseSensitive, searchText, textToHighlight } = this.state
    const searchWords = searchText.split(/\s/).filter(word => word)

    return (
      <div {...props}> 
        <div className={styles.Row}>
          <table>
            <thead>
              <tr>
              <th><h4 className={styles.Header}>Search Groups</h4></th>
              <th><h4 className={styles.Header}>Class Name</h4></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.tableRows.map((tableRow, idx) => (
                  <tr key={idx}>
                    <td>
                      <input 
                        className={styles.Input} 
                        id={idx} 
                        type="text"
                        name="searchWords"
                        onChange={this.handleRowChange}
                        value={tableRow.searchWords.join(',')} 
                        placeholder="Search words group"
                        />
                      </td>
                    <td>
                      <input 
                        className={styles.Input} 
                        id={idx} 
                        type="text" 
                        name="class"
                        onChange={this.handleRowChange}
                        value={tableRow.class} 
                        placeholder="Class to attach"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={this.handleRemoveRow}
                        className="small"
                      > - </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => this.handleAddRow()}>
          Add more
        </button>
        <br/>
        <h4 className={styles.Header}>
          Body of Text
        </h4>
        <textarea
          className={styles.Input}
          name='textToHighlight'
          value={textToHighlight}
          onChange={event => this.setState({ textToHighlight: event.target.value })}
        />

        <h4 className={styles.Header}>
          Output
        </h4>
        <MultiHighlighter
          searchWords={this.process_keywords()}
          textToHighlight={textToHighlight}
          classGroups={this.process_classes()}
          highlightTag='span'
        />
        <p className={styles.Footer}>
          <a href='https://github.com/acidbotmaker/react-highlight-words/blob/master/src/Highlighter.example.js'>
            View the source
          </a>
        </p>
      </div>
    )
  }
}
