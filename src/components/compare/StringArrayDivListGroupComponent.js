import React from "react";

export default class StringArrayDivListGroupComponent extends React.Component {
  render() {
    return(
      <div>
        {
          !this.props.field &&
          <div
            className="list-group"
            onChange={(e) => this.props.onChange(e)}>
            {
              this.props.array.map((item, index) =>
                <a onClick={() => {
                     this.props.onSelectItem(item[this.props.field])
                     this.props.onSelectIndex(index)
                   }}
                   className={`list-group-item mks-white-space-nowrap ${item.selected ? 'list-group-item-info' : ''}`}
                   key={item}>
                  <i className="fa fa-file-text"/>
                  &nbsp;
                  {item}
                  {/*<i className="fa fa-check pull-right"/>*/}
                </a>
              )
            }
          </div>
        }
        {
          this.props.field &&
          <div
            className="list-group"
            onChange={(e) => this.props.onChange(e)}>
            {
              this.props.array.map((item, index) =>
                <a onClick={() => {
                     this.props.onSelectItem(item[this.props.field])
                     this.props.onSelectIndex(index)
                   }}
                   className={`list-group-item mks-white-space-nowrap ${item.selected ? 'list-group-item-info' : ''}`}
                   key={item[this.props.field]}>
                  <i className="fa fa-file-text"/>
                  &nbsp;
                  {item[this.props.field]}
                  {/*<i className="fa fa-check pull-right"/>*/}
                </a>
              )
            }
          </div>
        }
      </div>
    )
  }
}
